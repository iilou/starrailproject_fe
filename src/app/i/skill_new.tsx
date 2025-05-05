import Image from "next/image";
import { transformDesc } from "./lib";
import StyledText from "./styledtext";
import { transform } from "next/dist/build/swc/generated-native";

// export default function SkillNew({ isMemo, icon, elementColor, name, desc, level, type_text}
export default function SkillNew({
  isMemo,
  isMax,
  icon,
  elementColor,
  name,
  desc,
  level,
  type_text,
  params = [[]],
  width = "374px",
}: {
  isMemo: boolean;
  isMax: boolean;
  icon: string;
  elementColor: string;
  name: string;
  desc: any;
  level: string;
  type_text: string;
  params?: any[];
  width?: string;
}) {
  return (
    <div
      className={` h-fit flex rounded-[10px] opacity-90 ${
        isMemo ? "bg-[#8971B2]" : "bg-[#3d3b8a]"
      } shadow-[0_0_0_0_#ffffff00] hover:shadow-[0_0_0px_2px_#e7e7e7] active:shadow-[0_0_3px_2px_#c7c7c7] py-[10px] duration-100`}
      style={{ width: width }}>
      {/* <div className='w-full flex' style={{ backgroundColor: isMemo ? "#8971B2" : "" }}> */}
      <div className={`rounded-[10px] px-3 ml-[4px] flex flex-col justify-center items-center ${isMemo ? "bg-[#210e38]" : "bg-[#5c59bf]"}`} style={{ height: "104px" }}>
        <div className='w-[50px] h-[50px]'>
          <Image
            src={`https://homdgcat.wiki/images/skillicons/avatar/${icon}`}
            width={100}
            height={100}
            alt={name}
            style={{
              boxShadow: isMax ? `0 0 10px 5px ${elementColor} inset, 0 0 5px 1px ${elementColor}` : "",
            }}
            className='rounded-full bg-[#232323]'
          />
        </div>
        {!isNaN(parseInt(level)) && (
          <div
            className='font-extrabold text-center bg-[#232323fewg] rounded-md w-fit px-2 mt-[2px]'
            style={{
              color: isMax ? "#ffffff" : "#c1c1c1",
              textShadow: isMax
                ? `0 0 3px ${elementColor}, 0 0 5px ${elementColor}, 0 0 7px ${elementColor}, 0 0 10px ${elementColor}, 0 0 20px ${elementColor}`
                : "0 0 7px #00000077",
            }}>
            {level}
          </div>
        )}
      </div>
      <div className='rounded-[10px] h-full w-full mx-1 group text-[#ececec]'>
        {/* <div
          className={`px-3 font-black text-[16px] py-2 text-left  group-hover:bg-[] rounded-md ${isMemo ? "bg-[#4b0071c2]" : "bg-[#020071c2]"}`}
          style={{ textShadow: "0 0 15px #000" }}>
          {type_text}
        </div> */}
        {type_text !== "" && (
          <div
            className={`px-3 font-black text-[14px] py-1 text-left  group-hover:bg-[] rounded-md ${isMemo ? "bg-[#4b0071c2]" : "bg-[#020071c2]"}`}
            style={{ textShadow: "0 0 15px #000" }}>
            {type_text}
          </div>
        )}
        <div className='px-2 h-fit'>
          {/* {skills
            .filter((o: any) => o["icon"] === skills[index]["icon"] && o["effect"] !== "MazeAttack")
            .map((skill: any, idx: number) => {
              return (
                <div className='mt-1'>
                  <div className='font-extrabold text-[13px] text-left text-[#f4e135]'>{skill["name"]}</div>
                  <div className='text-[11px] font-medium text-left text-[#dadada]'>{skill["desc"]}</div>
                </div>
              );
            })} */}
          {desc.map((skill: any, idx: number) => {
            return (
              <div className='mt-1' key={idx}>
                {"name" in skill && <div className='m1_1:text-[12px] m1_2:text-[11px] font-extrabold text-[13px] text-left text-[#f4e135]'>{skill["name"]}</div>}
                {"desc" in skill && (
                  <div className='text-[11px] m1_1:text-[10px] m1_2:text-[9px] font-medium text-left text-[#dadada]'>
                    {/* {
                      // skill["desc"]
                      transformDesc(skill["desc"], level, params[idx])
                    } */}
                    <StyledText text={transformDesc(skill["desc"], isNaN(parseInt(level)) ? 1 : parseInt(level), params[idx])} />
                  </div>
                )}
                {/* <div className='font-extrabold text-[13px] text-left text-[#f4e135]'>{skill["name"]}</div>
                <div className='text-[11px] font-medium text-left text-[#dadada]'>{skill["desc"]}</div> */}
              </div>
            );
          })}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
