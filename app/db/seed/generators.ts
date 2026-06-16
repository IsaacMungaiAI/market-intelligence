function randomNormal() {
  // simple gaussian approximation
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2);
}

export function generatePriceSeries({
  basePrice,
  volatility,
  days = 120,
}: {
  basePrice: number;
  volatility: number;
  days?: number;
}) {
  const prices: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[] = [];

  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const drift = 0.0002; // small upward bias (market growth)
    const shock = randomNormal() * volatility;

    const change = drift + shock;
    const open = price;
    const close = Math.max(1, price * (1 + change));

    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    const volume =
      Math.floor(10000 + Math.random() * 50000 * (1 + Math.abs(change) * 10));

    const date = new Date();
    date.setDate(date.getDate() - i);

    prices.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return prices;
}

export function generateFinancials(baseRevenue: number) {
  const revenue = baseRevenue * (0.9 + Math.random() * 0.2);
  const profitMargin = 0.15 + Math.random() * 0.1;

  const netProfit = revenue * profitMargin;
  const dividend = netProfit * (0.3 + Math.random() * 0.2);

  return {
    revenue,
    netProfit,
    dividend,
  };
}