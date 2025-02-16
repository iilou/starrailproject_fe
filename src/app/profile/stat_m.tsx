export default function StatM({
  name,
  value,
  percentage,
}: {
  name: string;
  value: number;
  percentage?: boolean;
}) {
  return (
    <div className="flex justify-between w-[302px] text-w3 px-7 py-1 bg-bk1 rounded-lg text-sm font-bold">
      <div className="p-0 text-w4">{name + (percentage ? "%" : "")}</div>
      <div className="p-0">
        {(value * (percentage ? 100 : 1)).toFixed(percentage ? 2 : 0) +
          (percentage ? "%" : "")}
      </div>
    </div>
  );
}
