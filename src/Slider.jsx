import { useState, useRef, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// import Inline from "yet-another-react-lightbox/plugins/inline";
import YouTube from "react-youtube";

export default function Slider() {
    const [open, setOpen] = useState(true);
    const videoRef = useRef();
    // const opts = {
    //     height: '0',
    //     width: '0',
    //     playerVars: {
    //     autoplay: 1,
    //     controls: 1,
    //     modestbranding: 0,
    //     loop: 100,
    //     mute: 0,
    //     rel: 0,
    //     },
    // };

    useEffect(() => {
        videoRef.current.internalPlayer.playVideo();
    }, []);

    return (
        <>
            <div className="w-3/4 h-auto mx-auto flex">
                <button
                    className="px-2 rounded-xl bg-green-500 w-auto h-8 m-auto hover:bg-emerald-300"
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    Open Lightbox
                </button>
                <YouTube videoId="0JSIMyRozEY" opts={[]} ref={videoRef} />
            </div>

            <Lightbox
                plugins={[Captions, Slideshow]}
                open={open}
                close={() => setOpen(false)}
                slides={[
                    {
                        src: "src/assets/img1.png",
                        title: "",
                        description: (
                            <div>
                                <p className="title">Ông Nguyễn Hải Đăng</p>{" "}
                                <p className="sub-title">
                                    Tổng giám đốc công ty Kaito
                                </p>
                            </div>
                        ),
                    },
                    {
                        title: "",
                        description: (
                            <div>
                                <p className="title">Ông Trần Văn Minh</p>{" "}
                                <p className="sub-title">
                                    Đồng sáng lập, tổng giám đốc công ty ABC
                                </p>
                            </div>
                        ),
                        src: "src/assets/img2.png",
                    },
                    {
                        title: "",
                        description: (
                            <div>
                                <p className="title">Ông Trần Văn Nam</p>{" "}
                                <p className="sub-title">
                                    Đồng sáng lập, tổng giám đốc công ty ABC
                                </p>
                            </div>
                        ),
                        src: "src/assets/img3.png",
                    },
                ]}
                captions={{
                    showToggle: true,
                    descriptionTextAlign: "center",
                    descriptionMaxLines: 5,
                }}
                slideshow={{ autoplay: true, delay: 2000 }}
                // inline={{
                //     style: { width: "100%", maxWidth: "100vw", aspectRatio: "3 / 2" },
                // }}
            />
        </>
    );
}
