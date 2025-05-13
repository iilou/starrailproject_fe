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
  SPNeed,
  SPAdd,
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
  SPNeed: number[] | null;
  SPAdd: number[] | null;
  params?: any[];
  width?: string;
}) {
  return (
    <div
      className={` h-fit flex flex-wrap rounded-[3px] opacity-90 ${
        isMemo ? "bg-[#68548c]" : "bg-[#3d3b8a]"
      } shadow-[0_0_0_0_#ffffff00] hover:shadow-[0_0_0px_2px_#e7e7e7] active:shadow-[0_0_3px_2px_#c7c7c7] py-[5px] duration-100`}
      style={{ width: width }}>
      <div className='flex w-full justify-between pr-2 items-center'>
        <div
          className={`rounded-[10px] px-[6px] ml-[4px] flex flex-col justify-center items-center aspect-square w-[48px] ${
            isMemo ? "bg-[#baa2d7]" : "bg-[#5c59bf] "
          }`}
          // style={{ height: "64px" }}
          // style={{ height: isNaN(parseInt(level)) ? "32px" : "54px" }}
        >
          <div className='w-[32px] h-[32px]'>
            <Image
              src={`https://homdgcat.wiki/images/skillicons/avatar/${icon}`}
              width={100}
              height={100}
              alt={name}
              style={{
                boxShadow: isMax
                  ? `0 0 5px 0px ${elementColor} inset, 0 0 3px 1px ${elementColor}`
                  : "",
              }}
              className='rounded-full bg-[#232323] w-full h-full'
            />
          </div>
        </div>
        <div className='rounded-[4px] h-[32px] mx-1 group text-[#f2f2f2]'>
          {type_text !== "" && (
            <div
              className={`px-7 font-bold text-[16px] text-left h-[32px] leading-[32px] group-hover:bg-[] rounded-md ${
                isMemo ? "bg-[#612c89e2]" : "bg-[#2c2c89e2]"
              }`}
              style={{ textShadow: "0 0 5px #000000a8" }}>
              {type_text}
            </div>
          )}
        </div>
        {/* {!isNaN(parseInt(level)) && ( */}
        <div
          className={`rounded-[10px] px-[6px] ml-[4px] flex flex-col justify-center items-center aspect-square w-[48px] ${
            isMemo ? "bg-[#baa2d7]" : "bg-[#5c59bf] "
          }`}
          // style={{ height: "64px" }}
          // style={{ height: isNaN(parseInt(level)) ? "32px" : "54px" }}
        >
          <div
            className='font-extrabold text-center bg-[#232323fewg] rounded-md w-fit text-[16px]'
            style={{
              color: isMax ? "#e7e7e7" : "#d2d2d2",
              textShadow: isMax
                ? `0 0 1px ${elementColor}, 0 0 7px ${elementColor}`
                : "0 0 1px #00000088",
            }}>
            {isNaN(parseInt(level)) ? (isMax ? "✓" : "𐄂") : level}
          </div>
        </div>
        {/* )} */}
      </div>
      <div className='px-2 h-fit'>
        {desc.map((skill: any, idx: number) => {
          return (
            <div className='mt-1' key={idx}>
              {"name" in skill && (
                <div className='m1_1:text-[12px] m1_2:text-[12px] font-extrabold text-[13px] text-left text-[#f4e135]'>
                  {skill["name"]}
                </div>
              )}
              {(SPNeed || SPAdd) && (
                <div>
                  {SPNeed && idx < SPNeed.length && SPNeed[idx] > 0 && (
                    <div className='text-[12px] m1_1:text-[12px] m1_2:text-[11px] font-medium text-left text-[#a1a1a1]'>
                      SP Need: {SPNeed[idx]}
                    </div>
                  )}
                  {SPAdd && idx < SPAdd.length && SPAdd[idx] > 0 && (
                    <div className='text-[12px] m1_1:text-[12px] m1_2:text-[11px] font-medium text-left text-[#a1a1a1]'>
                      SP Add: {SPAdd[idx]}
                    </div>
                  )}
                </div>
              )}
              {"desc" in skill && (
                <div className='text-[12px] m1_1:text-[12px] m1_2:text-[11px] font-medium text-left text-[#dadada]'>
                  {/* {
                      // skill["desc"]
                      transformDesc(skill["desc"], level, params[idx])
                    } */}
                  <StyledText
                    text={transformDesc(
                      skill["desc"],
                      isNaN(parseInt(level)) ? 1 : parseInt(level),
                      params[idx]
                    )}
                  />
                </div>
              )}
              {/* <div className='font-extrabold text-[13px] text-left text-[#f4e135]'>{skill["name"]}</div>
                <div className='text-[11px] font-medium text-left text-[#dadada]'>{skill["desc"]}</div> */}
            </div>
          );
        })}
      </div>

      {/* </div> */}
    </div>
  );
}
