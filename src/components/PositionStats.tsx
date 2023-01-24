import { useEffect, useState } from "react";
import { printDollar } from "../utils/print";

type API = {
  totalActivePositions: number;
  totalLongPositionCollaterals: string;
  totalLongPositionSizes: string;
  totalShortPositionCollaterals: string;
  totalShortPositionSizes: string;
};

const fetchStats = async () =>
  (await fetch(`https://api.gmx.io/position_stats`)).json();

export const PositionStats = () => {
  const [stats, setStats] =
    useState<{ label: string; value: React.ReactNode }[]>();

  useEffect(() => {
    async function run() {
      const data: API = await fetchStats();

      if (!data) return;

      const format = (num: string) => {
        return printDollar(BigInt(num) / 10n ** 30n);
      };

      setStats([
        {
          label: "Total Active Positions",
          value: data.totalActivePositions,
        },
        {
          label: "Total Long Position Collaterals",
          value: format(data.totalLongPositionCollaterals),
        },
        {
          label: "Total Long Position Sizes",
          value: format(data.totalLongPositionSizes),
        },
        {
          label: "Total Short Position Collaterals",
          value: format(data.totalShortPositionCollaterals),
        },
        {
          label: "Total Short Position Sizes",
          value: format(data.totalShortPositionSizes),
        },
      ]);
    }

    run();
  }, []);

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4 text-stone-800">
        GMX Position Stats
      </h1>
      <dl className="text-stone-700">
        {stats
          ? stats.map(({ label, value }) => (
              <div className="flex text-lg gap-2">
                <dt>{label}: </dt>
                <dl>{value}</dl>
              </div>
            ))
          : null}
      </dl>
    </section>
  );
};
