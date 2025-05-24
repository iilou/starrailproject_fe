import Image from "next/image";
import { useState, useEffect } from "react";

import SkillNew from "./skill_new";
import SubHeader from "./subheader";
import StyledText from "./styledtext";

import { Icon } from "@mui/material";
import { OpenInNew, EmojiEvents } from "@mui/icons-material";
import { ViewHeadline } from "@mui/icons-material";

import { get_tier_data_from_char_id, get_tier_details_from_tier } from "../../tier/tierData";
import { get_lb_types } from "../../lb/[[...lb_name]]/lib";

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
}: // setCharId,
{
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
  // setCharId: any;
}) {
  const [processedData, setProcessedData] = useState<any>(null);

  const [tierData, setTierData] = useState<any>(null);
  const [tierDetails, setTierDetails] = useState<any>(null);
  const [lb_data, setLbData] = useState<any>(null);

  useEffect(() => {
    const tierData = get_tier_data_from_char_id(parseInt(id));
    setTierData(tierData);
    const tierDetails = get_tier_details_from_tier(tierData["tier"]);
    setTierDetails(tierDetails);
    const lb_data = get_lb_types(parseInt(id));
    setLbData(lb_data);
  }, [id]);

  const getMostRecentVersion = (json: any) => {};

  const processDesc = (desc: string, maxLevel: number, params: any) => {
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
            SPAdd: ["SPAdd" in skill ? parseInt(skill.SPAdd) : 0],
            SPNeed: ["SPNeed" in skill ? parseInt(skill.SPNeed) : 0],
            Stance: skill.Stance,
            ID: [id],
          };
        } else {
          newProcessData.skill[skill_type].Desc.push(
            processDesc(skill.Desc, skill.MaxLevel, skill.Params)
          );
          newProcessData.skill[skill_type].Name.push(skill.Name);
          newProcessData.skill[skill_type].Params.push(skill.Params);
          newProcessData.skill[skill_type].ID.push(id);
          newProcessData.skill[skill_type].SPAdd.push("SPAdd" in skill ? parseInt(skill.SPAdd) : 0);
          newProcessData.skill[skill_type].SPNeed.push(
            "SPNeed" in skill ? parseInt(skill.SPNeed) : 0
          );

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
    const handleKeyDown = (e: KeyboardEvent | null) => {
      if (e == null) {
        console.log("e is null");
        return;
      }
      if (e.key === "-" || e.key === "_" || e.key === "q") {
        setIsMax(false);
      }
      if (e.key === "+" || e.key === "=" || e.key === "e") {
        setIsMax(true);
      }
      console.log(e.key);
    };

    const handleMouseDown = (e: MouseEvent | null) => {
      if (e == null) {
        console.log("e is null");
        return;
      }
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

  const [sidebarActive, setSidebarActive] = useState(false);

  const filteredID = (id: string) => {
    if (id[0] === "2") {
      return "1" + id.substring(1);
    }
    return id;
  };

  const filteredSkillImageLink = (id: string, skill: string) => {
    if (id[0] === "2") {
      return "1" + id.substring(1) + "/" + skill + ".png";
    } else {
      return id + "/" + skill + ".png";
    }
  };

  return (
    <div
      className='flex static h-fit pl-[520px] m1_4:pl-0 m1_4:flex-wrap m1_4:mt-[17vh]'
      style={{ width: "100%", maxWidth: "1800px" }}>
      <div
        className='flex justify-end flex-col items-center h-full fixed top-0 bottom-0 z-[5] -translate-x-[420px]  w-[380px]
        m1_4:translate-x-0 m1_4:w-full m1_4:h-fit m1_4:justify-start m1_4:py-[2vw] m1_4:relative m1_4:bg-[#3d3b8a] '
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #3D3B8A00 0%, #3D3B8Aff 12%, #3D3B8Aff 88%, #3D3B8A00 100%)",
        }}>
        <div
          className='absolute w-[680px] h-[680px] mt-[250px]  top-[-150px] left-[-150px] z-0 
          m1_4:mt-[0px] m1_4:ml-[0px] m1_4:relative m1_4:top-[-20vw] m1_4:left-0 m1_4:w-[70vw] m1_4:h-[30vw] 
          '>
          <img
            src={`https://homdgcat.wiki/images/avatardrawcard/${filteredID(id)}.png`}
            width={1360}
            height={1360}
            alt={id}
            className='w-full'
          />
        </div>
        <div
          className='
          mt-[80px] w-[90%] py-2  text-[#ffffff] text-[20px] font-extrabold text-center relative bg-[#020071f2] h-fit 
          m1_4:mt-[0px] m1_4:w-[100vw] m1_4:py-[0.8vw] m1_4:text-[3vw]
        '>
          {name}
        </div>
        <div className='w-[90%] h-fit text-[12px] font-bold px-[5%] flex relative z-[1000] text-center justify-center gap-[15px] mt-[6px] text-[#b1b1b1]'>
          <div className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-5 py-[2px] text-center font-extrabold text-[15px]'>
            Tier:
          </div>
          {tierDetails &&
            [tierDetails["name"], tierDetails["name_alt"]].map((name: string, idx: number) => {
              console.log(tierDetails["color"]);
              return (
                <div
                  key={idx}
                  className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-5 py-[2px] text-center font-extrabold text-[15px]'
                  style={{
                    color: tierDetails["color"],
                    textShadow: `0 0 20px ${tierDetails["color"]}`,
                    boxShadow: `0 0 5px ${tierDetails["color"]}`,
                  }}>
                  {name}
                </div>
              );
            })}
          <div className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-[7px] py-[2px] text-center font-extrabold text-[15px] hover:cursor-pointer hover:shadow-[0_0_2px_1px_#c1c1c1] transition-all duration-200'>
            <OpenInNew
              className='text-[#c8c8c8]'
              style={{
                fontSize: "15px",
                lineHeight: "15px",
                textShadow: "0 0 25px #000,0 0 25px #000",
                translate: "0px -1px",
              }}
              onClick={() => {
                router.push("/tier");
              }}
            />
          </div>
        </div>
        <div className='w-[90%] h-fit text-[12px] font-bold px-[5%] flex relative z-[1000] text-center justify-center gap-[15px] mt-[6px]  text-[#b1b1b1]'>
          <div className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-5 py-[2px] text-center font-extrabold text-[13px]'>
            Leaderboards:
          </div>
          <div className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-5 py-[2px] text-center font-extrabold text-[13px] hover:cursor-pointer hover:shadow-[0_0_2px_1px_#c1c1c1] transition-all duration-200'>
            {lb_data ? lb_data.length : 0}
          </div>
          <div className='w-fit h-fit bg-[#1a1a1a] rounded-[4px] px-[7px] py-[2px] text-center font-extrabold text-[13px] hover:cursor-pointer hover:shadow-[0_0_2px_1px_#c1c1c1] transition-all duration-200'>
            <EmojiEvents
              className='text-[#c8c8c8]'
              style={{
                fontSize: "15px",
                lineHeight: "15px",
                textShadow: "0 0 25px #000,0 0 25px #000",
                translate: "0px -1px",
              }}
              onClick={() => {
                if (lb_data.length > 0) {
                  router.push("/lb/" + name);
                } else {
                  router.push("/lb");
                }
              }}
            />
          </div>
        </div>
        <div className='relative h-fit w-full flex flex-col items-center justify-center gap-[15px] mt-[8px]'>
          <div className='flex flex-col gap-[3px] items-center justify-center w-full h-fit mb-[20%] m1_4:mb-[0px]'>
            {stats &&
              Object.keys(stats).map((key: string, idx: number) => {
                const stat = stats[key];
                return (
                  <div
                    key={idx}
                    className='flex justify-between items-center w-[270px] rounded-full text-[#c7c7c7] text-[12px] font-bold  px-7 py-[4px] bg-[#131313c2]'>
                    {/* <div className='w-fit'>{key === "" ? "Relic" : key}</div> */}
                    <div className='w-fit'>{key}</div>
                    <div className='w-fit'>{stat}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div
        className='fixed top-[40%] right-[90px] w-[40px] h-[20%] bg-[#3d3b8a78] z-[500] rounded-l-lg shadow-xl shadow-black cursor-pointer 
              active:shadow-[0_0_3px_2px_#000000] active:translate-x-[5px] '
        style={{
          right: sidebarActive ? "80px" : "0px",
          transition: "right 0.2s ease-in-out",
        }}
        onClick={() => {
          setSidebarActive((prev) => !prev);
        }}>
        <div className='w-full h-full flex justify-center items-center'>
          <ViewHeadline
            className='text-[#c8c8c8]'
            style={{
              fontSize: "30px",
              lineHeight: "20px",
              textShadow: "0 0 25px #000,0 0 25px #000",
              translate: "0px -1px",
            }}
          />
        </div>
      </div>
      <div
        className='fixed right-3 top-[10%] w-[80px] h-[80%] hover:w-[80px] flex flex-col justify-center bg-[#3d3b8a] shadow-xl shadow-black z-[500] rounded-lg'
        style={{
          right: sidebarActive ? "0px" : "-80px",
          transition: "right 0.2s ease-in-out",
        }}>
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
                        {item["DisplayName"].length > 7
                          ? item["DisplayName"].slice(0, 7) + "..."
                          : item["DisplayName"]}
                      </div>
                      <img
                        src={`https://homdgcat.wiki/images/avatarshopicon/avatar/${filteredID(
                          "" + item["_id"]
                        )}.png`}
                        width={100}
                        height={100}
                        alt={item["Name"]}
                        onClick={() => {
                          router.push("/i/" + item._id);
                        }}
                        className='rounded-full bg-[#232323] w-[70px] h-[70px] object-cover  border-[#232323] hover:cursor-pointer transition-all duration-100'
                        style={{
                          boxShadow:
                            "" + item._id === "" + id
                              ? `0 0 10px 5px ${
                                  elementColor[elementConvert[item["Element"]]]
                                } inset, 0 0 5px 1px ${
                                  elementColor[elementConvert[item["Element"]]]
                                }`
                              : `0 0 10px 5px #000000 inset, 0 0 5px 1px #000000`,
                          transform: "" + item._id === "" + id ? "scale(1.2)" : "scale(1)",
                          transition: "transform 0.2s ease-in-out",
                          filter:
                            "" + item._id === "" + id
                              ? `drop-shadow(0 0 10px ${
                                  elementColor[elementConvert[item["Element"]]]
                                }) brightness(1.2)`
                              : "none",
                        }}
                      />
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className='mt-[30px] flex flex-wrap gap-[10px] justify-center w-full h-full relative z-[10] m1_1:px-[3%]'>
        <div className='flex flex-col gap-[3px] h-fit w-[450px] m1_1:w-[500px] m1_2:w-full m1_2:basis-full'>
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
                  // icon={id + "/" + processedData.skill[key].Icon + ".png"}
                  icon={filteredSkillImageLink(id, processedData.skill[key].Icon)}
                  elementColor={charElementColor}
                  name={key}
                  desc={desc}
                  level={isMax ? processedData.skill[key].TrueMaxLevel : "1"}
                  params={processedData.skill[key].Params}
                  type_text={key}
                  width={w1}
                  SPAdd={
                    "SPAdd" in processedData.skill[key] ? processedData.skill[key].SPAdd : null
                  }
                  SPNeed={
                    "SPNeed" in processedData.skill[key] ? processedData.skill[key].SPNeed : null
                  }
                />
              );
            })}
        </div>
        <div className='flex flex-col gap-[3px] h-fit w-[300px] m1_1:w-[250px] m1_2:w-full m1_2:basis-full'>
          <SubHeader text='Ascension Traces' width={w2} />
          {processedData &&
            processedData.asc &&
            Object.keys(processedData.asc).map((key) => {
              return (
                <SkillNew
                  key={key}
                  isMemo={false}
                  isMax={isMax}
                  // icon={id + "/" + processedData.asc[key].Icon + ".png"}
                  icon={filteredSkillImageLink(id, processedData.asc[key].Icon)}
                  elementColor={charElementColor}
                  name={processedData.asc[key].Type}
                  desc={[{ name: processedData.asc[key].Name, desc: processedData.asc[key].Desc }]}
                  level={processedData.asc[key].Type.replace("Ascension ", "A")}
                  type_text={processedData.asc[key].Type}
                  width={w2}
                  SPNeed={null}
                  SPAdd={null}
                />
              );
            })}
        </div>
        <div className='flex flex-col gap-[3px] h-fit w-[350px] m1_1:w-[640px] m1_2:w-full'>
          <SubHeader text='Eidolons' width={w3} />
          {processedData &&
            processedData.rank &&
            Object.keys(processedData.rank).map((key) => {
              return (
                <SkillNew
                  key={key}
                  isMemo={false}
                  isMax={isMax}
                  // icon={id + "/" + processedData.rank[key].Icon + ".png"}
                  icon={filteredSkillImageLink(id, processedData.rank[key].Icon)}
                  elementColor={charElementColor}
                  name={processedData.rank[key].Type}
                  desc={[
                    { name: processedData.rank[key].Name, desc: processedData.rank[key].Desc },
                  ]}
                  level={processedData.rank[key].Type.replace("Eidolon ", "E")}
                  type_text={processedData.rank[key].Type}
                  width={w3}
                  SPNeed={null}
                  SPAdd={null}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
