'use client';
import MsgBox from "@/components/chat/cards/MsgBox";
import UserCard from "@/components/chat/cards/UserCard";
import Typing from "@/components/loading/Typing";
import Navbar from "@/components/navbar/Navbar";
import TopRightNotify from "@/components/notification/TopRightNotify";
import { LuSend } from "react-icons/lu";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { User } from "next-auth";
import io from 'socket.io-client';
import axios from "axios";
import { Message, DropdownType, ChatListTypes, ChatMessageType } from "@/lib/types";
import { debounce } from "lodash";


export default function Page() {
    const [user, setUser] = useState<User>();
    const [userChatSelected, setUserChatSelected] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatListTypes>({
        id: 'temp',
        name: 'temp',
        image: 'temp',
    });
    const socket = useRef<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');
    const [notifyMessages, setNotifyMessages] = useState<Message[]>([]);
    const [dropdownItems, setDropdownItems] = useState<DropdownType[]>([]);
    const [addFriend, setAddFriend] = useState<string>('');
    const [chatList, setChatList] = useState<ChatListTypes[]>([]);
    const [chatMessage, setChatMessage] = useState<ChatMessageType[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


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
        if (currentUserId != '') {
            setIsLoading(true);
            if (!socket.current) {
                socket.current = io('http://localhost:5000');
                socket.current.emit("set-user-id", currentUserId);

                socket.current.on("new-message", (newMessage: any) => {
                    console.log('new message : ', newMessage);

                    setNotifyMessages((prev) => [...prev, { id: newMessage.notifyId, msg: newMessage.msg, msgId: newMessage.msgId, senderId: newMessage.senderId, receiverId: newMessage.receiverId, name: newMessage.name, image: newMessage.image }]);
                    console.log('is user chat selecte: ', userChatSelected, " recevier id = ", selectedChat.id);
                    // if (userChatSelected) {
                        setChatMessage((prevMessages) => [
                            ...prevMessages,
                            {
                                id: newMessage.msgId,
                                msg: newMessage.msg,
                                senderId: newMessage.senderId,
                                receiverId: newMessage.receiverId,
                            },
                        ]);
                        // also toogle notifiaction of the message to true
                        // if the userChatSelected == true && receiver-id also same then toggle the notify to true ... 
                    // }
                });

                socket.current.on("typing", (details: any) => {
                    if (details.senderId === selectedChat.id) {
                        setIsTyping(true);
                    }
                });

                socket.current.on("stoppedTyping", (details: any) => {
                    if (details.senderId === selectedChat.id) {
                        setIsTyping(false);
                    }
                });
            }

            fetchChatList();
            fetchDropDownItems();

            return () => {
                if (socket.current) {
                    socket.current.off("new-message");
                    socket.current.off("typing");
                    socket.current.off("stoppedTyping");
                    socket.current.disconnect();
                    socket.current = null;
                }
            }
        }
    }, [currentUserId]);

    const fetchMessage = async (friendUserId: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/getMessages`, {
                currentUserId: currentUserId,
                friendUserId
            });
            
            if (response.data.success) {
                setChatMessage(response.data.data);
            }
            
        } catch (error) {
            console.error('Error fetching messages: ', error);
        }
        setIsLoading(false);
    };
    
    const fetchChatList = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/chatList`, { oppId: currentUserId });
            const chatItems = res.data.result;
            setChatList((prev) => [...prev, ...chatItems]);
            
        } catch (error) {
            console.error('Error fetching chat list: ', error);
        }
        setIsLoading(false);
    };

    const fetchDropDownItems = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`/api/getUnreadMessages`, { userId: currentUserId });
            const items = res.data.list;
            if (items.length > 0) {
                setDropdownItems((prev) => [...prev, ...items]);
            }
        } catch (error) {
            console.error('Error in fetchign dropdown items: ', error);
        }
        setIsLoading(false);
    };

    const handleSendMessages = async () => {
        if (messageInput.trim() !== "") {
            const newMessage = {
                msg: messageInput,
                senderId: currentUserId,
                receiverId: selectedChat?.id,
                createdAt: new Date(),
            };

            setChatMessage((prevMessages) => [...prevMessages, newMessage]);

            const addMessageRes = await axios.post('/api/addMessage', {
                msg: messageInput,
                senderId: user?.id,
                receiverId: selectedChat?.id,
            });

            const notifyId = addMessageRes?.data?.notifyId;
            const msgId = addMessageRes?.data?.msgId;

            socket.current.emit('message', {
                notifyId: notifyId,
                msgId: msgId,
                senderId: currentUserId,
                receiverId: selectedChat?.id,
                msg: messageInput,
                image: user?.image,
                name: user?.name
            });
            setMessageInput('');
            handleStoppedTyping.cancel();
        }
    };

    const addNewFriend = async () => {
        try {
            const res = await axios.post('/api/getNewFriendDetails', { friendEmail: addFriend });
            if (res.data.success) {
                setUserChatSelected(true);
                chooseChat(
                    res.data.data.id,
                    res.data.data.name,
                    res.data.data.image
                );
                const newFriend = {
                    id: res.data.data.id,
                    name: res.data.data.name,
                    image: res.data.data.image
                }
                // Chatlist = the friends list that will be visible on the left side of the screen.
                setChatList((prev) => [...prev, newFriend]);
                setAddFriend('');
            }
        } catch (error) {
            console.error('Error in adding user.');
        }
    }

    // if list exists on the left side, then this for that
    const chooseChat = (id: string, name: string, image: string) => {
        try {
            setUserChatSelected(true);
            setSelectedChat({
                id,
                name,
                image
            });
            fetchMessage(id);
        } catch (error) {
            console.error('Error in choosing chat and getting all message ', error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setNotifyMessages([]);
        }, 5000);
    }, [notifyMessages]);

    const handleTyping = debounce(() => {
        socket.current.emit("typing", {
            senderId: currentUserId,
            receiverId: selectedChat.id,
        });
    }, 300);

    const handleStoppedTyping = debounce(() => {
        socket.current.emit("stoppedTyping", {
            senderId: currentUserId,
            receiverId: selectedChat.id,
        });
    }, 2000);

    return (
        <div className="w-full h-screen flex justify-around items-center relative">

            {/* Navbar */}
            <Navbar name={user?.name ?? null} image={user?.image ?? "/non-user.png"} dropDownItems={dropdownItems} />

            {/* Chat list */}
            <div className="flex flex-col justify-center items-start space-y-4 mt-10">
                <div className="min-w-[355px] px-6 py-2 border-2 border-gray-500 rounded-[18px] flex flex-row-reverse justify-between items-center space-x-3">
                    <input type="text" value={addFriend} onChange={(e) => {
                        setAddFriend(e.target.value);
                    }} placeholder="Add your friend" className="flex-1 outline-none rounded-[18px] border-2 border-blue-500 px-4 py-2 bg-transparent text-white/70" />
                    <FiPlusCircle className="cursor-pointer size-9" onClick={() => {
                        addNewFriend();
                    }} />
                </div>
                {
                    chatList.map((item, index) => <UserCard key={index} chatListItem={item} selectedUser={selectedChat?.id} callBackfn={chooseChat} />)
                }
            </div>

            {/* chat container */}
            <div className="min-w-[800px] min-h-[511px] mt-10 px-6 pt-6 pb-2 bg-gradient-to-b from-[rgba(62,64,76,0.08)] to-[rgba(145,150,178,0.22)] rounded-[18px] flex justify-start items-start">
                {
                    !userChatSelected && <p className="w-full text-center text-white/70 tracking-wide text-lg self-center">No chat selected!!!</p>
                }
                {
                    userChatSelected &&
                    <div className="w-full h-full flex justify-center items-center flex-col ">
                        {/* Chat user details */}
                        <div className="flex justify-start items-center space-x-2 mb-6 self-baseline">
                            <img src={selectedChat?.image != '' ? selectedChat?.image : "/non-user.png"} alt="User Profile" className="w-[56px] h-[56px] rounded-full" />

                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm font-semibold tracking-wide">{selectedChat?.name}</p>
                                {/* <p className="text-sm font-light text-white/70">---</p> */}
                            </div>
                        </div>

                        {/* Incoming & outgoing message */}
                        <div className="w-full h-full flex-1 flex flex-col space-y-4 overflow-y-scroll">
                            {
                                chatMessage.map((item, index) => <MsgBox key={index} incoming={item.senderId !== currentUserId}
                                    outgoing={item.senderId === currentUserId} msg={item.msg} />)
                            }
                            {
                                isTyping && <Typing />
                            }
                        </div>

                        {/* User text input */}
                        <div className="flex justify-between items-center w-full self-end space-x-6 mt-10">
                            <input
                                value={messageInput}
                                onChange={(e) => {
                                    handleTyping();
                                    handleStoppedTyping();
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
                notifyMessages.length > 0 && <div className="absolute top-20 right-10 flex flex-col space-y-1 items-center">
                    {
                        notifyMessages.map((item, index) => <TopRightNotify senderImage={item.image} senderName={item.name} senderMsg={item.msg} key={index} />)
                    }
                </div>
            }

            {
                isLoading && <div className="w-full h-full inset-0 bg-white/30 flex justify-center items-center"><p className="text-xl animate-pulse text-white">Loading...</p></div>
            }
        </div>
    )
};
