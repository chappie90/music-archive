import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import moment from 'moment';

import { formatDate } from '../helpers/formatDate';
import YoutubeVideo from '../components/YoutubeVideo';
import { Context as DiscogsContext } from '../context/DiscogsContext';

const Master = (props) => {
  const { 
    state: { master, masterVersions }, 
    getMaster, 
    resetMaster
   } = useContext(DiscogsContext);
  const [images, setImages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const id = props.match.params.id;
    getMaster(id)
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
      });

    return () => {
      resetMaster();
    };
  }, []);

  useEffect(() => {
    if (master) {
      console.log(master)
      if (master.videos) {
        setActiveVideo(master.videos[0]);
      }
    }
    
  }, [master])

  const onSetActiveVideo = (video) => {
    setActiveVideo(video);
  };

  return (
    <div className="content-page master">
      <section className="master-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <div className="helper-container">
            <div className="left-column">
              <h2 className="section-heading heading-white">
                <span>Masters</span>
                <span className="slash">/</span> 
                <span>{master?.artists[0].name}</span>
                <span className="slash">/</span> 
                <span>{master?.title}</span>
              </h2>
              <div className="intro">
                <div className="img-container">
                  {master && master.images && master.images[0].type ==='primary' ? 
                    <img className="img" src={master.images[0].uri} alt={master.title} /> :
                    <img className="img" src="/record.jpg" alt="" /> 
                  } 
                </div>
                <div className="info">
                  {master && master.artists && master.artists[0].name && <div className="row">
                    <span className="label">Artist:</span>
                    <span className="value">{master.artists[0].name}</span>
                    </div>
                  }
                  {master?.genres && <div className="row">
                      <span className="label">Genre:</span>
                      <ul className="values-list">
                        {master.genres.map((item, index) => (
                          <li className="item" key={index}>
                            {index === 0 ? `${item}` : `, ${item}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                  {master?.styles && <div className="row">
                      <span className="label">Style:</span>
                      <ul className="values-list">
                        {master.styles.join(', ')}
                      </ul>
                    </div>
                  }
                  {master?.year && <div className="row">
                      <span className="label">Year:</span>
                      <span className="value">{master.year}</span>
                    </div>
                  }
                </div>
              </div>
              {master?.images?.length > 1 && 
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
              {master?.videos &&
                <div className="videos">
                  <h2 className="section-heading heading-white">Videos</h2>
                  <div className="video-container">
                    {activeVideo && <YoutubeVideo videoUrl={activeVideo?.uri} />}
                    {master?.videos.length > 1 && <ul className="list">
                      {master?.videos.map((item, index) => (
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
              {master && master.tracklist ?
                <ul className="list">
                  <li className="list-header">  
                    <span>Pos</span>
                    <span>Track</span>
                    <span>Duration</span>
                  </li>
                  {master.tracklist.map((item, index) => (
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
                  </ul> :
                  <p className="no-results">No tracks found</p>
                }
              </div>
            </div>
          </div>
        </section>
        <section className="master-versions-section">
          <div className="section-wrapper section-wrapper-green-dark">
            <h2 className="section-heading heading-white">
              Versions
            </h2>
            {masterVersions.versions && masterVersions.versions.length > 0 ?
              <ul className="list">
                <li className="list-header">  
                  <span>Title (Format)</span>
                  <span>Label</span>
                  <span>Cat#</span>
                  <span>Country</span>
                  <span>Year</span>
                </li>
                {masterVersions.versions.map((item, index) => (
                  <li key={item.id} className="list-row">
                     <span className="list-cell">
                        {item.thumb && <img className="release-cover" src={item.thumb} alt={item.title} />}
                        {item.title}
                        {` (${item.format})`}
                      </span>     
                      <span>{item.label}</span>
                      <span>{item.catno}</span>
                      <span>{item.country}</span>
                      <span>{item.released}</span>
                  </li>
                ))}
              </ul> :
              <p className="no-results">No playlists found</p>
            }
          </div>
        </section>
    </div>
  );
};

export default Master;