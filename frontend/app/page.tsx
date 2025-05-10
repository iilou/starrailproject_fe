"use client";

import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

import Image from "next/image";

import Header from "./header";
import BG from "./bg";

import { filterElementColor } from "./lib/color";

export default function Home() {
  const router = useRouter();

  const routes = [
    {
      href: "/i",
      text: "Index",
      color: "text-w1",
      description: "View the descriptions and details of all characters, weapons, and relics.",
    },
    {
      href: "/lb",
      text: "Leaderboard",
      color: "text-t1",

      description:
        "View the rankings of specific characters, based on relic quality, damage, and more.",
    },
    {
      href: "/tier",
      text: "Tier List",
      color: "text-t2",
      description: "Tier list of all characters, based on their performance in the game.",
    },
    {
      href: "/profile",
      text: "Load Profile",
      color: "text-t3",
      description:
        "View the details of a specific user's profile, including their characters, relics, and more.",
    },
  ];

  async function add_db(uid: number, username: string, score: number) {
    const data = {
      player_id: uid,
      username: username,
      score: score,
    };
    console.log(data);
    try {
      const res = await axios.post(
        // "http://127.0.0.1:8000/add-score",
        `${process.env.NEXT_PUBLIC_API_URL}/add-score`,
        {
          player_id: uid,
          username: username,
          score: score,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      if (res.status >= 200 && res.status < 300) {
        router.push(`/profile?uid=${uid}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch data from the API
  function fetchData(uid: string) {
    // uid must be int exactly 9 digits long
    if (!/^\d{9}$/.test(uid)) {
      console.log("Invalid UID", uid);
      return;
    }
    fetch(`http://127.0.0.1:8000/srd/${uid}`)
      .then((res) => res.json())
      .then((data) => {
        filterElementColor(data);

        console.log("fetch", data);
        localStorage.setItem("data_" + uid, JSON.stringify(data));

        const username: string = data["player"]["nickname"];

        if (username == null) {
          console.log("Username not found");
          return;
        }

        // window.location = `/#/profile?uid=${uid}`;
        router.push(`/profile?uid=${uid}`);
        window.location.reload();
      });
  }

  function handleUidSearchDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      // fetchData((e.target as HTMLInputElement).value);
      router.push(`/profile/${(e.target as HTMLInputElement).value}`);
    }
  }

  function handleUidSearchClick(e: React.MouseEvent<HTMLDivElement>) {
    if (document.getElementById("uid_input_field") == null) return;
    // fetchData((document.getElementById("uid_input_field") as HTMLInputElement).value);
    router.push(
      `/profile/${(document.getElementById("uid_input_field") as HTMLInputElement).value}`
    );
  }

  return (
    <div className='w-full h-[100vh] text-c2 '>
      <div className='absolute w-full h-[100vh] z-0'>
        <BG />
      </div>
      <Header current='/' />

      <div className='w-full h-[110px]'></div>

      <Image
        src='/h/hsr_logo.png'
        width={800}
        height={350}
        alt='HSR Logo'
        className='block relative mx-auto'
      />

      <div className='rounded-lg mx-auto relative w-auto flex justify-center gap-2'>
        <div
          className='text-c2 border-c2 border-[1px] rounded-lg px-4 py-2 relative block hover:bg-bk2 cursor-pointer'
          onMouseDown={handleUidSearchClick}>
          {">"}
        </div>
        <input
          type='text'
          placeholder='Enter UID'
          className=' rounded-lg bg-transparent border-c2 border-[1px] text-w1 w-fit relative block px-10 py-2 text-center text-base font-extrabold'
          onKeyDown={handleUidSearchDown}
        />
        <div className='text-c2 border-c2 border-[1px] rounded-lg px-4 py-2 relative block hover:bg-bk2 cursor-pointer'>
          {">"}
        </div>
      </div>
      <div
        className='flex w-[80vw] flex-col mx-auto mt-10 justify-center
        m1_4:w-[98vw]
      '>
        {routes.map((route) => (
          <button
            key={route.href}
            onClick={() => router.push(route.href)}
            className={`px-20 py-8 mx-4 my-2 rounded-lg font-medium text-2xl ${route.color} bg-[#1111113f] relative z-[10000] opacity-[1] shadow-[0_0_0_1px_#d1d1d1] hover:shadow-[0_0_0_4px_#ffffff] transition-all duration-200 ease-in-out
            
              m1_4:px-[1vw]
            `}>
            {/* {route.text} */}
            <div className='flex flex-col items-center'>
              <div
                className='text-3xl font-bold
                m1_4:text-[5vw] m1_4:leading-[5.2vw] 
              '>
                {route.text}
              </div>
              <div
                className='text-[18px] opacity-70 text-center text-[#c2c2c2] mt-2 leading-[21px]
                m1_4:text-[3.1vw] m1_4:leading-[4vw] 
              '>
                {route.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
