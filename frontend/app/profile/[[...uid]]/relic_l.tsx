import Image from "next/image";

import {
  scoreLib,
  scoreSetLib,
  weightLib,
  calculateScoreList,
  calculateFinalScore,
  calculateSetScore,
  charIndex,
  charSetIndex,
  weightParse,
  charIndexHeaders,
  charSetIndexHeaders,
} from "../../lib/score";

interface RelicJSON {
  icon: string;
  type: number;
  level: number;
  main_affix: {
    display: string;
    name: string;
    type: string;
    value: number;
  };
  sub_affix: {}[];
}

export default function RelicL({
  relicJSON,
  charName,
  element,
  elementColor,
}: {
  relicJSON: RelicJSON;
  charName: string;
  element: string;
  elementColor: string;
}) {
  const relicDataParsedFull = weightLib.split("\n").map((line) => {
    return line.split("\t");
  });

  const relicScores = relicJSON["sub_affix"].map((affix: any) => {
    const foundLine = relicDataParsedFull.find((line) => line[0] === affix["type"]);
    return foundLine && charName in charIndex
      ? (affix["value"] / Number(foundLine[1])) *
          Number(
            charIndex["INFO"].includes(affix["type"])
              ? charIndex[charName][charIndex["INFO"].indexOf(affix["type"])]
              : 0
          )
      : -1;
  });
  const relicMainstatWeight = relicDataParsedFull.find(
    (line) => line[0] === (relicJSON["main_affix"] as any)["type"]
  )
    ? relicJSON["main_affix"]["value"] /
      Number(
        relicDataParsedFull.find((line) => line[0] === (relicJSON["main_affix"] as any)["type"])![1]
      )
    : 0;
  const relicMainstatScore =
    charName in charIndex && charIndex["INFO"].includes((relicJSON["main_affix"] as any)["type"])
      ? relicMainstatWeight *
        Number(
          charIndex[charName][charIndex["INFO"].indexOf((relicJSON["main_affix"] as any)["type"])]
        )
      : 0;
  const relicScore = relicScores.reduce((a, b) => a + b, 0);
  const subAffixWeights = relicJSON["sub_affix"].map((affix: any) => {
    const foundLine = relicDataParsedFull.find((line) => line[0] === affix["type"]);
    return foundLine ? affix["value"] / Number(foundLine[1]) : -1;
  });

  const isCriticalStat = (type: string) => {
    return (
      charName in charIndex &&
      charIndex["INFO"].includes(type) &&
      parseFloat(charIndex[charName][charIndex["INFO"].indexOf(type)]) > 0
    );
  };

  return (
    <div className=' w-[309px] flex justify-center items-center rounded-sm flex-col'>
      <div className='flex mb-[2px]'>
        <div className='w-[54px] h-[54px] flex justify-center items-center bg-[#020071c2] rounded-md relative'>
          <img
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${relicJSON["icon"]}`}
            width={64}
            height={64}
            alt='Relic Icon'
            className='w-[46px] h-[46px]'
          />
        </div>
        <div className='flex flex-col text-center ml-[10px] gap-[2px] font-bold'>
          <div className='bg-[#e8e8e8]  active:bg-w3 hover:underline hover:cursor-default w-[240px] text-[15px] text-r1 rounded-sm pt-[8px] pb-[0px] font-extrabold'>
            {`${relicJSON["main_affix"]["name"]
              .replace("Boost", "")
              .replace("Energy Regeneration Rate", "Energy Regen")
              .replace("Outgoing Healing", "Heal Boost")}  ${relicJSON["main_affix"]["display"]}
            `}
          </div>
          <div className='bg-[#e8e8e8]  active:bg-w3 hover:underline hover:cursor-default w-[240px] text-[13px] text-[#7b0b0bc9] rounded-sm '>
            LV {relicJSON["level"]}
          </div>
        </div>
      </div>

      {[0, 1, 2, 3].map((index, i) => {
        const affix: any = index in relicJSON["sub_affix"] ? relicJSON["sub_affix"][index] : null;

        return (
          <div
            className='active:shadow-[5px_0px_0px_-4px_#ffffff,-5px_0px_0px_-4px_#ffffff] grid grid-cols-[40px,155px,40px,40px] w-fit text-center font-bold h-full  text-base text-w1 bg-[#3d3b8a]'
            // style={i % 2 === 0 ? { opacity: "80%" } : {}}
            key={i}
            style={{
              opacity: i % 2 === 0 ? "0.8" : "1",
              textShadow: isCriticalStat(affix ? affix["type"] : "")
                ? "0 0 1px #E5D64A, 0 0 10px #E5D64A"
                : "none",
              color: isCriticalStat(affix ? affix["type"] : "") ? "#E5D64A" : "#d9d9d9",
            }}>
            <div className='w-full flex justify-center items-center bg-[#020071c2]'>
              <img
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                  affix ? affix["icon"] : ""
                }`}
                width={32}
                height={32}
                alt='Relic Icon'
                className='w-[16px] h-[16px]'
                style={{
                  filter: `drop-shadow(0 0 1px #000000) drop-shadow(0 0 10px #000000)`,
                }}
              />
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-justify flex justify-between text-[12px]'>
              <div className='w-[100px] text-left pl-2'>
                {affix
                  ? // ? affix["name"].substring(0, 9) + (affix["name"].length > 9 ? "-" : "")
                    affix["name"]
                  : `Stat ${i + 1}`}
              </div>
              <div className='w-[55px] text-right pr-2'>
                {affix
                  ? affix["type"] == "SpeedDelta"
                    ? affix["value"].toFixed(1)
                    : affix["display"]
                  : "-"}
              </div>
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-right text-[12px] pr-[4px] bg-[#02007119]'>
              {"•".repeat(affix ? Math.ceil(subAffixWeights[index] - 0.1) : 0)}
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-center text-[12px] relic_weight'>
              {affix ? subAffixWeights[index].toFixed(1) : "-"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
