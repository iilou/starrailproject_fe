"use client";

import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "../../header";
import LocalProfileView from "../../local_profile_view";
import Image from "next/image";
import ProfilePreview from "./profile";
import PHeader from "./p_header";
import BG from "../../bg";

import { filterElementColor } from "../../lib/color";

import { useEffect, useState } from "react";

import axios from "axios";

import Character from "./character";

export default function Profile() {
  // const [uid, setUid] = useState<string | null>(null); // Initial state set to null
  const [uid, setUid] = useState<string | null>(null); // Initial state set to null
  const [localData, setLocalData] = useState<any>(null); // Initial state set to null
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shadow_color, setShadowColor] = useState("#00000000");

  const router = useRouter();
  // const { uid: urlUid } = router.query; // Extract uid from dynamic route parameter
  const { uid: urlUid } = useParams(); // Extract uid from dynamic route parameter

  useEffect(() => {
    // Check if urlUid is an array and pick the first element, or use the string value directly
    const initialUid = Array.isArray(urlUid) ? urlUid[0] : urlUid || "000000000"; // Default to "000000000" if no uid is found
    setUid(initialUid);

    const savedData = localStorage.getItem("data_" + initialUid);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const filteredData = filterElementColor(parsedData);
      setLocalData(filteredData);
      if (filteredData && filteredData.characters) {
        setCurrentCharacter(filteredData.characters[0]);
      }
    }
  }, [urlUid]); // Re-run effect when the `uid` param changes

  const fetchData = async () => {
    if (uid && (uid.length !== 9 || isNaN(parseInt(uid)) || parseInt(uid) === 0)) {
      if (localData && localData["player"] && localData["player"]["uid"]) {
        setUid(localData["player"]["uid"]);
        // router.push(`/profile?uid=${localData["player"]["uid"]}`);
        router.push(`/profile/${localData["player"]["uid"]}`);
      }
      return;
    }

    setIsLoading(true);
    try {
      // const response = await fetch(`http://127.0.0.1:8000/srd/${uid}`);
      console.log(
        "fetching data for uid:",
        uid,
        "url:",
        `${process.env.NEXT_PUBLIC_API_URL}/srd/${uid}`
      );
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/srd/${uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("fetch", response);
      if (!response.ok) {
        setIsLoading(false);
        // alert("Error fetching data. Please try again later.");
        return;
      }
      const data = await response.json();
      console.log("fetch : ", data);

      if (data.detail && (data.detail === "Invalid uid" || data.detail === "User not found")) {
        setIsLoading(false);
        alert("Invalid UID. Please check the UID and try again.");
        return;
      }

      if (checkBadLocalData(data)) {
        setIsLoading(false);
        return;
      }

      // post request "/add"
      // class Add(BaseModel):
      //     uid: str

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add`,
          {
            uid: uid,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("add", res);
      } catch (error) {
        console.error("Error pushing data to leaderboards: ", error);
      }

      filterElementColor(data);
      localStorage.setItem("data_" + uid, JSON.stringify(data));
      setCurrentCharacter(data.characters[0]);
      setLocalData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (localData && localData["player"] && localData["player"]["uid"]) {
        setUid(localData["player"]["uid"]);
        router.push(`/profile/${localData["player"]["uid"]}`);
        // router.push(`/profile?uid=${localData["player"]["uid"]}`);
      }
    }
  };

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]); // Fetch data whenever the UID changes

  const handleCharacterSelect = (character_id: string) => {
    const selectedCharacter = localData?.characters.find(
      (character: any) => character.id === character_id
    );
    setCurrentCharacter(selectedCharacter);
  };

  const onUidSearch = (uid: string) => {
    setUid(uid);
  };

  const checkBadLocalData = (data: any) => {
    return (
      !data ||
      data["sofijweiofjweiofjweiofjwiofj"] === "fwaefawefwefe" ||
      data.detail === "Invalid uid" ||
      !data.player
    );
  };

  return (
    <div className='w-full h-fit relative' style={{ minHeight: "100vh" }}>
      <Header current='/profile' />
      <div className='w-full h-[4000px] absolute top-0 left-0 z-[700]'>
        <BG />
      </div>
      <div className='w-full mt-[30px] mb-[50px] z-[900] relative'>
        <LocalProfileView router={router} />
      </div>
      <div className='w-full z-[900] relative'>
        <ProfilePreview
          playerData={localData ? localData.player : null}
          uid={uid || "000000000"}
          onUidSearch={onUidSearch}
          isLoading={isLoading}
        />
        <div className='w-1 h-[30px]'></div>
        {localData && localData?.player && localData?.characters && (
          <div className='w-full h-fit flex justify-center items-center bg-[#121212dd] z-[1000] relative shadow-[0_0_3px_2px_#000000,_0_0_10px_0px_#000000_inset]'>
            <div className='w-fit h-fit flex items-center overflow-x-scroll overflow-y-hidden relative'>
              <div className='w-[50px] h-2'></div>
              {localData.characters.map((character: any) => {
                const isCurrent = currentCharacter?.id === character.id;
                return (
                  <div
                    className='flex items-center justify-center group h-[100px] w-fit px-2 gap-2'
                    onClick={() => handleCharacterSelect(character.id)}
                    key={character.id}>
                    <div className='w-[100px] h-[100px] flex items-center justify-center rounded-full'>
                      <Image
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${character.icon}`}
                        width={68}
                        height={68}
                        alt='Character Icon'
                        className={`rounded-full bg-background transition-all bg-w1 w-[88px] h-[88px] block z-[120] duration-100 group-hover:bg-[#c3c3c3] shadow-[0_0_10px_2px_#000000_inset] group-hover:brightness-110 ${
                          isCurrent
                            ? "animate-bordewefr-glow  border-[2px] group-hover:border-[2px] group-hover:bg-w2 brightness-110"
                            : "border-[#121212] border-[15px] group-hover:border-[5px] group-hover:bg-w2 brightness-90"
                        }`}
                        style={{
                          borderColor: isCurrent ? character.element.color : "",
                          ["--glow_profile_char" as any]: character.element.color,
                        }}
                      />
                    </div>
                    <div
                      className='w-[1px] h-[100px] group-hover:w-[230px] transition-all text-[#c7c7c7] z-[110] flex items-center'
                      style={isCurrent ? { width: `230px`, marginRight: "26px" } : {}}>
                      {isCurrent ? (
                        <div className='relative group w-fit'>
                          <div
                            className='absolute inset-0 rounded-md border-2 animate-wefewborder-glow pointer-events-none'
                            style={{
                              borderColor: currentCharacter.element.color,
                              // ["--glow_profile_char" as any]: currentCharacter.element.color,
                            }}
                          />
                          <div
                            className='w-[230px] text-[#c7c7c7] font-bold text-2xl transition-all pl-4 pr-4 py-2 rounded-md bg-[#121212] group-hover:text-2xl group-hover:font-extrabold group-hover:bg-[#0f0f0f] animate-text-gfdlow'
                            style={{
                              border: `2px solid ${currentCharacter.element.color}`,
                              // ["--glow_profile_char_text" as any]: currentCharacter.element.color,
                            }}>
                            {character.name.substring(0, 12) +
                              (character.name.length > 12 ? "..." : "")}
                          </div>
                        </div>
                      ) : (
                        <div className='w-[230px] hidden group-hover:block font-bold text-2xl transition-all pl-4 group-hover:bg-[#121212] border-[1px] border-[#121212] pr-4 py-2 rounded-md text-nowrap shadow-[0_0_0px_1px_#e7e7e755_inset]'>
                          <span className='opacity-0 group-hover:opacity-100 transition-all duration-200 text-[#e9e9e900] group-hover:text-[#c7c7c7]'>
                            {character.name.substring(0, 12) +
                              (character.name.length > 12 ? "..." : "")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className='w-[50px] h-2'></div>
            </div>
          </div>
        )}
        {currentCharacter && <Character characterJSON={currentCharacter} />}
      </div>
    </div>
  );
}
