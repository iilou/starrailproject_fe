"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "@mui/icons-material";

export default function Header({ current }: { current: string }) {
  const router = useRouter();
  return (
    <>
      <div className='fixed top-0 left-0 w-full h-[5vh] bg-[#0d0d0d] shadow-lg shadow-black block z-[1000]'>
        <div className='w-full h-[5vh] flex justify-between text-w1 px-16 font-bold gap-16 bg-[#1A1947] z-[1000]'>
          <div className='flex items-center gap-4 cursor-pointer' onClick={() => router.push("/")}>
            <Image
              src='/srp_logo.png'
              width={38}
              height={38}
              alt='Star Rail Rankings Logo'
              className='w-[4vh] aspect-square'
            />
            <div className='text-[1.8vh] w-fit text-center font-extrabold'>star.stylla.moe</div>
          </div>
          <div className='w-fit flex justify-between items-center m1_2:w-[200px] m1_2:flex-col m1_2:justify-start h-[5vh] group m1_2:items-end'>
            {
              <div className='hidden m1_2:block relative m1_2:h-[5vh] m1_2:w-[5vh] bg-[#1A1947] mr-5'>
                <div className='flex items-center justify-center w-[5vh] h-[5vh] bg-[#1A1947]'>
                  <Menu
                    className='text-[#e1e1e1] cursor-pointer h-[5vh] w-[5vh] '
                    style={{
                      fontSize: "4vh",
                      textShadow: "0 0 25px #000,0 0 25px #000",
                    }}
                  />
                </div>
              </div>
            }
            {[
              {
                name: "Index",
                link: "/i",
                color: "",
                description:
                  "View the descriptions and details of all characters, weapons, and relics.",
              },
              {
                name: "Tier List",
                link: "/tier",
                color: "text-t2",
                description: "Tier list of all characters, based on their performance in the game.",
              },
              // { name: "Leaderboard", link: "/lb", color: "text-t1" },
              // { name: "Profile", link: "/profile", color: "text-t3" },
              // { name: "Tier List", link: "/", color: "text-t2" },
              {
                name: "Leaderboard",
                link: "/lb",
                color: "text-t1",
                description:
                  "View the rankings of specific characters, based on relic quality, damage, and more.",
              },
              {
                name: "Profile",
                link: "/profile",
                color: "text-t3",
                description:
                  "View the details of a specific user's profile, including their characters, relics, and more.",
              },
            ].map((item) => (
              <div
                key={item.name}
                style={{
                  lineHeight: "5vh",
                  textShadow: "0 0 25px #000,0 0 25px #000",
                }}
                className={`w-[25vh] text-[1.7vh] text-center h-[5vh] font-bold text-[#e1e1e1] cursor-pointer ${
                  item.link == current ? "bg-[#0d0d0d]" : "bg-[#1A1947]"
                } transition-all duration-100 m1_2:hidden m1_2:group-hover:block`}
                onMouseEnter={(e) => {
                  if (item.link != current) {
                    e.currentTarget.style.backgroundColor = "#23234b";
                    // e.currentTarget.style.opacity = "0.8";
                    e.currentTarget.style.boxShadow = "0px 0px 3px 1px #d3d3d341";
                    e.currentTarget.style.fontWeight = "900";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.link != current) {
                    // e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.backgroundColor = "#1A1947";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.fontWeight = "700";
                    e.currentTarget.style.color = "#e1e1e1";
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = "0px 0px 0px 1px #ffffff inset";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow =
                    item.link == current ? "0px 0px 3px 1px #d3d3d341" : "none";
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (item.link !== current) {
                    router.push(item.link);
                    window.location.reload();
                  }
                }}>
                <span>{item.name}</span>
                {/* <div className='flex items-center justify-center'>
                  <div className='text-[20px] font-extrabold'>{item.name}</div>
                  <div className='text-[12px] font-normal text-[#e1e1e1] ml-2'>
                    {item.description}
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='h-[5vh]'></div>
    </>
  );
}
