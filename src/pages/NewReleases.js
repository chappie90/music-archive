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

const NewReleases = (props) => {
  const {
    state: { 
      releases, 
      releasesCount, 
      totalReleases,
      localArtistsReset }, 
    getNewReleases, 
    resetReleases
  } = useContext(DiscogsContext);
  const { getMostPlayed, resetPlaylistsState } = useContext(PlaylistsContext);
  const [page, setPage] = useState(null);
  const [search, setSearch] = useState('');
  const [topArtists, setTopArtists] = useState([]);
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const pageInt = props.match.params.page;
    setPage(pageInt);
    getNewReleases(pageInt);

    return () => {
      resetReleases();
    };
  }, []);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    history.push(`/new-releases/${data.selected + 1}`);
    window.scrollTo(0, 0);
    getNewReleases(data.selected + 1);
  };

	return (
    <div className="content-page artists-list">
  		<section className="list-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">
            <span>New Releases</span>
          </h2>
          {totalReleases && <span className="count">{totalReleases.toLocaleString()} results</span>}
          <ul className="list">
            {releases.length > 0 && releases.map(item => {
              const release = item.title.split('-')[1].slice(1);
              const artist = item.title.split('-')[0];
              return (
                <li className="item" key={item.id}>
                  <Link 
                    className="link"
                    to={{ pathname: `/release/${urlPrettify(release)}/${item.id}`}}
                  >
                    <img className="img" src={item.cover_image} alt={item.title} />
                    <div className="info">
                      <span className="primary">{release}</span>
                      <span className="secondary">{artist}</span>
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

export default NewReleases;
