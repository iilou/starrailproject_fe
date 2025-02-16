"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header({ current }: { current: string }) {
  const router = useRouter();
  return (
    <div className="w-full h-14 flex justify-center items-center text-w1 py-3 font-bold gap-16">
      <div className="flex items-center gap-4">
        <Image
          src="/srp_logo.png"
          width={50}
          height={50}
          alt="Star Rail Rankings Logo"
        />
        <div className="w-fit text-center font-extrabold">
          Star Rail Rankings
        </div>
      </div>
      <div className="flex items-center">
        {[
          { name: "Leaderboard", link: "/lb", color: "text-t1" },
          { name: "Tier List", link: "/tier", color: "text-t2" },
          { name: "Load Profile", link: "/profile", color: "text-t3" },
        ].map((item) => (
          <div
            key={item.name}
            style={{ lineHeight: "56px" }}
            className={`px-10 h-full font-bold ${
              item.color
            } hover:bg-bk1 cursor-pointer ${
              current === item.link ? "bg-bk1" : ""
            }`}
            onClick={() => router.push(item.link)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className=" px-7 py-3 font-bold">Log in</div>
    </div>
  );
}
