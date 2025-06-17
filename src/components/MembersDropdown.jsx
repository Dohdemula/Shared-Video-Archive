import React, { useState, useRef, useEffect } from 'react';
import { mockMembers } from '../data/VideoData';
import './MembersDropdown.css';

const MembersDropdown = ({ onSelectMember }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMemberClick = (member) => {
    onSelectMember(member);
    setIsOpen(false);
  };

  return (
    <div className={`members-dropdown ${isOpen ? 'show' : ''}`} ref={dropdownRef}>
      <button className="members-dropdown-button" onClick={toggleDropdown}>
        Members
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className={`members-dropdown-content ${isOpen ? 'show' : ''}`}>
        <div className="members-dropdown-header">
          Archive Members
        </div>
        {mockMembers.map((member) => (
          <div
            key={member.id}
            className="member-item"
            onClick={() => handleMemberClick(member)}
          >
            <span className="member-name">{member.name}</span>
            <span className="member-role">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersDropdown; 