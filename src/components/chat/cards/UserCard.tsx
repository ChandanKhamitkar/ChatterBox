import { ChatListTypes } from "@/lib/types";

interface UserCardProps {
    chatListItem: ChatListTypes,
    selectedUser: string | undefined,
    callBackfn: (id: string, name: string, image: string) => void;
}
export default function UserCard({ chatListItem, selectedUser, callBackfn } : UserCardProps) {
    return (
        <div onClick={() => callBackfn(chatListItem.id, chatListItem.name, chatListItem.image)} className={`min-w-[355px] min-h-[87px] ${selectedUser == chatListItem.id ? 'bg-[#1B91FF]' : "bg-[#3E404C]"} rounded-[18px] px-6 py-4 flex justify-between items-center`}>

            <div className="flex justify-center items-center space-x-2">
                <img src={chatListItem.image != '' ? chatListItem.image  : "/non-user.png"} alt="User Profile" className="w-[47px] h-[47px] rounded-full" />

                <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold tracking-wide">{chatListItem.name}</p>
                    <p className="text-xs font-light text-white/70">{chatListItem.email}</p>
                </div>
            </div>

            <div className="w-4 h-4 bg-[#1B91FF] rounded-full"></div>
        </div>
    );
};
