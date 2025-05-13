import {
  get_icon_url_character,
  get_icon_url_element,
  get_icon_url_path,
  string_with_char_limit,
  elementColor,
  elementConvert,
} from "./lib";

import Image from "next/image";

import { get_rank_from_score, ranks } from "../../ranks";

export default function AvatarDisplay({
  item,
  sortedStat,
  onClick,
}: {
  item: any;
  sortedStat: string;
  onClick?: () => void;
}) {
  //   const rarityColor = item["Rarity"] === 5 ? "#FFD700" :
  const rarityGradient =
    item["Rarity"] === 5
      ? "linear-gradient(180deg,#885550,#c9a36a 53%)"
      : "linear-gradient(180deg,#343659,#8a5fcc 53%)";
  //   const rarityGradient = item["Rarity"] === 5 ? "linear-gradient(180deg,#885550,#c9a36a 53%)" : "linear-gradient(180deg,#343659,#4172b9 53%)";
  return (
    <div className='flex flex-col items-center justify-center mx-1 my-1 bg-[#3d3b8a] rounded-lg px-1 py-2 w-[150px] h-fit shadow-[0_0_0_0_#ffffff00] text-white text-sm group hover:cursor-pointer hover:shadow-[0_0_0_1px_#ffffff]'>
      <div
        className='mb-1 font-bold text-[18px] relative z-[101] h-[22px] group-hover:text-[18px] group-hover:font-extrabold text-center'
        style={{
          // color: `${elementColor[elementConvert[item["Element"]]]}`,
          textShadow: `1px 0 0px #000, -1px 0 0px #000, 0 1px 0px #000, 0 -1px 0px #000`,
        }}>
        {string_with_char_limit(item["DisplayName"], 15)}
      </div>
      <div className='w-[100px] h-[85px] mb-0'>
        <div
          className='w-fit h-fit rounded-full'
          style={{
            backgroundImage: rarityGradient,
          }}>
          <Image
            src={get_icon_url_character(item["Icon"])}
            width={100}
            height={100}
            alt={item["Name"]}
            className='rounded-full group-hover:scale-[1.2] relative z-[100] transition-all duration-300 drop-shadow-[5px_5px_0px_#000000a7] group-hover:drop-shadow-[10px_10px_0px_#000000a7] group-hover:translate-x-[-8px] translate-x-[-3px]'
          />
        </div>
      </div>
      <div className='w-full h-[10px] mb-2 flex relative z-[101]'>
        <div className='w-[80px] h-[80px]'>
          <Image
            src={get_icon_url_path(item["Path"])}
            width={100}
            height={100}
            alt={item["Path"]}
            className='rounded-full opacity-90 bg-[#000000e7]'
          />
        </div>
        <div className='w-[70px] h-1'></div>
        <div className='w-[80px] h-[80px]'>
          <Image
            src={get_icon_url_element(item["Element"])}
            width={100}
            height={100}
            alt={item["Element"]}
            className='rounded-full opacity-90 bg-[#000000e7]'
          />
        </div>
      </div>
      <div
        className='mb-5 relative z-[101] font-extrabold'
        style={{
          textShadow: `0 0 7px #000, 0 0 10px #000, 0 0 15px #000, 0 0 7px #ffffff, 0 0 7px #000`,
        }}>
        {item["Rarity"]}★
      </div>
      <div className='text-xs  relative z-[101] text-[#b2b2b2]'>{item._id}</div>
      {/* <div className='text-xs'>{item["Path"]}</div>
      <div className='text-xs'>{item["Element"]}</div> */}
      <div className='relative z-[101] font-extrabold'>V{item["Ver"]}</div>
      <div className='flex flex-col text-[11px] items-start font-medium'>
        {Object.keys(item["Stats"]).map((key: string, idx: number) => {
          const rank = get_rank_from_score(
            parseFloat(item["Stats"][key].toFixed(1)),
            item["maxStat"][key]
          );

          const isSortedStat = sortedStat.split("///")[0] === "stat_" + key.toLowerCase();
          if (!isSortedStat) {
            return null;
          }

          return (
            <div
              key={idx}
              className='h-[13px] flex px-3 rounded-md leading-[14px]'
              style={{
                color: isSortedStat ? rank.color + "f2" : "#898989",
                fontWeight: isSortedStat ? "700" : "600",
              }}>
              <div
                className='w-[50px] text-center flex justify-center rounded-md'
                style={{
                  fontWeight: isSortedStat ? "700" : "700",
                  backgroundColor: isSortedStat ? "#12121278" : "#00000000",
                }}>
                <div className='w-[20px] text-left'>
                  {((item["Stats"][key] * 100) / item["maxStat"][key]).toFixed(1)}
                </div>
                <div className='w-[20px] text-right'>%</div>
              </div>
              <div
                className='w-[70px] text-center'
                style={{
                  color: isSortedStat ? "#b2b2b2" : "#898989",
                  fontWeight: isSortedStat ? "bold" : "700",
                }}>
                {key}: {parseFloat(item["Stats"][key].toFixed(1))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
