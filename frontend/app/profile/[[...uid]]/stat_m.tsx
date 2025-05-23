export default function StatM({
  name,
  value,
  percentage,
  critical,
  negative,
}: {
  name: string;
  value: number;
  percentage?: boolean;
  critical?: boolean;
  negative?: boolean;
}) {
  // console.log(critical, name, value, percentage);
  return (
    <div
      className='flex w-fit px-7 bg-[#202020] hover:bg-[#303030] rounded-lg text-[13px] font-bold h-[26px] leading-[28px]'
      style={{
        color: true ? (critical ? "#E5D64A" : "#c1c1c177") : "#b33f3f",
        textShadow: critical ? "0 0 5px #E5D64A55, 0 0 20px #E5D64A55" : "none",
        backgroundImage: critical ? "linear-gradient(90deg, #3a3a3a 0%, #232323 100%)" : "none",
      }}>
      <div className='w-[180px]'>
        {(name + (percentage ? "%" : "")).length > 24
          ? (name + (percentage ? "%" : "")).substring(0, 24) + "..."
          : name + (percentage ? "%" : "")}
      </div>
      <div className='w-[60px] text-right'>
        {(value * (percentage ? 100 : 1)).toFixed(percentage ? 2 : 0) + (percentage ? "%" : "")}
      </div>
    </div>
  );
}
