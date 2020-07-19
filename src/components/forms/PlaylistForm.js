import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GrImage } from 'react-icons/gr';
import { IoMdImages, IoMdTrash } from 'react-icons/io';
import { DotLoader } from 'react-spinners';
import moment from 'moment';

import '../../styles/scss/components/date-picker.scss';
import { Context as PlaylistsContext } from '../../context/PlaylistsContext';
import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import { Context as TracksContext } from '../../context/TracksContext';
import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { Context as AlbumsContext } from '../../context/AlbumsContext';
import { addNotification } from '../../helpers/addNotification';

const PlaylistForm = ({ closeModal, currentItem }) => {
  const { getPlaylistsManager, savePlaylist, updatePlaylist } = useContext(PlaylistsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const { searchTracks } = useContext(TracksContext);
  const { searchArtists } = useContext(ArtistsContext);
  const { searchAlbums } = useContext(AlbumsContext);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [isSaving, setIsSaving] = useState(false);
  const [arrayError, setArrayError] = useState(false);
  const [formArrayTouched, setFormArrayTouched] = useState(false);
  const [playlistArray, setPlaylistArray] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(0);
  const [currentIntroImage, setCurrentIntroImage] = useState(null);
  const [newIntroImage, setNewIntroImage] = useState(null);
  const fileInputRef = useRef(null);
  const autoTrackRef = useRef(null);
  const autoAlbumRef = useRef(null);
  const autoArtistRef = useRef(null);
  const focusedInputRef = useRef(null);
  const upToDatePlaylistArr = useRef(playlistArray);

  useEffect(() => {
    if (programmes.length === 0) {
      getProgrammes();
    }
    if (currentItem) {
      console.log(currentItem)
      if (currentItem.intro?.image) {
        setCurrentIntroImage(currentItem.intro.image);
      }
      setDate(new Date(currentItem.date));
        setPlaylistArray(
          currentItem.playlistArr.map(item => ({
            trackTitle:  {
              value: item.track.tracktitle,
              valid: true,
              isOpen: false,
              exists: true
            },
            albumTitle:  {
              value: item.album.title,
              valid: true,
              isOpen: false,
              exists: true
            },
            artistName:  {
              value: item.artist.name,
              valid: true,
              isOpen: false,
              exists: true
            }
          }))
      ); 
    }
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  useEffect(() => {
    upToDatePlaylistArr.current = playlistArray;
  }, [playlistArray])

  const fileChangedHandler = (event) => {
    setNewIntroImage(event.target.files[0]);
  };

  const deleteIntroImage = (type, image) => {
    if (type === 'new') {
      setNewIntroImage(null);
    }
    if (type === 'current') {
      setCurrentIntroImage(null);    
    }
  };

  const onAddTrack = () => {
    setPlaylistArray([ 
      ...playlistArray, 
      {
        trackTitle : { 
          value: '', 
          valid: true,
          isOpen: false,
          exists: true
        },
        albumTitle: {
          value: '',
          valid: true,
          isOpen: false,
          exists: true
        },
        artistName: {
          value: '',
          valid: true,
          isOpen: false,
          exists: true
        }
      }
    ]);
  };

  const onRemoveTrack = (index) => {
    setPlaylistArray(playlistArray.filter(item => item !== playlistArray[index]));
  };

  const onTypeTrack = (value, index) => {
    if (value) {
      searchTracks(value, false)
        .then(response => {
          setSearchSuggestions(response);
        });
    } else {
      setSearchSuggestions([]);
    }

    let newArray = [ ...playlistArray ];
    newArray[index].trackTitle = { 
      ...newArray[index].trackTitle, 
      value,
      valid: value ? true : false,
      isOpen: value ? true : false,
      // exists: value ? 
    };
    setPlaylistArray(newArray);
  };

  const onTypeArtist = (value, index) => {
    if (value) {
      searchArtists(value, false)
        .then(response => {
          setSearchSuggestions(response);
        });
    } else {
      setSearchSuggestions([]);
    }

    let newArray = [ ...playlistArray ];
    newArray[index].artistName = { 
      ...newArray[index].artistName, 
      value: value,
      valid: value ? true : false,
      isOpen: value ? true : false
    };
    setPlaylistArray(newArray);
  };

  const onTypeAlbum = (value, index) => {
    if (value) {
      searchAlbums(value, false)
        .then(response => {
          setSearchSuggestions(response);
        });
    } else {
      setSearchSuggestions([]);
    }

    let newArray = [ ...playlistArray ];
    newArray[index].albumTitle = { 
      ...newArray[index].albumTitle, 
      value: value,
      valid: value ? true : false,
      isOpen: value ? true : false
    };
    setPlaylistArray(newArray);
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

      let onSelectFnc;
      let nameParts = event.target.name.split('.');
      if (nameParts[1] === 'trackTitle') onSelectFnc = onSelectTrack;
      if (nameParts[1] === 'artistName') onSelectFnc = onSelectArtist;
      if (nameParts[1] === 'albumTitle') onSelectFnc = onSelectAlbum;
      onSelectFnc(
        searchSuggestions[activeDropdownIndex],  
        nameParts[0].length === 9 ? 
          nameParts[0].slice(-2, -1) : 
          nameParts[0].slice(-3, -1)
      );

      setActiveDropdownIndex(0);
      setSearchSuggestions([]);
    }
  };

  const onSelectTrack = (track, index) => {
    setSearchSuggestions([]);
    let newArray = [ ...playlistArray ];
    newArray[index] = { 
      ...newArray[index], 
      trackTitle: {
        value: track.tracktitle,
        valid: true,
        isOpen: false,
        exists: true
      },
      albumTitle: {
        value: track.album.title,
        valid: true,
        isOpen: false,
        exists: true
      },
      artistName: {
        value: track.artist.name,
        valid: true,
        isOpen: false,
        exists: true
      }
    };
    setPlaylistArray(newArray);
  };

  const onSelectAlbum = (album, index) => {
    setSearchSuggestions([]);
    let newArray = [ ...playlistArray ];
    newArray[index] = { 
      ...newArray[index], 
      albumTitle: {
        value: album.title,
        valid: true,
        isOpen: false,
        exists: true
      },
      artistName: {
        value: album.artist.name,
        valid: true,
        isOpen: false,
        exists: true
      }
    };
    setPlaylistArray(newArray);
  };

  const onSelectArtist = (artist, index) => {
    setSearchSuggestions([]);
    let newArray = [ ...playlistArray ];
    newArray[index].artistName = { 
      ...newArray[index].artistName, 
      value: artist.name,
      valid: true,
      isOpen: false,
      exists: true
    };
    setPlaylistArray(newArray);
  };

  const onFocus = (e) => {
    if (e.target.name) {
     focusedInputRef.current = e.target.name;
    }
  };

  const onBlur = (type, index) => {
    let searchFnc;

    let newArray = [ ...playlistArray ];
    newArray[index][type]= {
      ...newArray[index][type],
      valid: playlistArray[index][type].value === '' ? false : true
    }

    if (type === 'trackTitle') searchFnc = searchTracks;
    if (type === 'albumTitle') searchFnc = searchAlbums;
    if (type === 'artistName') searchFnc = searchArtists;

    if (newArray[index][type].value) {
      searchFnc(newArray[index][type].value, true)
        .then(response => {
          newArray[index][type]= {
            ...newArray[index][type],
            exists: response.length === 0 ? false : true
          };
          setPlaylistArray(newArray);
        });
    } else {
      newArray[index][type]= {
        ...newArray[index][type],
        exists: true
      };
      setPlaylistArray(newArray);
    }

    focusedInputRef.current = null;
  };

  const onClickOutside = (e) => {
    if (autoTrackRef.current && autoTrackRef.current.contains(e.target)) return;
    if (autoAlbumRef.current && autoAlbumRef.current.contains(e.target)) return;
    if (autoArtistRef.current && autoArtistRef.current.contains(e.target)) return;

    if (focusedInputRef.current) {
      let newArray = upToDatePlaylistArr.current.map(item => {
        return {
          ...item,
          trackTitle: {
            ...item.trackTitle,
            isOpen: false
          },
          albumTitle: {
            ...item.albumTitle,
            isOpen: false
          },
          artistName: {
            ...item.artistName,
            isOpen: false
          }
        };
      });
      setPlaylistArray(newArray);
      setSearchSuggestions([]);
    }
  };

  const requiredArray = value => {
    if (value === undefined || value.length === 0) {
      setArrayError(true);
    } else {
       setArrayError(false);
    }
    return (value && value.length > 0 ? undefined : 'Required');
  } ;

  const validate = (values) => {
    const errors = {};
    if (values.progletter === 'none') {
      errors.progletter = 'Required';
    }
    return errors;
  };

  const onSubmit = async (formData) => {
    setIsSaving(true);

    let playlistData = new FormData();

    formData.date = date;

    formData.tracks = JSON.stringify(playlistArray.map(item => {
      return (
        {
          trackTitle: item.trackTitle.value,
          albumTitle: item.albumTitle.value,
          artistName: item.artistName.value
        }
      );
    }));

    if (currentItem && 
         (currentItem.date !== moment.utc(date).format('YYYY-MM-DD') || 
          formData.progletter !== currentItem.progcode.slice(0, -8))) {
      formData.playlistChanged = true;
      formData.oldProgCode = currentItem.progcode;
    }

    Object.keys(formData).forEach(key => {
      playlistData.append(key, formData[key]);
    });

    if (currentItem?.intro?.image && !currentIntroImage) {
      formData.image = '';
      playlistData.append('deletedIntroImage', currentItem.intro.image);
    }

    if (currentItem) {
      playlistData.append('image', currentItem.intro?.image);
    }

    if (newIntroImage) {
      playlistData.append(
        'introImage',
        newIntroImage,
        newIntroImage.name
      );
    }

    const actionFnc = currentItem ? updatePlaylist : savePlaylist;
    let title, type, message;
    actionFnc(playlistData)
      .then(response => {
        getPlaylistsManager([startDate, date], 'all', 1)
          .then(result => {
            closeModal();
            if (response.status === 200) {
              title = 'Success!';
              type = 'success';
               message = response.data.message;
              addNotification(title, message, type);
              setIsSaving(false);
            }
          });
      })
      .catch(err => {
        if (err.response.status === 422) {
          title = 'Error!'  
          type = 'danger';
          message = err.response.data.message;
          addNotification(title, message, type);
          setIsSaving(false);
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
            progletter: currentItem.progcode.slice(0, -8),
            title: currentItem.intro?.title,
            description: currentItem.intro?.description,
            tracks: playlistArray.map(item => {
              return {
                ...item
              } 
            })
          } :
          {
            progletter: 'none'
          }
      }
      mutators={{
        ...arrayMutators
      }}
      render={({
        handleSubmit, 
        form: {
          mutators: { push, pop }
        }, 
        submitting, 
        form,
        pristine, 
        reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="progletter">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="programme" className="label">BBC Programme</label>
                  {meta.error && meta.touched && <span className="error input-type">{meta.error}</span>}
                </div>
                <select id="programme" { ...input }>
                  <option value="none">Select Programme</option>
                  {programmes.map(item => (
                    <option key={item.ID} value={item.shortcode}>{item.Programme}</option>
                  ))}
                </select>
              </div>
            )} 
          </Field>
          <div className="input-group">
            <label htmlFor="date" className="label">Programme Date</label>
            <DatePicker
              id="date"
              selected={date}
              onChange={setDate}
              popperClassName="date-input"
            />
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="title" className="label">Title</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field name="title" id="title" component="input" type="text" placeholder="Title" />
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="description" className="label">Description</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field 
              name="description" 
              id="description" 
              component="textarea" 
              rows="5"
              placeholder="Description" />
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="introImage" className="label">Intro Image</label>
              <span className="input-type"> Optional</span>
            </div>
            {newIntroImage && 
              <div className="img-container img-container-playlist">         
                <div onClick={() => deleteIntroImage('new', newIntroImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newIntroImage)} 
                  onClick={() => fileInputRef.current.click()} 
                  className="playlist-intro-image" 
                />
              </div>
            }
            {currentIntroImage && !newIntroImage &&
              <div className="img-container img-container-playlist">   
                <div onClick={() => deleteIntroImage('current', currentIntroImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/playlists/intro/${currentIntroImage}`} 
                  onClick={() => fileInputRef.current.click()}
                  className="playlist-intro-image" 
                />
              </div>
            }
            {!currentIntroImage && !newIntroImage && <div onClick={() => fileInputRef.current.click()} className="image-placeholder playlist-image-placeholder">
                <GrImage size={45} className="placeholder-icon" />
              </div>
            } 
            <Field name="image">
              {props => (
                <div className="input-group">
                  <input 
                    ref={fileInputRef}
                    className="file-input"
                    type="file" 
                    accept="image/*" 
                    id="introImage"
                    onChange={fileChangedHandler} />
                  <span className="instructions">
                    <p>
                      Image will be displayed at the top of a playlist page in the playlist introductory section.
                    </p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="input-group">
            <div className="input-group-header">
              <label className="label">Playlist Tracks</label>  
              <button 
                className="button button-small positive-button margin-right-small" 
                type="button" 
                onClick={() => {
                  push('tracks', undefined);
                  onAddTrack();
                }}
              >
                Add Track
              </button>
              {arrayError && formArrayTouched && <span className="error error-array input-type">Required</span>}
            </div>
            <FieldArray name="tracks" validate={requiredArray}>
              {({ fields, meta }) => {
                if (meta.touched) {
                  setFormArrayTouched(true);
                }
                return fields.map((name, index) => (
                  <div className="field-array-field" key={name}>  
                    <Field id={`${name}.trackTitle`} name={`${name}.trackTitle`} >
                      {({ input, meta }) => (
                        <div className="input-group-array">
                          <span className="input-group-header">
                            <label htmlFor={`${name}.trackTitle`}>Track #{index + 1}</label>
                            <button 
                              onClick={() => {
                                onRemoveTrack(index);
                                fields.remove(index);
                              }} 
                              className="button button-small delete-button align-right"
                              type="button">Remove
                            </button>
                          </span>
                          <input
                            id={`${name}.trackTitle`} 
                            { ...input } 
                            type="text"
                            placeholder="Track Name" 
                            onChange={(event) => onTypeTrack(event.target.value, index)}
                            value={playlistArray[index]?.trackTitle.value || ''}
                            autoComplete="off"
                            onFocus={(e) => onFocus(e)}
                            onBlur={() => onBlur('trackTitle', index)}
                            onKeyDown={(e) => onKeyDown(e)}
                            onKeyPress={(e) => onKeyPress(e)}
                            onKeyUp={(e) => onKeyUp(e)}
                          />
                          <div className="input-group-footer">
                            {!playlistArray[index]?.trackTitle.valid && <span className="error error-array-field input-type">Required</span>}
                            {!playlistArray[index]?.trackTitle.exists &&
                              <div className="group-array-notification">
                                Track does not exist. A new Track will be created and assigned to the respective album.
                              </div>
                            }
                          </div>
                          {playlistArray[index]?.trackTitle.isOpen && searchSuggestions && searchSuggestions.length > 0 &&  
                            <div ref={autoTrackRef} className="autocomplete autocomplete-big">
                              <ul className="list">
                                {searchSuggestions.map((item, trackIndex) => (
                                  <li
                                    onClick={() => onSelectTrack(item, index)}
                                    className={activeDropdownIndex === trackIndex ? "item active" : "item"} 
                                    key={item.trackid}
                                  >
                                    {item.artist.wwwimage ?
                                      <img 
                                        className="img"  
                                        src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`} /> :
                                       <div className="img-container">
                                         <IoMdImages size={45} className="placeholder-icon" />
                                      </div>
                                    } 
                                    <div className="item-info">
                                      <span className="primary">{item.tracktitle}</span>
                                      <span className="secondary">{item.artist.name} - {item.album?.title}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div> 
                          }
                       </div>
                      )}        
                    </Field> 
                    <Field name={`${name}.albumTitle`}>
                      {({ input, meta }) => (
                        <div className="input-group-array">
                          <input 
                            { ...input } 
                            type="text" 
                            placeholder="Album Title"
                            autoComplete="off"
                            onChange={(event) => onTypeAlbum(event.target.value, index)}
                            value={playlistArray[index]?.albumTitle.value || ''}
                            onFocus={(e) => onFocus(e)}
                            onBlur={() => onBlur('albumTitle', index)}
                            onKeyDown={(e) => onKeyDown(e)}
                            onKeyPress={(e) => onKeyPress(e)}
                            onKeyUp={(e) => onKeyUp(e)}
                          />
                          <div className="input-group-footer">
                            {!playlistArray[index]?.albumTitle.valid && <span className="error error-array-field input-type">Required</span>}
                            {!playlistArray[index]?.albumTitle.exists &&
                              <div className="group-array-notification">
                                Album does not exist. A new Album will be created and assigned to the respective artist.
                              </div>
                            }
                          </div>
                          {playlistArray[index]?.albumTitle.isOpen && searchSuggestions && searchSuggestions.length > 0 &&  
                            <div ref={autoAlbumRef} className="autocomplete autocomplete-big autocomplete-less-margin">
                              <ul className="list">
                                {searchSuggestions.map((item, albumIndex) => (
                                  <li
                                    onClick={() => onSelectAlbum(item, index)}
                                    className={activeDropdownIndex === albumIndex ? "item active" : "item"} 
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
                                      <span className="secondary">{item.artist?.name}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div> 
                          }
                        </div>
                      )}  
                    </Field>  
                    <Field name={`${name}.artistName`}>
                      {({ input, meta }) => (
                        <div className="input-group-array">
                          <input
                            { ...input } 
                            type="text" 
                            placeholder="Artist Name" 
                            autoComplete="off"
                            onChange={(event) => onTypeArtist(event.target.value, index)}
                            value={playlistArray[index]?.artistName.value || ''}
                            onFocus={(e) => onFocus(e)}
                            onBlur={() => onBlur('artistName', index)}
                            onKeyDown={(e) => onKeyDown(e)}
                            onKeyPress={(e) => onKeyPress(e)}
                            onKeyUp={(e) => onKeyUp(e)}
                          />
                          <div className="input-group-footer">
                            {!playlistArray[index]?.artistName.valid && <span className="error error-array-field input-type">Required</span>}
                            {!playlistArray[index]?.artistName.exists &&
                              <div className="group-array-notification">
                                Artist does not exist. A new Artist will be created.
                              </div>
                            }
                          </div>
                          {playlistArray[index]?.artistName.isOpen && searchSuggestions && searchSuggestions.length > 0 &&
                            <div ref={autoArtistRef} className="autocomplete autocomplete-big autocomplete-less-margin">
                              <ul className="list">
                                {searchSuggestions.map((item, artistIndex) => (
                                  <li
                                    onClick={() => onSelectArtist(item, index)}
                                    className={activeDropdownIndex === artistIndex ? "item active" : "item"} 
                                    key={item.artistid}
                                  >
                                    {item.wwwimage ?
                                      <img 
                                        className="img"  
                                        src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.wwwimage}`} 
                                        alt="" /> :
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
                        </div>  
                      )}        
                    </Field>          
                  </div>
                ))
              }}
            </FieldArray>
          </div>
          <div className="submit-buttons">         
            <button 
              className="button dismiss-button" 
              type="button" 
              onClick={() => {
                form.reset();
                setDate(new Date());
              }} 
              disabled={submitting || pristine}>
              Reset
            </button>
             <button className="button action-button" type="submit" disabled={isSaving}>
              Submit
            </button>
          </div>
        </form>
      )} />
    );
};

export default PlaylistForm;

