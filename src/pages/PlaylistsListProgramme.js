import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { MdAudiotrack } from 'react-icons/md';
import { IoMdMusicalNote } from 'react-icons/io';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatProgrammeName } from '../helpers/formatProgrammeName';

const PlaylistsListProgramme = props => {
  const { 
    state: { 
      playlists, 
      playlistsCount, 
      playlistsYears, 
      mostPlayed, 
      mostPlayedCount,
      playlistsGroupByDate
    }, 
    getPlaylistsByYear, 
    resetPlaylistsState,
    getMostPlayed
  } = useContext(PlaylistsContext);
  const [page, setPage] = useState(1);
  const [activeYear, setActiveYear] = useState(null);
  const [programmeName, setProgrammeName] = useState('');
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [topTracks, setTopTracks] = useState([]);
  const [sliderSettings, setSliderSettings] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const { programme, shortcode, year } = props.match.params;
    setProgrammeName(formatProgrammeName(programme));
    setActiveYear(parseInt(year));
    getPlaylistsByYear(shortcode, year, 1);

    getMostPlayed('tracks', 16, [new Date(year), new Date(`${parseInt(year)+ 1}`)], shortcode, 1, 16)
      .then(response => {
        const settings = {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: response.length > 3 ? 4 : response.length,
          slidesToScroll: response.length > 3 ? 4 : response.length,
          autoplay: true,
          pauseOnFocus: true,
          draggable: false
        };
        setSliderSettings(settings);
        setTopTracks(response);
      });

    return () => {
      resetPlaylistsState();
    }

  }, []);

  useEffect(() => {
    if (history.action === 'POP') {
      const { year, page } = props.match.params;
      setActiveYear(parseInt(year));
      setPage(page);
    }
  }, [pathname]);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    const { programme, shortcode } = props.match.params;
    history.push(`/playlists/${programme}/${shortcode}/${activeYear}/${data.selected + 1}`);
    window.scrollTo(0, 0);
    getPlaylistsByYear(shortcode, activeYear, data.selected + 1);
  };

  const setActiveYearHandler = (year) => {
    const { programme, shortcode } = props.match.params;
    history.push(`/playlists/${programme}/${shortcode}/${year}/1`);
    setActiveYear(year);
    setPage(1);
    getPlaylistsByYear(shortcode, year, 1);
    getMostPlayed('tracks', 16, [new Date(year), new Date(`${parseInt(year)+ 1}`)], shortcode, 1, 16)
      .then(response => {
        setTopTracks(response);
      });
  };

  return (
    <div className="content-page playlists-list">
      <section className="playlists-list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">{programmeName}
            <span className="slash">/</span> 
            <span>Playlists</span>
            <span className="slash">/</span> 
            <span>{activeYear}</span>
          </h2>
          <div className="years-wrapper">
            <ul className="years-list">
              {playlistsYears && playlistsYears.map((item, index) => (
                <li className={activeYear === item ? 'active item' : 'item'} onClick={() => setActiveYearHandler(item)} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
           <ul className="months-list">
            {Object.keys(playlistsGroupByDate).map((key, value) => {
              return (
                <li className="months-item" key={value}>
                  <span className="month">{key}</span>
                  <ul className="dates-list">
                    {playlistsGroupByDate[key].map((item, index) => (
                      <li className="dates-item" key={index}>
                        <Link 
                          className="link link-white" 
                          to={{ pathname: `/playlists/${props.match.params.programme}/${item.date}/${item.progcode}` }}>
                          {item.date.split('-')[2]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      {topTracks.length > 0 && <section className="most-played-tracks">
          <div className="section-wrapper section-wrapper-green-dark">
            <h2 className="section-heading heading-white">
              <span>Most Played Tracks in {activeYear}</span>
            </h2>
            <Slider { ...sliderSettings }>
              {topTracks && topTracks.map((item, index) => (
                <div key={index} className="slider-item"> 
                  <Link 
                    className="image-link"
                    to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item}}
                  >
                  {item.artist.wwwimage ? 
                    <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} alt={item.artist.name} /> :
                    <div className="placeholder-img">
                      <IoMdMusicalNote className="placeholder-icon" size={60} />
                    </div>
                  }
                  </Link>
                  <Link className="description" to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item}}>
                    <span className="track-name">{item.track.tracktitle}</span>
                    <span className="artist-name">{item.artist.name}</span>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      }
    </div>
  );
};

export default PlaylistsListProgramme;