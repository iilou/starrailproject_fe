import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useEffect } from "react";

// param function on handling character selection
export default function CharSel({
  charList,
  currentChar,
  router,
}: {
  charList: { [key: string]: number };
  currentChar: string;
  router: any;
}) {
  const [isFocus, setIsFocus] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [filter, setFilter] = useState("");
  const [filteredList, setFilteredList] = useState(charList);

  const selChar = (char: string) => {
    // router.push(`/lb?char=${char}`);
    router.push(`/lb/${char}`);
    setIsFocus(() => false);
    setIsHover(() => false);
  };

  useEffect(() => {
    // filter out the current character from the list
    const newList = Object.keys(charList).reduce((acc: { [key: string]: number }, key) => {
      if (key !== currentChar) {
        acc[key] = charList[key];
      }
      return acc;
    }, {});

    // const newList = charList;
    // delete newList[currentChar];
    setFilteredList(newList);
  }, [charList, currentChar]);

  return (
    <div
      className='group flex flex-col  w-fit relative z-[50] mx-auto pl-[18px]'
      onMouseEnter={() => {
        setIsHover(() => true);
      }}
      onMouseLeave={() => {
        setIsHover(() => false);
      }}>
      <div className='text-2xl text-center flex items-center relative z-[101]'>
        <div
          className='w-12 relative z-[101]
          m1_4:w-[32px] aspect-square
        '>
          <Image
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/character/${charList[currentChar]}.png`}
            width={128}
            height={175}
            alt='Character Portrait'
            className='rounded-full shadow-[0px_0px_0px_5px_rgb(212,201,255)] bg-b0 hover:border-4 hover:border-b6 transition-all active:scale-95'
            rel='preload'
          />
        </div>
        <div
          className='text-lg font-bold h-fit w-[284px] py-1 pr-[44px] pl-[42px] bg-b6 rounded-[10px] text-b0 -translate-x-[36px] relative z-[100] text-center transition-all
          m1_4:text-[12px] m1_4:-translate-x-[16px] m1_4:w-[200px] m1_4:pl-[22px] m1_4:pr-[36px]
        '>
          <input
            type='text'
            placeholder={
              currentChar == ""
                ? "Search"
                : currentChar.substring(0, 15) + (currentChar.length > 15 ? " ..." : "")
            }
            className='w-full h-full bg-b6 text-b0 text-center rounded-[4px] outline-none focus:outline-none focus:bg-[#9998cf] hover:bg-[#b1aff2] transition-all'
            onFocus={() => {
              setIsFocus(() => {
                return true;
              });
            }}
            onBlur={() => {
              setIsFocus(() => false);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const value = e.currentTarget.value;

              if (e.key === "Enter") {
                if (!filteredList || Object.keys(filteredList).length === 0) {
                  return;
                }
                const firstKey = Object.keys(filteredList)[0];
                e.currentTarget.value = "";
                selChar(firstKey);
                return;
              }

              if (e.key === "Escape") {
                setIsFocus(() => false);
                setIsHover(() => false);
                e.currentTarget.value = "";
                return;
              }

              setIsFocus(() => true);
              setFilter(() => value);
              const newList = Object.keys(charList).reduce(
                (acc: { [key: string]: number }, key) => {
                  if (key.toLowerCase().includes(value.toLowerCase()) && key !== currentChar) {
                    acc[key] = charList[key];
                  }
                  return acc;
                },
                {}
              );
              setFilteredList(() => newList);
            }}
          />
        </div>
        {/* <SearchIcon
          className='text-b0 relative z-[101] translate-x-[-76px] hover:cursor-pointer
          m1_4:translate-x-[-48px]
          '
          fontSize='medium'
        /> */}

        <div
          className='text-b6 relative z-[101] translate-x-[-76px] hover:cursor-pointer text-[16px] h-[32px] aspect-square flex justify-center items-center rounded-lg hover:shadow-[0px_0px_0px_2px_#ffffff] bg-b0 hover:text-[13px]
          m1_4:translate-x-[-48px] m1_4:h-[24px] m1_4:text-[12px] m1_4:hover:text-[10px]
        '>
          <div className='transition-all'>🔎︎</div>
        </div>
      </div>
      <div
        className='flex-col justify-center w-fit px-3 bg-b3 shadow-[0px_0px_0px_2px_rgb(212,201,255)] rounded-b-lg gap-y-[3px] py-2 items-center h-fit absolute mt-[42px] ml-6
          m1_4:mt-[30px] m1_4:ml-[28px]
        '
        style={{ display: isFocus || isHover ? "flex" : "none" }}>
        {Object.keys(filteredList).map((key) => {
          return (
            <div
              key={key}
              className='w-[235px] h-[] bg-b6 text-b3 text-center py-1 text-[14px] font-extrabold px-1 rounded-lg hover:bg-b2 active:bg-b4 hover:text-b6 transition-all flex items-center
                m1_4:w-[140px] m1_4:text-[10px]
              '>
              <div
                className='w-[24px] h-[24px] relative z-[101] mr-2 ml-1 rounded-full 
                  m1_4:w-[16px] m1_4:h-[16px] 
                '
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  if (e.detail === 1 && e.button === 0) {
                    // router.push(`/lb?char=${key}`);
                    router.push(`/lb/${key}`);
                    setIsFocus(() => false);
                    setIsHover(() => false);
                  }
                }}>
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/icon/character/${filteredList[key]}.png`}
                  width={128}
                  height={128}
                  alt='Character Portrait'
                  className='shadow-[0px_0px_2px_2px_rgb(2,0,113)] bg-b6 rounded-full hover:cursor-pointer hover:border-2 hover:border-b0 transition-all active:scale-95'
                  rel='preload'
                />
              </div>
              <span
                className='select-none hover:underline hover:cursor-pointer'
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  if (e.detail === 1 && e.button === 0) {
                    // router.push(`/lb?char=${key}`);
                    router.push(`/lb/${key}`);
                    setIsFocus(() => false);
                    setIsHover(() => false);
                  }
                }}>
                {key.length > 15 ? key.substring(0, 15) + "..." : key}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
