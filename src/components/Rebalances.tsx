import useSWR from "swr";
import { Chart } from "./Chart/Chart";

type RebalanceInfoEntry = {
  blockNumber: number;
  timestamp: number;

  btcAmountBefore: number;
  btcAmountAfter: number;
  ethAmountBefore: number;
  ethAmountAfter: number;
  uniswapVolume: number;
  aUsdcJuniorBefore: number;
  aUsdcJuniorAfter: number;
  aUsdcSeniorBefore: number;
  aUsdcSeniorAfter: number;
  aaveHealthFactor: number;
};

export interface RebalanceInfoResult {
  result: {
    data: RebalanceInfoEntry[];
  };
}

const fetchData = async (url: string): Promise<RebalanceInfoResult> =>
  (await fetch(url)).json();

const URL =
  "https://apis.rage.trade/data/aggregated/get-rebalance-info?networkName=arbmain";

export const Rebalances = () => {
  const { data, error, isLoading } = useSWR<RebalanceInfoResult>(
    URL,
    fetchData
  );

  const _chartData = data?.result.data || [];

  const chartData = _chartData.map((d) => ({
    blockNumber: d.blockNumber,
    timestamp: d.timestamp,
    "BTC Amount Before": d.btcAmountBefore,
    "BTC Amount After": d.btcAmountAfter,
    "ETH Amount Before": d.ethAmountBefore,
    "ETH Amount After": d.ethAmountAfter,
    "Uniswap Volume": d.uniswapVolume,
    "aUSDC Junior Before": d.aUsdcJuniorBefore,
    "aUSDC Junior After": d.aUsdcJuniorAfter,
    "aUSDC Senior Before": d.aUsdcSeniorBefore,
    "aUSDC Senior After": d.aUsdcSeniorAfter,
    "Aave Health Factor": d.aaveHealthFactor,
  }));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Data not Found</div>;

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4 text-stone-800">Rebalance Charts</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-2 grid-cols-1">
        <Chart
          title="ETH Amounts"
          chartData={chartData}
          xAxisDataKey="timestamp"
          token="ETH"
          barChart={[
            { key: "ETH Amount Before", color: "#31a2af" },
            { key: "ETH Amount After", color: "#afa731" },
          ]}
          lineChart={[]}
        />

        <Chart
          title="BTC Amounts"
          chartData={chartData}
          xAxisDataKey="timestamp"
          token="BTC"
          barChart={[
            { key: "BTC Amount Before" },
            { key: "BTC Amount After", color: "#4eaf31" },
          ]}
          lineChart={[]}
        />

        <Chart
          title="Uniswap Volume and Aave Health Factor"
          chartData={chartData}
          xAxisDataKey="timestamp"
          barChart={[{ key: "Uniswap Volume", color: "#3165af" }]}
          lineChart={[{ key: "Aave Health Factor", color: "#af7831" }]}
        />

        <Chart
          title="aUSDC Amount for Senior / Junior Vaults"
          chartData={chartData}
          xAxisDataKey="timestamp"
          barChart={[
            { key: "aUSDC Senior Before", color: "#50af31" },
            { key: "aUSDC Senior After", color: "#c2343e" },
            { key: "aUSDC Junior Before", color: "#5b31af" },
            { key: "aUSDC Junior After", color: "#af31a9" },
          ]}
          lineChart={[]}
        />
      </div>
    </section>
  );
};
