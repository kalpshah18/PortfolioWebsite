---
title: "Trade Matching Engine"
date: "2026-09-03"
excerpt: "Creating a Trade Matching Engine in C++26 using std::hive"
tags: ["low-latency", "quant", "C++"]
---

## Why a Trade Matching Engine?

A matching engine sits at the core of every exchange, turning a stream of buy and sell orders into actual trades. It's a deceptively simple concept at a high level—orders come in, trades go out—but the performance and correctness constraints are brutal. Building one from scratch forces you to grapple with the same problems quant devs face daily: lock-free data structures, cache-aware memory layouts, deterministic latency under load, and squeezing nanoseconds out of a hot path. Every design decision, from your choice of container to your allocation strategy, has measurable, benchmarkable consequences. For someone targeting quant dev roles, few projects demonstrate relevant skills as directly.

It also doubles as a crash course in market microstructure. You have to understand price-time priority, how limit and market orders interact, what partial fills look like, and how exchanges handle edge cases like self-trade prevention. These stop being abstract textbook concepts when you're the one writing the state machine. The result is a project that speaks two languages: it tells systems engineers you can write fast, correct C++, and it tells trading firms you understand what happens between the moment a trader sends an order and the moment a fill hits their blotter.

## The Architecture: The Dual-Indexing Problem

At its core, a Limit Order Book (LOB) executing with **Price-Time Priority (FIFO)** must satisfy two opposing access patterns simultaneously:

1. **Sequential Priority Traversal (Matching):** For an incoming aggressive order, we must walk price levels from best to worst (bids descending, asks ascending), and within each price tick, consume resting orders strictly in the order they arrived ($O(1)$ next-order access).
2. **Random Access Cancellation (Drop by ID):** Market participants cancel orders continuously. Given only a 64-bit `OrderId`, the engine must locate and remove that resting order from deep inside the book in strictly $O(1)$ time without disrupting the queue order of other participants.

```
       Incoming Order (Submit / Cancel)
                     │
                     ▼
          ┌─────────────────────┐
          │   MatchingEngine    │
          └──────────┬──────────┘
                     │
                     ▼
             OrderBook Router
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│  Bids FlatMap │         │  Asks FlatMap │
│ (descending)  │         │  (ascending)  │
└───┬───────┬───┘         └───┬───────┬───┘
    │       │                 │       │
    ▼       ▼                 ▼       ▼
┌───────┐┌───────┐        ┌───────┐┌───────┐
│Tick 99││Tick 98│        │Tick100││Tick101│
└───┬───┘└───────┘        └───┬───┘└───────┘
    │                         │
    ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ hive<Order> FIFO │      │ hive<Order> FIFO │  ◄──┐
│ [Ord1]→[Ord2]... │      │ [Ord3]→[Ord4]... │     │ Direct stable
└──────────────────┘      └──────────────────┘     │ iterator pointer
                                                   │
                  Order ID Index                   │
        ┌───────────────────────────────────┐      │
        │      OpenAddressMap<OrderId>      ├──────┘
        │   Hash = OrderId & (Cap - 1)      │  O(1) Direct Lookup
        └───────────────────────────────────┘
```

To solve this, we decoupled price level ordering from order storage:
- **Price Levels** are maintained in contiguous sorted memory (`FlatMap<Price, PriceLevel>`), allowing instant retrieval of the Best Bid and Offer (BBO) without tree node indirection.
- **Resting Orders** inside each price level are held in a `tme::hive<Order>`.
- **Order Indexing** uses an open-addressing hash table (`OpenAddressMap`) mapping `OrderId` directly to an `OrderHandle{Side, Price, hive::iterator}`.

---

## Why `std::hive` (P0447) Changes the Game

The classic C++ dilemma in order books is container selection for the FIFO queue at each price tick:

- **`std::vector`:** Excellent cache locality, but deleting an order from the middle requires $O(N)$ element shifts and invalidates all downstream iterators.
- **`std::list` / Doubly-Linked List:** Gives pointer stability and $O(1)$ erase, but incurs a dynamic heap allocation per node and causes cache thrashing as pointers chase across random RAM addresses.

Enter **`std::hive`** (introduced in C++26 via proposal P0447 / `plf::hive` reference implementation).

```
 hive<Order> Memory Layout:
 ┌─────────────────────────── Block 0 ───────────────────────────┐
 │ [Order 0] [Order 1] [  EMPTY (Erased)  ] [Order 3] [Order 4] │
 └─────────────────────────────▲─────────────────────────────────┘
                               │
               Skipfield skips erased slot during iteration!
               Iterators to Order 0, 1, 3, 4 remain 100% STABLE.
```

`std::hive` allocates memory in contiguous blocks (jumps/chunks). When an order is cancelled or filled, its slot is marked erased via a skipfield without shifting subsequent elements. Iterators to all other active orders remain valid. Traversal during matching skips empty slots automatically with near-vector scanning performance.

