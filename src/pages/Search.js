import React, { Fragment, useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import DatePicker from 'react-datepicker';

import MetaTags from '../components/MetaTags';
import { Context as PlaylistsContext } from '../context/PlaylistsContext';
import { Context as DiscogsContext } from '../context/DiscogsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatDate } from '../helpers/formatDate';
import { routeToState } from '../helpers/routeToState';
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
  const { 
    state: { 
      searchResults, 
      resultsCount, 
      searchTotal 
    }, 
    searchAll,
    resetSearchAll 
  } = useContext(DiscogsContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [genre, setGenre] = useState('all');
  const [style, setStyle] = useState('all');
  const [country, setCountry] = useState('all');
  const [year, setYear] = useState('all');
  const [programmeMostPlayed, setProgrammeMostPlayed] = useState('all');
  const [startDate, setStartDate] = useState(new Date('1920-01-01'));
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
    'Pop Rock', 'House', 'Vocal', 'Experimental', 'Punk', 'Alternative Rock', 'Techno', 'Disco',
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

  let years = [];
  for (let i = parseInt(startDate.toISOString().split('-')[0]); i < endDate.toISOString().split('-')[0]; i++) {
    years.push(i);
  }

  useEffect(() => {
    let initialSearch = '';
    let initialCategory = 'all';
    let initialGenre = 'all';
    let initialStyle = 'all';
    let initialCountry = 'all';
    let initialYear = 'all';
    let initialPage = 1;

    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    if (paramsObj.query) {
      initialSearch = paramsObj.query;
      setSearch(initialSearch);
    }
    if (paramsObj.type) {
      initialCategory = paramsObj.type;
      setActiveCategory(initialCategory);
    }
    if (paramsObj.genre) {
      initialGenre = routeToState(paramsObj.genre);
      setGenre(initialGenre);
    }
    if (paramsObj.style) {
      initialStyle = routeToState(paramsObj.style);
      setStyle(initialStyle);
    }
    if (paramsObj.country) {
      initialCountry = routeToState(paramsObj.country);
      setCountry(initialCountry);
    }
    if (paramsObj.year) {
      initialYear = routeToState(paramsObj.year);
      setYear(initialYear);
    }
    if (paramsObj.page) {
      initialPage = routeToState(paramsObj.page);
      setPage(initialPage);
    }
    searchAll(initialSearch, initialCategory, initialGenre, initialStyle, initialCountry, initialYear, initialPage);

    return () => {
      resetSearchAll();
    };
  }, []);

  const onSearchChanged = (text) => {
    setSearch(text);
    if (!text) {
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

  const onResetSearch = () => {
    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    paramsObj.query = undefined;
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setSearch('');
    setSearchSubmitted(false);
    setPage(1);    
    resetPlaylistsSearchState();   
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
    searchAll(search, activeCategory, genre, style, country, year, data.selected + 1);
    window.scrollTo(0, 0);
  };

  const onSetGenre = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.genre = urlPrettify(e.target.value);
    } else {
      paramsObj.genre = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setGenre(e.target.value);
    searchAll(search, activeCategory, e.target.value, style, country, year, 1);
  };

  const onSetStyle = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.style = urlPrettify(e.target.value);
    } else {
      paramsObj.style = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setStyle(e.target.value);
    searchAll(search, activeCategory, genre, e.target.value, country, year, 1);
  };

  const onSetCountry = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.country = urlPrettify(e.target.value);
    } else {
      paramsObj.country = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setCountry(e.target.value);
    searchAll(search, activeCategory, genre, style, e.target.value, year, 1);
  };

  const onSetYear = (e) => {
    const params = location.search.slice(1);  
    const paramsObj = qs.parse(params);
    if (e.target.value !== 'all') {
      paramsObj.year = urlPrettify(e.target.value);
    } else {
      paramsObj.year = undefined;
    }
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setYear(e.target.value);
    searchAll(search, activeCategory, genre, style, country, e.target.value, 1);
  };

  const onCategoryChange = (category) => {
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
    searchAll(search, category, genre, style, country, year, 1);
    window.scrollTo(0, 0);
  };

  const onResetFilters = () => {
    const params = location.search.slice(1);
    const paramsObj = qs.parse(params);
    paramsObj.genre = undefined;
    paramsObj.style = undefined;
    paramsObj.country = undefined;
    paramsObj.year = undefined;
    const paramsStr = qs.stringify(paramsObj);
    history.push(`/search/search?${paramsStr}`);
    setGenre('all');
    setStyle('all');
    setCountry('all');
    setYear('all');
    searchAll(search, activeCategory, 'all', 'all', 'all', 'all', 1);
  };

  const renderFilters = () => {
    if (activeCategory !== 'all' && activeCategory !== 'release' && activeCategory !== 'master') return;

    return (
      <div className="filters-form">
        <form className="form">
          <div className="input-wrapper">
            <select className="filter" onChange={onSetGenre} value={genre} name="genre">
               <option value='all'>Genre</option>
              {genres.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>    
            <select className="filter" onChange={onSetStyle} value={style} name="style">
               <option value='all'>Style</option>
              {styles.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>                 
            <select className="filter country-filter" onChange={onSetCountry} value={country} name="country">
              <option value='all'>Country</option>
              {countries.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select className="filter" onChange={onSetYear} value={year} name="year">
               <option value='all'>Year</option>
              {years.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            {renderResetButton()}
          </div>  
        </form>
      </div>
    );
  };

  const renderResetButton = () => {
    if (genre !== 'all' || style !== 'all' || country !== 'all' || year !== 'all') {
      return (
        <button type="button" className="reset-filters" onClick={onResetFilters}>
          Reset Filters
        </button>
      );  
    }
    
    return (
      <Fragment></Fragment>
    );

  };

  const renderResultsItemLink = (item) => {
    let link;
    if (item.type === 'artist') {
      let artist = item.title.split('/').join('-');
      link = { pathname: `/artist/${urlPrettify(artist)}/${item.id}`}
    }
    if (item.type === 'release') {
      let release = item.title.split('-')[1].slice(1);
      release = release.split('/').join('-');
      link = { pathname: `/release/${urlPrettify(release)}/${item.id}` }  
    }
    if (item.type === 'master') {
      let master = item.title.split('-')[1].slice(1);
      master = master.split('/').join('-');
      link = { pathname: `/master/${urlPrettify(master)}/${item.id}`}
    }
    if (item.type === 'label') {
      const label = item.title.split('/').join('-');
      link = { pathname: `/label/${urlPrettify(label)}/${item.id}` }  
    }
    return link;
  };

	return (
		<div className="content-page search">
      <MetaTags title="Search | The Music Archive" />
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
                  {search && <IoMdClose onClick={onResetSearch} className="reset-icon" size={25} />}
                  <button type="button" className="submit-button" onClick={() => onSearchSubmit()}>Search</button>
                </div>
              <ul className="categories-list">
               <li className={activeCategory === 'all' ? 'item active ' : 'item'} onClick={() => onCategoryChange('all')}>
                  All
                </li>
                <li className={activeCategory === 'release' ? 'item active ' : 'item'} onClick={() => onCategoryChange('release')}>
                  Release
                </li>
                <li className={activeCategory === 'master' ? 'item active ' : 'item'} onClick={() => onCategoryChange('master')}>
                  Master
                </li>
                <li className={activeCategory === 'artist' ? 'item active ' : 'item'} onClick={() => onCategoryChange('artist')}>
                  Artist
                </li>
                <li className={activeCategory === 'label' ? 'item active ' : 'item'} onClick={() => onCategoryChange('label')}>
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