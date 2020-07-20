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

const Search = (props) => {
  const { 
    state: { playlists, playlistsCount, mostPlayed, mostPlayedCount }, 
    searchPlaylists, 
    resetPlaylistsState, 
    getMostPlayed,
    resetPlaylistsSearchState
  } = useContext(PlaylistsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const { state: { searchResults, resultsCount }, searchAll } = useContext(DiscogsContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTopCategory, setActiveTopCategory] = useState('artists');
  const [numResMostPlayed, setNumResMostPlayed] = useState(10);
  const [programmeMostPlayed, setProgrammeMostPlayed] = useState('all');
  const [startDate, setStartDate] = useState(new Date('1970-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    searchAll(search, activeCategory, 1);

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
    setPage(data.selected + 1);
    // history.push(`/playlists/search?${searchTerm}/${data.selected + 1}`);
    searchAll(search, activeCategory, data.selected + 1);
     window.scrollTo(0, 0);
  };

  const numberOfResultsSetHandler = (e) => {
    setNumResMostPlayed(e.target.value);
    getMostPlayed(activeTopCategory, e.target.value, [startDate, endDate], programmeMostPlayed, 1, 10)
      .then(response => {
      });
  };

  const programmeSetHandler = (e) => {
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
  };  

  const categoryClickHandler = (category) => {
    setPage(1);
    setActiveCategory(category);
    searchAll(search, category, 1);
    window.scrollTo(0, 0);
  };

  const renderResultsItemLink = (item) => {
    let link;
    if (item.type === 'artist') {
      link = { pathname: `/artist/${urlPrettify(item.title)}/${item.id}`}
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
            </div>
            <button type="button" className="submit-button" onClick={() => onSearchSubmit()}>Search</button>
            <ul className="categories-list">
             <li className={activeCategory === 'all' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('all')}>
                All
              </li>
              <li className={activeCategory === 'release' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('release')}>
                Releases
              </li>
              <li className={activeCategory === 'artist' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('artist')}>
                Artists
              </li>
              <li className={activeCategory === 'label' ? 'item active ' : 'item'} onClick={() => categoryClickHandler('label')}>
                Labels
              </li>
            </ul>
            <div className="filters-form">
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