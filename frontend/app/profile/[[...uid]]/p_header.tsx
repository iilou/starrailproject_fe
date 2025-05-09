export default function PHeader({ text }: { text: string }) {
  return (
    <div
      className={`w-[1230px] h-[70px] text-center bg-[#3d3b8a] text-[#f4e135] mx-auto mt-3 relative z-[100]`}
      style={{ textShadow: "0 0 5px #000, 0 0 10px #000, 0 0 15px #000, 0 0 20px #000, 0 0 5px #f4e135" }}>
      <div
        className='w-full h-[70px] flex justify-center text-[28px] font-extrabold items-center bg-[#1A1947] transition-all duration-100 cursor-default shadow-xl shadow-black'
        // onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        //   e.currentTarget.style.fontWeight = "900";
        //   // e.currentTarget.style.fontSize = "18px";
        // }}
        // onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        //   e.currentTarget.style.fontWeight = "700";
        //   // e.currentTarget.style.fontSize = "16px";
        // }}
      >
        <div className='px-3 pbewf-2 hover:text-extrabold transition-all'>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
