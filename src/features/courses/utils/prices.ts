interface ScopePrices {
  first: string | null;
  second: string | null;
  both: string | null;
}

/**
 * Picks the price to show on a course card. When the two-semester bundle is cheaper than buying both
 * semesters separately, the separate total is returned as the struck-through "original" price.
 */
export function formatPrices(prices: ScopePrices): { current: string | null; original: string | null } {
  const first = prices.first ? Number(prices.first) : null;
  const second = prices.second ? Number(prices.second) : null;
  const both = prices.both ? Number(prices.both) : null;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, ""));

  if (both !== null) {
    const separate = first !== null && second !== null ? first + second : null;
    return { current: fmt(both), original: separate !== null && separate > both ? fmt(separate) : null };
  }
  const single = first ?? second;

  return { current: single !== null ? fmt(single) : null, original: null };
}
