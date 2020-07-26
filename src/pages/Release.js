import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import moment from 'moment';

import { formatDate } from '../helpers/formatDate';
import YoutubeVideo from '../components/YoutubeVideo';
import { Context as DiscogsContext } from '../context/DiscogsContext';

const Release = (props) => {
  const { 
    state: { artist, release, artistReleases }, 
    getArtist, 
    getRelease,
    resetRelease
   } = useContext(DiscogsContext);
  const [images, setImages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = props.match.params.id;
    getRelease(id)
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

    return () => {
      resetRelease();
    };
  }, []);

  useEffect(() => {
    if (release) {
      if (release.videos) {
        setActiveVideo(release.videos[0]);
      }
    }
    
  }, [release])

  const onSetActiveVideo = (video) => {
    setActiveVideo(video);
  };

  return (
    <div className="content-page release">
      <section className="release-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <div className="helper-container">
            <div className="left-column">
              <h2 className="section-heading heading-white">
                <span>Releases</span>
                <span className="slash">/</span> 
                <span>{release?.title}</span>
              </h2>
              <div className="intro">
                <div className="img-container">
                  {release && release.images && release.images[0].type ==='primary' ? 
                    <img className="img" src={release.images[0].uri} alt={release.title} /> :
                    <img className="img" src="/record.jpg" alt="" /> 
                  } 
                </div>
                <div className="info">
                  {release && release.artists && release.artists[0].name && <div className="row">
                    <span className="label">Artist:</span>
                      <span className="value">{release.artists[0].name}</span>
                    </div>
                  }
                  {release && release.labels && release?.labels[0]?.name && <div className="row">
                      <span className="label">Label:</span>
                      <span className="value">{release.labels[0].name}</span>
                    </div>
                  }
                  {release?.released && <div className="row">
                      <span className="label">Released:</span>
                      <span className="value">{formatDate(release.released)}</span>
                    </div>
                  }
                  {release?.country && <div className="row">
                      <span className="label">Country:</span>
                      <span className="value">{release.country}</span>
                    </div>
                  }
                  {release?.genres && <div className="row">
                      <span className="label">Genre:</span>
                      <ul className="values-list">
                        {release.genres.join(', ')}
                      </ul>
                    </div>
                  }
                  {release?.styles && <div className="row">
                      <span className="label">Styles:</span>
                      <ul className="values-list">
                        {release.styles.join(', ')}
                      </ul>
                    </div>
                  }
                </div>
              </div>
              {release?.images?.length > 1 && 
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
              {release?.videos &&
                <div className="videos">
                  <h2 className="section-heading heading-white">Videos</h2>
                  <div className="video-container">
                    {activeVideo && <YoutubeVideo videoUrl={activeVideo?.uri} />}
                    {release?.videos.length > 1 && <ul className="list">
                      {release?.videos.map((item, index) => (
                        <li onClick={() => onSetActiveVideo(item)} className="item" key={index}>
                          <YoutubeVideo videoUrl={item.uri} />
                          <span className="title">{item.title}</span>
                          <span className="duration">{moment.utc(item.duration * 1000).format('mm:ss')}</span>
                        </li>
                      ))}
                      </ul> 
                    }
                  </div>
                </div>
              }
            </div>
            <div className="right-column">
              <h2 className="section-heading heading-white">
                Tracklist
              </h2>
              {release && release.tracklist &&
                <ul className="list">
                  <li className="list-header">  
                    <span>Pos</span>
                    <span>Track</span>
                    <span>Duration</span>
                  </li>
                  {release.tracklist.map((item, index) => (
                    <li key={item.id} className="list-row">
                      <span className="list-cell">
                        {item.position}
                      </span>   
                      <span className="list-cell">
                        {item.title}  
                      </span>
                      <span className="list-cell duration">
                        {item.duration}  
                      </span>
                      </li>
                    ))}
                  </ul>
                } 
                {!isLoading && !release.tracklist.length === 0 &&<p className="no-results">No tracks found</p>}
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Release;