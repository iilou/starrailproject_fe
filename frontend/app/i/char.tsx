import Image from "next/image";
import { useState, useEffect } from "react";

import SkillNew from "./skill_new";
import SubHeader from "./subheader";
import StyledText from "./styledtext";
import { Icon } from "@mui/material";

import { elementConvert, elementColor } from "./lib";

export default function Char({
  id,
  json,
  name,
  element,
  charElementColor,
  path,
  rarity,
  version,
  stats,
  avatarData,
  searchQuery,
  router,
}: {
  id: string;
  json: any;
  name: string;
  element: string;
  charElementColor: string;
  path: string;
  rarity: number;
  version: number;
  stats: any;
  avatarData: any;
  searchQuery: string;
  router: any;
}) {
  const [processedData, setProcessedData] = useState<any>(null);

  const getMostRecentVersion = (json: any) => {};

  const processDesc = (desc: string, maxLevel: number, params: any) => {
    // console.log(desc, maxLevel, params);
    // const descsplitparams_percent = desc.split("[p]");

    // for (let i = 0; i < descsplitparams_percent.length; i++) {
    //   const num = parseInt(descsplitparams_percent[i].split("#")[descsplitparams_percent[i].split("#").length - 1]);
    //   if (num) {
    //     descsplitparams_percent[i] = descsplitparams_percent[i].replace("#" + num, params[maxLevel - 1][num - 1] * 100 + "%");
    //   }
    // }
    // desc = descsplitparams_percent.join("");

    // const descsplitparams_float = desc.split("[f]");
    // for (let i = 0; i < descsplitparams_float.length; i++) {
    //   const num = parseInt(descsplitparams_float[i].split("#")[descsplitparams_float[i].split("#").length - 1]);
    //   if (num) {
    //     descsplitparams_float[i] = descsplitparams_float[i].replace("#" + num, params[maxLevel - 1][num - 1] + "");
    //   }
    // }
    // desc = descsplitparams_float.join("");

    return desc;
  };

  const getE0MaxLevel = (maxLevel: number) => {
    if (maxLevel === 1) return 1;

    if (maxLevel >= 6 && maxLevel <= 10) return 6;
    if (maxLevel > 10 && maxLevel) return 10;
    return 0;
  };

  const checkGlobalPassive = (id: string, skill: any) => {
    if (id.startsWith("2") && skill["Desc"].startsWith("After obtaining")) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const newProcessData: any = {
      skill: {},
    };

    if (json._avatarskill_) {
      for (const key in json._avatarskill_) {
        const id = key;
        const versions = Object.keys(json._avatarskill_[key]);
        const last_version = versions[versions.length - 1];
        const skill = json._avatarskill_[key][last_version];
        var skill_type = skill.Type;

        // Global Passive Check
        if (checkGlobalPassive(id, skill)) skill_type = "Global Passive";

        if (skill_type === "") continue;

        console.log(skill_type);
        if (!(skill_type in newProcessData.skill)) {
          newProcessData.skill[skill_type] = {
            MaxLevel: skill.MaxLevel,
            TrueMaxLevel: getE0MaxLevel(skill.MaxLevel),
            Desc: [processDesc(skill.Desc, skill.MaxLevel, skill.Params)],
            Params: [skill.Params],
            Icon: skill.Icon,
            Tag: skill.Tag,
            Name: [skill.Name],
            SPAdd: skill.SPAdd,
            Stance: skill.Stance,
            ID: [id],
          };
        } else {
          newProcessData.skill[skill_type].Desc.push(processDesc(skill.Desc, skill.MaxLevel, skill.Params));
          newProcessData.skill[skill_type].Name.push(skill.Name);
          newProcessData.skill[skill_type].Params.push(skill.Params);
          newProcessData.skill[skill_type].ID.push(id);

          if (newProcessData.skill[skill_type].TrueMaxLevel === "0") {
            console.log("werid", newProcessData.skill);
          }
        }

        console.log(skill);
      }
    }

    if (json._avatarskilltree_) {
      const tree = json._avatarskilltree_[id];
      newProcessData.asc = {};
      if (tree) {
        const versions = Object.keys(tree);
        const last_version = versions[versions.length - 1];
        const real_tree = tree[last_version];
        ["Tree1", "Tree2", "Tree3"].forEach((treeKey, index) => {
          const skill = real_tree[treeKey];
          newProcessData.asc[treeKey] = {
            Desc: skill.Desc,
            Icon: skill.Icon,
            Name: skill.Name,
            Type: "Ascension " + (index * 2 + 2),
          };
        });
        newProcessData.stat_inc = real_tree["Add"];
      }
    }

    if (json._avatarrank_) {
      newProcessData["rank"] = {};
      for (const key in json._avatarrank_) {
        const id = key;
        const versions = Object.keys(json._avatarrank_[key]);
        const last_version = versions[versions.length - 1];
        const eidolon = json._avatarrank_[key][last_version];
        const rank = eidolon.Rank;

        newProcessData["rank"][rank] = {
          Desc: eidolon.Desc,
          Icon: eidolon.Icon,
          Name: eidolon.Name,
          Type: "Eidolon " + rank,
          Rank: rank,
          id: id,
        };
      }
    }

    setProcessedData(newProcessData);
    console.log(newProcessData);
  }, [json]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "-" || e.key === "_" || e.key === "q") {
        setIsMax(false);
      }
      if (e.key === "+" || e.key === "=" || e.key === "e") {
        setIsMax(true);
      }
      console.log(e.key);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsMax((prev) => !prev);
      }
    };
    window.addEventListener("dblclick", handleMouseDown);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dblclick", handleMouseDown);
    };
  }, []);

  const w1 = "100%";
  const w2 = "100%";
  const w3 = "100%";

  const [isMax, setIsMax] = useState(true);

  return (
    <div className='flex static h-fit pl-[520px] m1_2:pl-0 m1_2:flex-wrap' style={{ width: "100%", maxWidth: "1800px" }}>
      {/* <div>{JSON.stringify(json._avatarskill_)}</div>
      <div>{JSON.stringify(json._avatarskilltree_)}</div>
      <div>{JSON.stringify(json._avatarrank_)}</div> */}

      {/* 0% 3D3B8A00 14% 3D3B8Aff 86% 3D3B8Aff 100% 3D3B8A00 */}
      <div
        className='flex justify-end flex-col items-center h-full fixed top-0 bottom-0 z-[5] -translate-x-[420px] m1_2:relative m1_2:translate-x-0 w-[380px] m1_2:w-full m1_2:h-[400px] m1_2:mt-0 m1_2:pl-[450px] m1_2:pr-[50px] m1_2:justify-start'
        style={{ backgroundImage: "linear-gradient(to bottom, #3D3B8A00 0%, #3D3B8Aff 14%, #3D3B8Aff 86%, #3D3B8A00 100%)" }}>
        {/* https://homdgcat.wiki/images/avatardrawcard/1406.png */}

        <div className='absolute w-[680px] h-[680px] mt-[250px] m1_2:mt-[50px] m1_2:ml-[100px]' style={{ top: "-150px", left: "-150px", zIndex: 0 }}>
          <Image src={`https://homdgcat.wiki/images/avatardrawcard/${id}.png`} width={1360} height={1360} alt={id} className='  w-[680px] h-[680px] ' />
        </div>
        <div className='mt-[80px] w-[95%] py-2 text-[#FAFF00] text-[20px] font-extrabold text-center relative bg-[#020071d2] h-fit'>{name}</div>
        <div className='relative h-fit w-full flex flex-col items-center justify-center gap-[15px] mt-[8px]'>
          <div className='flex justify-between items-center w-full px-[10%] font-bold text-r2 text-[14px]'>
            <div
              className='w-fit px-7 py-[2px] bg-[#e7e7e7] rounded-full hover:cursor-pointer hover:bg-[#d3d3d3] select-none active:shadow-[0_0_3px_2px_#c7c7c7]'
              onClick={() => {
                setIsMax(false);
              }}>
              Min (- or Tab)
            </div>
            <div
              className='w-fit px-7 py-[2px] bg-[#e7e7e7] rounded-full hover:cursor-pointer hover:bg-[#d3d3d3] select-none active:shadow-[0_0_3px_2px_#c7c7c7]'
              onClick={() => {
                setIsMax(true);
              }}>
              Max (+ or Tab)
            </div>
          </div>
          <div className='flex flex-col gap-[3px] items-center justify-center w-full h-fit mb-[20%]'>
            {stats &&
              Object.keys(stats).map((key: string, idx: number) => {
                const stat = stats[key];
                return (
                  <div key={idx} className='flex justify-between items-center w-[270px] rounded-full text-[#c7c7c7] text-[12px] font-bold  px-7 py-[4px] bg-[#131313c2]'>
                    <div className='w-fit'>{key}</div>
                    <div className='w-fit'>{stat}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className='fixed right-3 top-[10%] w-[80px] h-[80%] hover:w-[80px] flex flex-col justify-center bg-[#3d3b8a] shadow-xl shadow-black z-[500] rounded-lg'>
        <div className='w-full h-[90%] overflow-y-scroll overflow-x-hidden py-[5%]'>
          <div className='w-full flex flex-col items-center gap-y-2'>
            {avatarData &&
              avatarData
                .filter((item: any) => {
                  return item["DisplayName"]
                    .toLowerCase()
                    .replace(/[^a-z]/g, "")
                    .includes(searchQuery.toLowerCase());
                })
                .map((item: any, idx: number) => {
                  return (
                    <div key={idx} className='w-[70px] h-[70px] group'>
                      <div className='-translate-x-[0px] w-[70px] h-[30px] bg-[#3d3b8a] rounded-lg flex text-center justify-center items-center text-[14px] shadow-md shadow-black font-bold text-[#ffffff] opacity-0 group-hover:opacity-100 transition-all duration-200'>
                        {item["DisplayName"].length > 7 ? item["DisplayName"].slice(0, 7) + "..." : item["DisplayName"]}
                      </div>
                      <Image
                        src={`https://homdgcat.wiki/images/avatarshopicon/avatar/${item["_id"]}.png`}
                        width={100}
                        height={100}
                        alt={item["Name"]}
                        onClick={() => {
                          router.push("/i?char=" + item._id);
                        }}
                        className='rounded-full bg-[#232323] w-[70px] h-[70px] object-cover  border-[#232323] hover:cursor-pointer transition-all duration-100'
                        style={{
                          // boxShadow: `0 0 3px 1px ${elementColor[elementConvert[item["Element"]]]} inset, 0 0 2px 1px ${elementColor[elementConvert[item["Element"]]]}`,
                          // boxShadow: `0 0 10px 5px #000000 inset, 0 0 5px 1px #000000`,
                          boxShadow:
                            "" + item._id === "" + id
                              ? `0 0 10px 5px ${elementColor[elementConvert[item["Element"]]]} inset, 0 0 5px 1px ${elementColor[elementConvert[item["Element"]]]}`
                              : `0 0 10px 5px #000000 inset, 0 0 5px 1px #000000`,
                          transform: "" + item._id === "" + id ? "scale(1.2)" : "scale(1)",
                          transition: "transform 0.2s ease-in-out",
                          filter: "" + item._id === "" + id ? `drop-shadow(0 0 10px ${elementColor[elementConvert[item["Element"]]]}) brightness(1.2)` : "none",
                        }}
                      />
                    </div>
                  );
                })}
          </div>
        </div>

        {/* <div className='fixed top-[calc(50% - 15px)] right-0 w-[30px] h-[30px] bg-[#077bff] rounded-full'></div> */}
      </div>

      {/* <div className='w-[520px] relative h-1 text-[#00000000]'>asfewf</div> */}

      <div className='mt-[30px] flex flex-wrap gap-[30px] justify-center w-full h-full relative z-[10]'>
        <div className='flex flex-col gap-[20px] h-fit w-[450px] m1_1:w-[500px] m1_2:w-full m1_2:basis-full'>
          <SubHeader text='Skills' width={w1} />
          {processedData &&
            Object.keys(processedData.skill).map((key) => {
              const desc = [];
              for (let i = 0; i < processedData.skill[key].Desc.length; i++) {
                desc.push({
                  name: processedData.skill[key].Name[i],
                  desc: processedData.skill[key].Desc[i],
                });
              }
              const isMemo = key.includes("Memo");
              const maxLevel = processedData.skill[key].TrueMaxLevel;
              if (maxLevel === 0) console.log("weird", processedData.skill[key]);
              return (
                <SkillNew
                  key={key}
                  isMemo={isMemo}
                  isMax={isMax}
                  icon={id + "/" + processedData.skill[key].Icon + ".png"}
                  elementColor={charElementColor}
                  name={key}
                  desc={desc}
                  level={isMax ? processedData.skill[key].TrueMaxLevel : "1"}
                  params={processedData.skill[key].Params}
                  type_text={key}
                  width={w1}
                />
              );
            })}
        </div>
        <div className='flex flex-col gap-[20px] h-fit w-[300px] m1_1:w-[250px] m1_2:w-full m1_2:basis-full'>
          <SubHeader text='Ascension Traces' width={w2} />
          {processedData &&
            processedData.asc &&
            Object.keys(processedData.asc).map((key) => {
              return (
                <SkillNew
                  key={key}
                  isMemo={false}
                  isMax={isMax}
                  icon={id + "/" + processedData.asc[key].Icon + ".png"}
                  elementColor={charElementColor}
                  name={processedData.asc[key].Type}
                  desc={[{ name: processedData.asc[key].Name, desc: processedData.asc[key].Desc }]}
                  level={processedData.asc[key].Type.replace("Ascension ", "A")}
                  type_text={processedData.asc[key].Type}
                  width={w2}
                />
              );
            })}
        </div>
        <div className='flex flex-col gap-[20px] h-fit w-[350px] m1_1:w-[640px] m1_2:w-full'>
          <SubHeader text='Eidolons' width={w3} />
          {processedData &&
            processedData.rank &&
            Object.keys(processedData.rank).map((key) => {
              return (
                <SkillNew
                  key={key}
                  isMemo={false}
                  isMax={isMax}
                  icon={id + "/" + processedData.rank[key].Icon + ".png"}
                  elementColor={charElementColor}
                  name={processedData.rank[key].Type}
                  desc={[{ name: processedData.rank[key].Name, desc: processedData.rank[key].Desc }]}
                  level={processedData.rank[key].Type.replace("Eidolon ", "E")}
                  type_text={processedData.rank[key].Type}
                  width={w3}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
