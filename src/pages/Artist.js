import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosArrowDown } from 'react-icons/io';
import ImageGallery from 'react-image-gallery';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon
} from "react-share";
import {Helmet} from "react-helmet";

import { Context as ArtistsContext } from '../context/ArtistsContext';
import { Context as SessionsContext } from '../context/SessionsContext';
import ArtistSocialLinks from '../components/ArtistSocialLinks';
import YoutubeVideo from '../components/YoutubeVideo';
import { formatProgrammeName } from '../helpers/formatProgrammeName';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatDate } from '../helpers/formatDate';

const Artist = (props) => {
  const { 
    state: { artist, artistPlaylistResults, artistPlaylistResultsCount, artistPlaylistProgrammes }, 
    getArtist, 
    getPlaylistResultsArtist,
    resetArtistsState
   } = useContext(ArtistsContext);
  const { state: { session }, getSession } = useContext(SessionsContext);
  const [programmeName, setProgrammeName] = useState('');
  const [page, setPage] = useState(1);
  const [showDates, setShowDates] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
      const id = props.match.params.id;
      getArtist(id)
        .then(response => {
          if (response.artistImages.length > 0) {
            setImages(response.artistImages.map(item => {
              console.log(item.image)
              return {
                original: `${process.env.REACT_APP_API_BASE_URL}/public/images/artists/artist_gallery/${item.image}`,
                thumbnail: `${process.env.REACT_APP_API_BASE_URL}/public/images/artists/artist_gallery/${item.image}`,
                description: item.caption
              }
            }))
          }
        });
      getPlaylistResultsArtist(id, page);

      return () => {
        resetArtistsState();
      };
  }, []);

  useEffect(() => {
    console.log(artist)
  }, [artist])

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    window.scrollTo(0, 0);
    const id = props.match.params.id;
   getPlaylistResultsArtist(id, data.selected + 1);
  };

  const toggleDatesList = (key) => {
    if (showDates.includes(key)) {
      setShowDates(showDates.filter(item => item !== key));
    } else {
      setShowDates([ ...showDates, key ]);
    }
  };

  return (
    <div className="content-page artist">
      <Helmet>
        <title>Testing Helmet fml</title>
        <meta name="description" content="Todos!" />
        <meta name="theme-color" content="#008f68" />
      </Helmet>
      <section className="artist-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <div className="helper-container">
            <div className="left-column">
              <h2 className="section-heading heading-white">
                <span>Artists</span>
                <span className="slash">/</span> 
                <span>{artist?.name}</span>
              </h2>
              <div className="intro">
                {artist?.image && <div className="img-container">
                  <img 
                    className="img" 
                    src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/main/${artist.image}`} 
                    alt={artist.image} />
                  </div>
                }
                {artist?.freetext && <div className="bio">
                    <p className="paragraph">{artist.freetext}</p>
                  </div>
                }
              </div>
              {artist?.youtube &&
                <YoutubeVideo videoId={artist.youtube} />
              }
              {artist && <ArtistSocialLinks
                  size={22} 
                  website={artist.url} 
                  facebook={artist.facebook} 
                  twitter={artist.twitter} 
                  youtube={artist.youtube} 
                />
              }
              {artist?.artistImages.length > 0 && 
                <ImageGallery 
                  showPlayButton={false} 
                  showIndex={true} 
                  onSlide={(currentIndex) => console.log(currentIndex)}
                  items={images}
                  additionalClass="gallery-slider" /> 
              }
            </div>
            <div className="right-column">
              <h2 className="section-heading heading-white">
              Most played tracks
            </h2>
            {Object.keys(artistPlaylistResults).length > 0 ?
              <ul className="list">
                <li className="list-header">  
                  <span>Album / Source</span>
                  <span>Track</span>
                  <span>Date played</span>
                </li>
                {Object.entries(artistPlaylistResults).map(([albumKey, albumValue]) => {  
                  if (Object.keys(albumValue).length === 0) {
                    return <div></div>;
                  }
                  const subItem = albumValue[Object.keys(albumValue)[0]][0];
                  return (
                  <li key={albumKey} className="list-row">
                    <span className="list-cell album-cell">
                      {subItem.album.url && <img className="album-cover" src={`http://images.amazon.com/images/P/${subItem.album.url}`} alt={subItem.album.title} />}
                      {subItem.album.title}
                    </span>       
                    <span className="track-container">
                      <ul className="tracks-list">
                        {Object.entries(albumValue).map(([trackKey, trackValue]) => {
                          let programme = artistPlaylistProgrammes.find(p => p.shortcode === trackValue[0].progletter)?.Programme;
                          return (
                            <li className="track-item" key={trackKey}>
                              <span className="track">{trackValue[0].track.tracktitle}</span>
                              <span className="date">
                                {trackValue.length === 1 ?
                                  <Link 
                                    className="link link-white"
                                    to={{ pathname: `/playlists/${
                                      artistPlaylistProgrammes.length > 0 && programme && urlPrettify(programme)}/${
                                      trackValue[0].date}/${
                                      trackValue[0].progcode}`
                                    }}>
                                    {formatDate(trackValue[0].date)}
                                  </Link> :
                                  <div>
                                    <div onClick={() => toggleDatesList(trackKey)} className="expand-menu">
                                      <span>Show all dates</span>
                                      {showDates.includes(trackKey) ? 
                                        <IoIosArrowDropupCircle className="caret" size={20} /> :
                                        <IoIosArrowDropdownCircle className="caret" size={20} />
                                      }
                                    </div>
                                    <ul className={showDates.includes(trackKey) ? 'dates-list' : 'dates-list-hidden'}>
                                      {Object.entries(trackValue).map(([dateKey, dateValue]) => {
                                        console.log(dateValue.date)
                                        programme = artistPlaylistProgrammes.find(p => p.shortcode === dateValue.progletter)?.Programme;
                                        return (                 
                                          <li key={dateKey} className="item">
                                            <Link 
                                              className="link link-white" 
                                              to={{ pathname: `/playlists/${artistPlaylistProgrammes.length > 0 && programme}/${dateValue.date}/${dateValue.progcode}` }}>
                                              {formatDate(dateValue.date)}
                                            </Link>                       
                                          </li>     
                                        );      
                                      })}
                                    </ul>
                                  </div>
                                }
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </span>
                  </li>
                )})}
              </ul> :
              <p className="no-results">No playlists found</p>
            }
            {artistPlaylistResultsCount > 1 && <ReactPaginate
              pageCount={artistPlaylistResultsCount}
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
          </div>
        </div>
      </section>       
    </div>
  );
};

export default Artist;