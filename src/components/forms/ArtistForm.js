import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { IoMdImages, IoMdTrash } from 'react-icons/io';
import { GrImage } from 'react-icons/gr';
import { MdComment } from 'react-icons/md';
import { DotLoader } from 'react-spinners';

import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { addNotification } from '../../helpers/addNotification';

const ArtistForm = ({ closeModal, currentItem }) => {
  const { state: { artists }, getArtistsManager, saveArtist, updateArtist, checkArtistAvailability } = useContext(ArtistsContext);
  const [newArtistImage, setNewArtistImage] = useState(null);
  const [currentArtistImage, setCurrentArtistImage] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [currentCoverImage, setCurrentCoverImage] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
  const [updatedCurrentGalleryImages, setUpdatedCurrentGalleryImages] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [artistAvailable, setArtistAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const artistImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const fileMultipleInputRef = useRef(null);

  useEffect(() => {
    if (currentItem) {
      setArtistName(currentItem.name);
      if (currentItem.image) {
        setCurrentArtistImage(currentItem.image);
      }
      if (currentItem.wwwimage) {
        setCurrentCoverImage(currentItem.wwwimage);
      }
      setCurrentGalleryImages([ ...currentItem.artistGalleryImages ]);
      setUpdatedCurrentGalleryImages([ ...currentItem.artistGalleryImages ]);
    }
  }, [currentItem]);

  const onSearchArtists = (text) => {
    setArtistName(text);
    if (!text) {
      setArtistAvailable(true);
      return;
    }
    checkArtistAvailability(text)
      .then(response => {
        if (response) setArtistAvailable(response.artist ? true : false);
      });
  };

  const validate = (artist) => {
    const errors = {};
    if (!artistName) {
      errors.name = 'Required';
    }
    if (currentItem?.name !== artistName && !artistAvailable) {
      errors.name = 'Another artist with that name already exists';
    }
    return errors;
  };

  const fileChangedHandler = (category, event) => {
    if (category === 'artistImage') {
      setNewArtistImage(event.target.files[0]);
    }
    if (category === 'coverImage') {
      setNewCoverImage(event.target.files[0]);
    }
  };

  const deleteImage = (category, type, image) => {
    if (category === 'coverImage') {
      if (type === 'new') {
        setNewCoverImage(null);
      }
      if (type === 'current') {
        setCurrentCoverImage(null);    
      }
    }
    if (category === 'artistImage') {
      if (type === 'new') {
        setNewArtistImage(null);
      }
      if (type === 'current') {
        setCurrentArtistImage(null);    
      }
    }
  };

  const fileMultipleChangedHandler = (event) => {
    const fileNameFilter = newGalleryImages.map(file => file.file.name);
    const filterDuplicatesNewImages = [ ...event.target.files].filter(file => !fileNameFilter.includes(file.name));
    const imageNameFilter = updatedCurrentGalleryImages.map(img => img.image);
    const filterDuplicatesCurrentImages = [ ...filterDuplicatesNewImages ].filter(file => !imageNameFilter.includes(file.name));
    const previewGalleryImages = filterDuplicatesCurrentImages.map(item => {
      return {
        file: item,
        caption: ''
      }
    });
    setNewGalleryImages([ ...newGalleryImages, ...previewGalleryImages ]);
  };

  const deleteGalleryImage = (type, item) => {
    if (type === 'current') {
      setUpdatedCurrentGalleryImages(updatedCurrentGalleryImages.filter(image => image.image !== item.image));
    }
    if (type === 'new') {
      setNewGalleryImages(newGalleryImages.filter(image => image.file.name !== item));
    }
  };

  const onAddCaption = (type, item, text) => {
    let updateCaption;
    if (type === 'current') {
      updateCaption = updatedCurrentGalleryImages.map(image => {
        return image.image === item.image ?
          {
            ...image,
            caption: text
          } :
          image;
      });
      setUpdatedCurrentGalleryImages(updateCaption);
    }
    if (type === 'new') {
      updateCaption = newGalleryImages.map(image => {
        return image.file.name === item.file.name ?
          {
            ...image,
            caption: text
          } :
          image;
      });
      setNewGalleryImages(updateCaption);
    } 
  };

  const onSubmit = async (formData) => {
    setIsSaving(true);
    let artistData = new FormData();
    if (currentItem?.wwwimage && !currentCoverImage && currentItem.wwwimage !== newCoverImage?.name) {
      formData.wwwimage = '';
      artistData.append('deletedCoverImage', currentItem.wwwimage);
    }
    if (currentItem?.image && !currentArtistImage && currentItem.image !== newArtistImage?.name) {
      formData.image = '';
      artistData.append('deletedArtistImage', currentItem.image);
    }
    Object.keys(formData).forEach(key => {
      artistData.append(key, formData[key]);
    });
    artistData.append('artistName', artistName);
    if (newArtistImage) {
      artistData.append(
        'artistImage',
        newArtistImage,
        newArtistImage.name
      );
    }
    if (newCoverImage) {
      artistData.append(
        'coverImage',
        newCoverImage,
        newCoverImage.name
      );
    }
    if (newGalleryImages.length > 0) {
      for (let galleryImage of newGalleryImages) {
        artistData.append(
          'artistGalleryImages',
          galleryImage.file,
          galleryImage.file.name
        );
      }
      artistData.append(
        'newGalleryImages', 
        JSON.stringify(newGalleryImages.map(item => {
          return {
            name: item.file.name,
            caption: item.caption
          }
        }))
      );
    }
    let modifiedCaptionArr = [], deletedGalleryImages = [];
    for (let original of currentGalleryImages) {
      const updated = updatedCurrentGalleryImages.find(orig => orig.id === original.id);
      if (!updated) {
        deletedGalleryImages.push(original);
      } else if (original.caption !== updated.caption) {
        modifiedCaptionArr.push(updated);
      }
    }
    if (modifiedCaptionArr.length > 0) {
      artistData.append('modifiedGalleryCaptions', JSON.stringify(modifiedCaptionArr));
    }

    if (deletedGalleryImages.length > 0) {
      artistData.append('deletedGalleryImages', JSON.stringify(deletedGalleryImages));
    }

    const actionFnc = currentItem ? updateArtist : saveArtist;
    let title, type, message;
    actionFnc(artistData)
      .then(response => {
        getArtistsManager('', 1)
          .then(result => {
            setIsSaving(false);
            closeModal();
            if (response.status === 200) {
              title = 'Success!';
              type = 'success';
              message = response.data.message;
              addNotification(title, message, type);
            }
          });
      })
      .catch(err => {
        setIsSaving(false);
        if (err.response.status === 422) {
          title = 'Error!'  
          type = 'danger';
          message = err.response.data.message;
          addNotification(title, message, type);
        }
      });
  };

  return (
    <Form
      validate={validate}
      onSubmit={onSubmit}
      initialValues={
        currentItem ? 
          {
            ...currentItem,
            list: currentItem.list === -1 ? false : true 
          } :
          null
      }
      render={({ handleSubmit, form, submitting, pristine, reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="name">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="name" className="label">Name</label>
                  {meta.error && meta.touched && <span className="error input-type">{meta.error}</span>}
                </div>
                <input
                  { ...input }
                  onChange={(event) => onSearchArtists(event.target.value)}  
                  id="name"
                  type="text" 
                  placeholder="Name" 
                  value={artistName}
                /> 
              </div>
            )}
          </Field>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="coverImage" className="label">Artist Image</label>
              <span className="input-type"> Optional</span>
            </div>
            {newArtistImage && 
              <div className="img-container img-container-artist">         
                <div onClick={() => deleteImage('artistImage', 'new', newArtistImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newArtistImage)} 
                  onClick={() => artistImageInputRef.current.click()} 
                  className="artist-cover-image" 
                />
              </div>
            }
            {currentArtistImage && !newArtistImage &&
              <div className="img-container img-container-artist">   
                <div onClick={() => deleteImage('artistImage', 'current', currentArtistImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/main/${currentArtistImage}`} 
                  onClick={() => artistImageInputRef.current.click()}
                  className="artist-cover-image" 
                />
              </div>
            }
            {!currentArtistImage && !newArtistImage && <div onClick={() => artistImageInputRef.current.click()} className="image-placeholder">
                <GrImage size={45} className="placeholder-icon" />
              </div>
            } 
            <Field name="image">
              {props => (
                <div className="input-group">
                  <input 
                    ref={artistImageInputRef}
                    className="file-input"
                    type="file" 
                    accept="image/*" 
                    id="coverImage"
                    onChange={(e) => fileChangedHandler('artistImage', e)} />
                  <span className="instructions">
                    <p>This is the main artist image displayed on top of the artist page.</p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <Field name="freetext">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header"> 
                  <label htmlFor="freetext" className="label">Bio</label>
                  <span className="input-type"> Optional</span>
                </div>  
                <textarea 
                  { ...input }
                  id="freetext"
                  placeholder="Bio" 
                  rows="5"
                  />
                <span className="instructions">
                  <p>
                    You can add descriptive information about the artist to be displayed on the artist page.
                    This field has a 2000 character limit.
                  </p>
                </span>
              </div>
            )}
          </Field> 
          <div className="input-group">
            <div className="input-group-header"> 
              <label htmlFor="url" className="label">Website</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="url" placeholder="Website" name="url" component="input" type="text" />
            <span className="instructions">
              <p>This is the full URL of an artist's professional website.</p>
              <p>
                E.g. 'http://www.katecampbell.com/'
              </p>
            </span>
          </div>
          <div className="input-group">
            <div className="input-group-header"> 
              <label htmlFor="facebook" className="label">Facebook Profile</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="facebook" placeholder="Facebook" name="facebook" component="input" type="text" />
            <span className="instructions">
              <p>This is the URL path to an artist's facebook profile page.</p>
              <p>
                E.g. Add <span className="important">KateCampbellMusic</span> to show a link to Kate's Facebook profile page
                available at 'https://www.facebook.com/KateCampbellMusic'
              </p>
            </span>
          </div>
          <div className="input-group">
            <div className="input-group-header"> 
              <label htmlFor="twitter" className="label">Twitter Profile</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="twitter" placeholder="Twitter" name="twitter" component="input" type="text" />
            <span className="instructions">
              <p>This is the URL path to an artist's Twitter profile page.</p>
              <p>
                E.g. Add <span className="important">katemuses</span> to show a link to Kate's Twitter profile page
                available at 'https://twitter.com/katemuses'
              </p>
            </span>
          </div>
          <div className="input-group">
            <div className="input-group-header"> 
              <label htmlFor="youtube" className="label">Youtube Video ID</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="youtube" placeholder="Youtube" name="youtube" component="input" type="text" />
            <span className="instructions">
              <p>
                This is the ID found at the end of a URL to an artist's youtube video. If you include an ID, a youtube video
                iframe will be displayed on the artist page alongside a social media icon linking to the youtube page.
              </p>
              <p>
                E.g. Add <span className="important">m2CzHMga2D8</span> to show a link to Aaron's youtube video of 
                the song 'All The Right Moves' available at 'https://www.youtube.com/watch?v=m2CzHMga2D8' 
              </p>
            </span>
          </div>
          <Field name="list" type="checkbox" >
            {({ input, meta }) => (
              <div className="input-group">
                <div className="display-flex align-items-vertically">
                  <label htmlFor="list" className="label">Hide from artists list page</label>
                  <input
                    { ...input }
                    id="list"
                    className="checkbox"
                  /> 
                </div>
                <span className="instructions">
                  <p>If checkbox is selected the artist will not be displayed on the artists list page.</p>
                </span>
              </div>
            )}
          </Field>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="coverImage" className="label">Cover Image</label>
              <span className="input-type"> Optional</span>
            </div>
            {newCoverImage && 
              <div className="img-container img-container-artist">         
                <div onClick={() => deleteImage('coverImage', 'new', newCoverImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newCoverImage)} 
                  onClick={() => coverImageInputRef.current.click()} 
                  className="artist-cover-image" 
                />
              </div>
            }
            {currentCoverImage && !newCoverImage &&
              <div className="img-container img-container-artist">   
                <div onClick={() => deleteImage('coverImage', 'current', currentCoverImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${currentCoverImage}`} 
                  onClick={() => coverImageInputRef.current.click()}
                  className="artist-cover-image" 
                />
              </div>
            }
            {!currentCoverImage && !newCoverImage && <div onClick={() => coverImageInputRef.current.click()} className="image-placeholder">
                <GrImage size={45} className="placeholder-icon" />
              </div>
            } 
            <Field name="wwwimage">
              {props => (
                <div className="input-group">
                  <input 
                    ref={coverImageInputRef}
                    className="file-input"
                    type="file" 
                    accept="image/*" 
                    id="coverImage"
                    onChange={(e) => fileChangedHandler('coverImage', e)} />
                  <span className="instructions">
                    <p>
                      Image should be <span className="important">400px (wide) x 270px (high)</span> for optimal display. 
                      Use of images with different proportions might result in cropped images.
                    </p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="galleryImages" className="label">Gallery Images</label>
              <span className="input-type"> Optional</span>
            </div>
            <button type="button" onClick={() => fileMultipleInputRef.current.click()} className="button button-flex positive-button no-left-margin ">
              <span className="margin-right-small">Upload Images</span>
              <IoMdImages size={25} />
            </button>
            <ul className="gallery-images-list">
              {updatedCurrentGalleryImages && updatedCurrentGalleryImages.map((item, index) => {
                return (
                  <li key={index} className="item">
                    <div className="img-container">
                      <div className="image-status image-status-current">Current</div>
                      <div onClick={() => deleteGalleryImage('current', item)} className="delete-banner">
                        <IoMdTrash className="trash-icon" size={25} />
                        <div className="delete-banner-background"></div>
                      </div>  
                      <img 
                        className="img" 
                        src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/artist_gallery/${item.image}`}
                        alt="" />
                    </div>
                    <Field name="imagetext">
                      {({ input, meta }) => (
                        <div className="caption-box">
                          <div className="input-group-header"> 
                            <label htmlFor="imagetext" className="label">Image Caption</label>
                            <span className="input-type"> Optional</span>
                          </div>  
                          <textarea
                            onChange={(event) => onAddCaption('current', item, event.target.value)}  
                            id="imagetext"
                            placeholder="Add Caption..." 
                            value={item.caption} 
                            rows="3"
                            />
                        </div>
                      )}
                    </Field> 
                  </li>
                );
              })}
              {newGalleryImages && newGalleryImages.map((item, index) => {          
                return (
                  <li key={index} className="item">
                    <div className="img-container">
                      <div className="image-status image-status-new">New</div>
                      <div onClick={() => deleteGalleryImage('new', item.file.name)} className="delete-banner">
                        <IoMdTrash className="trash-icon" size={25} />
                        <div className="delete-banner-background"></div>
                      </div>
                      <img className="img" src={URL.createObjectURL(item.file)} />
                    </div>
                    <Field name="imagetext">
                      {({ input, meta }) => (
                        <div className="caption-box">
                          <div className="input-group-header"> 
                            <label htmlFor="imagetext" className="label">Image Caption</label>
                            <span className="input-type"> Optional</span>
                          </div>  
                          <textarea
                            onChange={(event) => onAddCaption('new', item, event.target.value)}  
                            id="imagetext"
                            placeholder="Add Caption..." 
                            value={item.caption} 
                            rows="3"
                            />
                        </div>
                      )}
                    </Field> 
                  </li>
                );
              })}
            </ul>
            <Field name="galleryImages">
              {props => (
                <div className="input-group">
                  <input 
                    ref={fileMultipleInputRef}
                    className="file-input"
                    type="file" 
                    accept="image/*" 
                    id="galleryImages"
                    onChange={fileMultipleChangedHandler}
                    multiple
                  />
                  <span className="instructions">
                    <p>
                      Images are displayed in the gallery section on the artist page. Multiple images can be uploaded at once. 
                    </p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="buttons">
            <button
              className="button dismiss-button" 
              type="button"
              onClick={() => {
                form.reset();
                setNewCoverImage(null);
              }}
              disabled={submitting || pristine}
            >
              Reset
            </button>
            <button 
              className={isSaving ? 'button action-button submit-button in-progress' : 'button action-button submit-button'} 
              type="submit" 
              disabled={submitting || isSaving}
            >
              {isSaving && <div className="sweet-loading">
                <DotLoader 
                  size={20}
                  color={"#fff"}
                  loading={isSaving}
                />
              </div>}
              <span>{isSaving ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </form>
      )} />
    );
};

export default ArtistForm;