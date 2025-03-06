"use client";

import Image from "next/image";

import Header from "../header";
import CharSel from "./char_sel";

import axios from "axios";

import { useState } from "react";

import { ranks, get_rank_from_score } from "../ranks";

import { useRouter } from "next/navigation";

export default function Leaderboard() {
  const columns = {
    uid: 0,
    name: 1,
    character_name: 2,
    string1: 3,
    string2: 4,
    score: 5,
  };
  const [data, setData] = useState<Array<string[]>>([]);
  const [lb_name, setLbName] = useState("");
  const [page, setPage] = useState(1);
  const [db_size, setDbSize] = useState(0);
  const pageSize = 50;

  const router = useRouter();

  const charList: { [key: string]: number } = {
    Seele: 1102,
    "Dan Heng • Imbibitor Lunae": 1213,
    "The Herta": 1401,
    Feixiao: 1220,
    Firefly: 1310,
    Aglaea: 1402,
  };

  const defaultDbType = "Relic Score";
  const charDbTypes: {
    [key: string]: { name: string; id: number; lb_types: string[] };
  } = {
    Seele: {
      name: "Seele",
      id: 1102,
      lb_types: ["", "", ""],
    },
    "Dan Heng • Imbibitor Lunae": {
      name: "Dan Heng • Imbibitor Lunae",
      id: 1213,
      lb_types: [""],
    },
    "The Herta": {
      name: "The Herta",
      id: 1401,
      lb_types: [""],
    },
    Feixiao: {
      name: "Feixiao",
      id: 1220,
      lb_types: [""],
    },
    Firefly: {
      name: "Firefly",
      id: 1310,
      lb_types: [""],
    },
    Aglaea: {
      name: "Aglaea",
      id: 1402,
      lb_types: [""],
    },
  };

  const charElement: { [key: string]: string } = {
    Seele: "Quantum",
    "Dan Heng • Imbibitor Lunae": "Imaginary",
    "The Herta": "Ice",
    Feixiao: "Wind",
    Firefly: "Fire",
    Aglaea: "Lightning",
  };

  const elementColor: { [key: string]: string } = {
    Quantum: "#1C29BA",
    Imaginary: "#F4D258",
    Ice: "#47C7FD",
    Wind: "#00FF9C",
    Fire: "#F84F36",
    Lightning: "#8872F1",
    Physical: "#F84F36",
  };

  const get_lb = async (pageForce: number = -1, lb_override: string = "") => {
    if (lb_name === "" && lb_override === "") {
      console.log("Invalid leaderboard name", lb_name);
      return;
    }

    try {
      fetch(
        `http://127.0.0.1:8000/get_lb_count/${
          lb_override === "" ? lb_name : lb_override
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setDbSize(data[0][0]);

          try {
            fetch(
              `http://127.0.0.1:8000/get_lb/${
                lb_override === "" ? lb_name : lb_override
              }/${pageForce === -1 ? page : pageForce}/${pageSize}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
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

  const on_lb_select = () => {
    get_lb(1);
  };

  const on_page_change = async (newPage: number) => {
    console.log("Page change", newPage);
    setPage((prev) => newPage);
    get_lb(newPage);
  };

  return (
    <div>
      <Header current="lb" />

      <div className="z-30 my-10 relaitve block mx-auto">
        <CharSel
          onCharSelect={(char) => {
            console.log("Selected character", char);
            setLbName(char);
            get_lb(1, char);
          }}
          charList={charList}
        />
      </div>

      <div className="w-full flex justify-center flex-wrap font-extrabold text-4xl bg-[#1A1A1Ac9] relative z-20 mt-12 h-[114px]">
        <div className="pt-6 pb-2">
          <strong
            style={{
              color:
                lb_name in charElement
                  ? elementColor[charElement[lb_name]]
                  : "",
            }}
          >
            {lb_name.toUpperCase()}
          </strong>{" "}
          LEADERBOARDS
        </div>
        <div className="flex justify-center w-full text-w1 font-extrabold text-base">
          {lb_name in charDbTypes &&
            charDbTypes[lb_name].lb_types.map((lb_type) => (
              <div
                className="cursor-pointer bg-[#323232c2] py-2 px-14 hover:bg-[#525252c2] transition-all"
                onClick={() => {
                  get_lb(1, `${lb_name}${lb_type}`);
                }}
              >
                {lb_type === ""
                  ? defaultDbType.toUpperCase()
                  : lb_type.toUpperCase()}
              </div>
            ))}
        </div>
      </div>

      <div className="absolute w-full z-0">
        {
          <Image
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/image/character_portrait/${
              charList[lb_name as keyof typeof charList] || 1102
            }.png`}
            width={724}
            height={724}
            alt="Character Portrait"
            className="-translate-y-64 m-auto"
            rel="preload"
          />
        }
      </div>

      <div className=" bg-[#353385b2] w-fit m-auto relative z-10 rounded-xl pb-4 mt-8">
        <div className="grid grid-cols-[224px,465px,228px,276px] mb-3">
          {["Rank", "Name", "Character", "Score"].map((col, i) => (
            <div
              className={`text-center text-lg font-extrabold pt-4 pb-2 bg-[#020071c2]  ${
                i == 0 ? "rounded-tl-xl" : i == 3 ? "rounded-tr-xl" : ""
              }`}
              key={col}
            >
              {col}
            </div>
          ))}
        </div>
        {data &&
          data.map((row, idx) => (
            <div
              className="grid grid-cols-[224px,465px,228px,276px] hover:bg-[#1A1A1Ac9] transition-all active:bg-[#020071c2]"
              onMouseDown={(e) => {
                router.push(`/profile?uid=${row[columns.uid]}`);
              }}
            >
              <div className="text-center text-base font-extrabold pt-1 pb-1">
                #{idx + 1 + (page - 1) * pageSize}
              </div>
              <div className="text-center text-base font-medium pt-1 pb-1">
                {row[columns.name]}
              </div>
              <div className="text-center text-base font-extrabold pt-1 pb-1">
                {(parseInt(row[columns.score]) / 1000).toFixed(3)}
              </div>
              <div className="text-center text-base font-bold pt-1 pb-1">
                {[
                  get_rank_from_score(parseInt(row[columns.score]) / 1000, 70),
                ].map((rank) => (
                  <div
                    style={{
                      color: rank.color,
                    }}
                  >
                    {rank.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        <div className="flex justify-center text-lg font-extrabold gap-8  rounded-b-xl text-w1 items-center pt-2">
          <div
            onClick={() => on_page_change(page > 1 ? page - 1 : 1)}
            className="cursor-pointer bg-[#720002c2] py-3 px-7 rounded-xl hover:bg-[#a20002c2] transition-all"
          >
            Previous
          </div>
          <div className="">
            Page: {page} of {Math.ceil(db_size / pageSize)} | Total: {db_size}
          </div>
          <div
            onClick={() =>
              on_page_change((page + 1) * pageSize < db_size ? page + 1 : page)
            }
            className="cursor-pointer bg-[#720002c2] py-3 px-7 rounded-xl hover:bg-[#a20002c2] transition-all"
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}
