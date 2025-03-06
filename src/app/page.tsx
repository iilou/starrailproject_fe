"use client";

import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

import Image from "next/image";

import Header from "./header";

export default function Home() {
  const [data, setData] = useState(null);
  const [score, setScore] = useState(Math.random() * 10000);

  const router = useRouter();

  const routes = [
    { href: "/", text: "Home", color: "text-w4" },
    { href: "/lb", text: "Leaderboard", color: "text-t1" },
    { href: "/tier", text: "Tier List", color: "text-t2" },
    { href: "/profile", text: "Load Profile", color: "text-t3" },
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
        "http://127.0.0.1:8000/add-score",
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
        setData(data);
        console.log("fetch", data);
        localStorage.setItem("data_" + uid, JSON.stringify(data));

        const username: string = data["player"]["nickname"];
        const score = Math.floor(Math.random() * 1000000);
        setScore(Math.floor(Math.random() * 1000000));

        if (username == null) {
          console.log("Username not found");
          return;
        }

        add_db(parseInt(uid), username, score);

        fetch(`http://127.0.0.1:8000/srd_alt/${uid}`).then((res) =>
          console.log("fetch alt", res)
        );
      });
  }

  function handleUidSearchDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      fetchData((e.target as HTMLInputElement).value);
    }
  }

  function handleUidSearchClick(e: React.MouseEvent<HTMLDivElement>) {
    if (document.getElementById("uid_input_field") == null) return;
    fetchData(
      (document.getElementById("uid_input_field") as HTMLInputElement).value
    );
  }

  return (
    <div className="w-full h-[100vh] text-c2">
      <Header current="/" />

      <Image
        src="/h/hsr_logo.png"
        width={900}
        height={350}
        alt="HSR Logo"
        className="block relative mx-auto"
      />

      <div className="rounded-lg mx-auto relative w-auto flex justify-center gap-2">
        <div
          className="text-c2 border-c2 border-[1px] rounded-lg px-4 py-2 relative block hover:bg-bk2 cursor-pointer"
          onMouseDown={handleUidSearchClick}
        >
          {">"}
        </div>
        <input
          type="text"
          placeholder="Enter UID"
          className=" rounded-lg bg-transparent border-c2 border-[1px] text-w5 w-fit relative block px-10 py-2 text-center text-base font-extrabold"
          onKeyDown={handleUidSearchDown}
        />
        <div className="text-c2 border-c2 border-[1px] rounded-lg px-4 py-2 relative block hover:bg-bk2 cursor-pointer">
          {">"}
        </div>
      </div>
      <div className="flex w-70vw mx-auto mt-20 justify-center">
        {routes.map((route) => (
          <button
            key={route.href}
            onClick={() => router.push(route.href)}
            className={`px-20 py-8 mx-4 my-2 bg-b1 rounded-lg font-medium text-2xl opacity-80 hover:opacity-70 transition-all ${route.color}`}
          >
            {route.text}
          </button>
        ))}
      </div>
    </div>
  );
}
