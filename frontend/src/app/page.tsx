'use client';
import { signIn } from "next-auth/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400"
});

export default function Home() {
  return (
    <div className={`flex flex-col justify-start items-start h-screen w-full py-10 px-20 space-y-16 relative ${poppins.className}`}>
      <nav>
        <p className="font-semibold text-4xl bg-gradient-to-r bg-clip-text from-white via-gray-300 to-gray-500 text-transparent">ChatterBox</p>
      </nav>

      <div className="flex flex-col justify-start items-start space-y-6">

        <p className="w-fit rounded-md px-4 py-2 bg-[#424856] text-white font-medium text-xs shadow-2xl">Messaging Platform</p>

        <p className="font-semibold text-5xl leading-[70px] text-left"><span className="text-white">Say Hi!</span> <span className="text-[#CACFE9]">To Your <br />Friends & Family</span></p>

        <div className="flex justify-center items-center space-x-5">
          <div onClick={() => signIn('google')} className="flex justify-center items-center rounded-3xl space-x-2 bg-white px-7 py-3 w-fit text-center cursor-pointer transition-all duration-500 hover:scale-105 shadow-xl">
            <img src={"/google.png"} alt="pGoogle logo" className="w-6 h-6 sm:w-5 sm:h-5" />
            <p className="text-black font-medium text-base ">Continue with Google</p>
          </div>
          <img src="/arrow-left.svg" alt="Arrow Pointing towards Google Signin" className="-rotate-6" />
        </div>
      </div>

      {/* Absolute Items */}
      <NotificationPreview imgUrl="https://avatars.githubusercontent.com/u/141998868?v=4" name="Chandan Khamitkar" msg="I&apos;d rather prefer to code." top={true} horizontalPosition="45%" />
      <NotificationPreview imgUrl="https://avatars.githubusercontent.com/u/38750492?v=4" name="Manas Malla" msg="Google Developer Expert"  horizontalPosition="40%" bottom={true} bottomPosition="bottom-20" />
      <NotificationPreview imgUrl="https://avatars.githubusercontent.com/u/116720762?v=4" name="P Siddharth" msg="Born to be leetcodian"  horizontalPosition="63%" bottom={true} bottomPosition="bottom-8" bgOpacity="76%" />
      <img src="/circles.svg" alt="Circles prop" className="absolute bottom-0 left-0" />
      <img src="/msgIconPatterns.svg" alt="Message Icon Pattern" className="absolute bottom-4 right-0" />
      <img src="/chatterbox-preview-1.png" alt="ChatterBox Chatting Preview" className="absolute right-0 bottom-10 w-[823px] h-[629px]" />

    </div>
  );
}

const NotificationPreview = (props: { imgUrl: string, name: string, msg: string, top?: boolean, bottom?: boolean, bottomPosition?: string, horizontalPosition: string, bgOpacity?: string }) => {
  return (
    <div
      style={{ left: props.horizontalPosition }}
      className={`min-w-[228px] min-h-[53px] px-4 py-2 rounded-[14px] bg-[#424856] flex justify-start items-center space-x-2 z-10 absolute ${props.top && "top-0"} ${props.bottom && `${props.bottomPosition}`} ${props.bgOpacity && `bg-opacity-75`}`}>
      <img src={props.imgUrl != '' ? props.imgUrl : "/non-user.png"} alt="User Profile" className="w-[32px] h-[32px] rounded-full" />

      <div className="flex flex-col justify-start items-start">
        <p className="text-[10px] font-semibold tracking-wide">{props.name}</p>
        <p className="text-[10px] font-medium text-white/60">{props.msg.length > 20 ? `${props.msg.substring(0, 20)}...` : props.msg}</p>
      </div>
    </div>
  );
}
