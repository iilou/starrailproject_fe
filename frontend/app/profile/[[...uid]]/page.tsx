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

import { charDbTypes, get_lb_types } from "../../lb/[[...lb_name]]/lib";

import ReactDOMServer from "react-dom/server";

import { filterElementColor } from "../../lib/color";
import { OpenInNew } from "@mui/icons-material";

import { useEffect, useState, useRef } from "react";

import axios from "axios";

import Character from "./character";

import { toPng } from "html-to-image";
import { toJpeg } from "html-to-image";
import { profile } from "console";
// import { image } from "html2canvas/dist/types/css/types/image";

export default function Profile() {
  // const [uid, setUid] = useState<string | null>(null);
  // const [localData, setLocalData] = useState<any>(null);
  const [char_list, setCharList] = useState<any[]>([]); // State to hold character list
  const [profile_data, setProfileData] = useState<any>(null);
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  // const { uid: urlUid } = router.query; // Extract uid from dynamic route parameter
  const { uid: urlUid } = useParams(); // Extract uid from dynamic route parameter

  const fetchData = async (savedData: any, uid: string) => {
    try {
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
      console.log("fetch raw response", response);

      // check if the response is ok
      if (!response.ok) {
        console.log("response not ok:", response);
        return;
      }

      const data = await response.json();
      console.log("fetch", data);

      if (data.detail && (data.detail === "Invalid uid" || data.detail === "User not found")) {
        alert("Invalid UID. Please check the UID and try again.");
        return;
      }

      // add data to leaderboards sql
      var worthAdding = false;

      filterElementColor(data);

      savedData["player"] = data.player;
      for (let i = data.characters.length - 1; i >= 0; i--) {
        const character = data.characters[i];

        if (character["name"] in charDbTypes) {
          worthAdding = true;
        }

        character["last_updated"] = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        // override if exists
        if (savedData["characters"].find((char: any) => char.id === character.id)) {
          savedData["characters"] = savedData["characters"].filter(
            (char: any) => char.id !== character.id
          );
        }

        savedData["characters"] = [character, ...savedData["characters"]];
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add`,
          { uid: uid },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("add", res);
      } catch (error) {
        console.error("Error pushing data to leaderboards: ", error);
      }

      // save data to local storage
      localStorage.setItem("data_" + uid, JSON.stringify(savedData));

      // set profile and character data
      setProfileData(() => savedData["player"]);
      setCharList(() => savedData["characters"]);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setProfileData(() => savedData["player"]);
      setCharList(() => savedData["characters"]);
    }
  };

  useEffect(() => {
    // Check if urlUid is an array and pick the first element, or use the string value directly
    const initialUid = Array.isArray(urlUid) ? urlUid[0] : urlUid || "000000000";

    let savedDataString = localStorage.getItem("data_" + urlUid);
    let savedData = null;

    if (!savedDataString) {
      savedData = {
        player: {
          avatar: {
            icon: "icon/avatar/1303.png",
            id: "201303",
            name: "Ruan Mei",
          },
          friend_count: 0,
          level: 0,
          is_display: true,
          nickname: "Unknown",
          signature:
            "Either this UID does not refer to a valid player, or access to the API is not available and there is no cached data.",
          uid: urlUid,
          world_level: 0,
        },
        characters: [],
      };
    } else {
      savedData = JSON.parse(savedDataString);
    }

    fetchData(savedData, initialUid); // Fetch data using the initialUid
  }, [urlUid]); // Fetch data when the component mounts or when urlUid changes

  // useEffect(() => {
  //   if (localData && localData["characters"]) {
  //     setCharList(() => localData["characters"]);
  //   }
  // }, [localData]); // Update char_list and char_ref_list when localData changes

  // useEffect(() => {
  //   if (uid) {
  //     fetchData();
  //   }
  // }, [uid]); // Fetch data whenever the UID changes

  const handleCharacterSelect = (character_id: string) => {
    const selectedCharacter = char_list.find((character: any) => character.id === character_id);
    setCurrentCharacter(selectedCharacter);
  };

  const onUidSearch = (uid: string) => {
    if (uid && uid.length === 9) {
      router.push(`/profile/${uid}`);
    }
  };

  const [scrollY, setScrollY] = useState(0); // State to hold scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [selClicked, setSelClicked] = useState(false); // State to hold selected clicked value
  const [gridChars, setGridChars] = useState<any[]>([]); // State to hold grid characters
  const gridRef = useRef<any>(null); // Ref to hold grid reference

  const generateImage = (ref: any, quality: number, type: string) => {
    if (ref.current && gridChars.length > 1 && gridChars.length < 5) {
      // setTempStatic(() => true);
      if (type === "jpeg 95%") {
        toJpeg(ref.current, {
          cacheBust: true,
          pixelRatio: quality,
          skipFonts: navigator.userAgent.includes("firefox") ? false : true,
          quality: 0.95,
        })
          .then((dataUrl) => {
            // setTempStatic(() => false);
            const link = document.createElement("a");
            link.download = "image.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            // setTempStatic(() => false);
            console.log(err);
          });
      } else if (type === "png") {
        toPng(ref.current, {
          cacheBust: true,
          pixelRatio: quality,
          skipFonts: navigator.userAgent.includes("firefox") ? false : true,
        })
          .then((dataUrl) => {
            // setTempStatic(() => false);
            const link = document.createElement("a");
            link.download = "image.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            // setTempStatic(() => false);
            console.log(err);
          });
      } else if (type === "jpeg 99%")
        toJpeg(ref.current, {
          cacheBust: true,
          pixelRatio: quality,
          skipFonts: navigator.userAgent.includes("firefox") ? false : true,
          quality: 0.99,
        })
          .then((dataUrl) => {
            // setTempStatic(() => false);
            const link = document.createElement("a");
            link.download = "image.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            // setTempStatic(() => false);
            console.log(err);
          });
    }
  };

  const currentCharRef = useRef<any>(null);

  return (
    <div
      className='w-[1920px] h-fit relative'
      style={{
        minHeight: "100vh",
      }}>
      <Header current='/profile' />
      <div className='w-full absolute top-0 left-0 z-[700]'>
        <BG />
      </div>
      <div className='w-full mt-[30px] mb-[50px] z-[900] relative'>
        <LocalProfileView router={router} />
      </div>
      {selClicked && (
        <div
          className='fixed z-[1100] flex w-[100vw] h-[100vh] top-0 left-0 justify-center items-center flex-col gap-2 bg-[#000000c2]'
          style={{
            filter: "blur(0px)",
            backdropFilter: "blur(7px)",
          }}>
          <div className='w-[720px] h-[60px] text-[#ffffff] text-[24px] bg-[#3d3b7a] rounded-lg font-black shadow-lg shadow-[#000000] '>
            <div className='w-full h-full flex items-center justify-center bg-[#0200d272] rounded-lg pt-[4px]'>
              Export Grid
            </div>
          </div>
          <div className='w-[310px] h-[60px] flex flex-col items-center justify-center text-[#ffffff] text-[21px] font-bold bg-[#232323] rounded-lg leading-[24px]'>
            <div>Select 2 - 4 characters</div>
            <div className='text-[#c7c7c7] text-[12px] font-bold leading-[10px]'>
              Generating may take a long time | 5-30 seconds
            </div>
          </div>
          <div className='w-[420px] h-fit bg-[#72719e] rounded-lg hover:shadow-[0_0_0_2px_#ffffff_inset] flex flex-col items-center justify-center gap-[3px] py-1'>
            {char_list &&
              char_list.map((character: any, index: number) => {
                return (
                  <div
                    className='w-[240px] h-[30px] flex items-center justify-center bg-[#232323] rounded-md shadow-[0_0_3px_0px_#000000a1] hover:shadow-[0_0_3px_2px_#a2a2a2_inset,_0_0_3px_0px_#000000a1] cursor-pointer relative'
                    style={{
                      backgroundColor: gridChars.find((char) => char.id === character.id)
                        ? "#0200d2c2"
                        : "#232323e2",
                    }}
                    onClick={() => {
                      if (gridChars.find((char) => char.id === character.id)) {
                        setGridChars((prev: any) =>
                          prev.filter((char: any) => char.id !== character.id)
                        );
                      } else {
                        if (gridChars.length < 4) {
                          setGridChars((prev: any) => [...prev, character]);
                        }
                      }
                    }}
                    key={index}>
                    <div className='absolute text-[#cfd221] text-[14px] font-extrabold right-2 w-[20px] text-center'>
                      {gridChars.findIndex((char) => char.id === character.id) === -1
                        ? ""
                        : gridChars.findIndex((char) => char.id === character.id) + 1}
                    </div>
                    <div
                      className='text-[#c7c7c7] text-[14px] font-extrabold flex justify-center items-center gap-2'
                      style={{
                        color: gridChars.find((char) => char.id === character.id)
                          ? "#e7e7e7"
                          : "#8a8a8ac2",
                      }}>
                      <div className='w-[24px] h-[24px] flex items-center justify-center'>
                        <Image
                          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${character.icon}`}
                          width={32}
                          height={32}
                          alt='Character Icon'
                          className={`w-full h-full rounded-md`}
                        />
                      </div>
                      <div>{character.name}</div>
                      <div className='w-[24px] h-[24px] flex items-center justify-center'>
                        <Image
                          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${character.element.icon}`}
                          width={32}
                          height={32}
                          alt='Character Icon'
                          className={`w-full h-full`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className=' flex items-center justify-center gap-2 w-[900px] flex-wrap'>
            {[
              { quality: 0.5, dim: "1920x1080", est: "0.8MB", type: "jpeg 95%" },
              { quality: 1, dim: "3840x2160", est: "2.2MB", type: "jpeg 95%" },
              { quality: 2, dim: "7680x4320", est: "6.0MB", type: "jpeg 95%" },
              { quality: 3, dim: "11520x6480", est: "10.4MB", type: "jpeg 95%" },
              { quality: 4, dim: "15360x8640", est: "15.4MB", type: "jpeg 95%" },
              { quality: 0.5, dim: "1920x1080", est: "?", type: "png" },
              { quality: 1, dim: "3840x2160", est: "?", type: "png" },
              { quality: 2, dim: "7680x4320", est: "?", type: "png" },
              { quality: 3, dim: "11520x6480", est: "?", type: "png" },
              { quality: 4, dim: "15360x8640", est: "?", type: "png" },
              { quality: 0.5, dim: "1920x1080", est: "?", type: "jpeg 99%" },
              { quality: 1, dim: "3840x2160", est: "?", type: "jpeg 99%" },
              { quality: 2, dim: "7680x4320", est: "?", type: "jpeg 99%" },
              { quality: 3, dim: "11520x6480", est: "?", type: "jpeg 99%" },
              { quality: 4, dim: "15360x8640", est: "?", type: "jpeg 99%" },
            ].map((item, index) => {
              return (
                <div
                  className='w-[160px] h-[68px] flex flex-col items-center justify-center text-[#e2e2e2]  bg-[#121212] rounded-lg hover:shadow-[0_0_0_2px_#ffffff_inset] active:shadow-[0_0_5px_1px_#ffffff_inset] cursor-pointer'
                  onClick={() => {
                    generateImage(gridRef, item.quality, item.type);
                  }}
                  style={{
                    backgroundColor: Math.floor(index / 5) % 2 === 0 ? "#070707" : "#121212",
                    color: Math.floor(index / 5) % 2 === 0 ? "#e7e7e7" : "#c7c7c7",
                  }}
                  key={index}>
                  {/* Generate {item.quality}x */}
                  <div className='text-[16px] font-bold'>Generate {item.quality}x</div>
                  <div className='text-[9px] font-bold text-[#a1a1a1]'>.{item.type}</div>
                  <div className='text-[9px] font-bold text-[#a1a1a1]'>{item.dim}</div>
                  <div className='text-[9px] font-bold text-[#a1a1a1]'>Est Size {item.est}</div>
                </div>
              );
            })}
          </div>
          <div
            className='w-[120px] h-[32px] flex items-center justify-center text-[#c7c7c7] text-[16px] font-extrabold bg-[#232323] rounded-lg hover:shadow-[0_0_0_2px_#787878_inset] active:shadow-[0_0_5px_1px_#ffffff_inset] cursor-pointer'
            onClick={() => {
              setSelClicked(() => false);
            }}>
            Cancel
          </div>
        </div>
      )}
      {/* { gridRender && ( */}
      {selClicked && (
        <div className='w-fit h-fit absolute top-0 left-0 z-[0] opacity-[1] pointer-events-none'>
          <div
            className='w-[3840px] flex flex-wrap justify-center items-end gap-0 z-[0] h-[2160px]'
            style={{
              backgroundImage: `url(/image.png)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            ref={gridRef}>
            {/* total h 302 */}
            <div className='text-[72px] font-extrabold text-[#EEAA5B] w-full h-[202px] text-center flex justify-center items-center gap-16'>
              {/* {localData ? localData.player.nickname : "No Name"} */}
              <img
                // src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${localData?.player?.avatar?.icon}`}
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
                  profile_data ? profile_data.avatar.icon : "icon/avatar/1303.png"
                }`}
                width={128}
                height={128}
                alt='Avatar'
                className='w-[128px] h-[128px] rounded-full'
              />
              <div className='flex flex-col items-center justify-center'>
                <div className='leading-[78px]'>
                  {/* {localData ? localData.player.nickname : "No Name"} */}
                  {profile_data ? profile_data.nickname : "No Name"}
                </div>
                <div className='text-[32px] font-bold text-[#c7c7c7] leading-[22px]'>
                  {/* {localData ? localData.player.uid : "No UID"} */}
                  {profile_data ? profile_data.uid : "No UID"}
                </div>
              </div>
              <div className='w-[128px] h-[128px] '></div>
            </div>
            {gridChars &&
              gridChars.map((character: any, index: number) => {
                return (
                  <div
                    className='block'
                    key={index}
                    style={{
                      transformOrigin: "top left",
                      width: "1920px",
                    }}>
                    <Character
                      characterJSON={character}
                      scrollY={10000}
                      router={router}
                      reactive={false}
                      charRef={null}
                    />
                  </div>
                );
              })}
            <div className='w-full h-[100px] flex justify-end gap-2'>
              <img
                src={`/srp_logo.png`}
                width={128}
                height={128}
                alt='Avatar'
                className='w-[72px] h-[72px] rounded-full'
              />
              <div className='flex h-[72px] items-center justify-center text-[#e7e7e7] text-[42px] font-extrabold mr-[100px]'>
                <div>star.stylla.moe</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='w-full z-[900] relative'>
        <div
          className='w-full h-fit flex justify-center items-center sticky top-[50px] z-[1200] transition-all duration-500 flex-col '
          style={{
            opacity: scrollY > 200 ? 0 : 1,
            backgroundImage: `linear-gradient(to bottom, #12121200 0%, #12121292 20%, #12121292 95%, #12121200 100%)`,
            userSelect: scrollY > 200 ? "none" : "auto",
            pointerEvents: scrollY > 200 ? "none" : "auto",
          }}>
          <ProfilePreview
            playerData={profile_data ? profile_data : null}
            uid={profile_data ? profile_data.uid : "000000000"}
            onUidSearch={onUidSearch}
            isLoading={false}
            onRefresh={() => {
              if (!profile_data) return;
              fetchData({ player: profile_data, characters: char_list }, profile_data.uid);
            }}
          />
          <div className='w-1 h-[30px]'></div>
          <div className='w-full h-fit flex justify-center items-center bg-[#121212dd] shadow-[0_0_3px_2px_#000000,_0_0_10px_0px_#000000_inset] sticky top-[80px] z-[1200]'>
            <div
              className='w-fit h-fit flex items-center overflow-x-scroll overflow-y-hidden relative'
              style={{
                scrollBehavior: "smooth",
                scrollbarColor: "#000000 #121212",
                scrollbarWidth: "thin",
              }}>
              <div className='w-[50px] h-2'></div>
              {char_list.map((character: any) => {
                const isCurrent = currentCharacter?.id === character.id;
                return (
                  <div
                    className='flex items-center justify-center group h-[100px] w-fit px-2 '
                    onClick={() => handleCharacterSelect(character.id)}
                    key={character.id}>
                    <div className='w-[100px] h-[100px] flex items-center justify-center rounded-full group relative'>
                      <Image
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${character.icon}`}
                        width={68}
                        height={68}
                        alt='Character Icon'
                        className={` relative
                          rounded-full bg-background transition-all bg-w1 w-[78px] h-[78px] block z-[120] duration-100 group-hover:bg-[#c3c3c3] shadow-[0_0_10px_2px_#000000_inset] ${
                            isCurrent
                              ? "animate-border-glow border-[2px] group-hover:bg-w2 brightness-90"
                              : "border-[#121212] border-[2px] group-hover:bg-w2 brightness-90"
                          }`}
                        style={{
                          borderColor: isCurrent ? character.element.color : "",
                          // ["--glow_profile_char" as any]: character.element.color,
                        }}
                      />
                    </div>
                    <div
                      className='w-[1px] h-[100px] group-hover:w-[230px] transition-all text-[#c7c7c7] z-[110] flex items-center'
                      style={isCurrent ? { width: `230px`, marginRight: "26px" } : {}}>
                      {isCurrent ? (
                        <div className='relative group w-fit'>
                          <div
                            className='absolute inset-0 rounded-md border-2 animate-border-glow pointer-events-none'
                            style={{
                              borderColor: currentCharacter.element.color,
                              // ["--glow_profile_char" as any]: currentCharacter.element.color,
                            }}
                          />
                          <div
                            className='w-[230px] text-[#c7c7c7] font-bold text-2xl transition-all pl-4 pr-4 py-2 rounded-md bg-[#121212] group-hover:text-2xl group-hover:font-extrabold group-hover:bg-[#0f0f0f] animate-text-glow'
                            style={{
                              border: `2px solid ${currentCharacter.element.color}`,
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
            </div>
          </div>
          <div className='w-full flex justify-center flex-col items-center'>
            <div className='w-[1px] h-[10px]'></div>
            <div
              className='ml-[1300px] shadow-[0_0_0_1px_#c7c7c7] w-[174px] h-[42px] flex items-center justify-center rounded-lg text-[#ac663d] font-bold cursor-pointer'
              onClick={() => {
                setSelClicked(() => true);
              }}>
              <div className='w-fit h-fit ml-3'>Export Grid</div>
              <div className='w-[42px] h-[42px] flex items-center justify-center'>
                <OpenInNew className='scale-[0.8]' />
              </div>
            </div>
          </div>
        </div>
        <div
          className='w-[1920px] relative transition-all duration-300 h-[490px]'
          style={{
            transform: scrollY > 200 ? "translateY(-420px)" : "translateY(0px)",
          }}>
          {currentCharacter && (
            <>
              <Character
                characterJSON={currentCharacter}
                router={router}
                charRef={currentCharRef}
                scrollY={scrollY}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
