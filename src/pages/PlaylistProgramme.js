import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdMusicalNote } from 'react-icons/io';

import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatProgrammeName } from '../helpers/formatProgrammeName';
import { formatDate } from '../helpers/formatDate';

const PlaylistProgramme = props => {
  const { 
    state: { playlist, playlistIntro, morePlaylists }, 
    getPlaylist, 
    resetPlaylistsState 
  } = useContext(PlaylistsContext);
  const [programmeName, setProgrammeName] = useState('');
  const [playlistDate, setPlaylistDate] = useState(null);

  useEffect(() => {
    const { programme } = props.match.params;
    setProgrammeName(formatProgrammeName(programme));

    return () => {
      resetPlaylistsState();
    };     
  }, []);

  useEffect(() => {
    const { progcode, date } = props.match.params;
    getPlaylist(progcode, date);
    setPlaylistDate(date);
  }, [props.match.params.progcode]);

  const renderIntroText = () => {
    if (!playlistIntro.title && !playlistIntro.description) {
      return;
    }
    return (
      <div className="text">
        <h2 className="heading heading-white">{playlistIntro.title}</h2>
        <p className="description">{playlistIntro.description}</p>
      </div>
    );  
  };

  return (
    <div className="content-page playlist-programme">
      <section className="playlist-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">{programmeName}
            <span className="slash">/</span> 
            <span>Playlists</span>
            <span className="slash">/</span> 
            <span>{formatDate(playlistDate)}</span>
          </h2>
          <div className="helper-container">
            <div className="left-column">
              {playlistIntro && <div className="intro">
                  {playlistIntro?.image && <div className="img-container">
                      <img 
                        className="img" 
                        src={`${process.env.REACT_APP_API_BASE_URL}/public/images/playlists/intro/${playlistIntro.image}`} 
                        alt={playlistIntro.image} />
                    </div>
                  }
                  {renderIntroText()}
                </div>
              }
              {playlist.length > 0 && <ul className="playlist">
                <li className="list-header">  
                  <span>Artist</span>
                  <span>Track</span>
                  <span>Album</span>
                  <span>Catalogue</span>
                </li>
                {playlist.map((item, index) => (
                  <li key={item.id} className="list-row">
                    {item.artist && <Link 
                        className="link link-white"
                        to={{ 
                          pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`,
                          data: item.artist}}>
                          {item.artist.name}
                      </Link>
                    }     
                    <span className="track-name">{item.track?.tracktitle}</span> 
                    <span>{item.album?.title}</span>
                    <span>{item.album?.catalogue}</span>
                  </li>
                ))}
              </ul>}
            </div>
            <div className="right-column">
              {morePlaylists && morePlaylists.length > 2 && <div className="more-playlists-sidebar">
                  <span className="heading">Also played in {playlistDate?.split('-')[0]}</span>
                  <ul className="list">
                    {morePlaylists.map((item, index) => {
                      const { programme } = props.match.params;
                      return (
                        <li key={index} className="item">
                          <Link 
                            className="link link-white"
                            to={{ pathname: `/playlists/${programme}/${item.date}/${item.progcode}` }}
                          >
                            {item.artist.wwwimage ? 
                              <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} alt={item.artist.name} /> :
                              <div className="placeholder-img">
                                <IoMdMusicalNote className="placeholder-icon" size={60} />
                              </div>
                            } 
                            <div className="description">
                              <span className="track-name">{`${item.tracknumber}. ${item.track.tracktitle}`}</span>
                              <span className="artist-name">{item.artist.name}</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaylistProgramme;