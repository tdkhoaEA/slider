import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
};

function CameraPage() {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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

    const uploadToS3 = useCallback(async () => {
        if (!capturedImage) {
            alert('No image captured or selected');
            return;
        }
    
        setUploading(true);
    
        try {
            const filename = 'khoa'
            // Fetch the presigned URL
            const response = await axios.get(`${apiBaseUrl}/api/generate-presigned-url/?filename=${encodeURIComponent(filename)}`);
            const { uploadUrl } = response.data;
    
            console.log('Received presigned URL:', uploadUrl);
            
            // Convert base64 image to a Blob
            const byteString = atob(capturedImage.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: 'image/png' });
    
            console.log('Blob created:', blob.size, 'bytes', 'Type:', blob.type);
    
            // Upload to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: blob,
                headers: {
                    'Content-Type': 'image/png',
                },
            });
    
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Error response body:', errorText);
                throw new Error(`HTTP error! Status: ${uploadResponse.status}, Body: ${errorText}`);
            }
    
            const responseText = await uploadResponse.text();
            console.log('Successful response body:', responseText);
            setUploadSuccess(true);

            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Full error:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    }, [capturedImage]);

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
                    <img src={capturedImage} alt="Captured" className="rounded-lg" />
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
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        {
                            uploadSuccess && (
                                <button 
                                    onClick={() => navigate('/slider')}
                                    className="view-button bg-orange-400 text-white  py-2 px-4 rounded"
                                >
                                    View
                                </button>
                            )
                        }
                    </div>
                </>
            )}
        </div>
    );
}

export default CameraPage;