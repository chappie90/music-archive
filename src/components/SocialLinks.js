import React from 'react';
import { AiFillFacebook, AiOutlineTwitter, AiOutlineInstagram, AiFillYoutube } from 'react-icons/ai';

const SocialLinks = ({ size }) => {
  return (
    <div className="social-links">
      <ul className="list">
        <li className="item">
          <a className="link" href="https://www.facebook.com/WhisperingBobHarris/" target="_blank" rel="noopener noreferrer">
            <AiFillFacebook size={size} className="icon" />
          </a>
        </li>
        <li className="item">
          <a className="link" href="https://twitter.com/whisperingbob" target="_blank" rel="noopener noreferrer">
            <AiOutlineTwitter size={size} className="icon" />
          </a>
        </li>
        <li className="item">
          <a className="link" href="https://www.instagram.com/whisperingbob/" target="_blank" rel="noopener noreferrer">
            <AiOutlineInstagram size={size} className="icon" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialLinks;
