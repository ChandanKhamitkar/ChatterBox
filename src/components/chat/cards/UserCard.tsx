export default function UserCard() {
    return (
        <div className="min-w-[355px] min-h-[87px] bg-[#3E404C] rounded-[18px] px-6 py-4 flex justify-between items-center">

            <div className="flex justify-center items-center space-x-2">
                <img src="/non-user.png" alt="User Profile" className="w-[47px] h-[47px]" />

                <div className="flex flex-col justify-start items-start">
                    <p className="text-sm font-semibold tracking-wide">Chandan Khamitkar</p>
                    <p className="text-sm font-light text-white/70">I'm right outside.</p>
                </div>
            </div>

            <div className="w-4 h-4 bg-[#1B91FF] rounded-full"></div>
        </div>
    );
};
