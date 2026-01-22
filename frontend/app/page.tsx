"use client";

import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

import Image from "next/image";

import Header from "./header";
import BG from "./bg";

import { filterElementColor } from "./lib/color";

import routes from "./lib/routes.json";
import ImageAnim from "./ImageAnim";

export default function Home() {
  const router = useRouter();

  function handleUidSearchDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      // fetchData((e.target as HTMLInputElement).value);
      router.push(`/profile/${(e.target as HTMLInputElement).value}`);
    }
  }

  function handleUidSearchClick(e: React.MouseEvent<HTMLDivElement>) {
    if (document.getElementById("uid_input_field") == null) return;

    router.push(
      `/profile/${(document.getElementById("uid_input_field") as HTMLInputElement).value}`,
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
        <input
          type='text'
          placeholder='Enter UID (e.x. 600505603)'
          className=' rounded-lg bg-transparent border-c2 border-[1px] text-w1 w-fit relative block px-10 py-2 text-center text-base font-extrabold'
          onKeyDown={handleUidSearchDown}
        />
        <div
          className='text-c2 border-c2 border-[1px] rounded-lg px-4 py-2 relative block hover:bg-bk2 cursor-pointer'
          onClick={handleUidSearchClick}>
          {">"}
        </div>
      </div>

      <div className='mx-auto w-[80vw] m1_4:w-[95vw] rounded-md mt-40 relative'>
        <div className='text-xl font-bold text-center pt-6 pb-2 bg-[#020071c2]'>Features</div>
        <div className='px-10 grid grid-cols-2 m1_4:grid-cols-1 gap-4 pt-8 pb-8 bg-[#3d3a8c77] '>
          {Object.keys(routes).map((key) => {
            const route = (routes as any)[key];
            return (
              <div
                key={route.href}
                className={`px-20 py-8 rounded-lg font-medium bg-neutral-700/20 relative hover:bg-[#1E1C65] m1_4:px-[1vw]
            `}>
                <div className='flex flex-col items-center justify-start'>
                  <div
                    className='text-lg font-black leading-[1rem]'
                    onClick={() => router.push(route.href)}>
                    {route.text.toUpperCase()}
                  </div>
                  <div className='text-sm font-normal text-[#787878]'>{route.href}</div>
                  <div className='w-full px-3 pt-2 pb-7'>
                    <ImageAnim base={`/c${route.href}`} n={route.img_n} />
                  </div>
                  <div
                    className='text-sm text-center text-[#787878] mt-2 leading-[1rem] font-normal 
                  '>
                    {route.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className='mx-auto w-fit relative mt-40 bg-[#1A1947] hover:bg-[#23234b] rounded-sm'>
        <div className='w-fit px-20 py-2 rounded-sm text-xl font-bold text-center text-c2'>
          Features
        </div>
      </div>
      <div
        className='w-[80vw] mx-auto mt-10 justify-center grid grid-cols-2 m1_4:grid-cols-1
        m1_4:w-[98vw]
      '>
        {Object.keys(routes).map((key) => {
          const route = (routes as any)[key];
          return (
            <button
              key={route.href}
              onClick={() => router.push(route.href)}
              className={`px-20 py-8 mx-4 my-2 rounded-lg font-medium text-2xl bg-neutral-700/60 relative z-[10000] opacity-[1] shadow-[0_0_0_1px_#d1d1d1] hover:shadow-[0_0_0_4px_#ffffff] transition-all duration-200 ease-in-out
            
              m1_4:px-[1vw]
            `}>
              <div className='flex flex-col items-center'>
                <div
                  className='text-3xl font-bold
                m1_4:text-[5vw] m1_4:leading-[5.2vw] text-[#]
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
          );
        })}
      </div> */}
    </div>
  );
}
