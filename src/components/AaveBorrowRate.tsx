import { useEffect, useState } from "react";

export interface SymbolData {
  id: string;
  symbol: string;
  variableBorrowRate: string;
}

export interface Data {
  reserves: SymbolData[];
}

const idWeth =
  "42161-0x82af49447d8a07e3bd95bd0d56f35241523fbab1-0xa97684ead0e402dc232d5a977953df7ecbab3cdb";
const idWbtc =
  "42161-0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f-0xa97684ead0e402dc232d5a977953df7ecbab3cdb";

const fetchData = async () => {
  const aaveResponseJson: Data = await (
    await fetch(`https://aave-api-v2.aave.com/data/markets-data`)
  ).json();

  const aaveReserves = aaveResponseJson.reserves;

  const btcBorrowRate = aaveReserves.find(
    (o) => o.id === idWbtc
  )?.variableBorrowRate;
  const ethBorrowRate = aaveReserves.find(
    (o) => o.id === idWeth
  )?.variableBorrowRate;

  return {
    btcBorrowRate,
    ethBorrowRate,
  };
};

export function AaveBorrowRate() {
  const [data, setData] = useState<{
    btcBorrowRate: string | undefined;
    ethBorrowRate: string | undefined;
  }>();

  useEffect(() => {
    fetchData().then((d) => setData(d));
  }, []);

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4 text-stone-800">
        AAVE ETH/BTC Borrow Rate
      </h1>

      <dl className="text-stone-700">
        <div className="flex gap-2">
          <dt>BTC Borrow Rate: </dt>
          <dd>{data?.btcBorrowRate}</dd>
        </div>
        <div className="flex gap-2">
          <dt>ETH Borrow Rate: </dt>
          <dd>{data?.ethBorrowRate}</dd>
        </div>
      </dl>
    </section>
  );
}
