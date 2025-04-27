"use client";

import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";

import Header from "../header";
import BG from "../bg";
import LocalProfileView from "../local_profile_view";

import { useState, useEffect } from "react";

import AvatarDisplay from "./avatar_display";
import WeaponDisplay from "./weapon_display";
import RelicDisplay from "./relic_display";
import FilterOption from "./filter_option";

import Char from "./char";

import * as LF from "./libfilters";

export default function Index() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<any>(null);

  const [avatarData, setAvatarData] = useState<any>(null);
  const [weaponData, setWeaponData] = useState<any>(null);
  const [relicData, setRelicData] = useState<any>(null);
  const [specificCharacterData, setSpecificCharacterData] = useState<any>(null);

  const router = useRouter();

  type Filter = {
    name: string;
    value: string;
  };

  const [avatarFilters, setAvatarFilters] = useState<string[]>(["Path///Destruction"]);

  const [weaponPassiveHidden, setWeaponPassiveHidden] = useState<boolean>(false);

  const [currentSort, setCurrentSort] = useState<string>("");

  // const [view, setView] = useState(searchParams.get("char") || "Characters");
  const [view, setView] = useState<string>("Characters");
  const [views, setViews] = useState<string[]>(["Characters", "Weapons", "Relics"]);

  const [highestMajorVersion, setHighestMajorVersion] = useState<number>(0);

  const updateAvatarData = (data: any) => {
    var highestMajorVersion: number = 0;

    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i]["_id"]) > 9999) {
        // delete
        data.splice(i, 1);
        i--;
        continue;
      }

      data[i]["DisplayName"] = data[i]["Name"];

      if (parseInt(data[i]["_id"]) > 8000) {
        data[i]["DisplayName"] = data[i]["Name"] + (parseInt(data[i]["_id"]) % 2 == 0 ? " F" : " M");
      }

      data[i]["DisplayOrder"] = i;
      data[i]["MajorVersion"] = data[i]["Ver"].split(".")[0] + ".0";
      data[i]["MinorVersion"] = data[i]["Ver"].split(".")[1].split("v")[0];
      // data[i]["isPreview"] = data[i]["Ver"].find("v") !== -1 ? true : false;

      highestMajorVersion = Math.max(highestMajorVersion, parseInt(data[i]["MajorVersion"].split(".")[0]));
    }

    setHighestMajorVersion(highestMajorVersion);
    setAvatarData(data);
  };

  const updateWeaponData = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      data[i]["DisplayName"] = data[i]["Name"];
      if (data[i]["DisplayName"] === "") {
        data[i]["DisplayName"] = "Name Not Found";
      }
    }
    setWeaponData(data);
    // setTimeout(() => {
    //   for (let i = 0; i < data.length; i++) {
    //     fetchWeaponDesc("" + data[i]["_id"]);
    //   }
    // }, 1000);
    var i = 0;
    var interval = setInterval(() => {
      if (i >= data.length) {
        clearInterval(interval);
        return;
      }
      fetchWeaponDesc("" + data[i]["_id"]);
      i++;
    }, 100);
  };

  const updateRelicData = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      data[i]["DisplayName"] = data[i]["Name"];
      if (data[i]["DisplayName"] === "") {
        data[i]["DisplayName"] = "Name Not Found";
      }
      if (parseInt("" + data[i]["_id"]) >= 300) {
        data[i]["Type"] = "Planar";
      } else {
        data[i]["Type"] = "Relic";
      }
    }
    console.log("relicData", data);
    setRelicData(data);
  };

  const applySort = (column: string, order: "asc" | "desc") => {
    var data = null;
    if (view === "Characters") {
      data = avatarData;
    } else if (view === "Weapons") {
      data = weaponData;
    } else if (view === "Relics") {
      data = relicData;
    }
    if (!data) return;

    const sortedData = [...data].sort((a: any, b: any) => {
      if (order === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    console.log("sortedData", sortedData);
    setCurrentSort(column + "///" + order);
    // setAvatarData(sortedData);
    if (view === "Characters") {
      setAvatarData(sortedData);
    } else if (view === "Weapons") {
      setWeaponData(sortedData);
    } else if (view === "Relics") {
      setRelicData(sortedData);
    }
  };

  const addFilter = (name: string, value: string, override_same_name: boolean = false) => {
    var data = null;
    if (view === "Characters") {
      data = avatarData;
    } else if (view === "Weapons") {
      data = weaponData;
    } else if (view === "Relics") {
      data = relicData;
    }
    if (!data) return;

    const filter = name + "///" + value;
    if (!avatarFilters.includes(filter)) {
      // setAvatarFilters((prev) => [...prev, filter]);
      setAvatarFilters((prev) => {
        const newFilters = [...prev.filter((f) => !override_same_name || f.split("///")[0] !== name), filter];
        if (value === "All") {
          //remove last filter
          console.log("newFilters", newFilters);
          newFilters.splice(newFilters.length - 1, 1);
        }
        return newFilters;
      });
    }
  };

  const removeFilter = (name: string, value: string, override_same_name: boolean = false) => {
    if (!avatarData) return;

    setAvatarFilters((prev) => {
      const newFilters = [...prev.filter((f) => !(override_same_name ? f === name + "///" + value : f.split("///")[0] === name && f.split("///")[1] === value))];
      return newFilters;
    });
  };

  const fetchWeaponDesc = async (id: string) => {
    const res = await fetch("/api/weapon?id=" + id);
    const data = await res.json();
    // const textData = await res.text();

    // console.log("textData", textData);
    console.log("data", data);
    if (!data.error) {
      const weapon = data;
      var passive = {};
      if ("Live" in weapon) {
        passive = weapon.Live;
      } else if ("pre" in weapon) {
        passive = weapon.pre;
      } else if ("Pre" in weapon) {
        passive = weapon.Pre;
      } else {
        var max = 0;
        for (const key in weapon) {
          if (key.startsWith("v")) {
            const version = parseInt(key.substring(1));
            if (version > max) {
              max = version;
            }
          }
        }
        passive = weapon["v" + max];
      }

      // if not empty
      if (Object.keys(passive).length > 0) {
        setWeaponData((prev: any) => {
          const newWeaponData = [...prev];
          const index = newWeaponData.findIndex((w: any) => "" + w._id === id);
          console.log(passive);
          newWeaponData[index]["Passive"] = passive;
          // newWeaponData[index]["Passive"]["Desc"][0] = newWeaponData[index]["Passive"]["Desc"].replace(/<[^>]+>/g, "");
          newWeaponData[index]["Passive"]["Desc"] = newWeaponData[index]["Passive"]["Desc"].map((desc: string) => desc.replace(/<[^>]+>/g, "").split("Hidden Stat")[0]);
          return newWeaponData;
        });
      }
    }
  };

  const getQuery = (arr: any[]) => {
    return arr.filter((item) => {
      let isValid = true;
      for (const filter of avatarFilters) {
        const [name, value] = filter.split("///");
        if ("" + item[name] !== value) {
          isValid = false;
          break;
        }
      }
      return isValid;
    });
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/hsrindex?file=Avatar&var=_avatar,_weapon,_relic");
      const data = await res.json();

      // setAvatarData(data._avatar);
      updateAvatarData(data._avatar);
      // setWeaponData(data._weapon);
      updateWeaponData(data._weapon);
      // setRelicData(data._relic);
      updateRelicData(data._relic);

      setData(data);
    })();
  }, []);

  useEffect(() => {
    const char = searchParams.get("char");
    if (!char) return;

    async function fetchCharacter() {
      try {
        const res = await fetch(`/api/char/${char}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Unknown error");
        }

        const json = await res.json();

        console.log("json", json);
        setView("char_" + char);
        setSpecificCharacterData(json);
        setViews(["Characters", "Weapons", "Relics", "char_" + char]);
      } catch (err: any) {
        console.error("Error fetching character data:", err.message);
      } finally {
      }
    }

    fetchCharacter();
  }, [searchParams]);

  const setNewView = (view: string) => {
    if (view === "Characters" || view === "Weapons" || view === "Relics") {
      setView(view);
      setViews(["Characters", "Weapons", "Relics"]);
    } else {
      setView(view);
    }
  };
  //
  //   "Stats": {
  //     "HP": 1358.28,
  //     "ATK": 679.14,
  //     "DEF": 460.845,
  //     "SPD": 94.0,
  //     "Aggro": 125.0
  // },

  return (
    <div className='w-full h-full relative' style={{ minHeight: "100vh" }}>
      <div className='absolute w-full h-[2900px] top-0 left-0 z-0'>
        <BG />
      </div>

      <div className='w-1 h-[10px]'></div>
      <Header current='/i' />

      <LocalProfileView router={router} />

      <div className='w-[full] flex items-center justify-center flex-wrap relative z-[900]'>
        {views.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`w-[100px] h-[30px] flex items-center justify-center rounded-lg bg-[#121212] text-white text-sm font-bold mx-2 my-1 cursor-pointer ${
                view === item ? "bg-[#3d3b8a]" : ""
              }`}
              onClick={() => {
                setCurrentSort("");
                setAvatarFilters([]);
                if (view !== item) {
                  setNewView(item);
                }
              }}>
              {item}
            </div>
          );
        })}
      </div>

      <>
        {(view === "Characters" ? LF.avatarFilter(highestMajorVersion) : view === "Weapons" ? LF.weaponFilter : view === "Relics" ? LF.relicFilter : []).map((item, idx) => {
          return (
            <div key={idx} className='w-full flex items-center justify-center flex-wrap relative z-[900]'>
              {item.values.map((value, idx) => {
                return (
                  <FilterOption
                    item={value}
                    idx={idx}
                    includes={avatarFilters.includes(item.name + "///" + value) || (value === "All" && avatarFilters.filter((f) => f.split("///")[0] === item.name).length === 0)}
                    addAvatarFilter={addFilter}
                    removeAvatarFilter={removeFilter}
                    name={item.name}
                    display={"displayValues" in item && Array.isArray(item.displayValues) ? "" + item.displayValues[idx] : value}
                  />
                );
              })}
            </div>
          );
        })}
        {(view === "Characters" || view === "Weapons" || view === "Relics") && (
          <div className='w-full flex items-center justify-center flex-wrap relative z-[900]'>
            <div
              className='w-[100px] h-[30px] flex items-center justify-center rounded-lg  text-white text-sm font-bold mx-2 my-1 cursor-pointer bg-[#3d3b8a]
          '>
              Sort By
            </div>
            {
              // ["DisplayName", "Rarity", "Ver", "Element", "Path", "_id"].map((item, idx
              (view === "Characters" ? LF.avatarSort : view === "Weapons" ? LF.weaponSort : view === "Relics" ? LF.relicSort : []).map((item, idx) => {
                const wasPreviousSort = currentSort.split("///")[0] === item.name;
                return (
                  <div
                    key={idx}
                    className='w-[100px] h-[30px] flex items-center justify-center rounded-lg bg-[#121212] text-white text-sm font-bold mx-2 my-1 cursor-pointer'
                    onClick={() => {
                      if (currentSort.split("///")[0] === item.name) {
                        applySort(item.name, currentSort.split("///")[1] === "asc" ? "desc" : "asc");
                      } else {
                        applySort(item.name, item.default);
                      }
                    }}>
                    {item.displayName}
                    {wasPreviousSort && <span className='text-xs ml-1'>{currentSort.split("///")[1] === "asc" ? "↑" : "↓"}</span>}
                  </div>
                );
              })
            }
          </div>
        )}
      </>

      {avatarData && view === "Characters" && (
        <div className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]' style={{}}>
          {getQuery(avatarData).map((item: any, idx: number) => {
            return <AvatarDisplay item={item} key={idx} />; // <AvatarDisplay item={item} key={idx} />
          })}
        </div>
      )}
      {view === "Weapons" && weaponData && (
        <div className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]' style={{ maxHeight: "2300px", overflowY: "scroll" }}>
          {getQuery(weaponData).map((item: any, idx: number) => (
            <WeaponDisplay item={item} key={idx} />
          ))}
        </div>
      )}
      {view === "Relics" && relicData && (
        <div className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]' style={{}}>
          {getQuery(relicData).map((item: any, idx: number) => {
            return <RelicDisplay item={item} key={idx} />; // <AvatarDisplay item={item} key={idx} />
          })}
        </div>
      )}

      {view.startsWith("char_") && specificCharacterData && (
        <div className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]' style={{}}>
          <Char json={specificCharacterData} id={view.split("_")[1]} />
        </div>
      )}
    </div>
  );
}
