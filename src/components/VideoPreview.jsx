import './VideoPreview.css';

const VideoPreview = ({ video, onVideoClick }) => {
  return (
    <div className="video-preview" onClick={() => onVideoClick(video)}>
      <img src={video.thumbnail} alt={video.title} />
      <div className="video-preview-info">
        <h3 className="video-preview-title">{video.title}</h3>
        <div className="video-preview-meta">
          {video.uploader && (
            <span className="uploader-name">Posted by {video.uploader.name}</span>
          )}
          <span className="video-preview-date">
            {new Date(video.uploadDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview; 