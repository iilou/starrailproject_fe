export default function StatM({ name, value, percentage, critical }: { name: string; value: number; percentage?: boolean; critical?: boolean }) {
  // console.log(critical, name, value, percentage);
  return (
    <div
      className='flex justify-between w-[302px] px-7 py-1 bg-bk1 hover:bg-[#303030] rounded-lg text-sm font-bold'
      style={{ color: critical ? "#E5D64A" : "#a9a9a9", textShadow: critical ? "0 0 5px #E5D64A, 0 0 20px #E5D64A" : "none" }}>
      <div className='p-0 '>{(name + (percentage ? "%" : "")).length > 20 ? (name + (percentage ? "%" : "")).substring(0, 20) + "..." : name + (percentage ? "%" : "")}</div>
      <div className='p-0'>{(value * (percentage ? 100 : 1)).toFixed(percentage ? 2 : 0) + (percentage ? "%" : "")}</div>
    </div>
  );
}
