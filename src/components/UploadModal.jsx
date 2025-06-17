import { useState, useEffect, useRef } from 'react';
import './UploadModal.css';

const UploadModal = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup thumbnail preview URL when component unmounts or thumbnail changes
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const generateThumbnailFromVideo = async (videoFile) => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const videoURL = URL.createObjectURL(videoFile);

      video.onloadeddata = () => {
        // Set video to 25% of its duration 
        video.currentTime = video.duration * 0.25;
      };

      video.onseeked = () => {
        // Draw the current video frame on the canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(videoURL);
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };

      video.src = videoURL;
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      // Generate default thumbnail if no custom thumbnail is selected
      if (!selectedThumbnail) {
        const thumbnailBlob = await generateThumbnailFromVideo(file);
        setSelectedThumbnail(thumbnailBlob);
        setThumbnailPreview(URL.createObjectURL(thumbnailBlob));
      }
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Cleanup previous preview URL if it exists
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setSelectedThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !title) {
      alert('Please provide both a video file and a title');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', title);
      if (selectedThumbnail) {
        formData.append('thumbnail', selectedThumbnail);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // After successful upload, close the modal
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <div className="upload-modal-content">
          <button className="upload-modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="upload-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="upload-modal-title">Upload New Video</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="title">Video Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="video">Select Video</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <p className="selected-file">Selected: {selectedFile.name}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="thumbnail">Select Thumbnail (Optional)</label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {selectedThumbnail && (
                <div className="thumbnail-preview">
                  <p className="selected-file">Selected: {selectedThumbnail.name || 'Auto-generated thumbnail'}</p>
                  {thumbnailPreview && (
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="thumbnail-image"
                    />
                  )}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="upload-button"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
          {/* Hidden elements for thumbnail generation */}
          <video ref={videoRef} style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 