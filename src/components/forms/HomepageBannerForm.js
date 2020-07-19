import React , { useState, useEffect, useContext, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { IoMdImages, IoMdTrash } from 'react-icons/io';
import { GrImage } from 'react-icons/gr';
import { MdComment } from 'react-icons/md';
import { DotLoader } from 'react-spinners';

import { Context as HomepageContext } from '../../context/HomepageContext';
import { addNotification } from '../../helpers/addNotification';

const HomepageBannerForm = ({ closeModal, currentItem }) => {
  const { 
    state: { allHomepageBanners }, 
    getAllBannersManager,
    updateBanner
  } = useContext(HomepageContext);
  const [currentBannerImage, setCurrentBannerImage] = useState(null);
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentBannerImage(currentItem.image);
  }, [currentItem]);

  const fileChangedHandler = (event) => {
    setNewBannerImage(event.target.files[0]);
  };

  const deleteBannerImage = (type, image) => {
    if (type === 'new') {
      setNewBannerImage(null);
    }
    if (type === 'current') {
      setCurrentBannerImage(null);    
    }
  };

  const validate = (banner) => {
    const errors = {};
    return errors;
  };

  const onSubmit = async (formData) => {
    setIsSaving(true);

    let bannerData = new FormData();

    Object.keys(formData).forEach(key => {
      bannerData.append(key, formData[key]);
    });

    if (currentItem.image && !currentBannerImage) {
      formData.image = '';
      bannerData.append('deletedBannerImage', currentItem.image);
    }

    if (newBannerImage) {
      bannerData.append(
        'homepageBannerImage',
        newBannerImage,
        newBannerImage.name
      );
    }

    updateBanner(bannerData)
      .then(response => {
      getAllBannersManager('', 1)
        .then(result => {
          let title, type;
          if (response.status === 200) {
            title = 'Success!';
            type = 'success';
          } else if (response.status === 422) {
            title = 'Error!'  
            type = 'danger';
          }
          let message = response.data.message;
          addNotification(title, message, type);
          setIsSaving(false);
          closeModal();
        });
    });

  };

  return (
    <Form
      validate={validate}
      onSubmit={onSubmit}
      initialValues={
        {
          ...currentItem,
          link_type: currentItem.link_type === 'internal' ? false : true 
        }
      }
      render={({ handleSubmit, form, submitting, pristine, reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          {currentItem.type !== 'hero_banner' && <Field name="section_title">
              {({ input, meta }) => (
                <div className="input-group">
                  <div className="input-group-header">
                    <label htmlFor="section-heading" className="label">
                      {currentItem.type === 'top_banner' ?
                        'Top Banners Section Heading' :
                        'Bottom Banners Section Heading'
                      }
                    </label>
                  </div>
                  <input
                    { ...input }
                    id="section-heading"
                    type="text" 
                    placeholder="Section Heading" 
                  /> 
                </div>
              )}
            </Field>
         }
         <div className="input-group">
            <label htmlFor="title" className="label">Title</label>
            <Field name="title" id="title" component="input" type="text" placeholder="Title" />
          </div>
         {currentItem.type === 'hero_banner' && <div className="input-group">
              <label htmlFor="body" className="label">Text</label>
              <Field name="body" id="body" component="textarea" rows="5" type="text" placeholder="Text" />
            </div>
          }
          {currentItem.type === 'hero_banner' && <div className="input-group">
              <label htmlFor="button" className="label">Button Text</label>
              <Field name="button" id="button" component="input" type="text" placeholder="Button" />
            </div>
          }
          <Field name="link" >
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="link" className="label">
                    {currentItem.type === 'hero_banner' ?
                      'Button' :
                      'Title'
                    } Link
                  </label>
                </div>
                <input
                  { ...input }
                  id="link"
                  type="text" 
                  placeholder="Link" 
                /> 
              </div>
            )}
          </Field>
          <Field name="link_type" type="checkbox" >
            {({ input, meta }) => (
              <div className="input-group display-flex align-items-vertically">
                <label htmlFor="link-type" className="label">External Link</label>
                <input
                  { ...input }
                  id="link-type"
                  className="checkbox"
                /> 
              </div>
            )}
          </Field>
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="bannerImage" className="label">Banner Image</label>
            </div>
            {newBannerImage && 
              <div className="img-container img-container-banner">         
                <div onClick={() => deleteBannerImage('new', newBannerImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>
                <img 
                  src={URL.createObjectURL(newBannerImage)} 
                  onClick={() => fileInputRef.current.click()} 
                  className="artist-cover-image" 
                />
              </div>
            }
            {currentBannerImage && !newBannerImage &&
              <div className="img-container img-container-banner">   
                <div onClick={() => deleteBannerImage('current', currentBannerImage)} className="delete-banner">
                  <IoMdTrash className="trash-icon" size={25} />
                  <div className="delete-banner-background"></div>
                </div>      
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}/public/images/homepage/${currentBannerImage}`} 
                  onClick={() => fileInputRef.current.click()}
                  className="artist-cover-image" 
                />
              </div>
            }
            {!currentBannerImage && !newBannerImage && <div onClick={() => fileInputRef.current.click()} className="image-placeholder artist-image-placeholder">
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
                    id="bannerImage"
                    onChange={fileChangedHandler} />
                  <span className="instructions">
                    <p>
                      Image should be <span className="important">200px (wide) x 135px (high)</span> for optimal display. 
                      Use of images with different proportions might result in cropped images.
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
                setNewBannerImage(null);
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

export default HomepageBannerForm;