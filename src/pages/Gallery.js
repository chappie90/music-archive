import React, { useState, useEffect, useContext } from 'react';
import ImageGallery from 'react-image-gallery';

import { Context as GalleryContext } from '../context/GalleryContext';

const Gallery = () => {
  const { state: { galleryImages }, getGalleryImages, } = useContext(GalleryContext);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getGalleryImages()
      .then(response => {
        setImages(response && response.map(item => {
          return {
            original: `${process.env.REACT_APP_API_BASE_URL}/public/images/gallery/main/${item.imageurl}`,
            thumbnail: `${process.env.REACT_APP_API_BASE_URL}/public/images/gallery/main/${item.imageurl}`
          }
        }));
      });
  }, []);

   useEffect(() => {
    console.log(galleryImages);
  }, [galleryImages]);

  return (
    <div className="gallery">
      <div className="images-section">
        <div className="wrapper">
          <h1 className="page-heading">Gallery</h1>
          {galleryImages.length > 0 && (
            <ImageGallery 
              showPlayButton={false} 
              showIndex={true} 
              onSlide={(currentIndex) => console.log(currentIndex)}
              items={images}
              additionalClass="gallery-slider" /> 
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;