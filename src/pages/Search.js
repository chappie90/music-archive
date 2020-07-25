import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import DatePicker from 'react-datepicker';

import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { Context as ProgrammesContext } from '../context/ProgrammesContext';
import { Context as DiscogsContext } from '../context/DiscogsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatDate } from '../helpers/formatDate';
const qs = require('qs');

const Search = (props) => {
  const { 
    state: { 
      playlists, 
      playlistsCount, 
      mostPlayed, 
      mostPlayedCount
    }, 
    searchPlaylists, 
    resetPlaylistsState, 
    getMostPlayed,
    resetPlaylistsSearchState
  } = useContext(PlaylistsContext); 
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const { state: { searchResults, resultsCount, searchTotal }, searchAll } = useContext(DiscogsContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTopCategory, setActiveTopCategory] = useState('artists');
  const [genre, setGenre] = useState('all');
  const [style, setStyle] = useState('all');
  const [country, setCountry] = useState('all');
  const [programmeMostPlayed, setProgrammeMostPlayed] = useState('all');
  const [startDate, setStartDate] = useState(new Date('1970-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const location = useLocation();

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

  const styles = [
    'Pop Rock', 'House', 'Vocal', 'Experimental', 'Punk', 'Synth-pop', 'Alternative Rock', 'Techno', 'Disco',
    'Soul', 'Indie Rock', 'Hardcore', 'Ambient', 'Electro', 'Folk', 'Hard Rock', 'Ballad', 'Country', 'Rock & Roll',
    'Trance', 'Chanson', 'Heavy Metal', 'Psychedelic Rock', 'Downtempo', 'Folk Rock', 'Classic Rock', 'Prog Rock',
    'Noise', 'Funk', 'Soundtrack'
  ];

  const countries = [
    'US', 'UK', 'Germany', 'France', 'Japan', 'Italy', 'Canada', 'Netherlands', 'Spain', 'Australia', 'Russia',
    'Sweden', 'Belgium', 'Brazil', 'Greece', 'Poland', 'Finland', 'Switzerland', 'Mexico', 'Denmark', 'Portugal',
    'Norway', 'Argentina', 'Austria', 'New Zealand', 'Yugoslavia', 'South Africa', 'Hungary', 'Ukraine', 'Turkey',
    'Czech Republic', 'Colombia', 'Venezuela', 'Ireland', 'India', 'Indonesia', 'Romania', 'Chile', 'Israel', 'Peru',
    'Taiwan', 'South Korea', 'Bulgaria', 'Malaysia', 'Thailand', 'Croatia', 'China', 'Serbia', 'Hong Kong', 'Lithuania'
  ];

  useEffect(() => {
    let initialSearch = '';
    let initialGenre = 'all';
    let initialStyle = 'all';
    let initialCountry = 'all';

    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    if (paramsObj.query) {
      initialSearch = paramsObj.query;
      setSearch(initialSearch);
    }
    if (paramsObj.genre) {
      initialGenre = paramsObj.genre;
      setGenre(initialGenre);
    }
    if (paramsObj.style) {
      initialStyle = paramsObj.style;
      setGenre(initialStyle);
    }
    if (paramsObj.country) {
      initialCountry = paramsObj.country;
      setCountry(initialCountry);
    }
    searchAll(initialSearch, activeCategory, initialGenre, initialStyle, initialCountry, 1);

    return () => {
      // resetPlaylistsState();
    };
  }, []);

  const onSearchChanged = (text) => {
    setSearch(text);
    if (!text) {
      // resetPlaylistsSearchState();
      setSearchSubmitted(false);
    }
  };

  const onSearchSubmit = () => {
    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    paramsObj.query = search;
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);

    setPage(1);

    if (search) {
      searchAll(search, activeCategory, 1)
        .then(response => setSearchSubmitted(true));
    } else {
      // resetPlaylistsSearchState();
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

    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    if (data.selected + 1 !== 1) {
      paramsObj.page = data.selected + 1;
    } else {
      paramsObj.page = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);

    setPage(data.selected + 1);
    searchAll(search, activeCategory, genre, style, country, data.selected + 1);
    window.scrollTo(0, 0);
  };

  const onSetGenre = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.genre = e.target.value;
    } else {
      paramsObj.genre = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setGenre(e.target.value);
    searchAll(search, activeCategory, e.target.value, style, country, 1);
  };

  const onSetStyle = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.style = e.target.value;
    } else {
      paramsObj.style = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setStyle(e.target.value);
    searchAll(search, activeCategory, genre, e.target.value, country, 1);
  };

  const onSetCountry = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.country = e.target.value;
    } else {
      paramsObj.country = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setCountry(e.target.value);
    searchAll(search, activeCategory, genre, style, e.target.value, 1);
  };

  const programmeSetHandler = (e) => {

    setProgrammeMostPlayed(e.target.value);
    
  };

  const setDateRangeHandler = (type, value) => {
    if (type === 0) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    const range = [startDate, endDate];
  };  

  const categoryClickHandler = (category) => {
    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    if (category !== 'all') {
      paramsObj.type = category;
    } else {
      paramsObj.type = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setPage(1);
    setActiveCategory(category);
    searchAll(search, category, genre, style, country, 1);
    window.scrollTo(0, 0);
  };

  const renderFilters = () => {
    if (activeCategory !== 'all' && activeCategory !== 'release' && activeCategory !== 'master') return;

    return (
      <div className="filters-form">
        <form className="form">
          <div className="input-wrapper">
            <select className="filter" onChange={onSetGenre} name="genre">
               <option value='all'>Genre</option>
              {genres.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>    
            <select className="filter" onChange={onSetStyle} name="style">
               <option value='all'>Style</option>
              {styles.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>                 
            <select className="filter country-filter" onChange={onSetCountry} name="country">
              <option value='all'>Country</option>
              {countries.map(item => (
                <option key={item} value={item}>{item}</option>
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
          </div>  
        </form>
      </div>
    );
  };

  const renderResultsItemLink = (item) => {
    let link;
    if (item.type === 'artist') {
      link = { pathname: `/artist/${urlPrettify(item.title)}/${item.id}`}
    }
    if (item.type === 'release') {
      const release = item.title.split('-')[1].slice(1);
      link = { pathname: `/release/${urlPrettify(release)}/${item.id}` }  
    }
    if (item.type === 'master') {
      const master = item.title.split('-')[1].slice(1);
      link = { pathname: `/master/${urlPrettify(master)}/${item.id}`}
    }
    if (item.type === 'label') {
      link = { pathname: `/label/${urlPrettify(item.title)}/${item.id}` }  
    }
    return link;
  };

	return (
		<div className="content-page search">
      <section className="search-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
            <h2 className="section-heading heading-white">
              <span>Find Music</span>
            </h2>
            <div className="helper-container">
                <div className="input-group">
                  <input
                    type="text" 
                    onChange={event => onSearchChanged(event.target.value)} 
                    onKeyDown={handleKeyDown}
                    className="input" 
                    placeholder="Search artists, albums and more..."
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
                  <button type="button" className="submit-button" onClick={() => onSearchSubmit()}>Search</button>
                </div>
              <ul className="categories-list">
               <li className={activeCategory === 'all' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('all')}>
                  All
                </li>
                <li className={activeCategory === 'release' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('release')}>
                  Release
                </li>
                <li className={activeCategory === 'master' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('master')}>
                  Master
                </li>
                <li className={activeCategory === 'artist' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('artist')}>
                  Artist
                </li>
                <li className={activeCategory === 'label' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('label')}>
                  Label
                </li>
              </ul>
            </div>
            {renderFilters()}
            {searchTotal && <span className="count">{searchTotal.toLocaleString()} results</span>}
            <ul className="results-list">            
              {searchSubmitted && searchResults.length === 0 && <p className="no-results">No results found</p>}
              {searchResults && searchResults.map((item, index) => (
                <li className="item" key={item.id}>
                  <Link 
                    className="link"
                    to={renderResultsItemLink(item)}
                  >
                  <div className="img-container">
                    {item.thumb && <img className="img" src={item.cover_image} alt={item.title} />}  
                  </div>
                    <div className="info">  
                      <span className="primary">{item.title}</span>
                      <span className="secondary">{`${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`}</span>
                      {item.year && <span className="tertiary">{item.year}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {resultsCount > 1 && <ReactPaginate 
              pageCount={resultsCount}
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

export default Search;