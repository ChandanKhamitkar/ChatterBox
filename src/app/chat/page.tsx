'use client';
import MsgBox from "@/components/chat/cards/MsgBox";
import UserCard from "@/components/chat/cards/UserCard";
import Typing from "@/components/loading/Typing";
import Navbar from "@/components/navbar/Navbar";
import TopRightNotify from "@/components/notification/TopRightNotify";
import { LuSend } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { User } from "next-auth";
import io from 'socket.io-client';
import axios from "axios";
import { Message } from "@/lib/types";


export default function Page() {
    const [user, setUser] = useState<User>();
    const [userChatSelected, setUserChatSelected] = useState(true);
    const socket = useRef<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');
    const [notifyMessages, setNotifyMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchUserSession = async () => {
            const res = await axios.get("/api/userSessionData");
            if (res.data.success) {
                console.log('session data : ', res.data.sessionData);
                setUser(res.data.sessionData);
                setCurrentUserId(res.data.sessionData.id);
            }
        }
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            if (!socket.current) {
                socket.current = io('http://localhost:5000');
                socket.current.emit("set-user-id", currentUserId);

                socket.current.on("new-message", (newMessage: any) => {
                    console.log('new message : ', newMessage);
                    setNotifyMessages((prev) => [...prev, newMessage]);
                });
            }
            fetchMessage();

            return () => {
                if (socket.current) {
                    socket.current.off("new-message");
                    socket.current.disconnect();
                    socket.current = null;
                }
            }
        }
    }, [currentUserId]);

    const fetchMessage = async () => {
        try {
            // const response = await axios.get(`/api/getMessages/${currentUserId}`);

            // if (response.data.success) {
            //     // reflect in dropdown OR navbar
            // }

        } catch (error) {
            console.error('Error fetching messages: ', error);
        }
    };

    const handleSendMessages = () => {
        if (messageInput.trim() !== "") {
            // also update in database
            console.log('updated noify message length = ', notifyMessages.length);
            socket.current.emit('message', {
                id: '123',
                senderId: currentUserId,
                receiverId: user?.email === 'khamitkarsaichandan1035@gmail.com' ? 'khamitkar.dev@gmail.com' : 'khamitkarsaichandan1035@gmail.com',
                msg: messageInput,
                image: user?.image,
                name: user?.name
            });
            setMessageInput('');
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setNotifyMessages([]);
        }, 5000);
    }, [notifyMessages]);

    return (
        <div className="w-full h-screen flex justify-around items-center relative">

            {/* Navbar */}
            <Navbar name={user?.name ?? null} image={user?.image ?? "/non-user.png"} />
            <div className="flex flex-col justify-center items-start space-y-4 mt-10">
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
                <UserCard />
            </div>

            {/* chat container */}
            <div className="min-w-[800px] min-h-[511px] mt-10 px-6 pt-6 pb-2 bg-gradient-to-b from-[rgba(62,64,76,0.08)] to-[rgba(145,150,178,0.22)] rounded-[18px] flex justify-start items-start">
                {
                    !userChatSelected && <p className="w-full text-center text-white/70 tracking-wide text-lg self-center">No chat selected!!!</p>
                }
                {
                    userChatSelected &&
                    <div className="w-full h-full flex justify-between items-center flex-col ">
                        {/* Chat user details */}
                        <div className="flex justify-start items-center space-x-2 mb-6 self-baseline">
                            <img src="/non-user.png" alt="User Profile" className="w-[56px] h-[56px]" />

                            <div className="flex flex-col justify-start items-start">
                                <p className="text-sm font-semibold tracking-wide">Chandan Khamitkar</p>
                                <p className="text-sm font-light text-white/70">Online</p>
                            </div>
                        </div>

                        {/* Incoming & outgoing message */}
                        <div className="w-full flex-1 flex flex-col space-y-4">
                            <MsgBox incoming />
                            <MsgBox incoming />
                            <MsgBox outgoing />
                            <MsgBox outgoing />
                            <Typing />
                        </div>

                        {/* User text input */}
                        <div className="flex justify-between items-center w-full self-end space-x-6 mt-10">
                            {/* <div className="min-h-11 flex-1 bg-[#444756] rounded-xl shadow-lg text-left  px-6 py-3">
                                <p className="text-white/60 text-base text-left">Type your message here...</p>
                            </div> */}
                            <input
                                value={messageInput}
                                onChange={(e) => {
                                    setMessageInput(e.target.value);
                                }} type="text" placeholder="Type your message here..." className="min-h-11 flex-1 bg-[#444756] rounded-xl shadow-lg px-6 py-3 placeholder-white/60 text-left outline-none hover:border-2 hover:border-blue-500" />

                            <div onClick={handleSendMessages} className="flex justify-center items-center rounded-xl bg-[#1B91FF] w-11 h-11 text-white cursor-pointer hover:scale-105 transition-all duration-200">
                                <LuSend />
                            </div>
                        </div>
                    </div>
                }
            </div>

            {/* Notify */}
            {
                notifyMessages.length > 0 && <div  className="absolute top-20 right-10 flex flex-col space-y-1 items-center">
                    {
                        notifyMessages.map((item, index) => <TopRightNotify senderImage={item.image} senderName={item.name} senderMsg={item.msg} key={index} />)
                    }
                    
                </div>
            }

        </div>
    )
};
