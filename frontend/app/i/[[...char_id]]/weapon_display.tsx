import Image from "next/image";
import { get_icon_url_path, get_icon_url_weapon } from "./lib";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function WeaponDisplay({
  item,
  showPassive,
}: // fetchWeaponDesc,
{
  item: any;
  showPassive: boolean;
  // fetchWeaponDesc: any;
}) {
  const rarityGradient =
    item["Rarity"] === 5
      ? "linear-gradient(180deg,#885550,#c9a36a 53%)"
      : item["Rarity"] === 4
      ? "linear-gradient(180deg,#343659,#8a5fcc 53%)"
      : "linear-gradient(180deg,#343659,#4172b9 53%)";
  const rarityColor =
    item["Rarity"] === 5 ? "#c9a36a" : item["Rarity"] === 4 ? "#8a5fcc" : "#4172b9";

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [desc, setDesc] = useState<any>(null);
  const fetchWeaponDesc = async (id: string) => {
    const res = await fetch("/api/weapon?id=" + id);
    const data = await res.json();

    if (!data.error) {
      const weapon = data;
      var passive = {};
      if ("Live" in weapon) {
        passive = weapon.Live;
      } else if ("pre" in weapon) {
        passive = weapon.pre;
      } else if ("Pre" in weapon) {
        passive = weapon.Pre;
      } else {
        var max = 0;
        for (const key in weapon) {
          if (key.startsWith("v")) {
            const version = parseInt(key.substring(1));
            if (version > max) {
              max = version;
            }
          }
        }
        passive = weapon["v" + max];
      }

      if ("Desc" in passive) {
        if (Array.isArray(passive["Desc"])) {
          passive["Desc"] = passive["Desc"].map(
            (desc: string) => desc.replace(/<[^>]+>/g, "").split("Hidden Stat")[0]
          );
        }
      }

      // if not empty
      if (Object.keys(passive).length > 0) {
        setDesc(() => {
          return passive;
        });
      }
    }
  };

  const [forceDescShow, setForceDescShow] = useState(false);
  const handleClick = () => {
    setForceDescShow((prev) => !prev);
  };

  useEffect(() => {
    if (forceDescShow && !desc && inView && item["_id"]) {
      fetchWeaponDesc(item["_id"]);
    }
  }, [forceDescShow]);

  useEffect(() => {
    if (showPassive && !desc && inView && item["_id"]) {
      fetchWeaponDesc(item["_id"]);
    }
  }, [showPassive]);

  useEffect(() => {
    if (inView && !desc && (showPassive || forceDescShow) && item["_id"]) {
      fetchWeaponDesc(item["_id"]);
    }
  }, [inView, item]);

  return (
    <div
      className=' mx-1 my-1 bg-[#3d3b8a] rounded-lg py-2 w-[320px] h-fit shadow-[0_0_0_0_#ffffff00] text-white text-sm group hover:cursor-pointer hover:shadow-[0_0_0_1px_#ffffff]'
      onClick={handleClick}
      ref={ref}>
      <div
        className='w-full flex items-start py-3 justify-center h-[120px]'
        style={{
          boxShadow: `0px 5px 1px -4px #020071c2 inset, 0 -5px 1px -4px #020071c2 inset`,
          backgroundImage: `url(${get_icon_url_path(item["Path"])})`,
          backgroundSize: "70px 70px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "95% 50%",
        }}>
        <div
          className='w-[90px] h-[90px] mb-0 flex justify-center items-center rounded-md'
          style={{
            backgroundImage: rarityGradient,
          }}>
          <img
            src={get_icon_url_weapon("" + item["_id"])}
            width={128}
            height={128}
            alt={item["Name"]}
            className='scale-[1.1] group-hover:scale-[1.3] relative z-[100] w-[128px] transition-all duration-300  drop-shadow-[5px_5px_0px_#000000a7] '
          />
        </div>
        <div className='flex flex-col items-start justify-start w-[180px] ml-6 h-fit'>
          <div
            className='font-bold text-[16px] leading-[18px] relative z-[101] mb-1 group-hover:text-[16px] group-hover:font-extrabold text-[#dadada]'
            style={
              {
                // textShadow: `1px 0 0px #000, -1px 0 0px #000, 0 1px 0px #000, 0 -1px 0px #000`,
                // color: `${rarityColor}`,
              }
            }>
            {item["DisplayName"]}
          </div>
          <div className='text-xs text-[#787878] font-bold leading-[14px] mb-1'>{item["_id"]}</div>
          {Object.keys(item["Stats"]).map((key: string, idx: number) => {
            return (
              <div key={idx} className='flex'>
                <div className='text-[12px] text-[#b2b2b2] font-bold leading-[14px] w-[40px]'>
                  {key}
                </div>
                <div className='text-[12px] text-[#b2b2b2] font-bold leading-[14px]'>
                  {item["Stats"][key]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* {item["Passive"] && showPassive && ( */}
      {desc && (showPassive || forceDescShow) && (
        <div className='w-full px-3 text-[10px] text-[#dadada] py-3'>
          <div className='font-extrabold text-[13px] text-left text-[#f4e135]'>
            {/* {item["Passive"]["Name"]} */}
            {desc["Name"]}
          </div>
          <div className='text-[11px] leading-[13px] font-medium text-left text-[#c2c2c2]'>
            {/* {item["Passive"]["Desc"]} */}
            {desc["Desc"] &&
              desc["Desc"].map((desc: string, idx: number) => {
                return (
                  <div key={idx} className='mt-1'>
                    <div
                      className='text-[11px] leading-[13px] font-medium text-left text-[#c2c2c2]'
                      dangerouslySetInnerHTML={{ __html: desc }}></div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
