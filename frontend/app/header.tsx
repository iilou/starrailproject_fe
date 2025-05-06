"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header({ current }: { current: string }) {
  const router = useRouter();
  return (
    <>
      <div className='fixed top-0 left-0 w-full h-[52px] bg-[#0d0d0d] shadow-lg shadow-black block z-[1000]'>
        <div className='w-full h-[52px] flex justify-between items-center text-w1 px-16 py-3 font-bold gap-16 bg-[#1A1947] z-[1000]'>
          <div className='flex items-center gap-4 cursor-pointer' onClick={() => router.push("/")}>
            <Image src='/srp_logo.png' width={38} height={38} alt='Star Rail Rankings Logo' />
            <div className='text-[20px] w-fit text-center font-extrabold'>star.stylla.moe</div>
          </div>
          <div className='w-[700px] flex justify-between items-center '>
            {[
              { name: "Index", link: "/i", color: "" },
              { name: "Leaderboard", link: "/lb", color: "text-t1" },
              { name: "Profile", link: "/profile", color: "text-t3" },
              { name: "Tier List", link: "/", color: "text-t2" },
            ].map((item) => (
              <div
                key={item.name}
                style={{
                  lineHeight: "52px",
                  textShadow: "0 0 25px #000,0 0 25px #000",
                }}
                className={`w-[200px] text-center px-10 h-full font-bold text-[#e1e1e1] cursor-pointer ${
                  item.link == current ? "bg-[#0d0d0d]" : "bg-transparent"
                } transition-all duration-100`}
                onMouseEnter={(e) => {
                  if (item.link != current) {
                    e.currentTarget.style.backgroundColor = "#D3D3D322";
                    e.currentTarget.style.boxShadow = "0px 0px 3px 1px #d3d3d341";
                    e.currentTarget.style.fontWeight = "900";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.link != current) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.fontWeight = "700";
                    e.currentTarget.style.color = "#e1e1e1";
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = "0px 0px 0px 1px #ffffff inset";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = item.link == current ? "0px 0px 3px 1px #d3d3d341" : "none";
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (item.link !== current) {
                    router.push(item.link);
                    window.location.reload();
                  }
                }}>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className=' px-7 py-3 font-bold'>Log in</div>
        </div>
      </div>
      <div className='h-[52px]'></div>
    </>
  );
}
