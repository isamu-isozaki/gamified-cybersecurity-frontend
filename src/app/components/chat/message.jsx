import { DateTime } from "luxon";
import { decodeTime } from "ulidx";

function Message({ id, content, type }) {
    const timestamp = DateTime.fromMillis(decodeTime(id)).toLocaleString(DateTime.TIME_SIMPLE);

    

    return(
        <div className={`flex ${type == "GPT" ? "flex-row" : "flex-row-reverse"} min-w-0 max-w-full items-center gap-3 p-2`}>
            <span className="whitespace-nowrap text-muted-foreground text-gray-100">{timestamp}</span>
            <span className={`whitespace-normal text-left text-white px-4 py-2 rounded ${type == "GPT" ? "bg-gray-950" : "bg-gray-500"}`}>{content}</span>
        </div>
    )
}

export default Message;