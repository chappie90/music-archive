import React from 'react';
import { Link } from 'react-router-dom';

import SocialLinks from '../SocialLinks';

const Footer = () => {
  return (
    <div className="footer">
      <div className="wrapper">
        <div className="col col-1">
          <div className="logo">
            <span className="secondary">The </span>
            <span className="primary">Music </span>
            <span className="secondary">Archive</span>
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
              <Link className="link" to="/search">Search</Link>
            </li>
            <li className="item">
              <Link className="link" to="/new-releases/1">New Releases</Link>
            </li>
          </ul>
        </div>
        <div className="col col-4">
          <ul className="nav-list">
            <li className="item">
              <Link className="link" to="/genres">Genres</Link>
            </li>
            <li className="item">
              <Link className="link" to="/">Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;