import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import VideoPreview from '../components/VideoPreview';
import VideoModal from '../components/VideoModal';
import { mockVideos } from '../data/VideoData';
import './Home.css';

const Home = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const latestVideos = mockVideos.slice(0, 3);

  return (
    <div>
      <Hero />
      <div className="home-container">
        <div className="home-header">
          <h2 className="home-title">Featured Videos</h2>
          <Link to="/gallery" className="home-link">See More →</Link>
        </div>
        <div className="home-grid">
          {latestVideos.map(video => (
            <VideoPreview
              key={video.id}
              video={video}
              onVideoClick={setSelectedVideo}
            />
          ))}
        </div>
      </div>
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Home; 