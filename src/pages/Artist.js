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
                {artist?.images[0].type ==='primary' && <div className="img-container">
                  <img 
                    className="img" 
                    src={artist.images[0].uri} 
                    alt={artist.name} />
                  </div>
                }
                {artist?.profile && <div className="bio">
                    <p className="paragraph">{artist.profile}</p>
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
                  <li key={item.id} className="list-row">
                     <div className="list-cell album-cell">
                        {item.thumb && <img className="album-cover" src={item.thumb} alt={item.title} />}
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