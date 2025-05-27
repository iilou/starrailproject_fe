"use client";

import Image from "next/image";

import Header from "../../header";
import LocalProfileView from "../../local_profile_view";
import CharSel from "./char_sel";
import BG from "../../bg";

import { charDbTypes } from "./lib";

import axios from "axios";

import { useState, useEffect } from "react";

import { ranks, get_rank_from_score } from "../../ranks";
import {
  charSetIndex,
  charIndex,
  property_hash,
  weightParse,
  reverse_property_hash,
} from "../../lib/score";

import { useRouter, useParams } from "next/navigation";
import { decode } from "punycode";
import { get } from "http";
import { parse } from "path";

import { main_relic_affix, sub_relic_affix, sub_relic_affix_hash } from "./relic_lib";
import { properties } from "../../i/[[...char_id]]/properties";

import OpenInNew from "@mui/icons-material/OpenInNew";

export default function Leaderboard() {
  // const searchParams = useSearchParams();

  const columns = {
    uid: 0,
    name: 1,
    character_name: 3,
    string1: 4,
    string2: 5,
    score: 2,
  };
  const [data, setData] = useState<Array<string[]>>([]);
  const [relicData, setRelicData] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);
  const [db_size, setDbSize] = useState(0);
  const [hoverCell, setHoverCell] = useState({ row: -1, col: -1 });
  const [sel_rows, setSelRows] = useState<Array<boolean>>([]);
  const pageSize = 50;

  const router = useRouter();

  const regionIds: { [key: string]: string } = {
    "1": "CN",
    "6": "NA",
    "7": "EU",
    "8": "JP",
  };

  const charList: { [key: string]: number } = {
    Seele: 1102,
    "Dan Heng • Imbibitor Lunae": 1213,
    "The Herta": 1401,
    Feixiao: 1220,
    Firefly: 1310,
    Aglaea: 1402,
    Castorice: 1407,
    Acheron: 1308,
    Gallagher: 1301,
    Robin: 1309,
    "Ruan Mei": 1303,
    Anaxa: 1405,
  };

  const getRankFromScoreWithSet = (lb_name: string, char_name: string) => {
    console.log("getRankFromScoreWithSet", lb_name, char_name);
    if (lb_name !== char_name) {
      // try {
      //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/get_lb_first/${lb_name}`)
      //     .then((res) => res.json())
      //     .then((data) => {
      //       console.log("fetch lb first data - ", data);
      //       if (data && data.length > 0) {
      //         const firstScore = parseInt(data[columns.score]);
      //         console.log("firstScore", firstScore);
      //         set_lb_100p_benchmark(() => firstScore);
      //       }
      //     });
      // } catch (error) {
      //   console.error("Error fetching first score:", error);
      //   set_lb_100p_benchmark(() => 80000); // Default value if fetch fails
      // }
      console.log("lb_name does not match char_name, returning 0", lb_name, char_name);
      return;
    }

    if (!(lb_name in charSetIndex)) {
      console.log("Character not found in charSetIndex", lb_name);
      return 0;
    }

    var bestRelicSetScore = 0;
    const headers = charSetIndex["INFO"];

    // 2pc + 2pc
    var highestSet = "";
    var highestSetScore = 0;
    for (let i = 1; i < headers.length; i++) {
      const setName = headers[i];
      const setNum = parseInt(setName.split(" ")[0]);
      if (setNum > 299) {
        continue;
      }
      // console.log(charSetIndex, lb_name, i);
      const setScore = parseFloat(charSetIndex[lb_name][i]);
      if (setScore > highestSetScore) {
        highestSetScore = setScore;
        highestSet = setName;
      }
    }
    for (let i = 1; i < headers.length; i++) {
      const setName = headers[i];
      const setNum = parseInt(setName.split(" ")[0]);
      if (setNum > 299) {
        continue;
      }
      if (setName === highestSet) {
        continue;
      }
      const setScore = parseFloat(charSetIndex[lb_name][i]);
      if (setScore > bestRelicSetScore) {
        bestRelicSetScore = setScore;
      }
    }
    bestRelicSetScore += highestSetScore;

    // 4pc
    for (let i = 1; i < headers.length; i++) {
      const setNum = parseInt(headers[i].split(" ")[0]);
      if (setNum > 299) {
        continue;
      }
      const pc2Index = headers.indexOf(setNum + "|2");
      const pc4Index = headers.indexOf(setNum + "|4");
      const totalSetScore =
        parseFloat(charSetIndex[lb_name][pc2Index]) + parseFloat(charSetIndex[lb_name][pc4Index]);
      if (totalSetScore > bestRelicSetScore) {
        bestRelicSetScore = totalSetScore;
      }
    }

    //planars
    var highestPlanarSetScore = 0;
    for (let i = 1; i < headers.length; i++) {
      const setNum = parseInt(headers[i].split(" ")[0]);
      if (setNum < 201) {
        continue;
      }

      const setScore = parseFloat(charSetIndex[lb_name][i]);
      if (setScore > highestPlanarSetScore) {
        highestPlanarSetScore = setScore;
      }
    }

    // substats + mainstats
    const subAffixOptions = Object.keys(sub_relic_affix_hash);
    const dps = parseFloat(charIndex[lb_name][property_hash["CriticalChanceBase"] + 1]) > 0.7;
    const subAffixOptionsSorted = subAffixOptions.sort((a: string, b: string) => {
      return (
        // Speed is breakpointed on maindps, and its weight is set to 0.7 to match atk rope most of the time,
        (dps && b === "SpeedDelta" ? 0 : 1) * parseFloat(charIndex[lb_name][property_hash[b] + 1]) -
        (dps && a === "SpeedDelta" ? 0 : 1) * parseFloat(charIndex[lb_name][property_hash[a] + 1])
      );
    });
    const subAffixTop5Sum = subAffixOptionsSorted.slice(0, 5).reduce((sum, affix) => {
      return sum + parseFloat(charIndex[lb_name][property_hash[affix] + 1]);
    }, 0);
    // console.log("subAffixTop4Sum", subAffixTop4Sum);
    // console.log("subAffixOptionsSorted", subAffixOptionsSorted);
    // console.log("subAffixOptions", subAffixOptions);
    // console.log("subAffixSorted", subAffixOptionsSorted);
    var baselineRelics = 0;
    for (let i = 0; i < 6; i++) {
      const mainAffixOptions = main_relic_affix[i + 1]["affixes"];

      var main_affix_option = mainAffixOptions[0];
      for (let i = 1; i < mainAffixOptions.length; i++) {
        if (
          // charIndex[lb_name][mainAffixOptions[i].property] >
          //   charIndex[lb_name][main_affix_option.property] ||
          // (charIndex[lb_name][mainAffixOptions[i].property] ===
          //   charIndex[lb_name][main_affix_option.property] &&
          //   main_affix_option in sub_relic_affix_hash &&
          //   !(mainAffixOptions[i].property in sub_relic_affix_hash))
          parseFloat(charIndex[lb_name][property_hash[mainAffixOptions[i].property] + 1]) >
            parseFloat(charIndex[lb_name][property_hash[main_affix_option.property] + 1]) ||
          (parseFloat(charIndex[lb_name][property_hash[mainAffixOptions[i].property] + 1]) ===
            parseFloat(charIndex[lb_name][property_hash[main_affix_option.property] + 1]) &&
            main_affix_option in sub_relic_affix_hash &&
            !(mainAffixOptions[i].property in sub_relic_affix_hash))
        ) {
          // only if sub affix contains old option but not new option, then replace
          main_affix_option = mainAffixOptions[i];
        }
      }

      var substatsum = 0;
      const steps = [4.25, 1.7, 0.5, 0.2];
      var ind = 0;
      for (let i = 0; ind < 4; i++) {
        if (main_affix_option.property === subAffixOptionsSorted[i]) {
          continue;
        }
        substatsum +=
          parseFloat(charIndex[lb_name][property_hash[subAffixOptionsSorted[i]] + 1]) * steps[ind];
        ind++;
        console.log(
          "mainstat",
          main_affix_option.property +
            " x " +
            charIndex[lb_name][property_hash[main_affix_option.property] + 1],
          "substat",
          subAffixOptionsSorted[i],
          "value",
          charIndex[lb_name][property_hash[subAffixOptionsSorted[i]] + 1],
          "count",
          steps[ind - 1]
        );
      }
      baselineRelics +=
        parseFloat(charIndex[lb_name][property_hash[main_affix_option.property] + 1]) * 10 +
        substatsum;

      // console.log("mainstat", main_affix_option, "substatsum", substatsum);
    }

    // console.log(
    //   "baselineRelics",
    //   baselineRelics,
    //   "bestRelicSetScore",
    //   bestRelicSetScore,
    //   "highestPlanarSetScore",
    //   highestPlanarSetScore
    // );

    // return bestRelicSetScore + highestPlanarSetScore;
    // return get_rank_from_score( score / 1000 + bestRelicSetScore + highestPlanarSetScore, max);
    set_lb_100p_benchmark(
      (prev) => (bestRelicSetScore + highestPlanarSetScore + baselineRelics) * 1000
    );
  };

  // const lb_name = searchParams.get("char") || "The Herta";

  // const { lb_name: lb_name_param } = useParams() as { lb_name: string };
  const { lb_name: lb_name_param } = useParams() as { lb_name: string };
  // console.log("lb_name_param", lb_name_param);
  const [lb_name, set_lb_name] = useState(
    lb_name_param !== undefined
      ? (Array.isArray(lb_name_param)
          ? decodeURIComponent(lb_name_param[0])
          : decodeURIComponent(lb_name_param)) || "The Herta"
      : "The Herta"
  );
  // const lb_100p_benchmark = getRankFromScoreWithSet(lb_name);
  const [lb_100p_benchmark, set_lb_100p_benchmark] = useState<number>(80000); // Default value, will be updated later
  useEffect(() => {
    if (Array.isArray(lb_name_param)) {
      set_lb_name(decodeURIComponent(lb_name_param[0]));
    } else if (lb_name_param && lb_name_param !== lb_name && lb_name_param !== "") {
      set_lb_name(decodeURIComponent(lb_name_param));
    }

    console.log("lb_name", lb_name_param, lb_name);
  }, [lb_name_param]);

  const defaultDbType = "Relic Score";

  const charElement: { [key: string]: string } = {
    Seele: "Quantum",
    "Dan Heng • Imbibitor Lunae": "Imaginary",
    "The Herta": "Ice",
    Feixiao: "Wind",
    Firefly: "Fire",
    Aglaea: "Lightning",
    Castorice: "Quantum",
    Acheron: "Lightning",
    Gallagher: "Fire",
    Robin: "Physical",
    "Ruan Mei": "Ice",
    Anaxa: "Wind",
  };

  const elementColor: { [key: string]: string } = {
    Quantum: "#1C29BA",
    Imaginary: "#F4D258",
    Ice: "#47C7FD",
    Wind: "#00FF9C",
    Fire: "#F84F36",
    Lightning: "#8872F1",
    Physical: "#ffffff",
  };

  const relic_string_to_array = (relic_string_array: string[]) => {
    const arr = [];
    for (let i = 0; i < relic_string_array.length; i++) {
      const relic = relic_string_array[i];
      if (relic !== "") {
        const relicObj: any = {};
        const relicParts = relic.split("relic");
        for (let j = 0; j < relicParts.length; j++) {
          const string_raw = relicParts[j];
          const char_array = string_raw.split("");
          const int_array = char_array.map((char: string) => {
            return char.charCodeAt(0);
          });
          // console.log("chr_array", char_array);
          // console.log("int_array", int_array);
          relicObj[j] = {};
          relicObj[j]["id"] = Math.floor(int_array[0] / 10);
          relicObj[j]["type"] = int_array[0] % 10;
          relicObj[j]["level"] = Math.floor(int_array[1] % 100);
          relicObj[j]["rarity"] = Math.floor(int_array[1] / 100);
          relicObj[j][
            "icon"
          ] = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/relic/${
            relicObj[j]["id"] >= 300
              ? relicObj[j]["id"] + "_" + (relicObj[j]["type"] - 5)
              : relicObj[j]["id"] + "_" + (relicObj[j]["type"] - 1)
          }.png`;

          relicObj[j]["main_affix"] = {};
          relicObj[j]["main_affix"]["hash"] = Math.floor(int_array[2] / 1000);
          relicObj[j]["main_affix"]["step"] = parseFloat(((int_array[2] % 1000) / 10).toFixed(2));
          if (relicObj[j]["main_affix"]["step"] === 16.7) {
            relicObj[j]["main_affix"]["step"] = 16.6666666;
          }
          relicObj[j]["main_affix"]["value"] =
            weightParse[reverse_property_hash[relicObj[j]["main_affix"]["hash"]]] *
            relicObj[j]["main_affix"]["step"];
          relicObj[j]["main_affix"]["type"] =
            reverse_property_hash[relicObj[j]["main_affix"]["hash"]];
          relicObj[j]["main_affix"]["DisplayValue"] =
            (
              relicObj[j]["main_affix"]["value"] *
              (properties[relicObj[j]["main_affix"]["type"]]["percent"] ? 100 : 1)
            ).toFixed(properties[relicObj[j]["main_affix"]["type"]]["percent"] ? 1 : 0) +
            (properties[relicObj[j]["main_affix"]["type"]]["percent"] ? "%" : "");
          relicObj[j]["main_affix"]["icon"] = properties[relicObj[j]["main_affix"]["type"]]["icon"];
          relicObj[j]["main_affix"]["name"] = properties[relicObj[j]["main_affix"]["type"]]["name"];

          relicObj[j]["sub_affixes"] = [];
          for (let k = 3; k < int_array.length; k++) {
            if (int_array[k] === 0) {
              break;
            }
            const sub_affix: any = {};
            sub_affix["hash"] = Math.floor(int_array[k] / 100);
            sub_affix["type"] = reverse_property_hash[sub_affix["hash"]];
            sub_affix["step"] = parseFloat(((int_array[k] % 100) / 10).toFixed(2));
            sub_affix["value"] =
              weightParse[reverse_property_hash[sub_affix["hash"]]] * sub_affix["step"];
            relicObj[j]["sub_affixes"].push(sub_affix);
            sub_affix["DisplayValue"] =
              (sub_affix["value"] * (properties[sub_affix["type"]]["percent"] ? 100 : 1)).toFixed(
                1
              ) + (properties[sub_affix["type"]]["percent"] ? "%" : "");
            sub_affix["icon"] = properties[sub_affix["type"]]["icon"];
            sub_affix["name"] = properties[sub_affix["type"]]["name"];
          }
        }

        arr.push({ relics: relicObj });
      } else {
        arr.push({ relics: [] });
      }
    }
    return arr;
  };

  const get_lb = async (pageForce: number = -1, lb_override: string = "") => {
    if (lb_name === "" && lb_override === "") {
      console.log("Invalid leaderboard name", lb_name);
      return;
    }

    console.log("lookup", lb_name, lb_override, pageForce, pageSize);

    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get_lb_count/${
          lb_override === "" ? lb_name : lb_override
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          setDbSize(data[0][0]);

          try {
            // fetch(`http://127.0.0.1:8000/get_lb/${lb_override === "" ? lb_name : lb_override}/${pageForce === -1 ? page : pageForce}/${pageSize}`)
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/get_lb/${
                lb_override === "" ? lb_name : lb_override
              }/${pageForce === -1 ? page : pageForce}/${pageSize}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("fetch lb data - ", data);

                const relic_full_array: any[] = relic_string_to_array([
                  ...data.map((row: any) => row[columns.string2]),
                ]);

                console.log("relic_full_array", relic_full_array);

                set_lb_100p_benchmark((prev) => data[0][columns.score]);
                // }
                setData(data);
                setSelRows(Array.from({ length: data.length }, () => false));
                setRelicData(relic_full_array);
                setPage(pageForce === -1 ? page : pageForce);
              });
          } catch (error) {
            console.error(error);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const [char_name, set_char_name] = useState<string>("");
  useEffect(() => {
    get_lb(1);
    // if (lb_name !== lb_name.split("|")[0]) {
    //   get_lb_first(lb_name.split("|")[0], () => {
    //     get_lb(1);
    //   });
    // } else {
    //   get_lb(1);
    // }
    // set_lb_100p_benchmark(getRankFromScoreWithSet(lb_name));
    // getRankFromScoreWithSet(lb_name, lb_name.split("|")[0]);
    set_char_name(lb_name.split("|")[0]);
    console.log("lb_name", lb_name);
  }, [lb_name]);

  const on_lb_select = () => {
    get_lb(1);
  };

  const on_page_change = async (newPage: number) => {
    setPage((prev) => newPage);
    get_lb(newPage);
  };

  // const color_find = (row: number, col: number, val: string = "") => {
  //   var color = "#e7e7e7";
  //   var weight = "400";

  //   if (col === 0) {
  //     color = "#a7a7a7";
  //     if ((page - 1) * pageSize + row < 3) {
  //       if (row === 0) {
  //         color = "#E3FF36";
  //       } else if (row === 1) {
  //         color = "#B7B7B7";
  //       } else if (row === 2) {
  //         color = "#978045";
  //       }
  //     }
  //     weight = (page - 1) * pageSize + row < 3 ? "900" : "300";
  //   } else if (col === 1) {
  //     weight = "600";
  //     switch (data[row][columns.uid].toString().charAt(0)) {
  //       case "1": //china
  //         color = "#DD7F7F";
  //         break;
  //       case "6": // na
  //         color = "#CDD28A";
  //         break;
  //     }
  //   } else if (col === 3) {
  //     // const rank = get_rank_from_score(parseInt(row[columns.score]) / 1000, 70);
  //     const maxScore = 70000;
  //     const min = [104, 63, 80];
  //     const max = [122, 55, 62];
  //     const minCutoff = 68000;

  //     color =
  //       parseInt(data[row][columns.score]) > minCutoff
  //         ? parseInt(data[row][columns.score]) > maxScore
  //           ? `hsl(${max[0]}, ${max[1]}%, ${max[2]}%)`
  //           : `hsl(
  //       ${
  //         ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
  //           (max[0] - min[0]) +
  //         min[0]
  //       },
  //       ${
  //         ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
  //           (max[1] - min[1]) +
  //         min[1]
  //       }%,
  //       ${
  //         ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
  //           (max[2] - min[2]) +
  //         min[2]
  //       }%)`
  //         : `hsl(${min[0]}, ${min[1]}%, ${min[2]}%)`;

  //     weight = "900";
  //   }

  //   return { color: color, weight: weight };
  // };

  const columnWidths = {
    RANK: "103px",
    UID: "210px",
    NAME: "371px",
    SCORE: "232px",
    TIER: "119px",
  };

  const columnWidthsM1_4 = {
    RANK: "12vw",
    UID: "20vw",
    NAME: "32vw",
    SCORE: "20vw",
    TIER: "12vw",
  };

  return (
    <div className='w-full h-fit'>
      <div className='absolute w-full h-[1600px] z-0 overflow-hidden'>
        <BG />
      </div>
      <div className='relative z-[10000]'>
        <Header current='/lb' />
      </div>
      <div className='w-full absolute z-[1000] translate-y-8'>
        <LocalProfileView router={router} />
      </div>

      <div className='relative z-[10] h-[400px] w-full bg-[#0000002c] flex items-end pb-[20px]'>
        <div className='absolute w-full z-[12]'>
          {
            <Image
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/image/character_portrait/${
                charList[char_name as keyof typeof charList] || 1102
              }.png`}
              width={724}
              height={724}
              alt='Character Portrait'
              className='translate-y-[350px] m1_4:translate-y-[190px] m-auto'
              rel='preload'
            />
          }
        </div>
      </div>

      <div
        className='w-full flex justify-center flex-wrap font-extrabold text-4xl relative z-[60]  h-[114px]
        m1_4:text-[24px] m1_4:h-fit m1_4:leading-[24px] 
      '>
        <div className='pt-6 pb-2 w-full flex justify-center gap-[10px] bg-[#1A1A1A]'>
          <strong
            style={{
              color: char_name in charElement ? elementColor[charElement[char_name]] : "",
              textShadow: char_name in charElement ? `0 0 2px #111111, 0 0 0px #787878` : "",
            }}>
            {char_name.toUpperCase()}
          </strong>{" "}
          LEADERBOARDS
        </div>
        <div className='flex justify-center w-full text-w1 font-extrabold  bg-[#00000092]'>
          {char_name in charDbTypes &&
            charDbTypes[char_name].lb_types.map((lb_type, index) => (
              <div
                className='cursor-pointer bg-[#323232c2] py-2 px-14 hover:bg-[#525252c2] transition-fast text-base
                  m1_4:text-[11px] m1_4:py-[1px] m1_4:px-[32px]
                '
                onClick={() => {
                  // get_lb(1, `${lb_name + (lb_type === "" ? "" : "|" + lb_type)}`);
                  set_lb_name(`${char_name}${lb_type === "" ? "" : "|" + lb_type}`); // Update lb_name to include the type
                }}
                key={index}>
                {lb_type === "" ? defaultDbType.toUpperCase() : lb_type.toUpperCase()}
              </div>
            ))}
        </div>
      </div>

      <div
        className='z-[190] relative block ml-auto mr-[0vw] w-fit translate-y-[-180px]
        m1_4:mr-auto m1_4:translate-y-[-130px] 
      '>
        <CharSel charList={charList} currentChar={char_name} router={router} />
      </div>

      <div className='w-[97vw] m-auto relative z-2 rounded-xl pb-4 opacity-[90%] overflow-x-auto z-[40]'>
        <div
          className='grid grid-cols-[103px,150px,371px,150px,150px] gap-x-3 bg-[#020071c2] px-[10px] rounded-md py-[2px] shadow-md shadow-[#000000d2] z-[100] relative w-fit text-[16px] mx-auto
                          m1_4:grid-cols-[12vw,12vw,32vw,12vw,22vw]      m1_4:gap-x-[0.2vw] m1_4:px-[0.2vw] m1_4:text-[2.3vw] 
          '>
          {["RANK", "UID", "NAME", "SCORE", "TIER"].map((col, i) => (
            <div
              className={`text-center font-extrabold pt-[26px] pb-[5px] hover:bg-[#353385d2] rounded-md active:shadow-[0px_0px_0px_1px_inset_#c7c7c7] active:bg-[#020071e2]
                  m1_4:pt-[2.8vw] m1_4:pb-[1.2vw] 
                `}
              style={{ textShadow: "0 0 7px #000000" }}
              key={col}>
              <span className='select-none cursor-pointer'>{col}</span>
            </div>
          ))}
        </div>
        <div
          className='flex flex-col scrollbar-thin scrollbar-thumb-[#1E1C65] scrollbar-track-[#020071c2] 
          scrollbar-thumb-rounded-full scrollbar-track-rounded-full z-[99] relative w-fit bg-[#3d3a8c77] rounded-md mx-auto
          '>
          <div className='w-[1px] h-[15px]'></div>
          {data.map((row, idx) => {
            // RENDER ROWS
            const hoverRow = hoverCell.row === idx;

            const rank: number = idx + 1 + (page - 1) * pageSize;
            const rankColor = rank > 3 ? "#d7d7d7" : ["#E3FF36", "#B7B7B7", "#978045"][rank - 1];

            const score = parseInt(row[columns.score]);
            // const percent = ((score / 1000 / (70 + lb_100p_benchmark)) * 100).toFixed(2);
            const percent = ((100 * score) / lb_100p_benchmark).toFixed(2);
            const letter_rank_obj = get_rank_from_score(score, lb_100p_benchmark);

            const elements = [
              // Rank
              <div
                className='flex justify-center items-center w-full border-r-[1px] border-[#d7d7d733]
                m1_4:text-[11px]
              '>
                <span
                  className={`${rank > 3 && "hover:underline"} cursor-pointer`}
                  style={{
                    color: rankColor,
                    fontWeight: rank > 3 ? "300" : "900",
                  }}>
                  {rank > 3 ? rank : rank + ["st", "nd", "rd"][rank - 1]}
                </span>
              </div>,
              // UID
              <span
                className='text-[#a1a1a1] font-light hover:underline cursor-pointer
                m1_4:text-[9px] 
              '>
                {row[columns.uid]}
              </span>,
              // Name and pfp
              <div
                className='flex gap-[10px] justify-center items-center w-full border-x-[1px] border-[#d7d7d773] group
                  m1_4:gap-[0.2vw] 
              '>
                <img
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                    row[columns.string1] == "" ? "icon/avatar/1001.png" : row[columns.string1]
                  }`}
                  width={100}
                  height={100}
                  alt={row[columns.name]}
                  className='rounded-full bg-[#232323] w-[32px] h-[32px] m1_4:w-[4.4vw] m1_4:h-[4.4vw]
                    group-hover:shadow-[0px_0px_0px_1px_rgb(150,150,150)] group-active:shadow-[0px_0px_0px_1px_rgb(240,240,240)]
                  '
                  rel='preload'
                />
                <span
                  className='group-hover:underline cursor-default
                  m1_4:text-[10px]
                '>
                  {row[columns.name]}
                </span>
                <div
                  className='m1_4:w-[4.4vw] m1_4:h-[4.4vw] flex justify-center items-center rounded-md cursor-pointer group relative bg-[#23232347] w-[32px] h-[32px]
                  group-hover:shadow-[0px_0px_0px_1px_rgb(150,150,150)] active:shadow-[0px_0px_0px_1px_rgb(240,240,240)]
                  text-[#a1a1a1] hover:text-[#e7e7e7]
                '
                  onClick={() => {
                    router.push(`/profile/${row[columns.uid]}`);
                  }}>
                  <OpenInNew className='scale-[0.5] m1_4:scale-[0.5]' />
                </div>
              </div>,
              // Score
              <div className='flex justify-center items-center w-full'>
                <span
                  className='text-[#d7d7d7] text-[14px] font-bold hover:underline cursor-pointer
                  m1_4:text-[10px]
                '>
                  {lb_name.includes("|")
                    ? parseInt(row[columns.score])
                    : (parseInt(row[columns.score]) / 1000).toFixed(2)}
                </span>
              </div>,
              // Tier
              <div className='flex w-full justify-center items-center border-l-[1px] border-[#d7d7d753]'>
                <div
                  className='text-center font-black text-[22px] flex justify-center items-center w-[40px]
                  m1_4:text-[14px] m1_4:w-[6vw] 
                '>
                  <span
                    className='hover:underline cursor-pointer'
                    style={{
                      color: letter_rank_obj.color,
                    }}>
                    {letter_rank_obj.name}
                  </span>
                </div>
                <div className='flex h-full items-center justify-center'>
                  <span
                    className='text-[14px] text-[#c7c7c7ac] font-bold h-fit w-[80px] hover:underline cursor-pointer
                    m1_4:text-[10px] m1_4:w-[12vw]
                  '>
                    ({percent}%)
                  </span>
                </div>
              </div>,
            ];

            // if (idx == 0) console.log(hoverCell, hoverRow);

            return (
              <>
                <div
                  key={idx}
                  className={`w-fit gap-x-3 px-[10px] grid grid-cols-[103px,150px,371px,150px,150px]
                   m1_4:gap-x-[0.2vw] m1_4:px-[0.2vw]  m1_4:grid-cols-[12vw,12vw,32vw,12vw,22vw]    
                  ${
                    hoverRow ? "bg-[#6861a9c9] underline" : ""
                  } hover:bg-[#4f4ea3] active:bg-[#e7f7e72b0] 
                   border-[#d7d7d733] 
                  ${idx === 0 ? "border-t-0" : "border-t-[1px]"}
                  ${idx === data.length - 1 ? "border-b-0" : ""} 
                `}
                  onClick={(e) => {
                    if (e.button === 0) {
                      setSelRows((prev) => {
                        const newSelRows = [...prev];
                        newSelRows[idx] = !newSelRows[idx];
                        return newSelRows;
                      });
                    }
                  }}>
                  {elements.map((element, i) => {
                    const cell_hover = hoverRow && hoverCell.col === i;
                    return (
                      <div
                        key={i}
                        className={`my-auto text-center hover:bg-[#1E1C65] transition-fast rounded-md h-[40px] flex justify-center items-center relative
                      ${
                        cell_hover ? "bg-[#ffffff20] shadow-[0px_0px_0px_1px_rgb(150,150,150)]" : ""
                      }
                      active:shadow-[0px_0px_0px_1px_rgb(240,240,240)] m1_4:h-[5.2vw]
                    `}
                        onClick={(e) => {
                          if (e.button === 0) {
                            setHoverCell({
                              row: idx,
                              col: i,
                            });
                          }
                        }}>
                        {element}
                      </div>
                    );
                  })}
                </div>
                <div
                  key={`relics-${idx}`}
                  className='relative w-full h-[200px] justify-center items-center bg-[#0000006c] rounded-b-md'
                  style={{
                    display: sel_rows[idx] ? "flex" : "none",
                  }}>
                  {relicData[idx] && relicData[idx].relics && (
                    <div
                      className='flex justify-center items-center w-[900px] h-full relative flex-wrap
                      m1_4:w-[90vw]
                    '>
                      {Object.keys(relicData[idx].relics).map((relicIdx) => {
                        const relic = relicData[idx].relics[relicIdx];
                        return (
                          <div
                            className='w-[210px] h-fit relative flex flex-col justify-center items-center
                            m1_4:w-[22vw]
                            '
                            key={relicIdx}>
                            <div className='w-full flex justify-center items-center gap-x-[6px] h-[13px]'>
                              <img
                                src={relic.icon}
                                alt={`Relic ${relicIdx}`}
                                className='w-[20px] aspect-square rounded-md'
                              />
                              <div
                                className='w-[120px] text-[13px] font-bold
                              m1_4:text-[8px] m1_4:w-[14vw]'>
                                {relic["main_affix"]["name"].length > 17
                                  ? relic["main_affix"]["name"].slice(0, 14) + "..."
                                  : relic["main_affix"]["name"]}
                              </div>
                              <div
                                className='w-fit text-[13px] font-bold
                              m1_4:text-[8px]'>
                                {relic["main_affix"]["DisplayValue"]}
                              </div>
                            </div>
                            <div className='w-full flex flex-col justify-center items-center gap-y-[2px] mt-[6px] '>
                              {relic.sub_affixes.map((sub_affix: any, subIdx: number) => (
                                <div
                                  className='w-full flex justify-center items-center text-[10px] font-light h-[15px] text-[#c7c7c7]
                                    m1_4:text-[8px] 
                                  '
                                  key={subIdx}>
                                  <div className='flex items-center gap-x-[4px] w-fit'>
                                    <img
                                      src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${sub_affix.icon}`}
                                      alt={`Sub Affix ${subIdx}`}
                                      className='w-[20px] aspect-square rounded-md invert-[0.2]'
                                    />
                                    <div
                                      className='w-[70px]
                                      m1_4:w-[14vw]
                                    '>
                                      {sub_affix.name}
                                    </div>
                                  </div>
                                  <div
                                    className='w-[50px] text-right
                                  m1_4:w-[5vw]'>
                                    {sub_affix.DisplayValue}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>

        <div className='flex justify-center text-lg font-extrabold gap-8  rounded-b-xl text-w1 items-center pt-2'>
          <div
            onClick={() => on_page_change(page > 1 ? page - 1 : 1)}
            className='cursor-pointer bg-[#720002c2] py-2 px-7 rounded-xl hover:bg-[#a20002c2] w-[130px] text-center transition-all active:shadow-[0px_0px_0px_1px_rgb(240,240,240)]'>
            Previous
          </div>
          <div className='w-[400px] text-center'>
            Page: {page} of {Math.ceil(db_size / pageSize)} | Total: {db_size}
          </div>
          <div
            onClick={() => on_page_change(page * pageSize < db_size ? page + 1 : page)}
            className='cursor-pointer bg-[#720002c2] py-2 px-7 rounded-xl hover:bg-[#a20002c2] w-[130px] text-center transition-all active:shadow-[0px_0px_0px_1px_rgb(240,240,240)]'>
            <span className='select-none'>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}
