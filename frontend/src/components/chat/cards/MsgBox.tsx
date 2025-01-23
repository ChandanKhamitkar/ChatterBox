interface MsgProps{
    incoming: boolean;
    outgoing: boolean;
    msg: string
}

export default function MsgBox(props:MsgProps) {
    return(
        <p className={`w-fit h-fit rounded-[15px] px-5 py-3 ${props.incoming ? "bg-[#424856] text-left " : props.outgoing ? "bg-[#1B91FF] text-right self-end" : ""} font-medium text-sm`}>
            {props.msg}
        </p>
    );
};
