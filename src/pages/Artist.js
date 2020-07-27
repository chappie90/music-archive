import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosArrowDown } from 'react-icons/io';
import ImageGallery from 'react-image-gallery';
import { Context as DiscogsContext } from '../context/DiscogsContext';
import ArtistSocialLinks from '../components/ArtistSocialLinks';
import YoutubeVideo from '../components/YoutubeVideo';
import { urlPrettify } from '../helpers/urlPrettify';
import { formatDate } from '../helpers/formatDate';

const Artist = (props) => {
  const { 
    state: { 
      artist, 
      artistReleases,
      artistPlaylistResults, artistPlaylistResultsCount, artistPlaylistProgrammes }, 
    getArtist, 
    getPlaylistResultsArtist,
    resetArtistsState
   } = useContext(DiscogsContext);
  const [programmeName, setProgrammeName] = useState('');
  const [page, setPage] = useState(1);
  const [showDates, setShowDates] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const id = props.match.params.id;
      getArtist(id)
        .then(response => {
          if (response.images?.length > 1) {
            const images = response.images
              .filter(item => item.type !== 'primary')
              .map(item => {
              return {
                original: item.uri,
                thumbnail: item.uri150
              }
            });
            setImages(images);
          }
          setIsLoading(false);
        });
      getPlaylistResultsArtist(id, page);

      return () => {
        resetArtistsState();
      };
  }, []);

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

  const renderProfileImage = () => {
    if (artist && artist.images) {
      return (
        <div className="img-container">
          <img 
            className="img" 
            src={artist.images[0].uri} 
            alt={artist.name} />
        </div>
      );  
    }
  };

  if (isLoading) {
    return (
      <div className="content-page artist">
        <section className="artist-section">
          <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
            <div className="helper-container">
              <div className="left-column">
                <h2 className="section-heading heading-white">Artists</h2>
                <div className="animated-background-artist">
                  <div className="masker top-mask"></div>
                  <div className="masker left-mask"></div>
                  <div className="masker right-mask"></div>
                  <div className="masker bottom-mask"></div>
                  <div className="masker middle-left-mask"></div>
                  <div className="masker middle-right-mask"></div>
                  <div className="masker middle-bottom-mask"></div>
                </div>
                <h2 className="section-heading heading-white">Images</h2>
                <div className="animated-background-images">
                  <div className="masker top-mask"></div>
                  <div className="masker left-mask"></div>
                  <div className="masker right-mask"></div>
                  <div className="masker bottom-mask"></div>
                  <div className="masker middle-left-mask"></div>
                  <div className="masker middle-right-mask"></div>
                  <div className="masker middle-bottom-mask"></div>
                </div>
                <h2 className="section-heading heading-white">Sites</h2>
                <div className="animated-background-sites">
                  <div className="masker left-mask"></div>
                  <div className="masker right-mask"></div>
                  <div className="masker first-mask"></div>
                  <div className="masker second-mask"></div>
                  <div className="masker third-mask"></div>
                  <div className="masker fourth-mask"></div>
                  <div className="masker fifth-mask"></div>
                  <div className="masker sixth-mask"></div>
                </div>
              </div>
              <div className="right-column">
                <h2 className="section-heading heading-white">Artist Releases</h2>
                <div className="animated-background-releases">
                  <div className="masker top-mask"></div>
                  <div className="masker left-mask"></div>
                  <div className="masker right-mask"></div>
                  <div className="masker bottom-mask"></div>
                  <div className="masker middle-first-mask"></div>
                  <div className="masker middle-second-mask"></div>
                  <div className="masker middle-third-mask"></div>
                  <div className="masker middle-fourth-mask"></div>
                  <div className="masker middle-fifth-mask"></div>
                  <div className="masker middle-sixth-mask"></div>
                  <div className="masker middle-seventh-mask"></div>
                  <div className="masker middle-eight-mask"></div>
                  <div className="masker middle-ninth-mask"></div>
                  <div className="masker middle-thenth-mask"></div>
                  <div className="masker middle-eleventh-mask"></div>
                  <div className="masker middle-twelfth-mask"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }


  return (
    <div className="content-page artist">
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
                {renderProfileImage()}
                {artist?.profile && <div className="bio">
                    <p className="paragraph">{artist.profile}</p>
                  </div>
                }
              </div>
              {artist?.images?.length > 1 && 
                <div className="more-images">
                  <h2 className="section-heading heading-white">Images</h2>
                  <ImageGallery 
                    showPlayButton={false} 
                    showIndex={true} 
                    onSlide={(currentIndex) => console.log(currentIndex)}
                    items={images}
                    additionalClass="gallery-slider" /> 
                </div>
              }
              {artist && artist.urls && <div className="sites">
                  <h2 className="section-heading heading-white">Sites</h2>
                  <ul className="sites-list">
                    {artist.urls.map((item, index) => (
                      <li className="item" key={index}>
                        <a rel="noopener noreferrer" className="link link-white" href={item} target="_blank" >{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>
            <div className="right-column">
              <h2 className="section-heading heading-white">
              Artist Releases
            </h2>
            {artistReleases.releases && artistReleases.releases.length > 0 && <ul className="list">
                <li className="list-header">  
                  <span>Album / Source</span>
                  <span>Track</span>
                  <span>Year</span>
                </li>
                {artistReleases.releases && artistReleases.releases.map((item, index) => (
                  <li key={index} className="list-row">
                     <div className="list-cell album-cell">
                        {item.thumb && <div className="album-img-container">
                            <img className="album-cover" src={item.thumb} alt={item.title} />
                          </div>
                        }
                        {item.title}
                      </div>     
                      <div className="list-cell"><span className="label">Track </span><span>{item.artist}</span></div>
                      <div className="list-cell"><span className="label">Year </span><span>{item.year}</span></div>
                  </li>
                ))}
              </ul>
            }
            {!isLoading && !artistReleases.releases && <p className="no-results">No playlists found</p>}
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