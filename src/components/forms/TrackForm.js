import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { IoMdImages } from 'react-icons/io';
import { DotLoader } from 'react-spinners';

import { Context as TracksContext } from '../../context/TracksContext';
import { Context as AlbumsContext } from '../../context/AlbumsContext';
import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { addNotification } from '../../helpers/addNotification';

const TrackForm = ({ closeModal, spinnerLoading, currentItem }) => {
  const { state: { tracks }, getTracks, saveTrack, updateTrack } = useContext(TracksContext);
  const { searchAlbums } = useContext(AlbumsContext);
  const { searchArtists } = useContext(ArtistsContext);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumExists, setAlbumExists] = useState(true);
  const [isAlbumSearch, setIsAlbumSearch] = useState(false);
  const [isAlbumRequired, setIsAlbumRequired] = useState(false);
  const [isArtistRequired, setIsArtistRequired] = useState(false);
  const [isArtistSearch, setIsArtistSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(0);
  const [artistName, setArtistName] = useState('');
  const [artistExists, setArtistExists] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const autoAlbumRef = useRef(null);
  const autoArtistRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentItem) {
      setAlbumTitle(currentItem.album.title);
      setArtistName(currentItem.artist.name);
    }
  }, [currentItem]);

  const onTypeAlbum = (value) => {
    setIsAlbumRequired(value ? false : true);
    setIsAlbumSearch(true);
    setAlbumTitle(value);
    if (value) {
      searchAlbums(value, false)
        .then(response => {
          setSearchSuggestions(response);
        });
    } else {
      setSearchSuggestions([]);
    }
  };

  const onTypeArtist = (text) => {
    setIsArtistRequired(text ? false : true);
    setIsArtistSearch(true);
    setArtistName(text);
    if (text) {
      searchArtists(text, false)
        .then(response => {
          setSearchSuggestions(response);
        });
    } else {
      setSearchSuggestions([]);
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 40) {
      if (activeDropdownIndex < searchSuggestions.length - 1) {
        setActiveDropdownIndex(activeDropdownIndex + 1);
      } else {
        setActiveDropdownIndex(0);
      }
    }
  };

  const onKeyUp = (event) => {
    if (event.keyCode === 38) {
      if (activeDropdownIndex > 0) {
        setActiveDropdownIndex(activeDropdownIndex - 1);
      } else {
        setActiveDropdownIndex(searchSuggestions.length - 1);
      }
    }
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.target.name === 'albumTitle') {
        setAlbumTitle(searchSuggestions[activeDropdownIndex].title);
        setArtistName(searchSuggestions[activeDropdownIndex].artist.name);
        setIsAlbumSearch(false);
      }    
      if (event.target.name === 'artistName') {
        setArtistName(searchSuggestions[activeDropdownIndex].name);
        setIsArtistSearch(false);
      }
      setActiveDropdownIndex(0);
      setSearchSuggestions([]);
    }
  };

  const onBlur = (event) => {
    if (event.target.name === 'albumTitle') {
      setIsAlbumRequired(albumTitle ? false : true);
      setAlbumExists(true);
      if (albumTitle) {
      searchAlbums(albumTitle, true)
        .then(response => {
          if (response.length === 0) {
            setAlbumExists(false);
          }
        });
      }
    }
    if (event.target.name === 'artistName') {
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
    }
  };

  const onClickOutside = (e) => {
    if (autoAlbumRef.current && autoAlbumRef.current.contains(e.target)) {
      return;
    }
    if (autoArtistRef.current && autoArtistRef.current.contains(e.target)) {
      return;
    }
    setActiveDropdownIndex(0);
    setSearchSuggestions([]);
    setIsAlbumSearch(false);
    setIsArtistSearch(false);
  };

  const onSelectAlbum = (album) => {
    setSearchSuggestions([]);
    setAlbumTitle(album.title);
    setArtistName(album.artist.name);
    setIsAlbumSearch(false);
  };

  const onSelectArtist = (artist) => {
    setSearchSuggestions([]);
    setArtistName(artist.name);
    setIsArtistSearch(false);
  };

  const validate = (track) => {
    const errors = {};
    if (!track.tracktitle) {
      errors.tracktitle = 'Required';
    }
    return errors;
  };

  const onSubmit = async (formData) => {
    formData.albumTitle = albumTitle;
    formData.artistName = artistName;
    const actionFnc = currentItem ? updateTrack : saveTrack;
    let title, type, message;
    actionFnc(formData)
      .then(response => {
        getTracks('', 1);
        closeModal();
        if (response.status === 200) {
          title = 'Success!';
          type = 'success';
           message = response.data.message;
          addNotification(title, message, type);
        }
      })
      .catch(err => {
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
      initialValues={
        currentItem ?
        { 
          trackid: currentItem.trackid,
          tracktitle: currentItem.tracktitle
        } :
        null
      }
      render={({ handleSubmit, form, submitting, pristine, reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="tracktitle">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label className="label" htmlFor="trackTitle">Track Title</label>
                  {meta.error && meta.touched && <span className="error input-type">{meta.error}</span>}
                </div>
                <input id="trackTitle" { ...input } type="text" placeholder="Track" />          
              </div>
            )}
          </Field>
          {!currentItem && <Field name="albumTitle">
              {({ input, meta }) => (
                <div className="input-group">
                  <div className="input-group-header">
                    <label className="label" htmlFor="album-title">Album Title</label>
                    {isAlbumRequired && <span className="error input-type">Required</span>}
                  </div>
                  <input 
                    id="album-title" 
                    { ...input } 
                    type="text" 
                    placeholder="Album"
                    autoComplete="off"
                    onChange={(event) => onTypeAlbum(event.target.value)}
                    value={albumTitle}
                    onKeyDown={(e) => onKeyDown(e)}
                    onKeyPress={(e) => onKeyPress(e)}
                    onKeyUp={(e) => onKeyUp(e)}
                    onBlur={(e) => onBlur(e)}
                  />         
                  {isAlbumSearch && searchSuggestions && searchSuggestions.length > 0 &&  
                    <div ref={autoAlbumRef} className="autocomplete autocomplete-big">
                      <ul className="list">
                        {searchSuggestions.map((item, index) => (
                          <li
                            onClick={() => onSelectAlbum(item)}
                            className={activeDropdownIndex === index ? "item active" : "item"} 
                            key={item.albumid}
                          >
                            {item.url ?
                              <img 
                                className="img"  
                                src={`http://images.amazon.com/images/P/${item.url}`}
                                alt="" /> :
                               <div className="img-container">
                                 <IoMdImages size={45} className="placeholder-icon" />
                              </div>
                            } 
                            <div className="item-info">
                              <span className="primary">{item.title}</span>
                              <span className="secondary">{item.artist.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div> 
                  }
                  {!albumExists &&
                    <div className="input-group-footer">
                      <div className="group-array-notification">
                        Album does not exist. A new album will be created and assigned to the respective artist.
                      </div>
                    </div>
                  }
                </div>
              )}
            </Field>
          }
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
                  {isArtistSearch && searchSuggestions && searchSuggestions.length > 0 &&  
                    <div ref={autoArtistRef} className="autocomplete autocomplete-big">
                      <ul className="list">
                        {searchSuggestions.map((item, index) => (
                          <li
                            onClick={() => onSelectArtist(item)}
                            className={activeDropdownIndex === index ? "item active" : "item"} 
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

export default TrackForm;