```cpp
// PriceLevel: FIFO queue backed by std::hive
class PriceLevel {
public:
    using Iterator = hive<Order>::iterator;

    Iterator addOrder(Order order) {
        return orders_.insert(order); // O(1) amortized, returns stable iterator
    }

    void removeOrder(Iterator it) {
        orders_.erase(it); // O(1) stable erasure, zero element shifting
    }

    void matchAgainst(OrderId aggressorId, Side aggressorSide, Price tradePrice,
                      Quantity& incomingQty, std::vector<TradeEvent>& trades,
                      std::vector<OrderId>& filledOrderIds) {
        for (auto it = orders_.begin(); it != orders_.end() && incomingQty > 0; ) {
            Order& resting = *it;
            Quantity fillQty = std::min(resting.remainingQty, incomingQty);

            trades.push_back(TradeEvent{
                .buyOrderId  = (aggressorSide == Side::Buy) ? aggressorId : resting.id,
                .sellOrderId = (aggressorSide == Side::Buy) ? resting.id : aggressorId,
                .price       = tradePrice,
                .quantity    = fillQty
            });

            resting.remainingQty -= fillQty;
            incomingQty          -= fillQty;

            if (resting.remainingQty == 0) {
                filledOrderIds.push_back(resting.id);
                it = orders_.erase(it); // Advances iterator cleanly
            } else {
                ++it;
            }
        }
    }
private:
    hive<Order> orders_;
};
```

---

## The Optimization Journey: Shaving 740ns to 35ns

Building the naive implementation gave us ~740ns insertion and ~170ns cancellation. Here is the series of architectural refactorings that brought performance down into double-digit nanoseconds.

### 1. Integer Fixed-Point Ticks vs. Floating-Point `double`

Using `double` for prices in a matching engine introduces several hidden costs:
- Non-exact binary representation (e.g. `$0.01` is periodic in binary floating point).
- Floating-point comparison instructions are slower and prevent direct bitwise hashing.
- `NaN` checks pollute branch predictors.

We converted `Price` to integer ticks at a fixed scale of $10,000$ (sub-cent precision):

$$\text{PriceTicks} = \text{round}(\text{price} \times 10{,}000)$$

```cpp
using Price    = std::uint32_t;
using Quantity = std::uint64_t;
using OrderId  = std::uint64_t;

static constexpr std::uint32_t PRICE_SCALE = 10'000u;
static constexpr Price INVALID_PRICE       = 0u;

[[nodiscard]] inline constexpr Price to_price(double p) noexcept {
    return static_cast<Price>(p * PRICE_SCALE + 0.5);
}
```

Now price comparisons are single CPU integer comparison instructions, and prices can be hashed or masked directly.

---

### 2. Cache Line Packing: Shrinking `Order` from 64B to 32B

On modern x86-64 CPUs, an L1 data cache line is **64 bytes**. 

Our initial `Order` struct had an 8-byte `std::chrono::time_point` timestamp and was aligned to 64 bytes. That meant **1 order occupied an entire cache line**.

By removing the timestamp from the hot matching loop (generating timestamps only when human-readable logging is explicitly enabled) and re-packing the fields:

```cpp
// 32-Byte Packed Order: Exactly TWO orders fit in a single 64-byte L1 cache line
struct Order {
    OrderId   id;           // 8 bytes
    Price     price;        // 4 bytes (integer ticks)
    Quantity  quantity;     // 8 bytes
    Quantity  remainingQty; // 8 bytes
    Side      side;         // 1 byte
    OrderType type;         // 1 byte
    //                      -- 30 bytes + 2 bytes implicit padding = 32 bytes
};
```

**Impact:** Iterating resting orders in `PriceLevel::matchAgainst()` now encounters **50% fewer L1 cache misses**, dropping match latency from **407ns to 305ns** (-25%).

---

### 3. Killing `std::unordered_map`: Custom `OpenAddressMap`

For order lookups during cancellation, `std::unordered_map` is notoriously slow for low-latency code:
- Node-based chaining with dynamic bucket allocations.
- Multiple pointer dereferences per lookup.
- Complex `std::hash<uint64_t>` overhead.

