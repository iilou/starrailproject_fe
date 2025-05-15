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
  const relicTypes = ["Head", "Hand", "Body", "Feet", "Ball", "Rope"];

  //   const relicData = `HPDelta	42.337549	38.1037941	33.8700392
  // AttackDelta	21.168773	19.0518957	16.9350184
  // DefenceDelta	21.168773	19.0518957	16.9350184
  // HPAddedRatio	0.04320000065	0.03888000059	0.03456000052
  // AttackAddedRatio	0.04320000065	0.03888000059	0.03456000052
  // DefenceAddedRatio	0.05399999977	0.04859999979	0.04319999982
  // SpeedDelta	2.600000001	2.3	2
  // CriticalChanceBase	0.03240000084	0.02916000076	0.02592000067
  // CriticalDamageBase	0.06480000168	0.05832000151	0.05184000134
  // StatusProbabilityBase	0.04320000065	0.03888000059	0.03456000052
  // StatusResistanceBase	0.04320000065	0.03888000059	0.03456000052
  // BreakDamageAddedRatioBase	0.06480000168	0.05832000151	0.05184000134
  // HealRatioBase	0.0345606	0.03110454	0.02764848
  // SPRatioBase	0.0194394	0.01749546	0.01555152
  // IceAddedRatio	0.0388803
  // QuantumAddedRatio	0.0388803
  // ImaginaryAddedRatio	0.0388803
  // FireAddedRatio	0.0388803
  // WindAddedRatio	0.0388803
  // ThunderAddedRatio	0.0388803
  // PhysicalAddedRatio	0.0388803		`.replaceAll("Thunder", "Lightning");
  const relicDataParsedFull = weightLib.split("\n").map((line) => {
    return line.split("\t");
  });

  //   const charRelicData =
  //     `INFO	HPDelta	AttackDelta	DefenceDelta	HPAddedRatio	AttackAddedRatio	DefenceAddedRatio	SpeedDelta	CriticalChanceBase	CriticalDamageBase	StatusProbabilityBase	StatusResistanceBase	BreakDamageAddedRatioBase	HealRatioBase	SPRatioBase	IceAddedRatio	QuantumAddedRatio	ImaginaryAddedRatio	FireAddedRatio	WindAddedRatio	ThunderAddedRatio	PhysicalAddedRatio
  // Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
  // Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0.7	0	0	0	0
  // The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0.7	0	0	0	0	0	0
  // Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
  // Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0	0	0	0	0	0	0
  // Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
  // Castorice	0.35	0	0	1	0	0	0	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
  // Acheron	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0	0.7	0
  // Gallagher	0.35	0	0	1	0	0	1	0	0	0	0	1	1	1	0	0	0	0	0	0	0
  // Robin	0	0.35	0	0	1	0	1	0	0	0	0	0	0	1	0	0	0	0	0	0	0
  // Ruan Mei	0	0	0	0	0	0	1	0	0	0	0	1	0	1	0	0	0	0	0	0	0`.replaceAll("Thunder", "Lightning");

  //   const charIndex: { [key: string]: string[] } = {};
  //   charRelicData.split("\n").forEach((line: string) => {
  //     const lineSplit: string[] = line.split("\t");
  //     charIndex[lineSplit[0]] = lineSplit;
  //   });

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
    <div className=' w-[259px] flex justify-center items-center rounded-sm flex-col'>
      <div className='flex mb-[2px]'>
        <div className='w-[56px] h-[56px] flex justify-center items-center bg-[#020071c2] rounded-md relative'>
          <Image
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${relicJSON["icon"]}`}
            width={64}
            height={64}
            alt='Relic Icon'
            className='w-[44px] h-[44px]'
          />
        </div>
        <div className='flex flex-col text-center ml-[10px] gap-[2px] font-bold'>
          <div className='bg-[#e8e8e8]  active:bg-w3 hover:underline hover:cursor-default w-[180px] text-[15px] text-r1 rounded-sm pt-[8px] pb-[0px] font-extrabold'>
            {`${relicJSON["main_affix"]["name"]
              .replace("Boost", "")
              .replace("Energy Regeneration Rate", "Energy Regen")}  ${
              relicJSON["main_affix"]["display"]
            }
            `}
          </div>
          <div className='bg-[#e8e8e8]  active:bg-w3 hover:underline hover:cursor-default w-[180px] text-[13px] text-[#7b0b0bc9] rounded-sm '>
            LV {relicJSON["level"]}
          </div>
        </div>
      </div>

      {/* <div className='w-[90%] rounded-sm mb-1 flex justify-between items-center bg-[#5c59bf] text-[13px] font-extrabold py-[3px] px-7'>
        <div className=' text-[#5bdc79] text-left '>
          M: {relicMainstatScore.toFixed(1)} S: {relicScore.toFixed(1)}
        </div>
        <div className=' text-[#f4e135] font-extrabold'>
          {"Total: " +
            ((relicScore + relicMainstatScore).toFixed(1) == "-1.0"
              ? "-"
              : (relicScore + relicMainstatScore).toFixed(1))}
        </div>
      </div> */}

      {[0, 1, 2, 3].map((index, i) => {
        const affix: any = index in relicJSON["sub_affix"] ? relicJSON["sub_affix"][index] : null;

        return (
          <div
            className='active:shadow-[5px_0px_0px_-4px_#ffffff,-5px_0px_0px_-4px_#ffffff] grid grid-cols-[40px,145px,36px,auto] w-full text-center font-bold h-full  text-base text-w1 bg-[#3d3b8a]'
            // style={i % 2 === 0 ? { opacity: "80%" } : {}}
            key={i}
            style={{
              opacity: i % 2 === 0 ? "0.8" : "1",
              textShadow: isCriticalStat(affix ? affix["type"] : "")
                ? "0 0 1px #E5D64A, 0 0 10px #E5D64A"
                : "none",
              color: isCriticalStat(affix ? affix["type"] : "") ? "#E5D64A" : "#d9d9d9",
            }}>
            <div className='hover:underline hover:cursor-default w-full py-[2px] bg-[#020071c2] text-[12px]'>
              {(affix ? relicScores[index].toFixed(1) : "-").toString() == "-1.0"
                ? "-"
                : affix
                ? relicScores[index].toFixed(1)
                : "-"}
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-justify flex justify-between text-[12px] pl-2 pr-2'>
              <div>
                {affix
                  ? affix["name"].substring(0, 10) + (affix["name"].length > 10 ? "..." : "")
                  : `Stat ${i + 1}`}
              </div>
              <div>
                {affix
                  ? affix["type"] == "SpeedDelta"
                    ? affix["value"].toFixed(1)
                    : affix["display"]
                  : "-"}
              </div>
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-center text-[12px]'>
              {"•••••"}
            </div>
            <div className='hover:underline hover:cursor-default w-full py-[2px] text-left text-[12px] pl-2 relic_weight'>
              {affix ? subAffixWeights[index].toFixed(1) : "-"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
