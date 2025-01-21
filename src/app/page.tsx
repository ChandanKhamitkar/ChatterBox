'use client';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";



export default function Home() {
  const router = useRouter();
  return (
    <div className="flex justify-around items-center h-screen w-full p-10">
      <h1>Welcome to chatter box</h1>
      <div className="flex flex-col justify-center items-center rounded-2xl bg-[#3E404C] p-10 gap-6">
        <div className="gap-2 text-center">
          <p className="text-xl text-white">Login to your account</p>
          <p className="text-base text-white/60">Enjoy chatting with your friends...</p>
        </div>
        <div onClick={() => router.push('/api/auth/signin')} className="flex justify-center items-center rounded-3xl space-x-2 bg-white px-7 py-2 w-full text-center cursor-pointer transition-all duration-500 hover:scale-105">
          <img src={"/google.png"} alt="pGoogle logo" className="w-6 h-6 sm:w-4 sm:h-4" />
          <p className="text-black font-medium text-base ">Continue with Google</p>
        </div>
      </div>
    </div>
  );
}
