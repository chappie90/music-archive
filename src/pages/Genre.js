import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import MetaTags from '../components/MetaTags';
import { Context as DiscogsContext } from '../context/DiscogsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { routeToState } from '../helpers/routeToState';

const Genre = props => {
  const { state: { releases, releasesCount, totalReleases }, getReleasesByGenre, resetReleases } = useContext(DiscogsContext);
  const [page, setPage] = useState(1);
  const [activeDecade, setActiveDecade] = useState(null);
  const [genre, setGenre] = useState('');
  const [style, setStyle] = useState('all');
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const styles = [
    'Pop Rock', 'House', 'Vocal', 'Experimental', 'Punk', 'Alternative Rock', 'Techno', 'Disco',
    'Soul', 'Indie Rock', 'Hardcore', 'Ambient', 'Electro', 'Folk', 'Hard Rock', 'Ballad', 'Country', 'Rock & Roll',
    'Trance', 'Chanson', 'Heavy Metal', 'Psychedelic Rock', 'Downtempo', 'Folk Rock', 'Classic Rock', 'Prog Rock',
    'Noise', 'Funk', 'Soundtrack'
  ];

  useEffect(() => {
    const { genre, style, page } = props.match.params;
    let initialStyle = 'all';
    setGenre(routeToState(genre));
    if (style) {
      initialStyle = routeToState(style); 
    }
    setStyle(initialStyle);
    setPage(page);
    getReleasesByGenre(genre, initialStyle, page);

    return () => {
      resetReleases();
    }
  }, []);

  useEffect(() => {
    if (history.action === 'POP') {
      const { genre, style, page } = props.match.params;
      let initialStyle = 'all';
      if (style) {
        initialStyle = routeToState(style);
      }
      let initialGenre = routeToState(genre);
      setGenre(initialGenre);
      setStyle(initialStyle);
      setPage(page);
      getReleasesByGenre(initialGenre, initialStyle, page);
    }
  }, [pathname]);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    const { genre } = props.match.params;
    if (style) {
      history.push(`/genres/${genre}/${urlPrettify(style)}/${data.selected + 1}`);
    } else {
      history.push(`/genres/${genre}/${data.selected + 1}`);
    }
    window.scrollTo(0, 0);
    getReleasesByGenre(genre, style, data.selected + 1);
  };

  const onSetStyle = (newStyle) => {
    const { genre } = props.match.params;
    setPage(1);
    let updateStyle;

    if (newStyle === style) {
      updateStyle = 'all';
      setStyle(updateStyle);
      history.push(`/genres/${genre}/1`);
    } else {
      history.push(`/genres/${genre}/${urlPrettify(newStyle)}/1`);
      updateStyle = newStyle;
      setStyle(updateStyle);
    }

    getReleasesByGenre(genre, updateStyle, 1);
  };

  return (
    <div className="content-page genre">
      <MetaTags title={`Genre | ${genre} | The Music Archive`} />
      <section className="playlists-list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">
            <span>Genres</span>
            <span className="slash">/</span> 
            <span>{genre}</span>
          </h2>
          <div className="styles-wrapper">
            <ul className="styles-list">
              {styles.map((item, index) => (
                <li className={style === item ? 'active item' : 'item'} onClick={() => onSetStyle(item)} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {totalReleases && <span className="count">{totalReleases.toLocaleString()} results</span>}
           <ul className="list">
            {releases.map((item, index) => {
              let release = item.title.split('-')[1].slice(1);
              release = release.split('/').join('-');
              return (
                <li className="item" key={item.id}>
                  <Link 
                    className="link link-white"
                    to={`/release/${urlPrettify(release)}/${item.id}`}
                  >
                    <img className="img" src={item.cover_image} alt={item.title} />
                    <div className="info">
                      <span className="primary">{item.title}</span>
                      <span className="secondary">{item.style[0]}</span>
                      {item.year && <span className="tertiary">{item.year}</span>}
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