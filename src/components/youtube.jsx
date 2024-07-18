import { useRef, useEffect } from "react";
import YouTube from "react-youtube";

function Youtube() {
    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.internalPlayer.playVideo();
    }, []);

    return (
        <div className="w-3/4 h-auto mx-auto flex">
            <YouTube videoId="0JSIMyRozEY" opts={[]} ref={videoRef} />
        </div>
    );
}

export default Youtube;
