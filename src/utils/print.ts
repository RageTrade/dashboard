export const EMPTY = "...";
type Maybe<T> = T | undefined;

/**
 * Cuts of a number string to max length for a its float representation
 */
export function formatFloatLength(str: string, maxLength = 6) {
  const [int, float] = str.split(".");

  return int + (float ? "." + float.slice(0, maxLength) : "");
}

function fixNumType(num: Maybe<number | string | bigint>) {
  if (typeof num === "undefined") return EMPTY;

  if (typeof num === "string") {
    num = parseFloat(num);

    if (isNaN(num)) return EMPTY;
  }

  return num;
}

/**
 * optimization technique to avoid rebuilding new Intl.NumberFormat
 */
function getINF(
  defaultInf: Intl.NumberFormat,
  options?: Intl.NumberFormatOptions
) {
  if (!options) return defaultInf;

  const { locale, ...defaultOptions } = defaultInf.resolvedOptions();

  return new Intl.NumberFormat(locale, {
    ...defaultOptions,
    ...options,
  });
}

const dollarINF = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/**
 * Returns comma separated string of number
 * with $ prefix
 * eg. 123456789 => $1,234,567,89
 */
export function printDollar(
  num: Maybe<number | string | bigint>,
  options?: Intl.NumberFormatOptions
) {
  num = fixNumType(num);
  if (typeof num === "string") return EMPTY;

  const inf = getINF(dollarINF, options);

  return inf.format(num);
}

const percentINF = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

/**
 * Returns comma separated string of number
 * with % suffix, multiplied by 100
 * eg. 123456.7899 => 12,345,678.99%
 */
export function printPercent(
  num: Maybe<number | string | bigint>,
  options?: Intl.NumberFormatOptions
) {
  num = fixNumType(num);
  if (typeof num === "string") return EMPTY;

  const inf = getINF(percentINF, options);

  return inf.format(num);
}

const tokenINF = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
});

/**
 * Returns comma separated string of number
 * with token symbol as suffix
 * eg. 123456789 => 1,234,567,89 ETH
 */
export function printToken(
  num: Maybe<number | string | bigint>,
  symbol: string,
  options?: Intl.NumberFormatOptions
) {
  num = fixNumType(num);
  if (typeof num === "string") return EMPTY;

  const inf = getINF(tokenINF, options);

  return inf.format(num) + " " + symbol;
}
