export default function MsgBox(props:any) {
    return(
        <p className={`w-fit h-fit rounded-[15px] px-5 py-3 ${props.incoming ? "bg-[#424856] text-left " : props.outgoing ? "bg-[#1B91FF] text-right self-end" : ""} font-medium text-sm`}>
            In calfornia, right to the street.
        </p>
    );
};
