import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

import { formatDate } from '../helpers/formatDate';
import YoutubeVideo from '../components/YoutubeVideo';
import { Context as DiscogsContext } from '../context/DiscogsContext';

const Label = (props) => {
  const { 
    state: { artist, label, labelReleases }, 
    getArtist, 
    getLabel,
    resetLabel
   } = useContext(DiscogsContext);
  const [images, setImages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = props.match.params.id;
    getLabel(id)
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
      resetLabel();
    };
  }, []);

  return (
    <div className="content-page label">
      <section className="label-section">
        <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
          <h2 className="section-heading heading-white">
            <span>Labels</span>
            <span className="slash">/</span> 
            <span>{label?.name}</span>
          </h2>
          <div className="intro">
            <div className="img-container">
              {label && label.images && label.images[0].type ==='primary' ? 
                <img className="img" src={label.images[0].uri} alt={label.title} /> :
                <img className="img" src="/record.jpg" alt="" /> 
              } 
            </div>
            <div className="info">
              {label && label.profile && <div className="row">
                <span className="label">Profile</span><span className="divider">|</span>
                  <span className="value">{label.profile}</span>
                </div>
              }
              {label && label.sublabels && <div className="row">
                  <span className="label">Sublabels</span><span className="divider">|</span>
                  <ul className="values-list">
                    {label.sublabels.map((item, index) => (
                      <li className="item" key={index}>
                        {index === 0 ? `${item.name}` : `, ${item.name}`}
                      </li>
                    ))}
                  </ul>
                </div>
              }
              {label?.parent_label && <div className="row">
                  <span className="label">Parent Label</span><span className="divider">|</span>
                  <span className="value">{label.parent_label.name}</span>
                </div>
              }
            </div>
          </div>
          <div className="helper-container">
            <div className="left-column">
              {label?.images?.length > 1 && 
                <ImageGallery 
                  showPlayButton={false} 
                  showIndex={true} 
                  onSlide={(currentIndex) => console.log(currentIndex)}
                  items={images}
                  additionalClass="gallery-slider" /> 
              }
            </div>
            <div className="right-column">
              {label && label.urls && <div>
                  <h2 className="section-heading heading-white">Sites</h2>
                  <ul className="sites-list">
                    {label.urls.map((item, index) => (
                      <li className="item" key={index}>
                        <a rel="noopener noreferrer" className="link link-white" href={item} target="_blank" >{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>
          </div>
          <div className="">
            <h2 className="section-heading heading-white">
              Label Releases
            </h2>
            {labelReleases.releases && labelReleases.releases.length > 0 ?
              <ul className="list">
                <li className="list-header">  
                  <span>Artist</span>
                  <span>Title</span>
                  <span>Cat#</span>
                  <span>Year</span>
                </li>
                {labelReleases.releases.map((item, index) => (
                  <li key={item.id} className="list-row">
                     <span className="list-cell">
                        {item.thumb && <img className="artist-cover" src={item.thumb} alt={item.title} />}
                        {item.artist}
                      </span>     
                      <span>{item.title}</span>
                      <span>{item.catno}</span>
                      <span>{item.year}</span>
                  </li>
                ))}
              </ul> :
              <p className="no-results">No playlists found</p>
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default Label;
