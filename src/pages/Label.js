import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

import MetaTags from '../components/MetaTags';
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

  if (isLoading) {
    return (
      <div className="content-page label">
        <MetaTags title={`Label | The Music Archive`} />
        <section className="label-section">
          <div className="section-wrapper section-wrapper-full-height section-wrapper-green">
            <h2 className="section-heading heading-white">Labels</h2>
            <div className="animated-background-label">
              <div className="masker top-mask"></div>
              <div className="masker left-mask"></div>
              <div className="masker right-mask"></div>
              <div className="masker bottom-mask"></div>
              <div className="masker middle-left-mask"></div>
              <div className="masker middle-right-mask"></div>
              <div className="masker middle-bottom-mask"></div>
            </div>
            <div className="helper-container">
              <div className="left-column">
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
              </div>
              <div className="right-column">
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
            </div>
          </div>
        </section>
        <section className="label-releases-section">
          <div className="section-wrapper section-wrapper-green-dark">
            <h2 className="section-heading heading-white">
              Label Releases
            </h2>
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
        </section>
      </div>
    );
  }

  return (
    <div className="content-page label">
      <MetaTags title={`Label | ${label?.name} | The Music Archive`} />
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
                <span className="label">Profile</span>
                  <span className="value">{label.profile}</span>
                </div>
              }
              {label && label.sublabels && <div className="row">
                  <span className="label">Sublabels</span>
                  <ul className="values-list">
                    {Array.prototype.map.call(label.sublabels, s => s.name).join(', ')}
                  </ul>
                </div>
              }
              {label?.parent_label && <div className="row">
                  <span className="label">Parent Label</span>
                  <span className="value">{label.parent_label.name}</span>
                </div>
              }
              {label && label.contact_info && <div className="row">
                <span className="label">Contact</span>
                  <span className="value">{label.contact_info}</span>
                </div>
              }
            </div>
          </div>
          <div className="helper-container">
            <div className="left-column">
              {label?.images?.length > 1 && 
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
        </div>
      </section>
      <section className="label-releases-section">
        <div className="section-wrapper section-wrapper-green-dark">
          <h2 className="section-heading heading-white">
            Label Releases
          </h2>
          {labelReleases.releases && labelReleases.releases.length > 0 &&
              <ul className="list">
                <li className="list-header">  
                  <span>Artist</span>
                  <span>Title</span>
                  <span>Cat#</span>
                  <span>Year</span>
                </li>
                {labelReleases.releases.map((item, index) => (
                  <li key={item.id} className="list-row">
                     <div className="list-cell">
                        {item.thumb && <img className="artist-cover" src={item.thumb} alt={item.title} />}
                        {item.artist}
                      </div>     
                      <div className="list-cell">
                        <span className="label">Title </span>
                        <span>{item.title}</span>
                      </div>
                      <div className="list-cell">
                        <span className="label">Cat# </span>
                        <span>{item.catno}</span>
                      </div>
                      <div className="list-cell">
                        <span className="label">Year </span>
                        <span>{item.year}</span>
                      </div>
                  </li>
                ))}
              </ul>
          }
          {!isLoading && labelReleases.releases.length === 0 && <p className="no-results">No releases found</p>}
        </div>
      </section>
    </div>
  );
};

export default Label;
