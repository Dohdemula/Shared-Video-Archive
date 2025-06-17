import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">The Video Archive</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/gallery" className="navbar-link">Gallery</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 