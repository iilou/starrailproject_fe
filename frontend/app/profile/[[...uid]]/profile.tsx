import { Refresh } from "@mui/icons-material";
import Image from "next/image";

import { useRouter } from "next/navigation";

export default function ProfilePreview({
  playerData,
  uid,
  onUidSearch,
  isLoading,
  onRefresh,
}: {
  playerData: any;
  uid: string;
  onUidSearch: (uid: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center mt-12 relative'>
      <div className='flex flex-col justify-center border-[1px] border-w2 w-[242px] h-[315px] px-4 rounded-lg font-bold text-lg text-center'>
        <div className='mx-auto w-fit pb-2'>
          <Image
            src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${
              playerData ? playerData.avatar.icon || "icon/avatar/1001.png" : "icon/avatar/1001.png"
            }`}
            width={120}
            height={120}
            alt='Player Avatar'
            rel='preload'
          />
        </div>
        <div className='flex w-full justify-center gap-2 text-[#6B7433] text-xl font-extrabold items-center my-2'>
          <div className='w-fit'>UID: </div>
          <input
            type='text'
            placeholder={uid}
            className='w-32 bg-transparent'
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // router.push(`/profile?uid=${(e.target as HTMLInputElement).value}`);
                router.push(`/profile/${(e.target as HTMLInputElement).value}`);

                onUidSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        {playerData && (
          <>
            <div>{`Achievements: ${playerData.space_info.achievement_count}`}</div>
            <div>{`Friends: ${playerData.friend_count}`}</div>
            <div>{`MOC Stars: ${"N/A"}`}</div>
          </>
        )}
      </div>
      <div className='h-[315px] w-[949px] ml-12 flex flex-col justify-end'>
        <div className='text-7xl font-extrabold text-[#EEAA5B] ml-7'>
          {playerData ? playerData.nickname : "Enter Player UID"}
        </div>
        <div className='text-2xl font-bold text-[#8F8F8F] ml-7 flex gap-2 justify-between w-full'>
          <div className='w-fit'>
            {playerData
              ? `Trailblazer Level ${playerData.level} - World Level ${playerData.world_level}`
              : "In the field to the left..."}
          </div>
          {playerData && (
            <>
              <div
                className='w-fit h-fit items-center text-[#8F8F8F] text-[20px] gap-x-2 hover:cursor-pointer hover:text-[#EEAA5B] transition-all duration-150 flex group rounded-lg px-4 py-1 
                shadow-[0_0_0_1px_#c9c9c9] hover:shadow-[0_0_0_2px_#c9c9c9] active:shadow-[0_0_0_3px_#c9c9c9]
                '
                onClick={() => {
                  onRefresh();
                }}>
                <Refresh
                  fontSize='large'
                  className='hover:cursor-pointer transition-all scale-[0.8]'
                  onClick={() => router.push(`/profile/${uid}`)}
                />

                <div className='mr-[7px]'>Refresh</div>
              </div>
            </>
          )}
        </div>
        <div className='text-xl font-medium text-[#8F8F8F] w-full px-7 border-[1px] mt-4 py-2 border-w2 rounded-lg h-[132px]'>
          {isLoading
            ? playerData
              ? "Refreshing ..."
              : "Loading ..."
            : playerData
            ? playerData.signature == ""
              ? "No Signature"
              : playerData.signature
            : "Hi Hi"}
        </div>
      </div>
    </div>
  );
}
