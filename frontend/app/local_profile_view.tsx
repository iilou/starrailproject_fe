import React from "react";
import { useState, useEffect } from "react";

import Close from "@mui/icons-material/Close";

export default function LocalProfileView({ router }: { router: any }) {
  const [uidList, setUidList] = useState([] as string[]);
  const [nicknameList, setNicknameList] = useState([] as string[]);

  useEffect(() => {
    const localStorage = window.localStorage;
    const uidList: string[] = [];
    const nicknameList: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("data_")) {
        const uid = key.substring(5);
        uidList.push(uid);
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        // nicknameList.push((data.player && data.player.nickname) || "Unknown");
        // const nickname = data.player?.nickname || "Unknown";
        nicknameList.push(
          ((data.player && data.player.nickname) || "Unknown").substring(0, 10) +
            (data.player?.nickname.length > 10 ? "..." : "")
        );
      }
    }
    setNicknameList(nicknameList);
    setUidList(uidList);
  }, []);

  const deleteUid = (uid: string) => {
    const localStorage = window.localStorage;
    localStorage.removeItem("data_" + uid);
    setUidList((prev) => prev.filter((item) => item !== uid));
    setNicknameList((prev) => prev.filter((item) => item !== nicknameList[uidList.indexOf(uid)]));
  };

  return (
    <div className='flex items-center justify-center w-full h-full relative z-[100]'>
      <div className='w-[1600px] h-full flex flex-wrap gap-x-2 gap-y-1 items-center justify-center'>
        {uidList.map((uid) => (
          <div
            key={uid}
            className='h-[30px] flex items-center group hover:bg-[#292e5c] bg-[#444b88] rounded-lg px-[5px] transition-all gap-[5px]'>
            <button
              className='w-[200px] text-[13px] text-[#d1d1d1] group-hover:text-[#f4e135] pl-[15px]
              transition-all font-bold h-fit rounded-lg
                m1_4:text-[8px] m1_4:w-[70px]
              '
              onClick={() => {
                // router.push(`/profile?uid=${uid}`);
                router.push(`/profile/${uid}`);
              }}>
              {nicknameList[uidList.indexOf(uid)].length > 15
                ? nicknameList[uidList.indexOf(uid)].substring(0, 15) + "..."
                : nicknameList[uidList.indexOf(uid)]}
              <span className='m1_4:hidden'> -</span>
              {" " + uid}
            </button>
            {/* <button
              className='w-[0px] h-fit text-[#c7c7c7] opacity-0 group-hover:opacity-100 font-medium transition-all rounded-full text-[14px] hover:font-bold hover:text-[20px] hover:-translate-y-[1px] hover:-translate-x-[17px] -translate-y-[2px] -translate-x-[15px] duration-75 hover:text-[#ffffff]'
              onClick={() => deleteUid(uid)}>

              x
            </button> */}
            <div
              className='aspect-square h-full hover:bg-[#000000] flex justify-center items-center rounded-sm hover:shadow-[0_0_0px_2px_#ffffff] '
              onClick={() => deleteUid(uid)}>
              <Close />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
