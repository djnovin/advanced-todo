import { TValue } from '../App';

interface OverviewProps {
  stocks: TValue[];
}

export function Overview(props: OverviewProps) {
  const { stocks } = props;

  // Ensure that stock.buy is treated as a number using parseFloat
  const totalInvestments = stocks.reduce((sum, stock) => sum + (stock.buy), 0);
  const totalGains = stocks.reduce((sum, stock) => sum + (stock.sell - stock.buy), 0);
  
  // Check if totalInvestments is a valid number before applying toFixed
  const formattedTotalInvestments = isNaN(totalInvestments) ? 0 : totalInvestments;
  
  const overallPortfolioPerformance = ((totalGains / formattedTotalInvestments) * 100) || 0;

  return (
    <div>
      <h2>Portfolio Overview</h2>
      <p>Total Investments: ${formattedTotalInvestments.toFixed(2)}</p>
      <p>Total Gains: ${totalGains.toFixed(2)}</p>
      <p>Overall Portfolio Performance: {overallPortfolioPerformance.toFixed(2)}%</p>
    </div>
  );
}