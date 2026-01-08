"use client";

import Image from "next/image";

import { useRouter, useParams } from "next/navigation";

import Header from "../../header";
import BG from "../../bg";
import LocalProfileView from "../../local_profile_view";

import { useState, useEffect, useRef } from "react";

import AvatarDisplay from "./avatar_display";
import WeaponDisplay from "./weapon_display";
import RelicDisplay from "./relic_display";
import FilterOption from "./filter_option";

import Char from "./char";

import * as LF from "./libfilters";
import { elementColor, elementConvert } from "./lib";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Sort } from "@mui/icons-material";
import { FilterList } from "@mui/icons-material";

export default function Index() {
  // const searchParams = useSearchParams();

  const [data, setData] = useState<any>(null);

  const [avatarData, setAvatarData] = useState<any>(null);
  const [weaponData, setWeaponData] = useState<any>(null);
  const [relicData, setRelicData] = useState<any>(null);
  const [specificCharacterData, setSpecificCharacterData] = useState<any>(null);
  const [specificCharacterAdditionalData, setSpecificCharacterAdditionalData] = useState<any>(null);

  const router = useRouter();

  const [avatarFilters, setAvatarFilters] = useState<string[]>([]);

  const [weaponPassiveHidden, setWeaponPassiveHidden] = useState<boolean>(false);

  const [currentSort, setCurrentSort] = useState<string>("");

  // const [view, setView] = useState(searchParams.get("char") || "Characters");
  const { char_id } = useParams() as { char_id: string | string[] };
  const [view, setView] = useState<string>(
    char_id ? "char_" + (Array.isArray(char_id) ? char_id[0] : char_id) : "Characters"
  );
  const [views, setViews] = useState<string[]>(["Characters", "Weapons", "Relics"]);

  const [highestMajorVersion, setHighestMajorVersion] = useState<number>(0);

  function calculateRanks(characters: any[]) {
    const allStats: Record<string, { id: number; value: number }[]> = {};

    // First, collect all stats
    for (const character of characters) {
      if (!character.Stats) continue; // Skip if no stats
      for (const [stat, value] of Object.entries(character.Stats)) {
        if (value != null) {
          if (!allStats[stat]) {
            allStats[stat] = [];
          }
          allStats[stat].push({ id: character._id, value: Number(value) });
        }
      }
    }

    // Then, for each stat, sort descending and assign ranks
    const statRankMaps: Record<string, Map<number, number>> = {}; // stat -> id -> rank
    const statTotalCounts: Record<string, number> = {};
    const statMaxValues: Record<string, number> = {};

    for (const [stat, entries] of Object.entries(allStats)) {
      // Sort descending (higher stat = better rank)
      entries.sort((a, b) => b.value - a.value);

      const rankMap = new Map<number, number>();

      // entries.forEach((entry, index) => {
      //   rankMap.set(entry.id, index + 1); // rank 1, 2, 3, ...
      // });
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (i > 0 && entry.value.toFixed(1) === entries[i - 1].value.toFixed(1)) {
          rankMap.set(entry.id, rankMap.get(entries[i - 1].id)!); // Same rank as previous
        } else {
          rankMap.set(entry.id, i + 1); // rank 1, 2, 3, ...
        }
      }

      statRankMaps[stat] = rankMap;
      statTotalCounts[stat] = entries.length;
      statMaxValues[stat] = parseFloat(entries[0].value.toFixed(1)); // Highest value for this stat
    }

    // Finally, assign ranks and rankTotals back to each character
    for (const character of characters) {
      const stats = character.Stats || {};
      character.rank = {};
      character.rankTotal = {};
      character.maxStat = {};

      for (const stat of Object.keys(stats)) {
        if (statRankMaps[stat]) {
          character.rank[stat] = statRankMaps[stat].get(character._id) || null;
          character.rankTotal[stat] = statTotalCounts[stat];
          character.maxStat[stat] = statMaxValues[stat];
        }
      }
    }

    return characters;
  }

  const updateAvatarData = (data: any) => {
    var highestMajorVersion: number = 0;

    const stats: { [key: string]: number[] } = {};

    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i]["_id"]) > 9999) {
        // delete
        data.splice(i, 1);
        i--;
        continue;
      }

      data[i]["DisplayName"] = data[i]["Name"];

      console.log("character", data[i]["_id"], data[i]["Name"]);

      if (parseInt(data[i]["_id"]) > 8000) {
        data[i]["DisplayName"] =
          data[i]["Name"] + (parseInt(data[i]["_id"]) % 2 == 0 ? " F" : " M");
      }

      data[i]["DisplayOrder"] = i;
      data[i]["MajorVersion"] = data[i]["Ver"].split(".")[0] + ".0";
      data[i]["MinorVersion"] = data[i]["Ver"].split(".")[1].split("v")[0];
      try {
        data[i]["stat_atk"] = data[i]["Stats"]["ATK"];
        data[i]["stat_hp"] = data[i]["Stats"]["HP"];
        data[i]["stat_def"] = data[i]["Stats"]["DEF"];
        data[i]["stat_spd"] = data[i]["Stats"]["SPD"];
        data[i]["stat_aggro"] = data[i]["Stats"]["Aggro"];
      } catch (e) {
        if (e == null) {
          console.log("Error: " + e);
        }
        data[i]["stat_atk"] = 0;
        data[i]["stat_hp"] = 0;
        data[i]["stat_def"] = 0;
        data[i]["stat_spd"] = 0;
        data[i]["stat_aggro"] = 0;
        alert("Error: " + e);
      }

      highestMajorVersion = Math.max(
        highestMajorVersion,
        parseInt(data[i]["MajorVersion"].split(".")[0])
      );
    }

    data = calculateRanks(data);

    data.sort((a: any, b: any) => {
      if (a["Ver"] < b["Ver"]) {
        return 1;
      } else if (a["Ver"] > b["Ver"]) {
        return -1;
      } else {
        return 0;
      }
    });

    setHighestMajorVersion(highestMajorVersion);
    setAvatarData(data);
    console.log("avatarData", data);
  };

  const updateWeaponData = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      data[i]["DisplayName"] = data[i]["Name"];
      if (data[i]["DisplayName"] === "") {
        data[i]["DisplayName"] = "Name Not Found";
      }
    }
    setWeaponData(data);
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
    // console.log("relicData", data);
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

    // console.log("sortedData", sortedData);
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
        const newFilters = [
          ...prev.filter((f) => !override_same_name || f.split("///")[0] !== name),
          filter,
        ];
        if (value === "All") {
          //remove last filter
          // console.log("newFilters", newFilters);
          newFilters.splice(newFilters.length - 1, 1);
        }
        return newFilters;
      });
    }
  };

  const removeFilter = (name: string, value: string, override_same_name: boolean = false) => {
    if (!avatarData) return;

    setAvatarFilters((prev) => {
      const newFilters = [
        ...prev.filter(
          (f) =>
            !(override_same_name
              ? f === name + "///" + value
              : f.split("///")[0] === name && f.split("///")[1] === value)
        ),
      ];
      return newFilters;
    });
  };

  const [searchQuery, setSearchQuery] = useState<string>("");

  const getQuery = (arr: any[]) => {
    return arr.filter((item) => {
      let isValid = item["DisplayName"]
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .includes(searchQuery.toLowerCase());
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

  async function fetchMainData() {
    if (avatarData !== null && weaponData != null && relicData != null) {
      console.log("Data already fetched");
      return;
    }
    try {
      const res = await fetch("/api/hsrindex?file=Avatar&var=_avatar,_weapon,_relic");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Unknown error");
      }
      const data = await res.json();

      // setAvatarData(data._avatar);
      updateAvatarData(data._avatar);
      // setWeaponData(data._weapon);
      updateWeaponData(data._weapon);
      // setRelicData(data._relic);
      updateRelicData(data._relic);

      setData(data);
    } catch (err: any) {
      console.error("Error fetching main data:", err.message);
    }
  }

  const [lastTimeout, setLastTimeout] = useState<number>(0);
  const [nextKeyPressReset, setNextKeyPressReset] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        if (nextKeyPressReset) {
          setSearchQuery((prev) => event.key);
          setNextKeyPressReset((prev) => false);
        } else {
          setSearchQuery((prev) => prev + event.key);
        }
        // Clear old timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Start a new timeout
        timeoutRef.current = setTimeout(() => {
          // setSearchQuery("");
          setNextKeyPressReset((prev) => true);
        }, 2000);
      } else if (event.key === "Backspace") {
        setSearchQuery("");
        // if (nextKeyPressReset) {
        //   setSearchQuery("");
        //   setNextKeyPressReset(false);
        // }
        // setSearchQuery((prev) => prev.slice(0, -1));
      } else if (event.key === "Escape") {
        setSearchQuery("");
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
        setSearchQuery(() => {
          console.log("searchQuery", "");
          return "";
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [nextKeyPressReset]);

  // const { char_id } = useParams();

  async function fetchCharacter(char: string) {
    if (!char) return;
    console.log("Fetching character data for char:", char);
    try {
      const res = await fetch(`/api/char/${char}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Unknown error");
      }

      const json = await res.json();

      console.log("json", json);
      // setView("char_" + char);
      setSpecificCharacterData(json);
    } catch (err: any) {
      console.error("Error fetching character data:", err.message);
    } finally {
    }
  }

  useEffect(() => {
    if (!view) return;

    if (view === "Characters" || view === "Weapons" || view === "Relics") {
      fetchMainData();
      setViews(["Characters", "Weapons", "Relics"]);
      return;
    } else {
      console.log("Fetching character data for view:", view, view.split("char_")[1]);
      fetchMainData();
      fetchCharacter(view.split("char_")[1]);
      setViews(["Characters", "Weapons", "Relics", view]);
    }
  }, [view]);

  useEffect(() => {
    const char = (Array.isArray(char_id) ? char_id[0] : char_id) || "Characters";
    setView(isNaN(parseInt(char)) ? char : "char_" + char);
  }, [char_id]);

  // useEffect(() => {
  //   if (view.startsWith("char_")) {
  //     const char = view.split("char_")[1];
  //     fetchCharacter(char);
  //   } else {
  //     setSpecificCharacterData(null);
  //   }
  // }, [view]);

  const setNewView = (view: string) => {
    if (view === "Characters" || view === "Weapons" || view === "Relics") {
      setView(view);
      setViews(["Characters", "Weapons", "Relics"]);
    } else {
      setView(view);
    }
  };

  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const [isWeaponPassiveHidden, setIsWeaponPassiveHidden] = useState(false);

  return (
    <div className='w-full h-full relative pb-[200px] m1_2:pb-[0px]' style={{ minHeight: "100vh" }}>
      <div className='absolute w-full top-0 left-0 z-0'>
        <BG isImage={true} />
      </div>

      {/* <div className='w-1 h-[10px]'></div> */}
      <div className='absolute'>
        <Header current='/i' />
      </div>

      <div
        className='w-full flex items-center justify-center flex-wrap sticky z-[950] top-12 bg-[#504e84] pt-3 pb-2
        m1_2:h-[6vh] 
      '>
        {views.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`w-[150px] h-[30px] text-center flex items-center justify-center bg-[#4d48db] text-white text-sm font-bold mx-2  cursor-pointer rounded-sm 
                 leading-[30px] hover:shadow-[0_0_0px_2px_#c7c7c7] transition-all duration-150 shadow-[0_2px_5px_0_#00000088]
                m1_4:w-[23vw] m1_4:h-[5.7vw] m1_4:text-[2.6vw] m1_4:leading-[5.7vw] m1_4:mx-[0.3vh] 
                ${view === item ? "bg-[#3d3b8a]" : ""}`}
              style={
                {
                  // filter: "drop-shadow(0px 2px 5px #00000088)",
                }
              }
              onClick={() => {
                setCurrentSort("");
                setAvatarFilters([]);
                if (view !== item) {
                  // setNewView(item);
                  // router.push(`/i/${item}`);
                  if (view.startsWith("char_")) {
                    // router.push(`/i`);
                    setView(item);
                  } else {
                    setView(item);
                  }
                }
              }}>
              <div className='w-full h-full bg-[#a2a1dac2] hover:bg-[#8d8cc8c2] text-center  rounded-sm hover:font-extrabold'>
                {item}
              </div>
            </div>
          );
        })}
      </div>

      {(view === "Characters" || view === "Weapons" || view === "Relics") && (
        <div className='w-[100vw] bg-[#151563a7] h-fit relative mt-12 mb-[0.5vw] py-4 px-3 gap-4 flex flex-col items-center justify-center'>
          <div className='rounded-lg text-[#ffffff] relative z-[900] w-full flex justify-center gap-2'>
            <div
              className=' w-fit flex justify-center items-center pl-[2.5vw] pr-[2vw] py-[0.1vw] rounded-md shadow-md shadow-[#000000] gap-2 hover:shadow-[0_0_1px_2px_#ffffff] cursor-pointer text-[13px]
          m1_4:w-[32vw] m1_4:text-[2.5vw]
          '
              style={{
                backgroundColor: filterVisible ? "#4d48ab" : "#1c196a",
                transition: "background-color 0.2s ease-in-out",
              }}
              onClick={() => {
                setFilterVisible((prev) => !prev);
              }}>
              <div className=' font-bold'>Filters</div>
              <div>
                <div>{filterVisible ? <FilterAlt /> : <FilterAltOff />}</div>
              </div>
            </div>
            <div
              className=' w-fit flex justify-center items-center pl-[2.5vw] pr-[2vw] py-[0.1vw] rounded-md shadow-md shadow-[#000000] gap-2 hover:shadow-[0_0_1px_2px_#ffffff] cursor-pointer text-[13px]
          m1_4:w-[32vw] m1_4:text-[2.5vw]
          '
              style={{
                backgroundColor: sortVisible ? "#4d48ab" : "#1c196a",
                transition: "background-color 0.2s ease-in-out",
              }}
              onClick={() => {
                setSortVisible((prev) => !prev);
              }}>
              <div className='font-bold'>Sort</div>
              <div>
                <div>{sortVisible ? <FilterList /> : <Sort />}</div>
              </div>
            </div>
          </div>

          {filterVisible && (
            <div className='w-full h-fit bg-[#5e5e95cc] relative rounded-lg flex items-center flex-col'>
              {(view === "Characters"
                ? LF.avatarFilter(highestMajorVersion)
                : view === "Weapons"
                ? LF.weaponFilter
                : view === "Relics"
                ? LF.relicFilter
                : []
              ).map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`w-full flex items-center justify-center flex-wrap relative z-[900] py-2 mx-2 ${
                      idx > 0 ? "border-t border-[#c7c7c7aa]" : ""
                    }`}>
                    {item.values.map((value, idx) => {
                      return (
                        <FilterOption
                          item={value}
                          idx={idx}
                          includes={
                            avatarFilters.includes(item.name + "///" + value) ||
                            (value === "All" &&
                              avatarFilters.filter((f) => f.split("///")[0] === item.name)
                                .length === 0)
                          }
                          addAvatarFilter={addFilter}
                          removeAvatarFilter={removeFilter}
                          name={item.name}
                          display={
                            "displayValues" in item && Array.isArray(item.displayValues)
                              ? "" + item.displayValues[idx]
                              : value
                          }
                          key={idx}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {sortVisible && (view === "Characters" || view === "Weapons" || view === "Relics") && (
            <div className='w-full h-fit bg-[#5e5e95cc] relative rounded-lg'>
              <div className='flex items-center justify-center flex-wrap relative z-[900] py-2 px-3'>
                {(view === "Characters"
                  ? LF.avatarSort
                  : view === "Weapons"
                  ? LF.weaponSort
                  : view === "Relics"
                  ? LF.relicSort
                  : []
                ).map((item, idx) => {
                  const wasPreviousSort = currentSort.split("///")[0] === item.name;
                  return (
                    <div
                      key={idx}
                      className={`w-[170px] h-[30px] flex items-center justify-center rounded-lg bg-[#121212] text-sm font-bold mx-2 my-1 cursor-pointer transition-all duration-50 hover:shadow-[0_0_1px_2px_#ffffff]
                          m1_4:w-[14vw] m1_4:text-[2.1vw] m1_4:h-[5vw] m1_4:mx-[0.3vw] m1_4:my-[0.05vw]
                          ${
                            wasPreviousSort
                              ? "bg-[#1c196a] text-[#ffffff] shadow-[0_0_0_1px_#c7c7c7]"
                              : "text-[#c7c7c7]"
                          }`}
                      onClick={() => {
                        if (currentSort.split("///")[0] === item.name) {
                          applySort(
                            item.name,
                            currentSort.split("///")[1] === "asc" ? "desc" : "asc"
                          );
                        } else {
                          applySort(item.name, item.default);
                        }
                      }}>
                      {item.displayName}
                      {wasPreviousSort && (
                        <span className='text-xs ml-1'>
                          {currentSort.split("///")[1] === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {
        <div
          className='w-full flex items-center justify-center flex-wrap sticky z-[950] top-[95px]
            m1_4:top-[10vh]
          '
          style={{ opacity: searchQuery.length > 0 ? 1 : 0.2 }}>
          <div
            className='w-[200px] h-[30px] flex items-center justify-center rounded-lg bg-[#817fd0d8] text-[#e9e9e9] text-sm font-bold mx-2 my-1 cursor-pointer shadow-md shadow-[#000000]
            m1_4:w-[52vw] m1_4:h-[5vw] text-[3.5vw] leading-[5vw] m1_4:mx-[0.3vw] m1_4:my-[1vw]
          '>
            {searchQuery}
          </div>
        </div>
      }

      {avatarData && view === "Characters" && (
        <div
          className='w-full mx-auto flex items-start justify-center flex-wrap relative z-[900]'
          style={{}}>
          {getQuery(avatarData).map((item: any, idx: number) => {
            // return <AvatarDisplay item={item} key={idx} onClick={() => router.push("/i?char=" + item._id)} />; // <AvatarDisplay item={item} key={idx} />
            return (
              <div
                onClick={() => router.push("/i/" + item._id)}
                className='cursor-pointer'
                key={idx}>
                <AvatarDisplay item={item} key={idx} sortedStat={currentSort} />
              </div>
            );
          })}
        </div>
      )}
      {view === "Weapons" && weaponData && (
        <>
          <div className='w-full flex items-center justify-center flex-wrap relative z-[900]'>
            <div
              className={`w-[190px] h-[30px] flex items-center justify-center rounded-lg bg-[#121212] text-white text-sm font-bold mx-2 my-1 cursor-pointer ${
                weaponPassiveHidden ? "bg-[#3d3b8a]" : ""
              }`}
              onClick={() => {
                setWeaponPassiveHidden(!weaponPassiveHidden);
              }}>
              {!weaponPassiveHidden ? "Show Passive" : "Hide Passive"}
            </div>
          </div>
          <div className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]'>
            {getQuery(weaponData).map((item: any, idx: number) => (
              <WeaponDisplay
                item={item}
                key={idx}
                showPassive={weaponPassiveHidden}
                // fetchWeaponDesc={fetchWeaponDesc}
              />
            ))}
          </div>
        </>
      )}
      {view === "Relics" && relicData && (
        <div
          className='w-[97%] mx-auto flex items-start justify-center flex-wrap relative z-[900]'
          style={{}}>
          {getQuery(relicData).map((item: any, idx: number) => {
            return <RelicDisplay item={item} key={idx} />; // <AvatarDisplay item={item} key={idx} />
          })}
        </div>
      )}
      {view.startsWith("char_") && specificCharacterData && avatarData && (
        <div
          className='w-full mx-auto flex items-start justify-center flex-wrap relative'
          style={{}}>
          <Char
            json={specificCharacterData}
            id={view.split("_")[1]}
            name={
              avatarData.find((item: any) => "" + item._id === view.split("_")[1])["DisplayName"]
            }
            element={
              avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Element"]
            }
            charElementColor={
              elementColor[
                elementConvert[
                  avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Element"]
                ]
              ]
            }
            path={avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Path"]}
            rarity={avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Rarity"]}
            version={avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Ver"]}
            stats={avatarData.find((item: any) => "" + item._id === view.split("_")[1])["Stats"]}
            avatarData={avatarData}
            searchQuery={searchQuery}
            router={router}
          />
        </div>
      )}
    </div>
  );
}
