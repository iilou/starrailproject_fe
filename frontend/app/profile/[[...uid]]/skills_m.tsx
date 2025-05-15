import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import SkillNew from "./skill_new";
import { ranks } from "../../ranks";

export default function SkillsM({
  skills,
  skill_trees,
  rank,
  rankIcons,
  charID,
}: {
  skills: any;
  skill_trees: any;
  rank: number;
  rankIcons: any;
  charID: number;
}) {
  function unsaturatedColor(hex: string) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return (
      "#" +
      (r * 0.3).toString(16).padStart(2, "0") +
      (g * 0.3).toString(16).padStart(2, "0") +
      (b * 0.3).toString(16).padStart(2, "0")
    );
  }

  const isLegacy = false;

  const [eidInfo, setEidInfo] = useState<any[]>([{}, {}, {}, {}, {}, {}]);
  const [eidJSON, setEidJSON] = useState<any>({});

  function isMaxLevel(level: number, maxLevel: number, skill: boolean, skill_id: string) {
    eidInfo.map((o: any, index: number) => {
      if ("level_up_skills" in o && rank >= index + 1) {
        o["level_up_skills"].map((o: any) => {
          level -= Number(o["id"] == skill_id) * o["num"];
        });
      }
    });

    if (skill) {
      if (maxLevel == 10) return level >= 6; // basic lv
      if (maxLevel == 15) return level >= 10; // skill,ult,talent
    } else {
      if (maxLevel == 6) return level >= 6; // basic lv
      if (maxLevel == 10) return level >= 10; // skill,ult,talent
    }

    return false;
  }

  useEffect(() => {
    if (eidJSON) {
      const newEidInfo: any[] = [];
      ["01", "02", "03", "04", "05", "06"].map((eid: any, index: number) => {
        if (eidJSON[charID + eid]) {
          newEidInfo.push(eidJSON[charID + eid]);
        }
      });
      setEidInfo(newEidInfo);
    }
  }, [charID]);

  useEffect(() => {
    const fetchEidolonData = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/index_new/en/character_ranks.json`
        );
        const data = await response.json();
        setEidJSON(data);
        console.log("eidolon data - ", data);
        const newEidInfo: any[] = [];
        ["01", "02", "03", "04", "05", "06"].map((eid: any, index: number) => {
          if (data[charID + eid]) {
            newEidInfo.push(data[charID + eid]);
          }
        });
        setEidInfo(newEidInfo);
      } catch (error) {
        console.error("Error fetching Eidolon data:", error);
      }
    };
    fetchEidolonData();
  }, []);

  return (
    <>
      {/* <div
        className={`px-7 py-1 bg-b6 text-b0 hover:bg-b4 hover:text-b6 font-medium text-medium rounded-lg w-fit mx-auto mt-5 flex gap-x-3 h-fit relative z-[100]`}
        onClick={() => setIsLegacy(() => !isLegacy)}
        >
        <span className='hover:cursor-pointer hover:underline select-none relative z-[100]'>{isLegacy ? "Legacy View  (Click to change)" : "Normal View (Click to change)"}</span>
      </div> */}
      <div className=' flex flex-wrap justify-center mt-1 gap-5 z-[100] relative w-[650px]'>
        <div
          className='relative z-[100] mx-auto mb-3'
          style={{ display: !isLegacy ? "block" : "none" }}>
          <div className='flex flex-col justify-center items-center h-fit'>
            <div className=' flex justify-center gap-[16px] flex-wrap mt-[10px]'>
              {[
                0,
                1,
                2,
                3,
                skills.findIndex((o: any) => o["icon"].includes("memosprite_skill")),
                skills.findIndex((o: any) => o["icon"].includes("memosprite_talent")),
              ]
                .filter((o: any) => o !== -1)
                .map((index: number) => {
                  const isMax = isMaxLevel(
                    skills[index]["level"],
                    skills[index]["max_level"],
                    true,
                    skills[index]["id"]
                  );
                  const isMemo = index > 3;
                  return (
                    <SkillNew
                      isMemo={isMemo}
                      isMax={isMax}
                      icon={skills[index]["icon"]}
                      elementColor={skills[0]["element"]["color"]}
                      name={skills[index]["name"]}
                      desc={skills.filter(
                        (o: any) =>
                          o["icon"] === skills[index]["icon"] && o["effect"] !== "MazeAttack"
                      )}
                      level={skills[index]["level"]}
                      type_text={skills[index]["type_text"]}
                      key={index}
                    />
                  );
                })}
            </div>
            <div className='flex justify-center gap-[16px] mt-[10px]'>
              <div className='justify-center items-center gap-[16px] w-fit px-12 py-1 flex rounded-[10px] opacity-90'>
                {[2, 4, 6].map((val, index) => {
                  return (
                    <div
                      className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-3 pt-4 pb-2 bg-[#5c59bf]'
                      key={index}>
                      <Image
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                          skill_trees[index + 4]["icon"]
                        }`}
                        width={32}
                        height={32}
                        alt={skill_trees[index + 4]["name"]}
                        style={{
                          boxShadow:
                            skill_trees[index + 4]["level"] >= skill_trees[index + 4]["max_level"]
                              ? `0 0 10px 5px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`
                              : "",
                        }}
                        className='rounded-full bg-[#232323]'
                      />
                      <div
                        className='font-bold text-center text-[14px] mt-[2px]'
                        style={{
                          // color: skill_trees[index + 4]["level"] >= skill_trees[index + 4]["max_level"] ? skills[0]["element"]["color"] : "#e2e2e2",
                          color:
                            skill_trees[index + 4]["level"] >= skill_trees[index + 4]["max_level"]
                              ? "#e9e9e9"
                              : "#898989",
                          textShadow:
                            skill_trees[index + 4]["level"] >= skill_trees[index + 4]["max_level"]
                              ? `0 0 5px #000000aa`
                              : "none",
                        }}>
                        {`A${val}`}
                      </div>
                    </div>
                  );
                })}
                {Object.values(
                  skill_trees
                    .slice(8, Math.min(skill_trees.length, 18))
                    .reduce((acc: any, obj: any) => {
                      if (!acc[obj.icon]) {
                        acc[obj.icon] = { ...obj }; // First instance
                      } else {
                        acc[obj.icon].level += obj.level; // Sum values
                        acc[obj.icon].max_level += obj.max_level; // Sum maxvalues
                      }
                      return acc;
                    }, {})
                ).map((obj: any) => {
                  // console.log("obj - ", obj);
                  return (
                    <div className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] px-3 pt-4 pb-2 bg-[#5c59bf] rounded-md'>
                      <Image
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${obj.icon}`}
                        width={32}
                        height={32}
                        alt={obj.icon}
                        style={
                          obj.level >= obj.max_level
                            ? {
                                boxShadow: `0 0 2px 1px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`,
                              }
                            : {}
                        }
                        className='rounded-full bg-[#232323]'
                      />
                      <div
                        className='font-bold text-center text-[14px] mt-[2px]'
                        style={{
                          color: obj.level >= obj.max_level ? "#e9e9e9" : "#898989",
                          textShadow: obj.level >= obj.max_level ? `0 0 5px #000000aa` : "none",
                        }}>
                        {`${obj.level}/${obj.max_level}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='flex justify-center gap-[16px] flex-wrap mt-[10px]'>
              {rankIcons.map((icon: any, index: number) => {
                return (
                  <SkillNew
                    isMemo={false}
                    isMax={index < rank}
                    icon={icon}
                    elementColor={skills[0]["element"]["color"]}
                    name={`E${index + 1}`}
                    desc={[
                      {
                        name: eidInfo[index] ? eidInfo[index]["name"] : "",
                        desc: eidInfo[index]
                          ? eidInfo[index]["desc"]
                          : "Eidolon description loading or not available...",
                      },
                    ]}
                    level={"" + (rank >= index + 1 ? 1 : 0) + " / 1"}
                    type_text={`E${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div
          className='w-fit bg-[#333262] hover:bg-[#3f3e77] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] transition-all rounded-lg py-3 px-8 items-center mt-3 mb-3'
          style={{ display: !isLegacy ? "none" : "flex" }}>
          <div className='flex flex-wrap gap-x-2 gap-y-2 justify-center items-center h-fit w-[340px] hover:bg-[#585799] active:bg-[#6867a7] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-lg py-3 px-4'>
            <div className='font-extrabold text-2xl text-w1 text-center hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2'>
              <span className='select-none hover:cursor-text'>SKILLS</span>
            </div>
            {skills.slice(0, 4).map((skill: any, idx: number) => {
              const isMax = isMaxLevel(skill["level"], skill["max_level"], true, skill["id"]);
              // // main skills
              // console.log("curr char skills - ", skills);
              return (
                <div className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2 pt-3 pb-1 '>
                  <Image
                    src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${skill["icon"]}`}
                    width={50}
                    height={50}
                    alt={skill["name"]}
                    style={{
                      boxShadow: isMax
                        ? `0 0 10px 5px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`
                        : "",
                    }}
                    className='rounded-full'
                  />
                  <div
                    className='font-bold text-center'
                    style={{ color: isMax ? skills[0]["element"]["color"] : "#898989" }}>
                    {skill["level"]}
                  </div>
                </div>
                // <SkillNew skill={skill} elementColor={skills[0]["element"]["color"]} isMaxLevel={isMaxLevel} key={idx} />
              );
            })}
          </div>
          <div className='ml-8 w-[1400px]'>
            <div className='w-[415px] flex flex-wrap gap-x-3 justify-center items-center mx-auto hover:bg-[#585799] active:bg-[#6867a7] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-lg py-3 px-4'>
              <div className='font-extrabold text-base text-w1 text-center w-full hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2'>
                {" "}
                <span className='select-none hover:cursor-text'>EIDOLONS</span>
              </div>
              {rankIcons.map((icon: any, index: number) => {
                return (
                  <div className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2 pt-3 pb-1 '>
                    <Image
                      src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${icon}`}
                      width={36}
                      height={36}
                      alt={`Rank ${index + 1}`}
                      style={{
                        boxShadow:
                          index < rank
                            ? `0 0 10px 5px ${skills[0]["element"]["color"]} inset, 0 0 5px 1px ${skills[0]["element"]["color"]}`
                            : "",
                      }}
                      className='rounded-full'
                    />
                    <div
                      className='font-bold text-center'
                      style={{
                        color: index < rank ? skills[0]["element"]["color"] : "#898989",
                      }}>
                      {`E${index + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='mt-1 flex justify-between w-[410px] mx-auto'>
              <div className='flex flex-wrap gap-x-2 justify-center items-center w-fit hover:bg-[#585799] active:bg-[#6867a7] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-lg pt-3 pb-1 px-2'>
                <div className='font-bold text-sm text-w1 text-center w-full hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2 '>
                  <span className='select-none hover:cursor-text'>MAJOR TRACE</span>
                </div>
                {[2, 4, 6].map((val, index) => {
                  return (
                    <div className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2 pt-3 pb-1 '>
                      <Image
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                          skill_trees[index + 4]["icon"]
                        }`}
                        width={26}
                        height={26}
                        alt={skill_trees[index + 4]["name"]}
                        style={
                          skill_trees[index + 4]["level"] >= skill_trees[index + 4]["max_level"]
                            ? {
                                boxShadow: `0 0 5px 2px ${skills[0]["element"]["color"]} inset, 0 0 2px 1px ${skills[0]["element"]["color"]}`,
                              }
                            : {}
                        }
                        className='rounded-full'
                      />
                      <div
                        className='font-bold text-center'
                        style={{
                          color: skills[0]["element"]["color"],
                        }}>
                        {`A${val}`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='flex flex-wrap gap-x-2 justify-center items-center hover:bg-[#585799] active:bg-[#6867a7] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-lg pt-3 pb-1 px-2'>
                <div className='font-bold text-sm text-w1 text-center w-full hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2'>
                  <span className='select-none hover:cursor-text'>MINOR TRACE</span>
                </div>
                {Object.values(
                  skill_trees
                    .slice(8, Math.min(skill_trees.length, 19))
                    .reduce((acc: any, obj: any) => {
                      if (!acc[obj.icon]) {
                        acc[obj.icon] = { ...obj }; // First instance
                      } else {
                        acc[obj.icon].level += obj.level; // Sum values
                        acc[obj.icon].max_level += obj.max_level; // Sum maxvalues
                      }
                      return acc;
                    }, {})
                ).map((obj: any) => (
                  <div className='w-fit h-fit block hover:bg-[#4e4d88] active:bg-[#252547] active:shadow-[0px_0px_0px_1px_inset_#e7e7e7] rounded-md px-2 pt-3 pb-1 '>
                    <Image
                      src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${obj.icon}`}
                      width={26}
                      height={26}
                      alt={obj.icon}
                      style={
                        obj.level >= obj.max_level
                          ? {
                              boxShadow: `0 0 5px 2px ${skills[0]["element"]["color"]} inset, 0 0 2px 1px ${skills[0]["element"]["color"]}`,
                            }
                          : {}
                      }
                      className='rounded-full'
                    />
                    <div
                      className='font-bold text-center'
                      style={
                        obj.level >= obj.max_level
                          ? {
                              color: skills[0]["element"]["color"],
                            }
                          : {
                              color: "#898989",
                            }
                      }>
                      {`x${obj.level}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
