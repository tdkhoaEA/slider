import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
console.log({apiBaseUrl})

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};

const initialMetadata = {
    title: '',
    subtitle: '',
    experience: '',
    achievement: '',
    // Add more fields as needed
};

function CameraPage() {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [metadata, setMetadata] = useState(initialMetadata);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    }, [webcamRef]);

    const handleFileInput = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setCapturedImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMetadataChange = (key, value) => {
        setMetadata(prevMetadata => ({
            ...prevMetadata,
            [key]: value
        }));
    };

    const uploadToS3 = useCallback(async () => {
        if (!capturedImage) {
            alert("No image captured or selected");
            return;
        }
    
        setUploading(true);
    
        try {
            // Prepare query parameters for metadata
            const queryParams = new URLSearchParams();
            Object.entries(metadata).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(`metadata_${key}`, value);
                }
            });
    
            // Fetch the presigned URL with metadata
            const response = await axios.get(
                `${apiBaseUrl}/api/generate-presigned-url/?${queryParams.toString()}`
            );
            const { uploadUrl, imageId } = response.data;
    
            console.log("Received presigned URL:", uploadUrl);
            console.log("Image ID:", imageId);
    
            // Convert base64 image to a Blob
            const byteString = atob(capturedImage.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: "image/png" });
    
            // Prepare headers
            const headers = {
                'Content-Type': 'image/png',
                'x-amz-meta-title': metadata.title || '',
                'x-amz-meta-subtitle': metadata.subtitle || '',
                'x-amz-meta-experience': metadata.experience || '',
                'x-amz-meta-achievement': metadata.achievement || '',
            };
    
            // Upload to S3 using the presigned URL
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: blob,
                headers: headers,
            });
    
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`HTTP error! status: ${uploadResponse.status}, message: ${errorText}`);
            }
    
            console.log("Upload successful. Image ID:", imageId);
            setUploadSuccess(true);
            setMetadata({});
    
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    }, [capturedImage, metadata]);

    return (
        <div className="camera-component flex flex-col items-center">
            {!capturedImage ? (
                <>
                    <Webcam
                        audio={false}
                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={videoConstraints}
                        className="rounded-lg"
                    />
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={capture}
                            className="capture-button bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Capture
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Select Local Image
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="rounded-lg"
                    />
                    <div className="mt-4 w-full max-w-md">
                        <label className="block text-sm font-medium text-gray-700">Metadata</label>
                        {Object.entries(metadata).map(([key, value]) => (
                            <div key={key} className="mt-2">
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type="text"
                                    id={key}
                                    value={value}
                                    onChange={(e) => handleMetadataChange(key, e.target.value)}
                                    placeholder={`Enter ${key}`}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="button-group mt-4 flex space-x-2">
                        <button
                            onClick={() => setCapturedImage(null)}
                            className="retake-button bg-red-500 text-white py-2 px-4 rounded"
                            disabled={uploading}
                        >
                            Retake/Reselect
                        </button>
                        <button
                            onClick={uploadToS3}
                            className="upload-button bg-green-500 text-white py-2 px-4 rounded"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                        {uploadSuccess && (
                            <button
                                onClick={() => navigate("/slider")}
                                className="view-button bg-orange-400 text-white py-2 px-4 rounded"
                            >
                                View
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CameraPage;