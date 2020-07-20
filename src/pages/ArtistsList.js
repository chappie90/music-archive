import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Context as DiscogsContext } from '../context/DiscogsContext';
import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { urlPrettify } from '../helpers/urlPrettify';

const ArtistsList = (props) => {
  const {
    state: { artists, artistsCount, localArtistsReset }, 
    getArtists, 
    resetLocalArtistsState,
    resetArtistsState
  } = useContext(DiscogsContext);
  const { getMostPlayed, resetPlaylistsState } = useContext(PlaylistsContext);
  const [activeLetter, setActiveLetter] = useState('A');
  const [page, setPage] = useState(null);
  const [search, setSearch] = useState('');
  const [topArtists, setTopArtists] = useState([]);
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const location = useLocation();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    let pageInt;
    if (props.location.search) {
      pageInt = parseInt(props.location.search.split('/')[1]);
    } else {
      pageInt = props.match.params.page;
    }
    const letter = props.match.params.letter;
    const search = props.location.search.split('/')[0].substr(1);
    setPage(pageInt);
    setActiveLetter(letter.toUpperCase());
    if (search) {
      setSearch(search);
      getArtists(null, search, pageInt);
    } else {   
      getArtists(letter, null, pageInt);
    }

    getMostPlayed('artists', 20, [startDate, endDate], 'all', 1, 20)
      .then(response => {
        setTopArtists(response);
        console.log(response)
      });

    return () => {
      resetArtistsState();
      resetPlaylistsState();
    };
  }, []);

  useEffect(() => {
    if (localArtistsReset) {
      setPage(1);
      setActiveLetter('A');
      getArtists('A', null, 1);
      setSearch('');
      resetLocalArtistsState(false);
    }
  }, [localArtistsReset]);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);

    if (search) {
      history.push(`/artists/${activeLetter.toLowerCase()}/search?${search}/${data.selected + 1}`);
      window.scrollTo(0, 0);
      getArtists(null, search, data.selected + 1);
    } else {
      history.push(`/artists/${activeLetter.toLowerCase()}/${data.selected + 1}`);
      window.scrollTo(0, 0);
      console.log(data.selected)
      getArtists(activeLetter, data.selected + 1);
    }
  };

  const setActiveLetterHandler = (letter) => {
    setActiveLetter(letter);
    setPage(1);
    setSearch('');
    history.push(`/artists/${letter.toLowerCase()}/1`)
    getArtists(letter, null, 1);
  };

  const onSearchChanged = (text) => {
    setSearch(text);
    if (text) {
     getArtists(null, text, 1)
      .then(response => { 
        history.push(`/artists/${activeLetter.toLowerCase()}/search?${text}/1`);
        setPage(1);
      });
    } else {
      getArtists(activeLetter, '', 1)
      .then(response => { 
        history.push(`/artists/${activeLetter.toLowerCase()}/1`);
        setPage(1);
      });
    }
  };

	return (
    <div className="content-page artists-list">
  		<section className="list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">
            <span>Artists </span>
          </h2>
          <div className="search-container">
            <ul className="letters-list">
              {letters.map((item, index) => (
                <li className={activeLetter === item ? 'active item' : 'item'} onClick={() => setActiveLetterHandler(item)} key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <form>
              <div className="input-group">
                <input
                  type="text" 
                  onChange={event => onSearchChanged(event.target.value)} 
                  className="input" 
                  placeholder="Search artists..."
                  value={search}
                />
                {search && <IoMdClose 
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                      history.push(`/artists/${activeLetter.toLowerCase()}/1`);
                      getArtists(activeLetter, null, 1);                            
                    }} 
                    className="reset-icon" size={25} 
                  />
                }
              </div>
            </form>
          </div>
          {search && artists.length === 0 && <p className="no-results">No artists found</p>}
          <ul className="list">
            {artists.length > 0 && artists.map(item => (
              <li className="item" key={item.id}>
                <Link 
                  className="link"
                  to={{ pathname: `/artist/${urlPrettify(item.title)}/${item.id}`}}
                >
                  <img className="img" src={item.cover_image} alt={item.title} />
                  <span className="artist">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          {artistsCount > 1 && <ReactPaginate 
            pageCount={artistsCount}
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

export default ArtistsList;
