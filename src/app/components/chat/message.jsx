import { DateTime } from "luxon";
import { decodeTime } from "ulidx";

function Message({ id, content, type }) {
    const timestamp = DateTime.fromMillis(decodeTime(id)).toLocaleString(DateTime.TIME_SIMPLE);

    return(
        <div className="flex flex-row items-center gap-3 bg-gray-500 p-2">
            <span className="whitespace-nowrap text-muted-foreground text-gray-300">{timestamp}</span>
            <span className="whitespace-normal text-right text-white">{content}</span>
        </div>
    )
}

export default Message;