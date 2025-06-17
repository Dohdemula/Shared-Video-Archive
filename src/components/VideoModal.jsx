import { useEffect } from 'react';
import './VideoModal.css';

const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.className === 'video-modal-overlay') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div className="video-modal-overlay">
      <div className="video-modal">
        <div className="video-modal-content">
          <button className="video-modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="video-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video src={video.url} controls className="video-modal-player" />
          <div className="video-modal-info">
            <h2 className="video-modal-title">{video.title}</h2>
            <p className="video-modal-date">Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 