Inspired by high-throughput feed architectures like [lim-james/ITCH-Order-Book](https://github.com/lim-james/ITCH-Order-Book), we replaced it with a contiguous, power-of-2 **`OpenAddressMap`**:

```cpp
template<std::size_t InitialCapacity = 65536, typename Key = uint64_t, typename Value = void*>
class OpenAddressMap {
    enum class SlotState : uint8_t { EMPTY, OCCUPIED, TOMBSTONE };
    struct Slot { Key key; Value value; SlotState state; };

    std::size_t hash(const Key& key) const noexcept {
        return static_cast<std::size_t>(key) & mask_; // Single bitwise AND instruction
    }

    Value& operator[](const Key& key) {
        // Automatic growth if load factor exceeds 70%
        if ((size_ + tombstone_) * 10 >= capacity_ * 7) [[unlikely]] {
            grow();
        }
        auto index = probe_for_insert(key); // Linear probing across contiguous memory
        auto& slot = table_[index];
        if (slot.state != SlotState::OCCUPIED) {
            slot.state = SlotState::OCCUPIED;
            slot.key   = key;
            ++size_;
        }
        return slot.value;
    }
};
```

**Key Advantages:**
1. **Single-Instruction Hash:** Since capacity is $2^N$, modulo is simply `id & (Capacity - 1)`.
2. **Linear Probing:** Collision searches stream sequentially through L1/L2 cache prefetchers.
3. **No Hot-Path Allocations:** Pre-allocates a single contiguous block of memory.

**Result:** Order cancellation latency plummeted from **140ns to ~35ns**—a **4x improvement** on cancellation throughput.

---

## Measuring with Cycle Accuracy: RDTSC + CPU Pinning

Standard `std::chrono::steady_clock::now()` calls go through kernel VDSO transitions, introducing **20–40ns of measurement noise**. When measuring an operation that takes 35ns, standard clocks add more latency than the code itself.

To obtain true nanosecond-level measurements, we implemented:

### 1. Serialized Hardware Timestamp Counter (`RDTSC`)
We used `_mm_lfence()` before `__rdtsc()` to prevent out-of-order CPU instruction reordering from skewing start times, and `__rdtscp()` at the end:

```cpp
[[nodiscard]] inline std::uint64_t rdtsc_start() noexcept {
    _mm_lfence();
    return __rdtsc();
}

[[nodiscard]] inline std::uint64_t rdtsc_end() noexcept {
    unsigned int aux;
    uint64_t val = __rdtscp(&aux);
    _mm_lfence();
    return val;
}
```

### 2. Thread CPU Affinity & Core Isolation
To eliminate OS thread migration and cold cache penalties, the benchmark thread is pinned to an isolated physical core with real-time priority:

```cpp
inline bool pin_to_core(int core_id) noexcept {
#if defined(_WIN32)
    DWORD_PTR mask = static_cast<DWORD_PTR>(1) << core_id;
    SetThreadAffinityMask(GetCurrentThread(), mask);
    SetThreadPriority(GetCurrentThread(), THREAD_PRIORITY_HIGHEST);
    return true;
#else
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(core_id, &cpuset);
    return pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset) == 0;
#endif
}
```

---

## Final Benchmark Results

All benchmarks were compiled with MSVC 19.41 (`/O2 /std:c++latest`) and run on a dedicated core clocked at **2.496 GHz** ($0.401\text{ ns/cycle}$) with $N = 200{,}000$ iterations.

### Progressive Latency Reduction

| Milestone | Order Insert | Order Cancel | Crossing Match | Mixed (70/20/10) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Baseline (`double` + `std::map`)** | 741 ns | 171 ns | 407 ns | 318 ns |
| **2. Fixed-Point Ticks + `FlatMap`** | 763 ns | 172 ns | 443 ns | 308 ns |
| **3. 32-Byte `Order` (No Timestamp)** | 616 ns | 140 ns | 305 ns | 274 ns |
| **4. Custom `OpenAddressMap`** | **187 ns** | **44 ns** | **273 ns** | **84 ns** |
| **5. RDTSC Pinned Measurement (p50)** | **41.7 ns** | **35.3 ns** | **147.4 ns** | **60.1 ns** |

### High-Resolution Latency Percentile Distribution

```
Distribution Breakdown (200,000 samples per operation):

Operation                   Min        p50 (Median)    p90        p99        p99.9
──────────────────────────────────────────────────────────────────────────────────
Order Cancel (O1)          31.7 ns        35.3 ns    37.3 ns    71.7 ns    290.5 ns
Order Insert (Limit)       34.1 ns        41.7 ns    44.9 ns   136.2 ns   2051.3 ns
Mixed Workload             30.0 ns        60.1 ns   143.0 ns   223.2 ns    921.5 ns
Crossing Match (Fill)     135.0 ns       147.4 ns   152.6 ns   177.5 ns    272.8 ns
```

---

## Lessons Learned & Key Takeaways

1. **Memory Layout Beats Big-O Notation:** A theoretical $O(1)$ structure with poor cache locality (like `std::unordered_map` or `std::list`) will consistently lose to cache-contiguous structures (`std::hive`, `OpenAddressMap`) by orders of magnitude on modern hardware.
2. **Align for the Cache Line:** Shrinking core structs to 32 bytes doubled our cache density and gave an immediate 25% throughput boost without altering matching logic.
3. **`std::hive` is the Future of Order Queues:** It uniquely solves the iterator stability vs cache-locality conflict for FIFO order queues, making C++26 an exciting prospect for financial systems.
4. **Benchmark the Code, Not the Timer:** Standard clock syscalls introduce more latency than high-performance functions take to execute. Always use serialized cycle counters (`RDTSC`) and core pinning when working below 100ns.
