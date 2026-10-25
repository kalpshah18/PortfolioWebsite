import type { Metadata } from "next";
import Game from "./Game";

export const metadata: Metadata = {
  title: "80 in 8 | Kalp Shah",
  description: "80 mental-maths questions in 8 minutes. A practice clone of the Optiver numeracy test.",
};

export default function Optiver80In8Page() {
  return <Game />;
}
