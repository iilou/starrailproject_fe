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
import { charSetIndex } from "../../lib/score";

import { useRouter, useParams } from "next/navigation";
import { decode } from "punycode";

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
  const [page, setPage] = useState(1);
  const [db_size, setDbSize] = useState(0);
  const [hoverCell, setHoverCell] = useState({ row: -1, col: -1 });
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

  const getRankFromScoreWithSet = (lb_name: string) => {
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

    return bestRelicSetScore + highestPlanarSetScore;
    // return get_rank_from_score( score / 1000 + bestRelicSetScore + highestPlanarSetScore, max);
  };

  // const lb_name = searchParams.get("char") || "The Herta";
  const [lb_name, set_lb_name] = useState("The Herta");
  const lb_relicSetMaxScore = getRankFromScoreWithSet(lb_name);

  // const { lb_name: lb_name_param } = useParams() as { lb_name: string };
  const { lb_name: lb_name_param } = useParams() as { lb_name: string };
  useEffect(() => {
    // if (lb_name_param && lb_name_param !== lb_name && lb_name_param !== "") {
    if (Array.isArray(lb_name_param)) {
      set_lb_name(decodeURIComponent(lb_name_param[0]));
      // set_lb_name(lb_name_param[0].replace(/%20/g, " "));
    } else if (lb_name_param && lb_name_param !== lb_name && lb_name_param !== "") {
      // set_lb_name(lb_name_param.replace(/%20/g, " "));
      set_lb_name(decodeURIComponent(lb_name_param));
    }

    console.log("lb_name", lb_name_param, lb_name);
  }, [lb_name_param]);

  // useEffect(() => {
  //   // const searchParams = useSearchParams();
  //   const char = searchParams.get("char");
  //   if (char) {
  //     set_lb_name(char);
  //   }
  // }, [searchParams]);

  // const [lb_name, set_lb_name] = useState(searchParams.get("char") || "The Herta");
  // const [lb_name, set_lb_name] = useState("The Herta");
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

  const get_lb = async (pageForce: number = -1, lb_override: string = "") => {
    if (lb_name === "" && lb_override === "") {
      console.log("Invalid leaderboard name", lb_name);
      return;
    }

    console.log("lookup", lb_name, lb_override, pageForce, pageSize);

    try {
      // fetch(`http://127.0.0.1:8000/get_lb_count/${lb_override === "" ? lb_name : lb_override}`)
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
                setData(data);
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

  useEffect(() => {
    get_lb(1);
    console.log("lb_name", lb_name);
  }, [lb_name]);

  const on_lb_select = () => {
    get_lb(1);
  };

  const on_page_change = async (newPage: number) => {
    setPage((prev) => newPage);
    get_lb(newPage);
  };

  const color_find = (row: number, col: number, val: string = "") => {
    var color = "#e7e7e7";
    var weight = "400";

    if (col === 0) {
      color = "#a7a7a7";
      if ((page - 1) * pageSize + row < 3) {
        if (row === 0) {
          color = "#E3FF36";
        } else if (row === 1) {
          color = "#B7B7B7";
        } else if (row === 2) {
          color = "#978045";
        }
      }
      weight = (page - 1) * pageSize + row < 3 ? "900" : "300";
    } else if (col === 1) {
      weight = "600";
      switch (data[row][columns.uid].toString().charAt(0)) {
        case "1": //china
          color = "#DD7F7F";
          break;
        case "6": // na
          color = "#CDD28A";
          break;
      }
    } else if (col === 3) {
      // const rank = get_rank_from_score(parseInt(row[columns.score]) / 1000, 70);
      const maxScore = 70000;
      const min = [104, 63, 80];
      const max = [122, 55, 62];
      const minCutoff = 68000;

      color =
        parseInt(data[row][columns.score]) > minCutoff
          ? parseInt(data[row][columns.score]) > maxScore
            ? `hsl(${max[0]}, ${max[1]}%, ${max[2]}%)`
            : `hsl(
        ${
          ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
            (max[0] - min[0]) +
          min[0]
        }, 
        ${
          ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
            (max[1] - min[1]) +
          min[1]
        }%, 
        ${
          ((parseInt(data[row][columns.score]) - minCutoff) / (maxScore - minCutoff)) *
            (max[2] - min[2]) +
          min[2]
        }%)`
          : `hsl(${min[0]}, ${min[1]}%, ${min[2]}%)`;

      weight = "900";
    }

    return { color: color, weight: weight };
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

      <div className='relative z-[10] h-[300px] w-full bg-[#0000002c] flex items-end pb-[20px]'>
        <div className='absolute w-full z-[12]'>
          {
            <Image
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/image/character_portrait/${
                charList[lb_name as keyof typeof charList] || 1102
              }.png`}
              width={724}
              height={724}
              alt='Character Portrait'
              className='translate-y-[400px] m1_4:translate-y-[190px] m-auto'
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
              color: lb_name in charElement ? elementColor[charElement[lb_name]] : "",
              textShadow: lb_name in charElement ? `0 0 2px #111111, 0 0 0px #787878` : "",
            }}>
            {lb_name.toUpperCase()}
          </strong>{" "}
          LEADERBOARDS
        </div>
        <div className='flex justify-center w-full text-w1 font-extrabold  bg-[#00000092]'>
          {lb_name in charDbTypes &&
            charDbTypes[lb_name].lb_types.map((lb_type, index) => (
              <div
                className='cursor-pointer bg-[#323232c2] py-2 px-14 hover:bg-[#525252c2] transition-fast text-base
                  m1_4:text-[11px] m1_4:py-[1px] m1_4:px-[32px]
                '
                onClick={() => {
                  get_lb(1, `${lb_name}${lb_type}`);
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
        <CharSel charList={charList} currentChar={lb_name} router={router} />
      </div>

      <div className='w-[97vw] m-auto relative z-2 rounded-xl pb-4 opacity-[90%] overflow-x-auto z-[40]'>
        <div
          className='grid grid-cols-[103px,210px,371px,232px,119px] gap-x-3 bg-[#020071c2] px-[40px] rounded-md py-[2px] shadow-md shadow-[#000000d2] z-[100] relative w-fit text-[16px] mx-auto
                  m1_4:grid-cols-[12vw,20vw,32vw,20vw,12vw] m1_4:gap-x-[0.2vw] m1_4:px-[0.2vw] m1_4:text-[2.3vw] 
          '
          // style={{ width: 103 + 210 + 371 + 232 + 119 + 12 * 9 + "px" } /* 12px for gap */}
        >
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
          className='flex flex-col scrollbar-thin scrollbar-thumb-[#1E1C65] scrollbar-track-[#020071c2] scrollbar-thumb-rounded-full scrollbar-track-rounded-full z-[99] relative w-fit bg-[#3d3a8c77] rounded-md mx-auto
          '
          // style={{ width: 103 + 210 + 371 + 232 + 119 + 12 * 9 + "px" } /* 12px for gap */}
        >
          <div className='h-5 w-1 text-[#00000000]'>A</div>

          {data &&
            data.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-[103px,210px,371px,232px,119px] text-[16px] gap-x-3 hover:bg-[#4f4ea3] active:bg-[#ewf7e72b0]  border-[#d7d7d733] 
                  ${
                    hoverCell.row === idx ? "bg-[#6861a9c9] underline" : ""
                  } hover:underline  px-[40px] ${idx === 0 ? "border-t-0" : "border-t-[1px]"} ${
                  idx === data.length - 1 ? "border-b-0" : ""
                }

                  m1_4:grid-cols-[12vw,20vw,32vw,20vw,12vw] m1_4:gap-x-[0.2vw] m1_4:px-[0.2vw] m1_4:text-[2.3vw] 
                `}>
                {[
                  { text: `#${idx + 1 + (page - 1) * pageSize}`, fontWeight: "400" },
                  {
                    text: (
                      <div className='flex px-3 justify-around items-center'>
                        <span className='text-left font-bold m1_4:hidden'>
                          {regionIds["" + row[columns.uid].toString().charAt(0)]}
                        </span>
                        <span className='text-[#d7d7d7] text-right font-normal'>
                          {" "}
                          {row[columns.uid]}
                        </span>
                      </div>
                    ),
                    fontWeight: "400",
                  },
                  { text: row[columns.name], fontWeight: "400" },
                  { text: row[columns.score], fontWeight: "400" },
                ].map((col, i) => (
                  <div
                    className={` my-auto text-center py-2 hover:bg-[#1E1C65] transition-fast rounded-md active:shadow-[0px_0px_0px_1px_rgb(240,240,240)]  ${
                      hoverCell.row === idx && hoverCell.col === i
                        ? "bg-[#ffffff20] shadow-[0px_0px_0px_1px_rgb(150,150,150)]"
                        : ""
                    }
                      m1_4:py-[0.5vw]    
                    `}
                    key={i}
                    style={{
                      color: color_find(idx, i).color,
                      fontWeight: color_find(idx, i).weight,
                    }}
                    onClick={(e) => {
                      if (e.button === 0) {
                        if (hoverCell.row === idx && hoverCell.col === i) {
                          // router.push(`/profile?uid=${row[columns.uid]}`);
                          router.push(`/profile/${row[columns.uid]}`);
                        }
                        setHoverCell({
                          row: idx,
                          col: i,
                        });
                      }
                    }}>
                    <span
                      className='cursor-pointer'
                      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if (e.button === 0) {
                          // router.push(`/profile?uid=${row[columns.uid]}`);
                          router.push(`/profile/${row[columns.uid]}`);
                        }
                      }}>
                      {col.text}
                    </span>
                  </div>
                ))}
                <div
                  className={`text-center font-black py-[2px] hover:bg-[#1E1C65] transition-fast rounded-md text-[22px] h-full leading-[150%] ${
                    hoverCell.row === idx && hoverCell.col === 4 ? "bg-[#ffffff20]" : ""
                  }
                    m1_4:text-[2.4vw] 
                  `}
                  onClick={(e) => {
                    if (e.button === 0) {
                      if (hoverCell.row === idx && hoverCell.col === 4) {
                        // router.push(`/profile?uid=${row[columns.uid]}`);
                        router.push(`/profile/${row[columns.uid]}`);
                      }
                      setHoverCell({
                        row: idx,
                        col: 4,
                      });
                    }
                  }}>
                  <span className='cursor-pointer'>
                    {[
                      get_rank_from_score(
                        parseInt(row[columns.score]) / 1000,
                        70 + lb_relicSetMaxScore
                      ),
                    ].map((rank, i) => (
                      <div
                        style={{
                          color: rank.color,
                        }}
                        key={i}>
                        {rank.name}
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            ))}
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
