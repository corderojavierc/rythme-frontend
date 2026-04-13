import { useEffect, useRef, useState } from "react";
import LoaderScreen from "./LoaderScreen";
import { getApi } from "../App";

const API_URL = getApi() + "/likes";
const STEP = 5;
export default function LikeComponent() {
    const [countLiked, setCountLiked] = useState(0);
    const [likes, setLikes] = useState([]);

    return (
        <button
            className={countLiked > 0 ? "action-btn liked" : "action-btn"}
            onClick={() => setCountLiked(countLiked + 1)}
            style={{
                cursor: "pointer",
            }}
        >
            <span className="material-symbols-outlined">favorite</span>
            {countLiked}
        </button>
    );
}
