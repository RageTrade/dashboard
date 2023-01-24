import { format } from "date-fns";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { printDollar, printToken } from "../../utils/print";

const tokenFormatter = (symbol: string) => (value: number) =>
  printToken(value, symbol, { minimumFractionDigits: 0 });

const dollarFormatter = (value: number) =>
  printDollar(value, { minimumFractionDigits: 0, notation: "compact" });

export const dateFormatter = (timestamp: string) =>
  format(parseInt(timestamp) * 1000, "d LLL, y");

export type ChartData = Array<Record<string, number>>;

type PlotProps<T extends ChartData> = {
  chartData: T;
  token?: string;
  xAxisDataKey: keyof T[number];
  barChart: Array<{
    key: keyof T[number];
    color?: string;
  }>;
  lineChart: Array<{
    key: keyof T[number];
    color?: string;
  }>;
};

export function Plot<T extends ChartData>({
  token,
  chartData,
  barChart,
  lineChart,
  xAxisDataKey,
}: PlotProps<T>) {
  return (
    <ResponsiveContainer width={600} height={300}>
      <ComposedChart data={chartData} stackOffset="sign" syncId="sync">
        <XAxis
          dataKey={xAxisDataKey as string}
          tickFormatter={dateFormatter}
          tick={{ fill: "#5B5474", fontSize: "0.85rem" }}
          tickLine={{ stroke: "#5B5474" }}
        />

        <YAxis
          yAxisId="left-axis"
          tickFormatter={token ? tokenFormatter(token) : dollarFormatter}
          tick={{ fill: "#5B5474", fontSize: "0.85rem" }}
          tickLine={{ stroke: "#5B5474" }}
        />

        <YAxis
          yAxisId="right-axis"
          orientation="right"
          tickFormatter={token ? tokenFormatter(token) : dollarFormatter}
          tick={{ fill: "#5B5474", fontSize: "0.85rem" }}
          tickLine={{ stroke: "#5B5474" }}
        />

        <Tooltip
          wrapperClassName="rounded-2xl shadow-black/5 shadow-lg text-sm font-mono"
          contentStyle={{
            fontSize: "0.85rem",
            background: "#f5f5f4",
            border: "1px solid #dcdae3",
            padding: "1rem 1.5rem",
          }}
          labelFormatter={dateFormatter}
          formatter={(value, name) => [
            token
              ? tokenFormatter(token)(value as number)
              : printDollar(value as number),
            name,
          ]}
          labelClassName="font-sans text-grey-2 pb-2"
          cursor={{ stroke: "#5B5474", strokeWidth: 1.5 }}
        />

        <Legend />

        {barChart.map(({ key, color = "#834FCD" }) => (
          <Bar
            key={key as string}
            dataKey={key as string}
            yAxisId="right-axis"
            stackId={"a"}
            fill={color}
          />
        ))}

        {lineChart.map(({ key, color = "#FB7400" }) => (
          <Line
            key={key as string}
            dataKey={key as string}
            dot={false}
            type="monotone"
            yAxisId="left-axis"
            stroke={color}
            strokeWidth={2}
          />
        ))}

        <CartesianGrid strokeDasharray="12 10" stroke="#2E2A3B" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

type ChartProps<T extends ChartData> = PlotProps<T> & {
  title: string;
  description?: React.ReactNode;
};

export function Chart<T extends ChartData>(props: ChartProps<T>) {
  const { title, description, ...plotProps } = props;

  return (
    <div className="w-full h-full max-w-5xl p-6 rounded-lg bg-grey-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="m-0 font-medium">{title}</h1>
      </div>

      <Plot {...plotProps} />
      <div className="py-2">{description}</div>
    </div>
  );
}
