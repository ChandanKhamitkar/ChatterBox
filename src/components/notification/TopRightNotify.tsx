export default function TopRightNotify() {
    return (
        <div className="min-w-[228px] min-h-[53px] px-4 py-2 rounded-b-[14px] rounded-tl-[14px] bg-[#424856] flex justify-start items-center space-x-2">
            <img src="/non-user.png" alt="User Profile" className="w-[32px] h-[32px]" />

            <div className="flex flex-col justify-start items-start">
                <p className="text-[10px] font-semibold tracking-wide">Chandan Khamitkar</p>
                <p className="text-[10px] font-medium text-white/60">Sent you a message</p>
            </div>
        </div>
    );
};
