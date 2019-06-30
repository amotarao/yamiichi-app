/**
 * 入札金額の候補を生成する
 */
export const generateBiderPriceList = (initialPrice: number, currentPrice: number, maxPrice: number, maxCount: number = 5): number[] | null => {
  const hasMaxPrice = maxPrice >= 0;

  if (maxCount < 1) {
    return null;
  }
  if (currentPrice >= 0 && currentPrice < initialPrice) {
    return null;
  }
  if (maxPrice >= 0 && currentPrice >= maxPrice) {
    return null;
  }

  const priceList = currentPrice === -1 ? [initialPrice, initialPrice] : [currentPrice];

  [...Array(maxCount - priceList.length + 1)].forEach(() => {
    const previous = priceList[priceList.length - 1];
    const price = previous + Math.max(50, 10 ** (previous.toString().length - 2));
    priceList.push(price);
  });

  return priceList.slice(1).filter((price) => !hasMaxPrice || price <= maxPrice);
};
