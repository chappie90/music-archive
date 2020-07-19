import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import DatePicker from 'react-datepicker';

import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { Context as ProgrammesContext } from '../context/ProgrammesContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatDate } from '../helpers/formatDate';

const PlaylistsSearch = (props) => {
  const { 
    state: { playlists, playlistsCount, mostPlayed, mostPlayedCount }, 
    searchPlaylists, 
    resetPlaylistsState, 
    getMostPlayed,
    resetPlaylistsSearchState
  } = useContext(PlaylistsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const [page, setPage] = useState(null);
  const [pageMostPlayed, setPageMostPlayed] = useState(1);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeSearchCategory, setActiveSearchCategory] = useState('all');
  const [activeTopCategory, setActiveTopCategory] = useState('artists');
  const [numResMostPlayed, setNumResMostPlayed] = useState(10);
  const [programmeMostPlayed, setProgrammeMostPlayed] = useState('all');
  const [startDate, setStartDate] = useState(new Date('1970-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    getMostPlayed(activeTopCategory, numResMostPlayed, [startDate, endDate], programmeMostPlayed, pageMostPlayed, 10);

    if (programmes.length === 0) {
      getProgrammes();
    }

    return () => {
      resetPlaylistsState();
    };
  }, []);

  const onSearchChanged = (text) => {
    setSearch(text);
    if (!text) {
      resetPlaylistsSearchState();
      setSearchSubmitted(false);
    }
  };

  const onSearchSubmit = () => {
    setPage(1);

    if (search) {
      searchPlaylists(search, activeSearchCategory, 1)
        .then(response => setSearchSubmitted(true));
    } else {
      resetPlaylistsSearchState();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const pageClickHandler = data => {

    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);

    // history.push(`/playlists/search?${searchTerm}/${data.selected + 1}`);
    
    searchPlaylists(search, activeSearchCategory, data.selected + 1)
      .then(response => {
        window.scrollTo(0, 0);
    });

  };

  const pageClickHandlerMostPlayed = data => {

    if (pageMostPlayed === `${data.selected} + 1`) {
      return;
    }

    setPageMostPlayed(data.selected + 1);

     getMostPlayed(activeTopCategory, numResMostPlayed, [startDate, endDate], programmeMostPlayed, data.selected + 1, 10)
      .then(response => {
        console.log(response)
      });
  };

  const numberOfResultsSetHandler = (e) => {
    setPageMostPlayed(1);
    setNumResMostPlayed(e.target.value);
    getMostPlayed(activeTopCategory, e.target.value, [startDate, endDate], programmeMostPlayed, 1, 10)
      .then(response => {
      });
  };

  const programmeSetHandler = (e) => {
    setPageMostPlayed(1);
    setProgrammeMostPlayed(e.target.value);
    
    getMostPlayed(activeTopCategory, numResMostPlayed, [startDate, endDate], e.target.value, 1, 10)
      .then(response => {
      });
  };

  const setDateRangeHandler = (type, value) => {
    if (type === 0) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    const range = [startDate, endDate];
    getMostPlayed(activeTopCategory, numResMostPlayed, range, programmeMostPlayed, pageMostPlayed, 10)
      .then(response => {

      });
  };  

  const searchCategoryClickHandler = (category) => {
    setActiveSearchCategory(category);
    searchPlaylists(search, category, 1)
      .then(response => {
        window.scrollTo(0, 0);
    });
  };

  const topCategoryClickHandler = (category) => {
    setPageMostPlayed(1);
    setActiveTopCategory(category);
    getMostPlayed(category, numResMostPlayed, [startDate, endDate], programmeMostPlayed, pageMostPlayed, 10)
      .then(response => {

      });
  };

  const renderTopCategoryHeader = (category) => {
    if (category === 'artists') {
      return (
        <li className="list-header">
          <span className="col-10">Pos</span>
          <span className="col-70">Artist</span>
          <span className="col-20">Plays</span>
        </li>
      );
    }
    if (category === 'albums') {
      return (
        <li className="list-header">
          <span className="col-10">Pos</span>
          <span className="col-50">Artist</span>
          <span className="col-30">Album</span>
          <span className="col-10">Plays</span>
        </li>
      );
    }
    if (category === 'tracks') {
      return (
        <li className="list-header">
          <span className="col-10">Pos</span>
          <span className="col-50">Artist</span>
          <span className="col-20">Album</span>
          <span className="col-20">Track</span>
          <span className="col-10">Plays</span>
        </li>
      );
    }
  };

  const renderTopCategoryCell = (item, index) => {
    const position = index + 1 + (pageMostPlayed - 1) * 10;
    if (item.artist && item.artistid) {
      return (
        <li key={index} className="item">
          <span className="col-10 position">{position}</span>
          <div className="artist col-70"> 
            <Link 
                className="image-link"
                to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
              >
              {item.artist.wwwimage ? 
                <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} alt={item.artist.name} /> :
                <img className="img" src={require('../images/logo.png')} alt={item.artist.name} />
              }
            </Link> 
            <Link 
              className="link link-white"
              to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
            >
              {item.artist.name}
            </Link>
          </div>
          <span className="col-20">{item.count}</span>
        </li>
      );
    }
    if (item.artist && item.albumid) {
      return (
        <li key={index} className="item">
          <span className="col-10 position">{position}</span>
          <div className="artist col-50"> 
            <Link 
              className="image-link"
              to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
            >
              {item.artist.wwwimage ? 
                <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} alt={item.artist.name} /> :
                <img className="img" src={require('../images/logo.png')} alt={item.artist.name} />
              }
            </Link> 
            <Link 
              className="link link-white"
              to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
            >
              {item.artist.name}
            </Link>
          </div>
          <span className="col-30">{item.album.title}</span>
          <span className="col-10">{item.count}</span>
        </li>
      );
    }
    if (item.artist && item.trackid) {
      return (
        <li key={index} className="item">
          <span className="col-10 position">{position}</span>
          <div className="artist col-50"> 
            <Link 
              className="image-link"
              to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
            >
              {item.artist.wwwimage ? 
                <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} alt={item.artist.name} /> :
                <img className="img" src={require('../images/logo.png')} alt={item.artist.name} />
              }
            </Link> 
            <Link 
              className="link link-white"
              to={{ pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`, data: item.artist}}
            >
              {item.artist.name}
            </Link>
          </div>
          <span className="col-20">{item.album?.title}</span>
          <span className="col-20">{item.track.tracktitle}</span>
          <span className="col-10">{item.count}</span>
        </li>
      );
    }
  };

  const renderSearchResults = (item) => {
    let match;
    if (item.match === 'artist') {
      match = item.artist.artistName;
    }
    if (item.match === 'album') {
      match = item.album.albumTitle;
    }
    if (item.match === 'track') {
      match = item.track.trackTitle;
    }
    return ( 
      match && match.replace(new RegExp(search, 'gi'), (searchTerm) => `<span style='color: #ffbb00'>${searchTerm}</span>`)
    );
  };

	return (
		<div className="content-page playlists-search">
      <section className="search-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <div className="row">
            <div className="top-column">
              <h2 className="section-heading heading-white">
                <span>Most Played</span>
              </h2>
              <ul className="categories-list">
                <li className={activeTopCategory === 'artists' ? 'item active ' : 'item'} onClick={() => topCategoryClickHandler('artists')}>
                  Artists
                </li>
                <li className={activeTopCategory === 'albums' ? 'item active ' : 'item'} onClick={() => topCategoryClickHandler('albums')}>
                  Albums
                </li>
                <li className={activeTopCategory === 'tracks' ? 'item active ' : 'item'} onClick={() => topCategoryClickHandler('tracks')}>
                  Tracks
                </li>
              </ul>
              <div className="most-played-form">
                <form className="form">
                  <div className="input-wrapper">
                    <select className="filter" onChange={numberOfResultsSetHandler} name="number">
                      <option value="10">Top 10</option>
                      <option value="20">Top 20</option>
                      <option value="50">Top 50</option>
                    </select>                     
                    <select className="filter programme-filter" onChange={programmeSetHandler} name="programme">
                      <option value='all'>All Programmes</option>
                      {programmes.map(item => (
                        <option key={item.ID} value={item.shortcode}>{item.Programme}</option>
                      ))}
                    </select>
                    <DatePicker
                      selected={startDate}
                      onChange={val => setDateRangeHandler(0, val)}
                      popperClassName="date-input" 
                      showMonthDropdown
                      showYearDropdown
                      yearDropdownItemNumber={10}
                      adjustDateOnChange
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={val => setDateRangeHandler(1, val)}
                      popperClassName="date-input"
                      showMonthDropdown
                      showYearDropdown
                      yearDropdownItemNumber={10}
                      adjustDateOnChange
                    />
                  </div>  
                </form>
              </div>
              <ul className="most-played-list">            
                {renderTopCategoryHeader(activeTopCategory)}
                {mostPlayed.length > 0 && mostPlayed.map((item, index) => (
                  renderTopCategoryCell(item, index)
                ))}
              </ul>
              {mostPlayedCount > 1 &&
                <ReactPaginate
                  pageCount={mostPlayedCount}
                  previousLabel={false}
                  nextLabel={false}
                  onPageChange={pageClickHandlerMostPlayed}
                  containerClassName={'pagination-light'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={pageMostPlayed - 1}
                />
              }
            </div>
            <div className="search-column">
              <h2 className="section-heading heading-white">
                <span>Search Playlists</span>
              </h2>
              <div className="input-group">
                <input
                  type="text" 
                  onChange={event => onSearchChanged(event.target.value)} 
                  onKeyDown={handleKeyDown}
                  className="input" 
                  placeholder="Artists, albums or tracks"
                  value={search}
                />
                {search && <IoMdClose 
                    onClick={() => {
                      setSearch('');
                      setSearchSubmitted(false);
                      setPage(1);    
                      resetPlaylistsSearchState();                   
                    }} 
                    className="reset-icon" size={25} 
                  />
                }
              </div>
              <button type="button" className="submit-button" onClick={() => onSearchSubmit()}>Search</button>
              {searchSubmitted && playlists.length === 0 && <p className="no-results">No results found</p>}
              {playlists.length > 0 && 
                <ul className="categories-list">
                  <li className={activeSearchCategory === 'all' ? 'item active ' : 'item'} onClick={() => searchCategoryClickHandler('all')}>
                    All
                  </li>
                  <li className={activeSearchCategory === 'artists' ? 'item active ' : 'item'} onClick={() => searchCategoryClickHandler('artists')}>
                    Artists
                  </li>
                  <li className={activeSearchCategory === 'albums' ? 'item active ' : 'item'} onClick={() => searchCategoryClickHandler('albums')}>
                    Albums
                  </li>
                  <li className={activeSearchCategory === 'tracks' ? 'item active ' : 'item'} onClick={() => searchCategoryClickHandler('tracks')}>
                    Tracks
                  </li>
                </ul>
              }
              {playlists.length > 0 && <ul className="search-list">
                  {playlists.map((item, index) => {
                    let programme;
                    if (item.playlist) {
                      programme = programmes.filter(p => p.shortcode === item.playlist.progletter)[0]?.Programme;
                    }
                    return (
                      <li className="item" key={index}>
                        <div className="link-container">
                          {programme && <Link 
                            className="link link-white" 
                            to={{
                              pathname: `/playlists/${urlPrettify(programme)}/${item.playlist.date}/${item.playlist.progcode}`,
                              data: {
                               progcode: item.playlist.progcode,
                               programmeName: programme
                              }
                            }}>
                            {formatDate(item.playlist.date)}
                          </Link>}
                        </div>
                        <div className="match-container">
                          <div className="match">
                            <span dangerouslySetInnerHTML={{ __html: renderSearchResults(item) }}></span> 
                            {activeSearchCategory === 'all' && 
                              <span className="match-type">
                                {`${item.match.charAt(0).toUpperCase()}${item.match.slice(1)}`}
                              </span>
                            }
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              }
              {playlistsCount > 1 &&
                <ReactPaginate
                  pageCount={playlistsCount}
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  pageRangeDisplayed={4}
                  onPageChange={pageClickHandler}
                  containerClassName={'pagination-light'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              }
            </div>
          </div>
        </div>
      </section>
    </div>
	);
};

export default PlaylistsSearch;