import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = (props, { tab }) => {
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    setActiveTab(pathname.split('/')[2]);
  }, []);

  return (
    <div className="sidebar">
      <ul className="list">
        <li className="item">
          <Link className={`link ${activeTab === 'homepage' ? 'active' : ''}`} to="/dashboard/homepage">
            Homepage
          </Link>
        </li>
        <li className="item">
          <Link className={`link ${activeTab === 'tracks' ? 'active' : ''}`} to="/dashboard/tracks">
            Tracks
          </Link>
        </li>
        <li className="item">
          <Link className={`link ${activeTab === 'albums' ? 'active' : ''}`} to="/dashboard/albums">
            Albums
          </Link>
        </li>
        <li className="item">
          <Link className={`link ${activeTab === 'artists' ? 'active' : ''}`} to="/dashboard/artists">
            Artists
          </Link>
        </li>
        <li className="item">
          <Link className={`link ${activeTab === 'playlists' ? 'active' : ''}`} to="/dashboard/playlists">
            Playlists
          </Link>
        </li>
        <li className="item">
          <Link className={`link ${activeTab === 'programmes' ? 'active' : ''}`} to="/dashboard/programmes">
            Programmes
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
