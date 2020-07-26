import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { MdAudiotrack } from 'react-icons/md';
import { IoMdMusicalNote } from 'react-icons/io';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { Context as DiscogsContext } from '../context/DiscogsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { routeToState } from '../helpers/routeToState';

const Genre = props => {
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
  const { state: { releases, releasesCount }, getReleasesByGenre } = useContext(DiscogsContext);
  const [page, setPage] = useState(1);
  const [activeDecade, setActiveDecade] = useState(null);
  const [genre, setGenre] = useState('');
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [topTracks, setTopTracks] = useState([]);
  const [sliderSettings, setSliderSettings] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

  useEffect(() => {
    const { genre, decade } = props.match.params;
    setGenre(routeToState(genre));
    setActiveDecade(decade);
    getReleasesByGenre(genre, decade, page);

    return () => {
      resetPlaylistsState();
    }
  }, []);

  useEffect(() => {
    if (history.action === 'POP') {
      const { year, page } = props.match.params;
      setActiveDecade(parseInt(year));
      setPage(page);
    }
  }, [pathname]);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    const { genre, shortcode } = props.match.params;
    history.push(`/genres/${genre}/${activeDecade}/${data.selected + 1}`);
    window.scrollTo(0, 0);
    getReleasesByGenre(genre, activeDecade, data.selected + 1);
  };

  const setActiveYearHandler = (decade) => {
    const { genre } = props.match.params;
    history.push(`/genres/${genre}/${decade}/1`);
    setActiveDecade(decade);
    setPage(1);
    getReleasesByGenre(genre, decade, 1);
  };

  return (
    <div className="content-page genre">
      <section className="playlists-list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">{genre}
            <span className="slash">/</span> 
            <span>Playlists</span>
            <span className="slash">/</span> 
            <span>{activeDecade}</span>
          </h2>
          <div className="years-wrapper">
            <ul className="years-list">
              {decades.map((item, index) => (
                <li className={activeDecade === item ? 'active item' : 'item'} onClick={() => setActiveYearHandler(item)} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
           <ul className="list">
            {releases.map((item, index) => {
              return (
                <li className="item" key={item.id}>
                  <Link 
                    className="link link-white"
                  >
                    <img className="img" src={item.cover_image} alt={item.title} />
                    <div className="info">
                      <span className="primary">{item.title}</span>
                      <span className="secondary">{item.style[0]}</span>
                      <span className="tertiary">{item.year}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {releasesCount > 1 && <ReactPaginate 
            pageCount={releasesCount}
            previousLabel={'previous'}
            nextLabel={'next'}
            pageRangeDisplayed={4}
            onPageChange={pageClickHandler}
            containerClassName={'pagination-light'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            disableInitialCallback={true}
            forcePage={page - 1}
          />}
        </div>
      </section>
    </div>
  );
};

export default Genre;