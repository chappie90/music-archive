import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

import { formatDate } from '../helpers/formatDate';
import { urlPrettify } from '../helpers/urlPrettify';

const Genres = () => {
  const genres = [
    'Rock', 
    'Electronic', 
    'Pop', 
    'Folk, World, & Country',
    'Jazz',
    'Funk / Soul',
    'Classical',
    'Hip Hop',
    'Latin',
    'Reggae',
    'Blues',
  ];

  return (
    <div className="content-page genres-list">
      <section className="programmes-list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">      
         <h1 className="section-heading heading-white">Music Genres</h1>
          <ul className="list">        
            {genres.map(item => {
              return (  
                <li className="item" key={item.ID}>
                  <div className="info">
                    <div className="primary">
                      <h1 className="heading heading-white programme-name">{item}</h1>
                    </div>
                    <span className="border">
                    </span>
                  </div>
                  <Link 
                    className="link link-black"
                    to={{ 
                        pathname: `/genres/${urlPrettify(item)}/${2020}/1`, 
                        shortcode: item.shortcode
                      }}>
                    <span className="text">Explore Releases</span>
                    <span className="icon-wrapper">
                      <BsArrowRight className="icon" size={30} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Genres;

