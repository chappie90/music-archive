import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { IoMdImages, IoMdTrash } from 'react-icons/io';
import { GrImage } from 'react-icons/gr';
import { DotLoader } from 'react-spinners';

import { Context as AlbumsContext } from '../../context/AlbumsContext';
import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { addNotification } from '../../helpers/addNotification';

const AlbumForm = ({ closeModal, spinnerLoading, currentItem }) => {
  const { state: { albums }, getAlbumsManager, saveAlbum, updateAlbum } = useContext(AlbumsContext);
  const { searchArtists } = useContext(ArtistsContext);
  const [artistName, setArtistName] = useState('');
  const [artistExists, setArtistExists] = useState(true);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [currentCoverImage, setCurrentCoverImage] = useState(null);
  const [isArtistRequired, setIsArtistRequired] = useState(false);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const autoArtistRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentItem) {
      setArtistName(currentItem.artist.name);
      if (currentItem.coverscan) {
        setCurrentCoverImage(currentItem.coverscan);
      }
    }
  }, [currentItem]);

  const onTypeArtist = (text) => {
    setArtistName(text);
    if (text) {
      searchArtists(text, false)
        .then(response => {
          setArtistSuggestions(response);
        });
    } else {
      setArtistSuggestions([]);
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 40) {
      if (activeArtistIndex < artistSuggestions.length - 1) {
        setActiveArtistIndex(activeArtistIndex + 1);
      } else {
        setActiveArtistIndex(0);
      }
    }
  };

  const onKeyUp = (event) => {
    if (event.keyCode === 38) {
      if (activeArtistIndex > 0) {
        setActiveArtistIndex(activeArtistIndex - 1);
      } else {
        setActiveArtistIndex(artistSuggestions.length - 1);
      }
    }
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.target.name === 'artistName') {
        setArtistName(artistSuggestions[activeArtistIndex].name);
      }
      setActiveArtistIndex(0);
      setArtistSuggestions([]);
    }
  };

  const onBlur = (event) => {
    setIsArtistRequired(artistName ? false : true);
    setArtistExists(true);
    if (artistName) {
    searchArtists(artistName, true)
      .then(response => {
        if (response.length === 0) {
          setArtistExists(false);
        }
      });
    }
  };

  const onClickOutside = (e) => {
    if (autoArtistRef.current && autoArtistRef.current.contains(e.target)) {
      return;
    }
    setActiveArtistIndex(0);
    setArtistSuggestions([]);
  };

  const onSelectArtist = (artist) => {
    setArtistSuggestions([]);
    setArtistName(artist.name);
  };

  const fileChangedHandler = (event) => {
    setNewCoverImage(event.target.files[0]);
  };

  const deleteCoverImage = (type, image) => {
    if (type === 'new') {
      setNewCoverImage(null);
    }
    if (type === 'current') {
      setCurrentCoverImage(null);    
    }
  };

  const validate = (album) => {
    const errors = {};
    if (!album.title) {
      errors.title = 'Required';
    }
    return errors;
  };

  const onSubmit = async (formData) => {
    setIsSaving(true);
    formData.artistName = artistName;
    let albumData = new FormData();
    if (currentItem?.coverscan && !currentCoverImage && currentItem.coverscan !== newCoverImage?.name) {
      formData.coverscan = '';
      albumData.append('deletedCoverImage', currentItem.coverscan);
    }
    Object.keys(formData).forEach(key => {
      albumData.append(key, formData[key]);
    });
    if (newCoverImage) {
      albumData.append(
        'albumCoverImage',
        newCoverImage,
        newCoverImage.name
      );
    }

    const actionFnc = currentItem ? updateAlbum : saveAlbum;
    let title, type, message;
    actionFnc(albumData)
      .then(response => {
        getAlbumsManager('', 1)
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
      onSubmit={onSubmit}
      validate={validate}
      initialValues={currentItem}
      render={({ handleSubmit, form, submitting, pristine, reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="title">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label className="label" htmlFor="albumTitle">Album Title</label>
                  {meta.error && meta.touched && <span className="error input-type">{meta.error}</span>}
                </div>
                <input id="albumTitle" { ...input } type="text" placeholder="Album" />          
              </div>
            )}
          </Field>
          {!currentItem && <Field name="artistName">
              {({ input, meta }) => (
                <div className="input-group">
                  <div className="input-group-header">
                    <label className="label" htmlFor="artist">Artist Name</label>
                    {isArtistRequired && <span className="error input-type">Required</span>}
                  </div>
                  <input 
                    id="artist" 
                    { ...input } 
                    type="text" 
                    placeholder="Artist"
                    autoComplete="off"
                    onChange={(event) => onTypeArtist(event.target.value)}
                    value={artistName}
                    onKeyDown={(e) => onKeyDown(e)}
                    onKeyPress={(e) => onKeyPress(e)}
                    onKeyUp={(e) => onKeyUp(e)}
                    onBlur={(e) => onBlur(e)}
                  />         
                  {artistSuggestions && artistSuggestions.length > 0 &&  
                    <div ref={autoArtistRef} className="autocomplete autocomplete-big">
                      <ul className="list">
                        {artistSuggestions.map((item, index) => (
                          <li
                            onClick={() => onSelectArtist(item)}
                            className={activeArtistIndex === index ? "item active" : "item"} 
                            key={item.artistid}
                          >
                            {item.wwwimage ?
                              <img 
                                className="img"  
                                src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.wwwimage}`} /> :
                               <div className="img-container">
                                 <IoMdImages size={45} className="placeholder-icon" />
                              </div>
                            } 
                            <div className="item-info">
                              <span className="primary">{item.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div> 
                  }
                  {!artistExists &&
                    <div className="input-group-footer">
                      <div className="group-array-notification">
                        Artist does not exist. A new artist will be created.
                      </div>
                    </div>
                  }
                </div>
              )}
            </Field>
          }
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="catalogue" className="label">Catalogue</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="catalogue" name="catalogue" component="input" type="text" placeholder="Catalogue" />
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="coverImage" className="label">Cover Image</label>
              <span className="input-type"> Optional</span>
            </div>
            {newCoverImage && 
              <div className="img-container img-container-album">         
                <div onClick={() => deleteCoverImage('new', newCoverImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newCoverImage)} 
                  onClick={() => fileInputRef.current.click()} 
                  className="album-cover-image" 
                />
              </div>
            }
            {currentCoverImage && !newCoverImage &&
              <div className="img-container img-container-album">   
                <div onClick={() => deleteCoverImage('current', currentCoverImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/albums/original/${currentCoverImage}`} 
                  onClick={() => fileInputRef.current.click()}
                  className="album-cover-image" 
                />
              </div>
            }
            {!currentCoverImage && !newCoverImage && <div onClick={() => fileInputRef.current.click()} className="image-placeholder">
                <GrImage size={45} className="placeholder-icon" />
              </div>
            } 
            <Field name="coverscan">
              {props => (
                <div className="input-group">
                  <input 
                    ref={fileInputRef}
                    className="file-input"
                    type="file" 
                    accept="image/*" 
                    id="coverImage"
                    onChange={fileChangedHandler} />
                  <span className="instructions">
                    <p>
                      This serves as the album cover image. If selected, it will supersede the amazon album image.
                    </p>
                    <p>
                      Image should be <span className="important">300px (wide) x 300px (high)</span> for optimal display. 
                      Use of images with different proportions might result in cropped images.
                    </p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="albumUrl" className="label">Album Url</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field id="albumUrl" name="url" component="input" type="text" placeholder="Album Url" />
          </div>
          <div className="submit-buttons">         
            <button 
              className="button dismiss-button" 
              type="button" 
              onClick={() => form.reset()} 
              disabled={submitting || pristine}>
              Reset
            </button>
             <button 
              className="button action-button submit-button"
              type="submit" 
              disabled={submitting || isSaving}
            >
              <span>Submit</span>
            </button>
          </div>
        </form>
      )} />
    );
};

export default AlbumForm;