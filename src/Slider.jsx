import { useState, useRef, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// import Inline from "yet-another-react-lightbox/plugins/inline";
import axios from "axios";
import Youtube from "./components/youtube";

export default function Slider() {
    const [open, setOpen] = useState(true);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchS3Objects();
    }, []);

    const fetchS3Objects = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/api/images/");
            const fetchedObjects = response.data;

            const transformedSlides = fetchedObjects.map(obj => ({
                src: obj.url, // Assuming the key is the image URL
                title: "",
                description: (
                    <div>
                    <p className="title">{obj.metadata.title || 'Untitled'}</p>
                    <p className="sub-title">{obj.metadata.subtitle || 'No position specified'}</p>
                    {obj.metadata.experience && <p className="experience">Kinh nghiệm: {obj.metadata.experience}</p>}
                    {obj.metadata.achievement && <p className="achievement">Thành tựu: {obj.metadata.achievement}</p>}
                  </div>
                ),
                quote: obj.quote || "",
              }));
              
        
              setSlides(transformedSlides);
            setLoading(false);
        } catch (err) {
            setError("An error occurred while fetching S3 objects");
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <button
                className="px-2 rounded-xl bg-green-500 w-auto h-8 m-auto hover:bg-emerald-300"
                type="button"
                onClick={() => setOpen(true)}
            >
                Open Lightbox
            </button>
            <Youtube />

            <Lightbox
                plugins={[Captions, Slideshow]}
                open={open}
                close={() => setOpen(false)}
                slides={slides}
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
