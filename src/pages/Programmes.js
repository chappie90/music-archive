import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

import { Context as ProgrammesContext } from '../context/ProgrammesContext';
import { formatDate } from '../helpers/formatDate';
import { urlPrettify } from '../helpers/urlPrettify';

const Programmes = () => {
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);

  useEffect(() => {
    getProgrammes();
  }, []);

  return (
    <div className="content-page programmes">
      <section className="programmes-list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">      
         <h1 className="section-heading heading-white">Bob Harris Shows</h1>
          <ul className="list">        
            {programmes.map(item => {
              if (!item.mostRecentSessionYear && !item.mostRecentPlaylistYear) {
                return;
              }
              return (  
                <li className="item" key={item.ID}>
                  <div className="info">
                    <div className="primary">
                      <h1 className="heading heading-white programme-name">{item.Programme}</h1>
                      <span className="station">{item.radio_station}</span>
                    </div>
                    <span className="dates">
                      <Link 
                        className="date" 
                        to={{ pathname: `/playlists/${urlPrettify(item.Programme)}/${item.playlistsRange[0].date}/${item.playlistsRange[0].progCode}` }}>
                        {formatDate(item.playlistsRange[0].date)}
                      </Link>
                      {` - `}
                      <Link 
                        className="date" 
                        to={{ pathname: `/playlists/${urlPrettify(item.Programme)}/${item.playlistsRange[1].date}/${item.playlistsRange[1].progCode}` }}>
                        {formatDate(item.playlistsRange[1].date)}
                      </Link>
                    </span>
                  </div>
                  <Link 
                    className="link link-black"
                    to={{ 
                        pathname: `/playlists/${urlPrettify(item.Programme)}/${item.shortcode}/${item.mostRecentPlaylistYear}/1`, 
                        shortcode: item.shortcode
                      }}>
                    <span className="text">View Playlists</span>
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

export default Programmes;

