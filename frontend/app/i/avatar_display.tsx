import { get_icon_url_character, get_icon_url_element, get_icon_url_path, string_with_char_limit, elementColor, elementConvert } from "./lib";
import Image from "next/image";

export default function AvatarDisplay({ item, onClick }: { item: any; onClick?: () => void }) {
  //   const rarityColor = item["Rarity"] === 5 ? "#FFD700" :
  const rarityGradient = item["Rarity"] === 5 ? "linear-gradient(180deg,#885550,#c9a36a 53%)" : "linear-gradient(180deg,#343659,#8a5fcc 53%)";
  //   const rarityGradient = item["Rarity"] === 5 ? "linear-gradient(180deg,#885550,#c9a36a 53%)" : "linear-gradient(180deg,#343659,#4172b9 53%)";
  return (
    <div className='flex flex-col items-center justify-center mx-2 my-4 bg-[#3d3b8a] rounded-lg px-1 py-1 w-[150px] h-[290px] shadow-[0_0_0_0_#ffffff00] text-white text-sm group hover:cursor-pointer'>
      <div
        className='mb-1 font-bold text-[18px] relative z-[101] h-[22px] group-hover:text-[18px] group-hover:font-extrabold text-center'
        style={{
          color: `${elementColor[elementConvert[item["Element"]]]}`,
          textShadow: `1px 0 0px #000, -1px 0 0px #000, 0 1px 0px #000, 0 -1px 0px #000`,
        }}>
        {string_with_char_limit(item["DisplayName"], 15)}
      </div>
      <div className='w-[100px] h-[85px] mb-0'>
        <div className='w-fit h-fit rounded-full'>
          <Image
            src={get_icon_url_character(item["Icon"])}
            width={100}
            height={100}
            alt={item["Name"]}
            className='rounded-full bg-[#121212] group-hover:scale-110 relative z-[100]'
            style={{
              backgroundImage: rarityGradient,
              //   boxShadow: `0 0 13px 3px ${rarityColor} inset, 0 0 1px 1px ${rarityColor}`,
              // boxShadow: `0 0 30px 10px #232323 inset, 0 0 5px 1px #232323`,
              // filter: `drop-shadow(0 0 10px ${elementColor[elementConvert[item["Element"]]]})`,
            }}
            // style={{ backgroundColor: elementColor[elementConvert[item["Element"]]] }}
          />
        </div>
      </div>
      <div className='w-full h-[10px] mb-2 flex relative z-[101]'>
        <div className='w-[80px] h-[80px]'>
          <Image src={get_icon_url_path(item["Path"])} width={100} height={100} alt={item["Path"]} className='rounded-full opacity-90 bg-[#000000e7]' />
        </div>
        <div className='w-[70px] h-1'></div>
        <div className='w-[80px] h-[80px]'>
          <Image src={get_icon_url_element(item["Element"])} width={100} height={100} alt={item["Element"]} className='rounded-full opacity-90 bg-[#000000e7]' />
        </div>
      </div>
      <div
        className='mb-5 relative z-[101] font-extrabold'
        style={{
          //   color: rarityColor,
          textShadow: `0 0 7px #000, 0 0 10px #000, 0 0 15px #000, 0 0 7px #ffffff, 0 0 7px #000`,
        }}>
        {item["Rarity"]}★
      </div>
      <div className='text-xs  relative z-[101]'>{item._id}</div>
      {/* <div className='text-xs'>{item["Path"]}</div>
      <div className='text-xs'>{item["Element"]}</div> */}
      <div className='font-bold relative z-[101]'>V{item["Ver"]}</div>
      <div className='flex flex-col text-[11px] items-start font-medium'>
        {Object.keys(item["Stats"]).map((key: string, idx: number) => {
          const hueArr = [0, 120, 240, 60, 300];
          // const curHue = hueArr[idx % hueArr.length];
          const curHue = 120;
          console.log("Rank", item["Rank"], "TotalRank", item["TotalRank"], "Stats", item["Stats"]);
          return (
            <div
              key={idx}
              className='h-[14px] flex'
              // style={{ color: `hsl(${curHue}, 50%, 70%)` }}
              style={{
                color: item["rank"][key] <= 3 ? "#ffffff" : item["rank"][key] / item["rankTotal"][key] < 0.2 ? "#f4e135" : "#676767",
                textShadow: item["rank"][key] <= 3 ? `0 0 5px #ffffff` : item["rank"][key] / item["rankTotal"][key] < 0.2 ? `none` : "none",
              }}>
              <div className='w-[50px] text-center flex'>
                <div className='w-[20px] text-right'>{item["rank"][key]}</div>
                <div className='w-[10px] text-center'>/</div>
                <div className='w-[20px] text-left'>{item["rankTotal"][key]}</div>
              </div>
              <div className='w-[70px] text-center'>
                {key}: {parseFloat(item["Stats"][key].toFixed(1))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
