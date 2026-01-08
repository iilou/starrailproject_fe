"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "@mui/icons-material";
import HeaderLink from "./headerlink";
import { z } from "zod";

import routes from "./lib/routes.json";

const RouteSchema = z.object({
  href: z.string(),
  text: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
});
const RoutesSchema = z.record(z.string(), RouteSchema);
const parsedRoutes = RoutesSchema.parse(routes);

export default function Header({ current }: { current: string }) {
  const router = useRouter();
  return (
    <>
      <div className='fixed top-0 left-0 w-full h-12 bg-[#0d0d0d] shadow-lg shadow-black block z-[1000]'>
        <div className='w-full h-full flex justify-between text-w1 px-16 font-bold gap-16 bg-[#1A1947] z-[1000]'>
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => router.push("/")}>
            <Image
              src='/srp_logo.png'
              width={38}
              height={38}
              alt='Star Rail Rankings Logo'
              className='h-7 w-7 aspect-square'
            />
            <div className='text-sm w-fit text-center font-extrabold'>star.stylla.moe</div>
          </div>
          <div className='w-fit flex justify-between items-center m1_2:w-[200px] m1_2:flex-col m1_2:justify-start h-full group m1_2:items-end'>
            {
              <div className='hidden m1_2:block relative m1_2:h-full m1_2:w-9 bg-[#1A1947] mr-5'>
                <div className='flex items-center justify-center w-9 h-9 bg-[#1A1947]'>
                  <Menu
                    className='text-[#e1e1e1] cursor-pointer h-9 w-9'
                    style={{
                      fontSize: "29px",
                      textShadow: "0 0 25px #000,0 0 25px #000",
                    }}
                  />
                </div>
              </div>
            }
            {Object.entries(parsedRoutes).map(([key, route]) => {
              return (
                <HeaderLink
                  key={key}
                  href={route.href}
                  name={route.text}
                  isCurrentPage={route.href === current}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className='h-9'></div>
    </>
  );
}
