import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillFacebook, AiOutlineTwitter, AiOutlineInstagram, AiFillYoutube } from 'react-icons/ai';

const SocialLinks = ({ size }) => {
  return (
    <div className="social-links">
      <ul className="list">
        <li className="item">
          <Link className="link" to="/">
            <AiFillFacebook size={size} className="icon" />
          </Link>
        </li>
        <li className="item">
          <Link className="link" to="/">
            <AiOutlineTwitter size={size} className="icon" />
          </Link>
        </li>
        <li className="item">
          <Link className="link" to="/">
            <AiOutlineInstagram size={size} className="icon" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SocialLinks;
