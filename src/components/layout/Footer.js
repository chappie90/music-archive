import React from 'react';
import { Link } from 'react-router-dom';

import SocialLinks from '../SocialLinks';

const Footer = () => {
  return (
    <div className="footer">
      <div className="wrapper">
        <div className="col col-1">
          <div className="logo">
            <img src="/logo.svg" alt="logo" />
          </div>
        </div>
        <div className="col col-2">
          <SocialLinks size={28} />
        </div>
        <div className="break"></div>
        <div className="col col-3">
          <ul className="nav-list">
            <li className="item">
              <Link className="link" to="/">Home</Link>
            </li>
            <li className="item">
              <Link className="link" to="/artists/a/1">Artists</Link>
            </li>
            <li className="item">
              <Link className="link" to="/search-playlists">Playlists</Link>
            </li>
            <li className="item">
              <Link className="link" to="/programmes">Programmes</Link>
            </li>
          </ul>
        </div>
        <div className="col col-4">
          <ul className="nav-list">
            <li className="item">
              <Link className="link" to="/gallery">Gallery</Link>
            </li>
            <li className="item">
              <Link className="link" to="/terms-of-use">Terms of Use</Link>
            </li>
            <li className="item">
              <Link className="link" to="/">Contact Bob</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;