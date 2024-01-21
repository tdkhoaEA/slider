import { useState, useRef, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// import Inline from "yet-another-react-lightbox/plugins/inline";
import YouTube from 'react-youtube';

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

useEffect(()=>{
    videoRef.current.internalPlayer.playVideo();
}, [])

return (
<>
    <div className="w-3/4 h-auto mx-auto flex">
        <button className='px-2 rounded-xl bg-green-500 w-auto h-8 m-auto hover:bg-emerald-300' type="button" onClick={() => setOpen(true)}>
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
            src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Chị Nguyễn Thị Mỹ Linh",
            description: "Nhà sáng lập cửa hàng ABC." 
        },
        { 
            title: "Ông Trần Văn Nam",
            description: "Đồng sáng lập, tổng giám đốc công ty ABC",
            src: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        },
        { 
            title: "Anh Nguyễn Thị Trân",
            description: "Khách hàng thân thiết tại cửa hàng ABC",
            src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ]}
    captions={{ showToggle: true, descriptionTextAlign: "center", descriptionMaxLines: 5 }}
    slideshow={{ autoplay: true, delay: 2000 }}
    // inline={{
    //     style: { width: "100%", maxWidth: "100vw", aspectRatio: "3 / 2" },
    // }}
    />
</>
);
}