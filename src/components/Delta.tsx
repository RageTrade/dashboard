import {
  deltaNeutralGmxVaults,
  tokens as _tokens,
  aave as _aave,
  chainlink,
} from "@ragetrade/sdk";
import type { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { printDollar, printToken } from "../utils/print";

const vault = deltaNeutralGmxVaults.getContractsSync("arbmain");
const { ethUsdAggregator, btcUsdAggregator } =
  chainlink.getContractsSync("arbmain");

// const tokens = _tokens.getContractsSync("arbmain");
// const aave = _aave.getContractsSync("arbmain");
// const wethVariableDebtTokenAddress =
//   _aave.getAddresses("arbmain").wethVariableDebtTokenAddress;
// const wbtcVariableDebtTokenAddress =
//   _aave.getAddresses("arbmain").wbtcVariableDebtTokenAddress;

// const vdWbtc = aave.aUsdc.attach(wbtcVariableDebtTokenAddress);
// const vdWeth = aave.aUsdc.attach(wethVariableDebtTokenAddress);

async function fetchData() {
  const [
    ethPrice, // 8 decimals
    btcPrice, // 8 decimals
    [btcOptimal, ethOptimal],
    [btcCurrent, ethCurrent],
  ] = await Promise.all([
    ethUsdAggregator.latestRoundData(),
    btcUsdAggregator.latestRoundData(),

    vault.dnGmxJuniorVault.getOptimalBorrows(
      vault.dnGmxJuniorVault.totalAssets()
    ),
    vault.dnGmxJuniorVault.getCurrentBorrows(),
  ]);

  const format = (num: BigNumber, decimals: number) => {
    return formatUnits(num, decimals);
  };

  return [
    {
      label: "BTC Current",
      value: printToken(format(btcCurrent, 8), "BTC"),
      valueAsDollar: printDollar(
        format(btcCurrent.mul(btcPrice.answer), 8 + 8)
      ),
    },
    {
      label: "BTC Optimal",
      value: printToken(format(btcOptimal, 8), "BTC"),
      valueAsDollar: printDollar(
        format(btcOptimal.mul(btcPrice.answer), 8 + 8)
      ),
    },
    {
      label: "ETH Current",
      value: printToken(format(ethCurrent, 18), "ETH"),
      valueAsDollar: printDollar(
        format(ethCurrent.mul(ethPrice.answer), 18 + 8)
      ),
    },
    {
      label: "ETH Optimal",
      value: printToken(format(ethOptimal, 18), "ETH"),
      valueAsDollar: printDollar(
        format(ethOptimal.mul(ethPrice.answer), 18 + 8)
      ),
    },
  ];
}

export function Delta() {
  const [data, setData] = useState<
    {
      label: string;
      value: string;
      valueAsDollar: string;
    }[]
  >();

  useEffect(() => {
    fetchData().then((d) => setData(d));
  }, []);

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4">Total Delta ETH/BTC</h1>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <dl>
          {data.map(({ label, value, valueAsDollar }) => {
            return (
              <div key={label} className="flex gap-2">
                <dt>{label}: </dt>
                <dl className="tabular-nums">
                  {value} ({valueAsDollar})
                </dl>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
