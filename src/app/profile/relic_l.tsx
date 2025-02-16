import Image from "next/image";

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
}: {
  relicJSON: RelicJSON;
  charName: string;
  element: string;
}) {
  const relicTypes = ["Head", "Hand", "Body", "Feet", "Ball", "Rope"];

  const relicData = `HPDelta	42.337549	38.1037941	33.8700392
AttackDelta	21.168773	19.0518957	16.9350184
DefenceDelta	21.168773	19.0518957	16.9350184
HPAddedRatio	0.04320000065	0.03888000059	0.03456000052
AttackAddedRatio	0.04320000065	0.03888000059	0.03456000052
DefenceAddedRatio	0.05399999977	0.04859999979	0.04319999982
SpeedDelta	2.600000001	2.3	2
CriticalChanceBase	0.03240000084	0.02916000076	0.02592000067
CriticalDamageBase	0.06480000168	0.05832000151	0.05184000134
StatusProbabilityBase	0.04320000065	0.03888000059	0.03456000052
StatusResistanceBase	0.04320000065	0.03888000059	0.03456000052
BreakDamageAddedRatioBase	0.06480000168	0.05832000151	0.05184000134
HealRatioBase	0.0345606	0.03110454	0.02764848
ELEMENTAddedRatio	0.0388803	0.03499227	0.03110424
SPRatioBase	0.0194394	0.01749546	0.01555152`.replaceAll("ELEMENT", element);
  const relicDataParsedFull = relicData.split("\n").map((line) => {
    return line.split("\t");
  });

  const charRelicData =
    `INFO	HPDelta	AttackDelta	DefenceDelta	HPAddedRatio	AttackAddedRatio	DefenceAddedRatio	SpeedDelta	CriticalChanceBase	CriticalDamageBase	StatusProbabilityBase	StatusResistanceBase	BreakDamageAddedRatioBase	HealRatioBase	ELEMENTAddedRatio	SPRatioBase
Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0
Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	1	0
Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0
Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0.7	0`.replaceAll("ELEMENT", element);

  const charIndex: { [key: string]: string[] } = {};
  charRelicData.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    charIndex[lineSplit[0]] = lineSplit;
  });
  console.log(charIndex);

  const relicScores = relicJSON["sub_affix"].map((affix: any) => {
    const foundLine = relicDataParsedFull.find(
      (line) => line[0] === affix["type"]
    );
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
        relicDataParsedFull.find(
          (line) => line[0] === (relicJSON["main_affix"] as any)["type"]
        )![1]
      )
    : 0;
  const relicMainstatScore =
    charName in charIndex &&
    charIndex["INFO"].includes((relicJSON["main_affix"] as any)["type"])
      ? relicMainstatWeight *
        Number(
          charIndex[charName][
            charIndex["INFO"].indexOf((relicJSON["main_affix"] as any)["type"])
          ]
        )
      : 0;
  const relicScore = relicScores.reduce((a, b) => a + b, 0);
  const subAffixWeights = relicJSON["sub_affix"].map((affix: any) => {
    const foundLine = relicDataParsedFull.find(
      (line) => line[0] === affix["type"]
    );
    return foundLine && charName in charIndex
      ? affix["value"] / Number(foundLine[1])
      : -1;
  });

  return (
    <div className="flex w-fit h-[75px] justify-center flex-wrap items-center bg-b3 rounded-sm gap-[3px]">
      <div className="w-[75px] h-[75px] flex justify-center items-center">
        <Image
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${relicJSON["icon"]}`}
          width={59}
          height={59}
          alt="Relic Icon"
        />
      </div>
      <div className=" bg-w2 w-[214px] text-center text-xl font-extrabold flex flex-col h-full ">
        <div className="w-full pt-3 text-r4">
          {`${relicTypes[relicJSON["type"] - 1]} +${relicJSON["level"]}`}
        </div>
        <div
          className="w-full pt-1 text-sm text-r1"
          style={{ borderTop: "3px solid #A29FDD" }}
        >
          {`${relicMainstatScore.toFixed(1)} ${relicJSON["main_affix"]["name"]
            .replace("Boost", "")
            .replace("Energy Regeneration Rate", "Energy Regen")} ${
            relicJSON["main_affix"]["display"]
          }
            `}
        </div>
      </div>
      {relicJSON["sub_affix"].map((affix: any, index: number) => {
        return (
          <div className="w-[274px] text-center font-extrabold flex flex-wrap h-full bg-b10 text-base text-b3 justify-end pt-1">
            <div className="text-left text-sm w-[175px]">
              {affix["name"] +
                " " +
                (affix["type"] == "SpeedDelta"
                  ? affix["value"].toFixed(1)
                  : affix["display"])}
            </div>
            <div className="text-left text-sm w-[40px]">{"•••"}</div>
            <div className="text-right text-sm w-[30px] mr-3 relic_weight">
              {subAffixWeights[index].toFixed(
                affix["type"] == "SpeedDelta" ? 1 : 2
              )}
            </div>
            <div className="w-full text-b2 border-t-b3 border-t-[3px] pt-[8px]  text-2xl ">
              {relicScores[index].toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
