import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Slider from "react-slick";

import { Context as SessionsContext } from '../context/SessionsContext';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatProgrammeName } from '../helpers/formatProgrammeName';
import { formatDate } from '../helpers/formatDate';

const SessionsList = (props) => {
  const { 
    state: { sessions, sessionsCount, sessionsYears, liveSessions }, 
    getSessionsByYear,
    getBbcLiveSessions, 
    resetSessionsState 
  } = useContext(SessionsContext);
  const [page, setPage] = useState(1);
  const [activeYear, setActiveYear] = useState(null);
  const [programmeName, setProgrammeName] = useState('');
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    pauseOnFocus: true,
    draggable: false
  };

  useEffect(() => {
    const { programme, shortcode, year, page } = props.match.params;
    setPage(page);
    setProgrammeName(formatProgrammeName(programme));
    setActiveYear(parseInt(year));
    getSessionsByYear(shortcode, year, page);
    getBbcLiveSessions(shortcode);

    return () => {
      resetSessionsState();
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
    history.push(`/sessions/${programme}/${shortcode}/${activeYear}/${data.selected + 1}`);
    window.scrollTo(0, 0);
    getSessionsByYear(shortcode, activeYear, data.selected + 1);
  };

  const setActiveYearHandler = (year) => {
    const { programme, shortcode } = props.match.params;
    history.push(`/sessions/${programme}/${shortcode}/${year}/1`);
    setActiveYear(year);
    setPage(1);
    getSessionsByYear(shortcode, year, 1);
  };

  return (
    <div className="content-page sessions-list">
      <section className="sessions-list-section">
        <div className="wrapper">
          <h2 className="programme-name">{programmeName}
            <span className="slash">/</span> 
            <span>Sessions</span>
            <span className="slash">/</span> 
            <span className="playlist-year">{activeYear}</span>
          </h2>
          <ul className="years-list">
            {sessionsYears && sessionsYears.length > 0 && sessionsYears.map((item, index) => (
              <li className={activeYear === item ? 'active item' : 'item'} onClick={() => setActiveYearHandler(item)} key={item}>
                {item}
              </li>
            ))}
          </ul>
          <ul className="sessions-list">
            {sessions.map(item => (
              <li className="item" key={item.id}>
                <div className="left-column">
                  {item.image && item.artist &&
                    <Link 
                      className="link" 
                      to={{ 
                        pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`,
                        data: item
                      }} 
                    >
                      <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/sessions/original/${item.image}`} />
                    </Link>
                  }
                  {item.bbcshowcase && <span className="cta-listen">
                      <a className="link" href={`http://www.bbc.co.uk/programmes/${item.bbcshowcase}`} target="_blank">
                        Listen
                      </a>
                    </span>
                  }
                </div>
                <div className="details">
                  {item.artist && <Link 
                      className="title" 
                      to={{ 
                        pathname: `/artist/${urlPrettify(item.artist.name)}/${item.artist.artistid}`,
                        data: item
                      }} 
                    >
                      {item.artist.name}
                    </Link>
                  }
                  <ul className="tracks-list">
                    {item.tracks.map((item, index) => (
                      <li className="track" key={index}>
                        {item.track.tracktitle}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="date">{formatDate(item.progdate)}</span>
              </li>
            ))}
          </ul>
          {sessionsCount > 1 && <ReactPaginate
              pageCount={sessionsCount}
              previousLabel={'previous'}
              nextLabel={'next'}
              pageRangeDisplayed={4}
              onPageChange={pageClickHandler}
              containerClassName={'pagination-light'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              forcePage={page - 1}
            />
          }
        </div>
      </section>
      {liveSessions && liveSessions.length > 0 &&
        <section className="bbc-live-sessions">
          <div className="wrapper">
            <h2 className="section-heading">
              <span>Available on BBC Radio 2</span>
            </h2>
            
              <Slider {...settings}>
                {liveSessions && liveSessions.map((item, index) => {
                  if (item.image) {
                    return (
                      <div key={index} className="slider-item"> 
                        <img className="img" src={`${process.env.REACT_APP_API_BASE_URL}/public/images/sessions/original/${item.image}`} alt={item.artist.name} />
                        <div className="description">
                          <div className="artist">
                            <span className="artist-name">{item.artist.name}</span>
                          </div>
                          <a className="cta-listen" href={`http://www.bbc.co.uk/programmes/${item.bbcshowcase}`} target="_blank">
                            Listen
                          </a>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  } 
                })}
              </Slider>
            }
          </div>
        </section>
      }
    </div>
  );
};

export default SessionsList;