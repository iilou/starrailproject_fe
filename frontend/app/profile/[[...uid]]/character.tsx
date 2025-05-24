import Image from "next/image";

import StatM from "./stat_m";

import SkillsM from "./skills_m";

// import RelicView from "./relic_view";
import RelicL from "./relic_l";
import RelicSetL from "./relicset_l";

import PHeader from "./p_header";
import BG from "../../bg";

import { get_tier_data_from_char_id, get_tier_details_from_tier } from "../../tier/tierData";
import { get_lb_types } from "../../lb/[[...lb_name]]/lib";

import { weightLib, weightParse } from "../../lib/score";

import { OpenInNew, EmojiEvents } from "@mui/icons-material";
import { Download } from "@mui/icons-material";

import { toPng } from "html-to-image";

import { use, useState } from "react";
import { useEffect } from "react";

export default function Character({
  characterJSON,
  router,
  charRef,
  scrollY = 0,
  reactive = true,
}: {
  characterJSON: any;
  router: any;
  charRef: any;
  scrollY: number;
  reactive?: boolean;
}) {
  const scoreLib = `INFO	wefe	wef	gawef	HP	ATK	DEF	SPD	CRIT Rate	CRIT DMG	Effect Hit Rate	Effect RES	Break Effect	Outgoing Healing Boost	Energy Regeneration Rate	Ice DMG Boost	Quantum DMG Boost	Imaginary DMG Boost	Fire DMG Boost	Wind DMG Boost	Lightning DMG Boost	Physical DMG Boost
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
Ruan Mei	0	0	0	0	0	0	1	0	0	0	0	1	0	1	0	0	0	0	0	0	0
Anaxa	0	0.2	0	0	0.7	0	1	1	1	0	0	0	0	0	0	0	0	0	0.7	0	0`;
  const charIndex: { [key: string]: string[] } = {};
  scoreLib.split("\n").forEach((line: string) => {
    const lineSplit: string[] = line.split("\t");
    charIndex[lineSplit[0]] = lineSplit;
  });

  const headers = `hp,atk,def,spd,${characterJSON["element"][
    "id"
  ].toLowerCase()}_dmg,crit_rate,crit_dmg,effect_hit,effect_res,break_dmg,heal_rate,sp_rate`;
  const headersDisplayName = `HP,ATK,DEF,SPD,${characterJSON["element"]["name"]} DMG Boost,CRIT Rate,CRIT DMG,Effect Hit Rate,Effect RES,Break Effect,Outgoing Healing Boost,Energy Regen Rate`;
  const isHeaderPercent = `0,0,0,0,1,1,1,1,1,1,1,1`;

  const [windowWidth, setWindowWidth] = useState(10000);
  useEffect(() => {
    if (!reactive) return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      // window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // if (windowWidth < 768) {
  //   return null;
  // }

  return (
    <div className='h-fit relative w-full' id={`char_${characterJSON["id"]}`} ref={charRef}>
      <div className='w-1 h-[60px]'></div>
      <div
        className='w-full rounded-lg flex justify-center py-5 items-center bg-b2 z-[90] relative transition-all duration-500'
        style={{
          backgroundColor: scrollY > 200 || !reactive ? "#414aa2" : "#414aa882",
          boxShadow:
            scrollY > 200 || !reactive ? `0px 0px 3px 0px #414aa2` : `0px 0px 10px 7px #414aa882`,
        }}>
        <div
          className=' w-fit h-fit -translate-y  absolute transition-all duration-500 z-[99]'
          style={{
            transform: scrollY > 200 || !reactive ? `translateX(-384px)` : `translateX(-50px)`,
            filter:
              scrollY > 200 || !reactive
                ? `drop-shadow(0px 0px 5px ${characterJSON["element"]["color"]}ee)`
                : `drop-shadow(0px 0px 30px ${characterJSON["element"]["color"]}99)`,
          }}>
          <img
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["portrait"]}`}
            width={1200}
            height={1200}
            alt='Character Portrait'
            className='transition-all duration-500'
            style={{
              width: scrollY > 200 || !reactive ? "700px" : "900px",
              height: scrollY > 200 || !reactive ? "700px" : "900px",
            }}
            rel='preload'
          />
        </div>
        <div
          className='flex flex-col items-center jusitfy-center transition-all duration-500 z-[98]'
          style={{
            transform: scrollY > 200 || !reactive ? `translateX(384px)` : `translateX(-150px)`,
            opacity: scrollY > 200 || !reactive ? 1 : 0,
            backgroundImage: `url(https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["path"]["icon"]})`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 60%",
          }}>
          <div
            className='text-2xl font-extrabold w-[790px] text-center rounded-lg text-[#e9e9e9] bg-[#3d3b8a] relative shadow-md shadow-[#000000aa] '
            // style={{ color: characterJSON["element"]["color"] }}
          >
            <div
              className='w-full h-full py-3 bg-[#020071e2] rounded-lg'
              style={{
                textShadow: `0px 0px 5px #000000`,
              }}>
              {characterJSON["name"]}
            </div>
          </div>
          <div className='mx-auto  flex justify-center gap-[5px] items-center relative translate-y-[5px]'>
            <div className='w-[62px] text-center font-extrabold text-[16px] bg-[#232323] rounded-lg h-fit py-[2px]'>
              {"E" + characterJSON["rank"]}
            </div>
            <div className='w-[92px] text-center font-extrabold text-[16px] bg-[#232323] rounded-lg h-fit py-[2px] mr-[40px]'>
              {"LV" + characterJSON["level"]}
            </div>
            <div className='flex items-center justify-center w-[36px] aspect-square rounded-lg bg-[#232323]'>
              <img
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["path"]["icon"]}`}
                width={30}
                height={30}
                alt={characterJSON["path"]["name"]}
                className='rounded-full'
              />
            </div>
            <div className='flex items-center justify-center w-[36px] aspect-square rounded-lg bg-[#232323] mr-[70px]'>
              <img
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${characterJSON["element"]["icon"]}`}
                width={30}
                height={30}
                alt={characterJSON["element"]["name"]}
                className='rounded-full'
              />
            </div>
            <div className='flex flex-col items-start justify-center mr-[70px] w-[200px] text-center'>
              <div className='text-[12px] font-bold text-[#e9e9e9] w-full text-center'>
                Last Updated:{" "}
                {"last_updated" in characterJSON ? characterJSON["last_updated"] : "Unknown"}
              </div>
            </div>
            <div className='flex gap-[3px]'>
              {/* <div className='px-4 text-[14px] font-bold bg-[#232323] rounded-lg leading-[26px]'>
                View Kit
              </div> */}
              <div
                className='flex justify-center items-center aspect-square bg-[#232323] rounded-lg w-[32px] h-[32px]'
                onClick={() => {
                  if (characterJSON["name"] in charIndex) {
                    router.push(`/i/${characterJSON["id"]}`);
                  }
                }}>
                <OpenInNew className='text-[#e9e9e9] cursor-pointer scale-[0.7]' />
              </div>
              <div
                className='flex justify-center items-center aspect-square bg-[#232323] rounded-lg w-[32px] h-[32px]'
                onClick={() => {
                  if (characterJSON["name"] in charIndex) {
                    router.push(`/lb/${characterJSON["name"]}`);
                  }
                }}>
                <EmojiEvents className='text-[#e9e9e9] cursor-pointer scale-[0.7]' />
              </div>
              <div>
                <div
                  className='flex justify-center items-center aspect-square bg-[#232323] rounded-lg w-[32px] h-[32px]'
                  onClick={() => {
                    if (charRef.current) {
                      toPng(charRef.current, {
                        cacheBust: true,
                        pixelRatio: 2,
                        skipFonts: true,
                        backgroundColor: "#000000",
                      })
                        .then((dataUrl) => {
                          const link = document.createElement("a");
                          link.download = `${characterJSON["name"]}.png`;
                          link.href = dataUrl;
                          link.click();
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  }}>
                  <Download className='text-[#e9e9e9] cursor-pointer scale-[0.7]' />
                </div>
              </div>
            </div>
          </div>
          <div className='w-[730px] flex flex-col flex-wrap gap-[3px] h-[250px] justify-end items-center'>
            <div
              className='flex flex-col flex-wrap items-start h-[119px] pb-2 w-[310px] group mt-[10px]'
              onMouseEnter={(e) => {
                console.log(e.currentTarget.querySelector("img"));
                const div = e.currentTarget.querySelector(".icon") as HTMLDivElement;
                const stars = e.currentTarget.querySelector(".stars") as HTMLImageElement;

                if (div) {
                  // div.style.filter = `drop-shadow(0px 0px 15px ${characterJSON["element"]["color"]}) brightness(1.1)`;
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
              <div className='flex items-center justify-center w-[95px] h-fit rounded-lg transition-all duration-150 icon '>
                {characterJSON["light_cone"] && (
                  <img
                    src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                      characterJSON["light_cone"] && characterJSON["light_cone"]["preview"]
                    }`}
                    width={384}
                    height={77}
                    alt='Light Cone Portrait'
                    className='z-[101]'
                  />
                )}
              </div>
              <div className='ml-[20px]'>
                <div className=' translate-x-[-20px] relative'>
                  <img
                    src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/deco/Star${
                      characterJSON["light_cone"] ? characterJSON["light_cone"]["rarity"] : 3
                    }.png`}
                    width={143}
                    height={162}
                    alt='Light Cone Rarity'
                    className='mt-1 stars transition-all'
                  />
                </div>
                <div className='font-extrabold text-[11px] text-w1 flex translate-x-[-10px] relative h-[18px]'>
                  <div className='bg-[#232323e1] px-3 mt-[2px] rounded-lg w-fit'>
                    {`S${characterJSON["light_cone"] ? characterJSON["light_cone"]["rank"] : 0}`}
                  </div>
                  <div className='bg-[#23232381] px-3 mt-[2px] ml-[2px] rounded-lg'>
                    {characterJSON["light_cone"]
                      ? `Lv${characterJSON["light_cone"]["level"]}`
                      : "N/A"}
                  </div>
                  <div
                    className='w-[16px] aspect-square ml-[2px] mt-[2px] bg-[#232323e1] rounded-lg flex justify-center items-center'
                    onClick={() => {
                      if (characterJSON["light_cone"]) {
                        router.push(`/i`);
                      }
                    }}>
                    <OpenInNew
                      className='text-[#e9e9e9] cursor-pointer scale-[0.6] w-[16px] h-[16px]'
                      fontSize={"small"}
                    />
                  </div>
                </div>
                <div className='font-medium text-[14px] leading-[20px] mt-[2px] w-[195px] text-[#eaeaead0] px-3 rounded-lg py-1 bg-[#232323] translate-x-[-25px] relative'>
                  {characterJSON["light_cone"]
                    ? characterJSON["light_cone"]["name"]
                    : "No Light Cone"}
                </div>
              </div>
            </div>

            {headers.split(",").map((header: string, idx: number) => {
              return (
                <StatM
                  name={headersDisplayName.split(",")[idx]}
                  value={
                    parseFloat(
                      characterJSON["attributes"].find(
                        (attribute: any) => attribute["field"] === header
                      ) === undefined
                        ? "0"
                        : characterJSON["attributes"].find(
                            (attribute: any) => attribute["field"] === header
                          )["value"]
                    ) +
                    parseFloat(
                      characterJSON["additions"].find(
                        (addition: any) => addition["field"] === header
                      ) !== undefined
                        ? characterJSON["additions"].find(
                            (addition: any) => addition["field"] === header
                          )["value"]
                        : "0"
                    )
                  }
                  percentage={isHeaderPercent.split(",")[idx] === "1"}
                  critical={
                    characterJSON["name"] in charIndex &&
                    charIndex["INFO"].includes(headersDisplayName.split(",")[idx]) &&
                    parseFloat(
                      charIndex[characterJSON["name"]][
                        charIndex["INFO"].indexOf(headersDisplayName.split(",")[idx])
                      ]
                    ) > 0.3
                  }
                  key={idx}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div
        className='transition-all duration-[400ms] relative z-[110]'
        style={{
          opacity: scrollY > 200 || !reactive ? 1 : 0,
          transitionTimingFunction: "ease-in-out",
        }}>
        <div className='h-[20px] w-1'></div>

        <div className='w-full grid grid-cols-[auto,auto]'>
          <div className='w-full flex justify-center'>
            <div className='w-[800px] bg-[#3a3855] font-extrabold text-[20px] rounded-lg mx-auto'>
              <div className='w-full py-2 text-center bg-[#020071c2]'>Relics</div>
            </div>
          </div>
          <div className='w-full flex justify-center'>
            <div className='w-[400px] bg-[#3a3855] text-center font-extrabold text-[20px] rounded-lg mx-auto'>
              <div className='w-full py-2 text-center bg-[#020071c2]'>Skills</div>
            </div>
          </div>
          <div className='w-fit mx-auto'>
            <div
              className={`grid gap-x-[10px] gap-y-[10px] mt-[10px] relative z-[100] grid-cols-[auto,auto,auto,auto] w-[1280px]`}>
              {/* {characterJSON["relics"].map((relic: any, idx: number) => { */}
              {[0, 1, 2, 3, 4, 5].map((idx: number) => {
                if (idx >= characterJSON["relics"].length) return <div className='w-[309px]'></div>;
                const relic = characterJSON["relics"][idx];
                return (
                  <RelicL
                    relicJSON={relic}
                    charName={characterJSON["name"]}
                    element={characterJSON["element"]["name"]}
                    elementColor={characterJSON["element"]["color"]}
                    key={idx}
                    showScores={reactive}
                  />
                );
              })}
              <div
                className={`flex flex-col justify-center items-center gap-1  relative z-[100] w-[319px] translate-x-[130px]`}>
                {characterJSON["relic_sets"].map((relic_set: any, idx: number) => {
                  return (
                    <RelicSetL
                      relicsetJSON={relic_set}
                      charName={characterJSON["name"]}
                      key={idx}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className='w-fit mx-auto'>
            <SkillsM
              skills={characterJSON["skills"]}
              skill_trees={characterJSON["skill_trees"]}
              rank={characterJSON["rank"]}
              rankIcons={characterJSON["rank_icons"]}
              charID={Number(characterJSON["id"])}
            />
          </div>
        </div>

        {/* <PHeader text='TALENTS' /> */}

        {/* <div className='h-[10px] w-1'></div> */}

        <div className='h-[20px] w-1'></div>
        {/* <PHeader text='DAMAGE' /> */}
      </div>
    </div>
  );
}
