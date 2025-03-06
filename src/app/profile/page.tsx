"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "../header";
import Image from "next/image";
import ProfilePreview from "./profile";

import { useEffect, useState } from "react";

import axios from "axios";

import Character from "./character";

export default function Profile() {
  const searchParams = useSearchParams();
  // const uid = searchParams.get("uid") || "000000000";
  const [uid, setUid] = useState(searchParams.get("uid") || "000000000");
  const [localData, setLocalData] = useState(
    JSON.parse(localStorage.getItem("data_" + uid) || "{}")
  );
  const [currentCharacter, setCurrentCharacter] = useState(
    localData && localData.characters ? localData.characters[0] : null
  );

  const router = useRouter();

  console.log(localData);

  const fetchData = async () => {
    if (uid.length !== 9 || isNaN(parseInt(uid)) || parseInt(uid) === 0) {
      return;
    }
    try {
      fetch(`http://127.0.0.1:8000/srd/${uid}`).then((response) => {
        response.json().then((data) => {
          console.log(data);

          localStorage.setItem("data_" + uid, JSON.stringify(data));
          setCurrentCharacter(() => {
            return data.characters[0];
          });

          setLocalData(data);
        });

        try {
          axios.post("http://127.0.0.1:8000/add", {
            uid: uid.toString(),
          });
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("UID", uid);
  }, [uid]);

  function handleCharacterSelect(character_id: string) {
    for (const character of localData.characters) {
      if (character.id === character_id) {
        setCurrentCharacter(character);
      }
    }
  }

  function onUidSearch(uid: string) {
    setUid(() => uid);
  }

  return (
    <div>
      <Header current="/profile" />
      {Object.keys(localData).length > 0 && (
        <>
          {/* {localData && localData.player && (
            <div className="flex items-center justify-center mt-12">
              <div className="flex flex-col justify-center border-[1px] border-w2 w-[242px] h-[315px] px-4 rounded-lg font-bold text-lg text-center">
                <div className="mx-auto w-fit pb-2">
                  {localData && localData.player && localData.player.avatar && (
                    <Image
                      src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${localData.player.avatar.icon}`}
                      width={120}
                      height={120}
                      alt="Player Avatar"
                    />
                  )}
                </div>
                <div className="flex w-full justify-center gap-2 text-[#6B7433] text-xl font-extrabold items-center my-2">
                  <div className="w-fit">UID: </div>
                  <input
                    type="text"
                    value={uid}
                    className="w-32 bg-transparent"
                  />
                </div>
                <div>
                  {`Achievements: ${localData.player.space_info.achievement_count}`}
                </div>
                <div>{`Friends: ${localData.player.friend_count}`}</div>
                <div>{`MOC Stars: -1`}</div>
              </div>
              <div className="h-[315px] w-[949px] ml-12 flex flex-col justify-end">
                <div className="text-7xl font-extrabold text-[#EEAA5B] ml-7">
                  {localData.player.nickname}
                </div>
                <div className="text-2xl font-bold text-[#8F8F8F] ml-7">
                  {`Trailblazer Level ${localData.player.level} - World Level ${localData.player.world_level}`}
                </div>
                <div className="text-xl font-medium text-[#8F8F8F] w-full px-7 border-[1px] mt-4 py-2 border-w2 rounded-lg h-[132px]">
                  {localData.player.signature}
                </div>
              </div>
            </div>
          )} */}
          {
            <ProfilePreview
              playerData={localData ? localData.player : null}
              uid={uid}
              onUidSearch={onUidSearch}
            />
          }

          {localData && localData.player && localData.player.space_info && (
            <div className="w-full h-fit flex justify-center mt-12 gap-8 items-center bg-bk1">
              {localData.characters.map((character: any) => {
                return (
                  <div
                    className="flex items-center justify-center group h-[106px]"
                    onClick={() => handleCharacterSelect(character.id)}
                  >
                    <div className="w-[8px] h-[106px] bg-bk1 group-hover:bg-background absolute block z-0"></div>
                    <Image
                      src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${character["icon"]}`}
                      width={88}
                      height={88}
                      alt="Character Icon"
                      className="rounded-full border-[8px]  bg-background border-background hover:bg-bk2 transition-all w-[88px] h-[88px] block z-10"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {currentCharacter && <Character characterJSON={currentCharacter} />}
        </>
      )}
    </div>
  );
}
