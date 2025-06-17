import { useState, useMemo } from 'react';
import VideoPreview from '../components/VideoPreview';
import VideoModal from '../components/VideoModal';
import UploadModal from '../components/UploadModal';
import { mockVideos, mockMembers } from '../data/VideoData';
import './Gallery.css';

const Gallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedUploader, setSelectedUploader] = useState('all');

  const filteredAndSortedVideos = useMemo(() => {
    let filtered = mockVideos;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply uploader filter
    if (selectedUploader !== 'all') {
      filtered = filtered.filter(video => 
        video.uploader.id === parseInt(selectedUploader)
      );
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [searchQuery, sortOrder, selectedUploader]);

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1 className="gallery-title">Video Gallery</h1>
        <div className="gallery-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={selectedUploader}
            onChange={(e) => setSelectedUploader(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Uploaders</option>
            {mockMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button 
            className="new-video-button"
            onClick={() => setShowUploadModal(true)}
          >
            New Video +
          </button>
        </div>
      </div>
      <div className="gallery-grid">
        {filteredAndSortedVideos.map(video => (
          <VideoPreview
            key={video.id}
            video={video}
            onVideoClick={setSelectedVideo}
          />
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};

export default Gallery; 