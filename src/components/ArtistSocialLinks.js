import React, { Fragment } from 'react';
import { AiFillFacebook, AiOutlineTwitter, AiOutlineInstagram, AiFillYoutube } from 'react-icons/ai';
import { FiGlobe } from 'react-icons/fi';

const ArtistSocialLinks = ({ size, website, facebook, twitter, youtube }) => {
  if (!website && !facebook && !twitter && !youtube) return <Fragment/>;

  return (
    <div className="artist-social-links">
      <ul className="list">
        {website && <li className="item">
            <a className="link" href={website} target="_blank" rel="noopener noreferrer">        
              <FiGlobe size={size} className="icon" />
              <span className="icon-label">Website</span>
            </a>
          </li>
        }
        {facebook && facebook !== '-' && <li className="item">
            <a className="link" href={`https://www.facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer">
              <AiFillFacebook size={size} className="icon" />
              <span className="icon-label">Facebook</span>
            </a>
          </li>
        }
        {twitter && <li className="item">
            <a className="link" href={`https://www.twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer">
              <AiOutlineTwitter size={size} className="icon" />
              <span className="icon-label">Twitter</span>
            </a>
          </li>
        }
        {youtube && <li className="item">
            <a className="link" href={`https://www.youtube.com/watch?v=${youtube}`} target="_blank" rel="noopener noreferrer">
              <AiFillYoutube size={size} className="icon" />
              <span className="icon-label">Youtube</span>
            </a>
          </li>
        }
      </ul>
    </div>
  );
};

export default ArtistSocialLinks;
