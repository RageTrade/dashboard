type Maybe<T> = T | undefined;

const EMPTY = "...";
function fixNumType(num: Maybe<number | string | bigint>) {
  if (typeof num === "undefined") return EMPTY;

  if (typeof num === "string") {
    num = Number(num);

    if (isNaN(num)) return EMPTY;
  }

  return num;
}

const dollarINF = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function printDollar(num: Maybe<number | string | bigint>) {
  num = fixNumType(num);
  if (typeof num === "string") return EMPTY;

  return dollarINF.format(num);
}

const tokenINF = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 4,
  minimumFractionDigits: 4,
});

/**
 * Returns comma separated string of number
 * with token symbol as suffix
 * eg. 123456789 => 1,234,567,89 ETH
 */
export function printToken(
  num: Maybe<number | string | bigint>,
  symbol: string,
) {
  num = fixNumType(num);
  if (typeof num === "string") return EMPTY;

  return tokenINF.format(num) + " " + symbol;
}
