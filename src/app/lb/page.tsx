"use client";

import Image from "next/image";

import Header from "../header";
import CharSel from "./char_sel";

import axios from "axios";

import { useState } from "react";

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

  const charList: { [key: string]: number } = {
    Seele: 1102,
    "Dan Heng • Imbibitor Lunae": 1213,
    "The Herta": 1401,
    Feixiao: 1220,
    Firefly: 1310,
    Aglaea: 1402,
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

      <div className="w-full flex justify-center flex-wrap font-extrabold text-4xl bg-[#1A1A1Ac9] relative z-20 mt-32 h-[100px]">
        <div className="pt-6 pb-1">
          <strong className="">SEELE</strong> LEADERBOARDS
        </div>
      </div>

      <div className="absolute -translate-y-16 z-30 mb-16">
        <CharSel
          onCharSelect={(char) => {
            console.log("Selected character", char);
            setLbName(char);
            get_lb(1, char);
          }}
          charList={charList}
        />
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

      <div className=" bg-[#353385c2] w-fit m-auto relative z-10 rounded-xl pb-4 mt-8">
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
            <div className="grid grid-cols-[224px,465px,228px,276px] ">
              <div className="text-center text-base font-extrabold pt-1 pb-1">
                #{idx + 1 + (page - 1) * pageSize}
              </div>
              <div className="text-center text-base font-medium pt-1 pb-1">
                {row[columns.name]}
              </div>
              <div className="text-center text-base font-extrabold pt-1 pb-1">
                {row[columns.score]}
              </div>
              <div className="text-center text-base font-bold pt-1 pb-1">
                {row[columns.character_name]}
              </div>
            </div>
          ))}
      </div>

      <div>
        <button onClick={() => on_page_change(page > 1 ? page - 1 : 1)}>
          Previous
        </button>
        <div>
          Page: {page} of {Math.ceil(db_size / pageSize)} | Total: {db_size}
        </div>
        <button
          onClick={() =>
            on_page_change((page + 1) * pageSize < db_size ? page + 1 : page)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
