import Image from "next/image";
import { get_icon_url_path, get_icon_url_relic } from "./lib";

export default function RelicDisplay({ item }: { item: any }) {
  const rarityGradient =
    item["Type"] === "Planar"
      ? "linear-gradient(180deg,#343659,#8a5fcc 53%)"
      : "linear-gradient(180deg,#885550,#c9a36a 53%)";
  const rarityColor = item["Type"] === "Planar" ? "#8a5fcc" : "#c9a36a";
  return (
    <div className=' mx-1 my-1 bg-[#3d3b8a] rounded-lg py-2 w-[340px] h-fit shadow-[0_0_0_0_#ffffff00] text-white text-sm group hover:cursor-pointer'>
      <div
        className='w-full flex items-start py-3 justify-center h-fit'
        style={{
          boxShadow: `0px 5px 1px -4px #020071c2 inset, 0 -5px 1px -4px #020071c2 inset`,
          // backgroundImage: `url(${get_icon_url_path(item["Path"])})`,
          backgroundSize: "70px 70px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "95% 50%",
        }}>
        <div
          className='w-[90px] h-[90px] mb-0 flex justify-center items-center rounded-md'
          style={{
            backgroundImage: rarityGradient,
          }}>
          <img
            src={get_icon_url_relic(item["Icon"])}
            width={128}
            height={128}
            alt={item["Name"]}
            className='scale-[0.8] group-hover:scale-[1.3] relative z-[100] w-[128px] transition-all duration-300 drop-shadow-[5px_5px_0px_#00000077] '
          />
        </div>
        <div className='flex flex-col items-start justify-start w-[220px] ml-3 h-fit'>
          <div
            className='font-bold text-[16px] leading-[18px] relative z-[101] group-hover:text-[15px] group-hover:font-extrabold text-[#dadada]'
            style={
              {
                // textShadow: `1px 0 0px #000, -1px 0 0px #000, 0 1px 0px #000, 0 -1px 0px #000, 1px 0px 0px`,
                // filter: `drop-shadow(0px 0px 7px #ffffff7a)`,
                // color: `${rarityColor}`,
              }
            }>
            {item["DisplayName"]}
          </div>
          <div className='text-[12px] text-[#787878] font-extrabold leading-[18px] mb-0'>
            {item["_id"]}
          </div>
          {item["Skills"].map((skill: any, idx: number) => {
            return (
              <div key={idx} className='w-full px-0 text-[10px] text-[#b2b2b2]'>
                {/* <div className='font-extrabold text-[13px] text-left text-[#f4e135]'>{idx === 0 ? "2p" : "4p"}</div> */}
                <div className='text-[10px] leading-[12px] font-medium text-left text-[#b2b2b2]'>
                  <span className='font-bold text-[#f4e135]'>{idx === 0 ? "2p" : "4p"}: </span>
                  {skill.replace(/<[^>]+>/g, "")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
