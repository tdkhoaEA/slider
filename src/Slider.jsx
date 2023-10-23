import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// import Inline from "yet-another-react-lightbox/plugins/inline";

export default function Slider() {
const [open, setOpen] = React.useState(true);

return (
<>
    <div className="w-3/4 h-auto mx-auto flex">
        <button className='px-2 rounded-xl bg-green-500 w-auto h-8 m-auto hover:bg-emerald-300' type="button" onClick={() => setOpen(true)}>
            Open Lightbox
        </button>
    </div>

    <Lightbox
    plugins={[Captions, Slideshow]}
    open={open}
    close={() => setOpen(false)}
    slides={[
        { 
            src: "https://source.unsplash.com/ts1zXzsD7xc/1080x1620",
            title: "Slide title",
            description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." 
        },
        { 
            title: "Slide title",
            description: "Slide description",
            src: "https://source.unsplash.com/F_r83HEzsXI/1080x1426" 
        },
        { 
            title: "Slide title",
            description: "Slide description",
            src: "https://source.unsplash.com/m82uh_vamhg/1080x1440" },
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