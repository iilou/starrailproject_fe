import Image from "next/image";

import StatM from "./stat_m";

import SkillsM from "./skills_m";

import RelicL from "./relic_l";

import RelicSetL from "./relicset_l";

export default function Character({ characterJSON }: { characterJSON: any }) {
  console.log("characterJSON", characterJSON);
  return (
    <>
      <div
        className="w-full rounded-lg flex justify-center mt-20 py-5 items-center bg-b2"
        //   style={{ backgroundColor: characterJSON["element"]["color"] }}
      >
        <Image
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["portrait"]}`}
          width={688}
          height={688}
          alt="Character Portrait"
          className=" -translate-y -translate-x-96 absolute"
          rel="preload"
        />
        <div className="flex flex-col items-center jusitfy-center translate-x-96 ">
          <div
            className="text-2xl font-extrabold w-[730px] text-center bg-bk1 py-3 rounded-lg"
            style={{ color: characterJSON["element"]["color"] }}
          >
            {characterJSON["name"] + " - Level " + characterJSON["level"]}
          </div>
          <div className="w-[730px] flex flex-col flex-wrap gap-[6px] h-[280px] justify-end">
            <div className="flex flex-col flex-wrap items-start h-[159px] w-fit pt-1 pb-2">
              <Image
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["light_cone"]["preview"]}`}
                width={125}
                height={147}
                alt="Light Cone Portrait"
              />
              <Image
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/deco/Star${characterJSON["light_cone"]["rarity"]}.png`}
                width={162}
                height={33}
                alt="Light Cone Rarity"
                className="mt-3"
              />
              <div className="font-extrabold text-lg text-w1">
                {`LEVEL ${characterJSON["light_cone"]["level"]}`}
              </div>
              <div className="font-bold text-lg text-w1 w-[185px]">
                {characterJSON["light_cone"]["name"]}
              </div>
            </div>

            {characterJSON["attributes"].map((attribute: any) => {
              console.log(attribute);
              return (
                <StatM
                  name={attribute["name"]}
                  value={
                    parseFloat(attribute["value"]) +
                    parseFloat(
                      characterJSON["additions"].find(
                        (addition: any) =>
                          addition["field"] === attribute["field"]
                      ) !== undefined
                        ? characterJSON["additions"].find(
                            (addition: any) =>
                              addition["field"] === attribute["field"]
                          )["value"]
                        : 0
                    )
                  }
                  percentage={attribute["display"].includes("%")}
                />
              );
            })}
            {characterJSON["additions"]
              .filter(
                (addition: any) =>
                  !characterJSON["attributes"].find(
                    (attribute: any) => attribute["field"] === addition["field"]
                  ) &&
                  (!addition["name"].includes("DMG Boost") ||
                    addition["name"].includes(characterJSON["element"]["name"]))
              )
              .map((addition: any) => {
                return (
                  <StatM
                    name={addition["name"]}
                    value={parseFloat(addition["value"])}
                    percentage={addition["display"].includes("%")}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-5 gap-5">
        <SkillsM
          skills={characterJSON["skills"]}
          skill_trees={characterJSON["skill_trees"]}
          rank={characterJSON["rank"]}
          rankIcons={characterJSON["rank_icons"]}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-1 mt-4">
        {characterJSON["relics"].map((relic: any) => {
          return (
            <RelicL
              relicJSON={relic}
              charName={characterJSON["name"]}
              element={characterJSON["element"]["name"]}
            />
          );
        })}
      </div>
      <div className="flex flex-col justify-center items-center gap-1 mt-4">
        {characterJSON["relic_sets"].map((relic_set: any) => {
          return <RelicSetL relicsetJSON={relic_set} />;
        })}
      </div>
      <div className="w-[1130px] text-center text-xl bg-b5 text-w1 font-extrabold mx-auto py-3 mt-3">
        DAMAGE
      </div>
    </>
  );
}
