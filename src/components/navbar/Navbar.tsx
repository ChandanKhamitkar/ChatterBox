'use client';
import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";

export default function Navbar(props: {name: string | null , image: string}) {
    const [showDropdown, setShowDropDown] = useState(false);

    const toggleDropdown = () => {
        setShowDropDown(!showDropdown);
    }

    return (
        <nav className="w-full mt-6 flex justify-between px-16 text-white self-start absolute top-0">
            <p className="text-lg font-semibold ">
                ChatterBox
            </p>

            <div className="flex justify-center items-center space-x-3">
                <img src={props.image} alt="User Profile" className="w-8 h-8 rounded-full" />
                <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold tracking-wide">Welcome back!</p>
                    <p className="text-sm font-medium text-white/70">{props.name}</p>
                </div>

            </div>
            <div className="cursor-pointer hover:scale-105 transition-all duration-200 relative">
                <FiMessageSquare size={20} onClick={() => {
                    setShowDropDown(!showDropdown);
                }} />

                <div className="w-3 h-3 bg-[#1B91FF] rounded-full absolute -top-1 -right-1"></div>

                {/* DropDown */}
                {
                    showDropdown &&
                    <div className="min-w-[352px] h-fit bg-[#3E404C] bg-opacity-25 rounded-b-[14px] rounded-tl-[14px] shadow-lg space-y-2 absolute right-5 z-10">
                        <DropDownChild />
                        <DropDownChild />
                        <DropDownChild />
                    </div>
                }

            </div>
        </nav>
    );
};

export const DropDownChild = () => {
    return (
        <div className="w-full min-h-[87px] rounded-[18px] px-6 py-4 flex justify-between items-center">
            <div className="flex justify-center items-center space-x-2">
                <img src="/non-user.png" alt="User Profile" className="w-[47px] h-[47px]" />

                <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold tracking-wide">Chandan Khamitkar</p>
                    <p className="text-sm font-light text-white/70">Preview of the message...</p>
                </div>
            </div>

            <div className="w-5 h-5 bg-[#1B91FF] rounded-full flex justify-center items-center text-[10px]">5</div>
        </div>
    );
};
