import portfolioJson from "../../data/portfolio.json";
import { PortfolioData } from "../types/portfolio";

export function getPortfolioData(): PortfolioData {
  return portfolioJson as PortfolioData;
}
