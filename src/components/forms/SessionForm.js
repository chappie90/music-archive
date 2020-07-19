import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdImages, IoMdTrash } from 'react-icons/io';
import { DotLoader } from 'react-spinners';
import moment from 'moment';

import '../../styles/scss/components/date-picker.scss';
import { Context as SessionsContext } from '../../context/SessionsContext';
import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { addNotification } from '../../helpers/addNotification';

const SessionForm = ({ closeModal, spinnerLoading, currentItem }) => {
  const { getSessionsManager, saveSession, updateSession } = useContext(SessionsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const { searchArtists } = useContext(ArtistsContext);
  const [programmeLetter, setProgrammeLetter] = useState('none');
  const [isProgrLettertRequired, setIsProgrLettertRequired] = useState(false);
  const [date, setDate] = useState(new Date());
  const [newSessionImage, setNewSessionImage] = useState(null);
  const [currentSessionImage, setCurrentSessionImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [isArtistRequired, setIsArtistRequired] = useState(false);
  const [artistExists, setArtistExists] = useState(true);
  const [artistsSuggestions, setArtistsSuggestions] = useState([]);
  const [activeArtistNameIndex, setActiveArtistNameIndex] = useState(0);
  const [sessionTracks, setSessionTracks] = useState([]);
  const [bbcCode, setBbcCode] = useState('');
  const fileInputRef = useRef(null);
  const autoDropdownRef = useRef(null);

  useEffect(() => {
    if (programmes.length === 0) {
      getProgrammes();
    }
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentItem) {
      setDate(new Date(currentItem.progdate));
      setArtistName(currentItem.artistName);
      setProgrammeLetter(currentItem.progcode[0]);
      setBbcCode(currentItem.bbcshowcase);
      setSessionTracks(
        currentItem.tracks.map(item => ({ 
          trackTitle: {
            value: item.track.tracktitle,
            valid: true 
          }
        }))
      );
      if (currentItem.image) {
        setCurrentSessionImage(currentItem.image);
      }
    }
  }, [currentItem]);

  const onProgrammeChange = (value) => {
    setIsProgrLettertRequired(value !== 'none' ? false : true);
    setProgrammeLetter(value);
  }

  const onTypeArtist = (text) => {
    setIsArtistRequired(text ? false : true);
    setArtistName(text);
    if (text) {
      searchArtists(text, false)
        .then(response => {
          setArtistsSuggestions(response);
        });
    } else {
      setArtistsSuggestions([]);
    }
  };

  const onTypeBbcCode = (value) => {
    setBbcCode(value);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 40) {
      if (activeArtistNameIndex < artistsSuggestions.length - 1) {
        setActiveArtistNameIndex(activeArtistNameIndex + 1);
      } else {
        setActiveArtistNameIndex(0);
      }
    }
  };

  const onKeyUp = (event) => {
    if (event.keyCode === 38) {
      if (activeArtistNameIndex > 0) {
        setActiveArtistNameIndex(activeArtistNameIndex - 1);
      } else {
        setActiveArtistNameIndex(artistsSuggestions.length - 1);
      }
    }
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setArtistName(artistsSuggestions[activeArtistNameIndex].name);
      setActiveArtistNameIndex(0);
      setArtistsSuggestions([]);
    }
  };

  const onBlurArtist = () => {
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

  const onBlurTrack = (index) => {
    let newArray = [ ...sessionTracks ];
    newArray[index].trackTitle = {
      ...newArray[index].trackTitle,
      valid: sessionTracks[index].trackTitle.value === '' ? false : true
    }
    setSessionTracks(newArray);
  };

  const onClickOutside = (e) => {
    if (autoDropdownRef.current && autoDropdownRef.current.contains(e.target)) {
      return;
    }
    setActiveArtistNameIndex(0);
    setArtistsSuggestions([]);
  };

  const onSelectArtist = (artist) => {
    setArtistsSuggestions([]);
    setArtistName(artist.name);
  };

  const onAddTrack = () => {
    setSessionTracks([ 
      ...sessionTracks, 
      { 
        trackTitle: {
          value: '',
          valid: true
        } 
      } 
    ]);
  };

  const onRemoveTrack = (index) => {
    setSessionTracks(sessionTracks.filter(item => item !== sessionTracks[index]));
  };

  const onTypeTrack = (value, index) => {
    let newArray = [ ...sessionTracks ];
    newArray[index].trackTitle = { 
      ...newArray[index].trackTitle,
      value,
      valid: value ? true : false
    };
    setSessionTracks(newArray);
  };

  const fileChangedHandler = (event) => {
    setNewSessionImage(event.target.files[0]);
  };

  const deleteSessionImage = (type, image) => {
    if (type === 'new') {
      setNewSessionImage(null);
    }
    if (type === 'current') {
      setCurrentSessionImage(null);    
    }
  };

  const required = value => (value ? undefined : 'Required');

  const onSubmit = async (formData) => {
    if (programmeLetter === 'none') {
      setIsProgrLettertRequired(true);
    }
    if (!artistName) {
      setIsArtistRequired(true);
    }
    if (programmeLetter === 'none' || !artistName) {
      return;
    }

    setIsSaving(true);

    formData.artistName = artistName;
    formData.tracks = JSON.stringify(sessionTracks || []);

    if (currentItem && 
         (moment.utc(date).format('YYYY-MM-DD') !== currentItem.progdate ||
          programmeLetter !== currentItem.progcode.charAt(0) ||
          artistName !== currentItem.artistName)) {
      formData.sessionChanged = true;
      formData.oldArtistName = currentItem.artistName;
    }
 
    let sessionData = new FormData();

    if (currentItem?.image && !currentSessionImage && currentItem.image !== newSessionImage?.name) {
      formData.image = '';
      sessionData.append('deletedSessionImage', currentItem.image);
    }

    sessionData.append('date', date);
    sessionData.append('progLetter', programmeLetter);
    sessionData.append('bbcshowcase', bbcCode);

    if (currentItem) {
      sessionData.append('oldProgCode', currentItem.progcode);
      sessionData.append('image', currentItem.image);
      sessionData.append('id', currentItem.id);
      sessionData.append('artistId', currentItem.artistid);
    }

    Object.keys(formData).forEach(key => {
      sessionData.append(key, formData[key]);
    });

    if (newSessionImage) {
      sessionData.append(
        'sessionImage',
        newSessionImage,
        newSessionImage.name
      );
    }

    const actionFnc = currentItem ? updateSession : saveSession;
    let title, type, message;
    actionFnc(sessionData)
      .then(response => {
        getSessionsManager([new Date('1998-01-01'), new Date()], 'all', 1)
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
      onSubmit={onSubmit}
      initialValues={
        currentItem ?
        { 
          tracks: sessionTracks.map(item => {
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
        form: { mutators: { push, pop } }, 
        form, 
        values,
        submitting, 
        pristine, 
        reset,
      }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="progletter">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="programme" className="label">BBC Programme</label>
                  {isProgrLettertRequired && <span className="error input-type">Required</span>}
                </div>
                <select 
                  onChange={e => onProgrammeChange(e.target.value)} 
                  onBlur={e => onProgrammeChange(e.target.value)}
                  id="programme" 
                  value={programmeLetter}
                >
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
              popperClassName="date-input" />
          </div>
          <Field name="artistName">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label className="label" htmlFor="artistName">Artist</label>
                  {isArtistRequired && <span className="error input-type">Required</span>}
                </div>
                <input
                  id="artistName" 
                  { ...input } 
                  type="text" 
                  placeholder="Artist Name"
                  onChange={(event) => onTypeArtist(event.target.value)}
                  onKeyDown={(e) => onKeyDown(e)}
                  onKeyPress={(e) => onKeyPress(e)}
                  onKeyUp={(e) => onKeyUp(e)}
                  onBlur={() => onBlurArtist()}
                  value={artistName}
                  autoComplete="off"
                />  
                {artistsSuggestions && artistsSuggestions.length > 0 && 
                  <div ref={autoDropdownRef} className="autocomplete autocomplete-big">
                    <ul className="list">
                      {artistsSuggestions.map((item, index) => (
                        <li
                          onClick={() => onSelectArtist(item)}
                          className={activeArtistNameIndex === index ? "item active" : "item"} 
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
                          <span className="artist-name">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div> 
                }       
                {!artistExists &&
                  <div className="notification">
                    Artist does not exist. A new artist will be created.
                  </div>
                }
              </div>
            )}         
          </Field>
          <div className="input-group">
            <div className="input-group-header">
              <label className="label">Session Tracks</label>  
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
              <span className="input-type"> Optional</span>
            </div>
            <div className="field-array-group">
              <FieldArray name="tracks">
                {({ fields }) => 
                  fields.map((name, index) => (
                    <div className="field-array-field" key={name}>
                      <Field name={`${name}.track`}>  
                        {({ input, meta }) => (
                          <div className="input-group">
                            <span className="input-group-header">
                              <label htmlFor={`track-${index + 1}`}>Track #{index + 1}</label>
                              {!sessionTracks[index]?.trackTitle.valid && <span className="error input-type">Required</span>}
                              <button 
                                onClick={() => {
                                  onRemoveTrack(index);
                                  fields.remove(index);
                                }} 
                                className="button button-small delete-button align-right"
                                type="button">Remove</button>
                            </span>
                            <input 
                              id={`track-${index + 1}`} 
                              { ...input } 
                              onChange={(event) => onTypeTrack(event.target.value, index)}
                              onBlur={(event) => onBlurTrack(index)}
                              value={sessionTracks[index]?.trackTitle.value}
                              type="text" 
                              placeholder="Track Title"
                              autoComplete="off" 
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  ))
                }
              </FieldArray>
            </div>
          </div>
          <Field id="bbcProgrammeCode" name="bbcshowcase" component="input" type="text">
            {({ input }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="bbcProgrammeCode" className="label">BBC Radio 2 Programme Code</label>
                  <span className="input-type"> Optional</span>
                </div>
                <input
                  id="bbcProgrammeCode"
                  { ...input } 
                  type="text"
                  placeholder="BBC code" 
                  onChange={(event) => onTypeBbcCode(event.target.value)}
                  value={bbcCode}
                  autoComplete="off"
                />
                <span className="instructions">
                  <p>The code can be found at the end of a URL from a BBC Radio 2 Programme episode.</p>
                  <p>
                    E.g. Add <span className="important">m000jvnf</span> to show a link to the Country show episode with Lukas Nelson 
                    available at 'https://www.bbc.co.uk/programmes/m000jvnf'
                  </p>
                </span>
              </div>
            )} 
          </Field>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="coverImage" className="label">Session Cover Image</label>
              <span className="input-type"> Optional</span>
            </div>
            {newSessionImage && 
              <div className="img-container">         
                <div onClick={() => deleteSessionImage('new', newSessionImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newSessionImage)} 
                  onClick={() => fileInputRef.current.click()} 
                  className="preview-session-image" 
                />
              </div>
            }
            {currentSessionImage && !newSessionImage &&
              <div className="img-container">   
                <div onClick={() => deleteSessionImage('current', currentSessionImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/sessions/original/${currentSessionImage}`} 
                  onClick={() => fileInputRef.current.click()}
                  className="preview-session-image" 
                />
              </div>
            }
            {!currentSessionImage && !newSessionImage && 
              <div onClick={() => fileInputRef.current.click()} className="image-placeholder session-image-placeholder">
                <IoMdImages size={45} className="placeholder-icon" />
              </div>
            }   
            <Field name="image">
              {props => (
                <div className="input-group">
                  <input
                    ref={fileInputRef}
                    className="file-input"
                    id="coverImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={fileChangedHandler} 
                  />
                  <span className="instructions">
                    <p>
                      Image should be <span className="important">270px (wide) x 150px (high)</span> for optimal display. 
                      Use of images with different proportions might result in cropped images.
                    </p>
                  </span>
                </div>
              )}
            </Field>
          </div>
          <div className="submit-buttons">         
            <button 
              className="button dismiss-button" 
              type="button" 
              onClick={() => {
                form.reset();
                setDate(new Date());
                setNewSessionImage(null);
              }} 
              disabled={submitting || pristine}>
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

export default SessionForm;