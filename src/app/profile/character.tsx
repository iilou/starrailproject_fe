import Image from "next/image";
import ChangeCircle from "@mui/icons-material/ChangeCircle";

import StatM from "./stat_m";

import SkillsM from "./skills_m";

import RelicView from "./relic_view";

import PHeader from "./p_header";
import BG from "../bg";

// import {
//   scoreLib,
//   scoreSetLib,
//   weightLib,
//   calculateScoreList,
//   calculateFinalScore,
//   calculateSetScore,
//   charIndex,
//   charSetIndex,
//   weightParse,
//   charIndexHeaders,
//   charSetIndexHeaders,
// } from "../lib/score";

import { use, useState } from "react";
import { useEffect } from "react";

export default function Character({ characterJSON }: { characterJSON: any }) {
  const [isTableView, setIsTableView] = useState(true);

  const scoreLib = `INFO	wefe	wef	gawef	HP	ATK	DEF	SPD	CRIT Rate	CRIT DMG	Effect Hit Rate	Effect RES	Break Effect	Outgoing Healing Boost	Energy Regeneration Rate	Ice DMG Boost	Quantum DMG Boost	Imaginary DMG Boost	Fire DMG Boost	Wind DMG Boost	Thunder DMG Boost	Physical DMG Boost
Seele	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Dan Heng \u2022 Imbibitor Lunae	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0.7	0	0	0	0
The Herta	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0.7	0	0	0	0	0	0
Feixiao	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Firefly	0	0.2	0	0	0.7	0	1	0	0	0	0	1	0	0	0	0	0	0	0	0	0
Aglaea	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0
Castorice	0.35	0	0	1	0	0	0	1	1	0	0	0	0	0	0	0.7	0	0	0	0	0
Acheron	0	0.2	0	0	0.7	0	0.7	1	1	0	0	0	0	0	0	0	0	0	0	0.7	0
Gallagher	0.35	0	0	1	0	0	1	0	0	0	0	1	1	1	0	0	0	0	0	0	0
Robin	0	0.35	0	0	1	0	1	0	0	0	0	0	0	1	0	0	0	0	0	0	0
Ruan Mei	0	0	0	0	0	0	1	0	0	0	0	1	0	1	0	0	0	0	0	0	0`;
  const charIndex: { [key: string]: string[] } = {};
  scoreLib.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    charIndex[lineSplit[0]] = lineSplit;
  });
  console.log(charIndex);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const translateX = Math.min(-384, Math.max(-384 - scrollY / 2, -768));

  return (
    <div className='h-fit'>
      {/* <div className='h-full w-full z-0 absolute'>
        <BG />
      </div> */}
      {/* <PHeader text={characterJSON["name"]} /> */}
      <div className='w-1 h-[60px]'></div>
      <div
        className='w-full rounded-lg flex justify-center py-5 items-center bg-b2 z-[100] relative transition-all duration-500'
        style={{
          backgroundColor: scrollY > 200 ? "#414aa2" : "#414aa882",
          boxShadow: scrollY > 200 ? `0px 0px 3px 0px #414aa2` : `0px 0px 10px 7px #414aa882`,
        }}
        //   style={{ backgroundColor: characterJSON["element"]["color"] }}
      >
        <div
          className=' w-fit h-fit -translate-y  absolute transition-all duration-500 z-[99]'
          style={{
            transform: scrollY > 200 ? `translateX(-384px)` : `translateX(-50px)`,
            // filter: `drop-shadow(0px 0px 30px ${characterJSON["element"]["color"]}88)`,
            filter: scrollY > 200 ? `drop-shadow(0px 0px 5px ${characterJSON["element"]["color"]}ee)` : `drop-shadow(0px 0px 30px ${characterJSON["element"]["color"]}99)`,
          }}>
          <Image
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["portrait"]}`}
            width={1200}
            height={1200}
            alt='Character Portrait'
            priority={true}
            className='transition-all duration-500'
            style={{
              width: scrollY > 200 ? "700px" : "900px",
              height: scrollY > 200 ? "700px" : "900px",
            }}
            rel='preload'
          />
        </div>
        <div
          className='flex flex-col items-center jusitfy-center transition-all duration-500 z-[98]'
          style={{
            transform: scrollY > 200 ? `translateX(384px)` : `translateX(-150px)`,
            opacity: scrollY > 200 ? 1 : 0,
          }}>
          <div className='text-2xl font-extrabold w-[730px] text-center bg-bk1 py-3 rounded-lg' style={{ color: characterJSON["element"]["color"] }}>
            {characterJSON["name"] + " - Level " + characterJSON["level"]}
          </div>
          <div className='w-[730px] flex flex-col flex-wrap gap-[6px] h-[280px] justify-end items-center'>
            <div
              className='flex flex-col flex-wrap items-start h-[159px] pt-1 pb-2 w-[340px] group'
              onMouseEnter={(e) => {
                console.log(e.currentTarget.querySelector("img"));
                const div = e.currentTarget.querySelector(".icon") as HTMLDivElement;
                const stars = e.currentTarget.querySelector(".stars") as HTMLImageElement;

                if (div) {
                  div.style.filter = `drop-shadow(0px 0px 15px ${characterJSON["element"]["color"]}) brightness(1.1)`;
                  div.style.transform = `scale(1.1)`;
                }

                if (stars) {
                  stars.style.filter = "brightness(1.1)";
                  stars.style.transform = `scale(1.1)`;
                }
              }}
              onMouseLeave={(e) => {
                const div = e.currentTarget.querySelector(".icon") as HTMLDivElement;
                const stars = e.currentTarget.querySelector(".stars") as HTMLImageElement;

                if (div) {
                  div.style.filter = `drop-shadow(0px 0px 15px ${characterJSON["element"]["color"]}00) brightness(1)`;
                  div.style.transform = `scale(1)`;
                }

                if (stars) {
                  stars.style.filter = "brightness(1)";
                  stars.style.transform = `scale(1)`;
                }
              }}>
              <div className='flex items-center justify-center w-[125px] h-[147px] rounded-lg transition-all duration-150 icon'>
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["light_cone"] && characterJSON["light_cone"]["preview"]}`}
                  width={125}
                  height={147}
                  alt='Light Cone Portrait'
                  className='z-[101]'
                />
              </div>
              <Image
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/deco/Star${
                  characterJSON["light_cone"] ? characterJSON["light_cone"]["rarity"] : 3
                }.png`}
                width={162}
                height={33}
                alt='Light Cone Rarity'
                className='mt-3 stars transition-all'
              />
              <div className='font-extrabold text-lg text-w1'>{`LEVEL ${characterJSON["light_cone"] ? characterJSON["light_cone"]["level"] : 0}`}</div>
              <div className='font-bold text-lg text-w1 w-[185px]'>{characterJSON["light_cone"] ? characterJSON["light_cone"]["name"] : "No Light Cone"}</div>
            </div>

            {characterJSON["attributes"].map((attribute: any) => {
              return (
                <StatM
                  name={attribute["name"]}
                  value={
                    parseFloat(attribute["value"]) +
                    parseFloat(
                      characterJSON["additions"].find((addition: any) => addition["field"] === attribute["field"]) !== undefined
                        ? characterJSON["additions"].find((addition: any) => addition["field"] === attribute["field"])["value"]
                        : 0
                    )
                  }
                  percentage={attribute["display"].includes("%")}
                  critical={
                    characterJSON["name"] in charIndex &&
                    charIndex["INFO"].includes(attribute["name"]) &&
                    parseFloat(charIndex[characterJSON["name"]][charIndex["INFO"].indexOf(attribute["name"])]) > 0.3
                  }
                />
              );
            })}
            {characterJSON["additions"]
              .filter(
                (addition: any) =>
                  !characterJSON["attributes"].find((attribute: any) => attribute["field"] === addition["field"]) &&
                  (!addition["name"].includes("DMG Boost") || addition["name"].includes(characterJSON["element"]["name"]))
              )
              .map((addition: any) => {
                return (
                  <StatM
                    name={addition["name"]}
                    value={parseFloat(addition["value"])}
                    percentage={addition["display"].includes("%")}
                    critical={
                      characterJSON["name"] in charIndex &&
                      charIndex["INFO"].includes(addition["name"]) &&
                      parseFloat(charIndex[characterJSON["name"]][charIndex["INFO"].indexOf(addition["name"])]) > 0.3
                    }
                  />
                );
              })}
          </div>
        </div>
      </div>

      <div
        className='transition-all duration-[1000ms]'
        style={{
          opacity: scrollY > 200 ? 1 : 0,
        }}>
        <div className='h-[10px] w-[1px] mx-auto relative -translate-y-[100px]'>
          {[0, 1, 2, 3, 4, 5].map((num, i) => {
            const r = Math.floor(num / 2);
            const c = num % 2;
            const size = 512;
            const gap = 400;
            const gap_y = 40;
            const t_x = c * size - size + gap * (c == 0 ? -1 : 1);
            const t_y = r * size + r * gap_y + 200;
            const op = num >= characterJSON["rank"] ? 0.3 : 1;
            const moveSpeed = 1;
            return (
              <div
                className={`absolute top-0 left-0 z-[10] animate-eid_glow filter transition-all`}
                style={{
                  transform: scrollY > 400 + 250 * i * 0 ? `translateX(${t_x}px) translateY(${t_y}px)` : `translateX(-250px) translateY(-350px)`,
                  width: size + "px",
                  height: size + "px",

                  // opacity: scrollY > 400 + 250 * i * 0 ? op : 0,
                  // filter: num >= characterJSON["rank"] ? `drop-shadow(0px 0px 15px #ffffffee)` : "",
                  filter:
                    scrollY > 400
                      ? num < characterJSON["rank"]
                        ? "brightness(1.2) drop-shadow(0px 0px 40px #ffffffc9) grayscale(0) opacity(1)"
                        : "brightness(0.5) drop-shadow(0px 0px 0px #ffffff00) grayscale(0.7) opacity(0.7)"
                      : num < characterJSON["rank"]
                      ? "brightness(1.2) drop-shadow(0px 0px 300px #ffffff) grayscale(1) opacity(0)"
                      : "brightness(0.5) drop-shadow(0px 0px 300px #ffffff) grayscale(1) opacity(0)",
                  // spd = distance / time
                  // time = distance / spd
                  transitionDuration: `${Math.sqrt((t_x + size / 2 - (-250 + size / 2)) ** 2 + (t_y + size / 2 - (-350 + size / 2)) ** 2) / moveSpeed}ms`,
                }}
                key={num}>
                <Image
                  src={`https://api.hakush.in/hsr/UI/rank/_dependencies/textures/${characterJSON["id"]}/${characterJSON["id"]}_Rank_${num + 1}.webp`}
                  width={1024}
                  height={1024}
                  alt={`Rank ${num}`}
                  className={`absolute top-0 left-0 w-full h-full`}
                />
              </div>
            );
          })}
        </div>

        {/* <div className={`w-[1130px] text-center text-xl bg-[#2b2876cb] text-w1 font-extrabold mx-auto py-3 mt-3  relative z-[100]`}>TALENTS</div> */}
        <div className='h-[80px] w-1'></div>

        <PHeader text='TALENTS' />

        <div className='h-[50px] w-1'></div>

        <SkillsM
          skills={characterJSON["skills"]}
          skill_trees={characterJSON["skill_trees"]}
          rank={characterJSON["rank"]}
          rankIcons={characterJSON["rank_icons"]}
          charID={Number(characterJSON["id"])}
        />
        {/* <div className={`w-[1130px] text-center text-xl bg-b5 text-w1 font-extrabold mx-auto py-3 mt-3  relative z-[100]`}>RELICS</div> */}
        <div className='h-[30px] w-1'></div>
        <PHeader text='RELICS' />
        <div className='h-[10px] w-1'></div>
        {/* <div
        className={`px-7 py-1 bg-b6 text-b0 hover:bg-b4 hover:text-b6 font-medium text-medium rounded-lg w-fit mx-auto mt-3 flex gap-x-3  relative z-[100]`}
        onClick={() => setIsTableView(() => !isTableView)}>
        <span className='hover:cursor-pointer hover:underline select-none relative z-[100]'>{isTableView ? "Table View  (Click to change)" : "Block View (Click to change)"}</span>
      </div> */}

        <RelicView
          relic_list={characterJSON["relics"]}
          relic_set_list={characterJSON["relic_sets"]}
          char_name={characterJSON["name"]}
          element={characterJSON["element"]["id"]}
          elementColor={characterJSON["element"]["color"]}
        />
        {/* <div className='w-[1130px] text-center text-xl bg-b5 text-w1 font-extrabold mx-auto py-3 mt-3 relative z-[100]'>DAMAGE</div> */}
        <PHeader text='DAMAGE' />
      </div>
    </div>
  );
}
