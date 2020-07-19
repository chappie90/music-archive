import React, { useState, useEffect, useContext } from 'react';
import { IoIosAddCircle, IoIosCreate, IoMdTrash, IoMdClose, IoMdImages } from 'react-icons/io';
import { DotLoader, MoonLoader, PulseLoader, ScaleLoader } from 'react-spinners';
import noScroll from 'no-scroll';

import { Context as HomepageContext } from '../../context/HomepageContext';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import { addNotification } from '../../helpers/addNotification';
import HomepageBannerForm from '../../components/forms/HomepageBannerForm';

const HomepageManager = (props) => {
  const { state: { allHomepageBanners }, getAllBannersManager } = useContext(HomepageContext);
  const [modal, setModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerName, setBannerName] = useState(null);

  useEffect(() => {
    if (allHomepageBanners.length === 0) {
      getAllBannersManager();
    }
  }, []);

  useEffect(() => {
    if (modal) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }, [modal]);

  const openModalHandler = (banner) => {
    setBannerName(banner.name);
    setSelectedBanner(banner);
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
  };

  return (
    <div className="manage-content-page homepage-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={`Edit ${bannerName}`}
          showButton={true}>
          <HomepageBannerForm currentItem={selectedBanner} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <div>
            <h1>Manage Homepage Banners</h1>
          </div>
          {allHomepageBanners.length > 0 && <ul className="manager-list">
              {allHomepageBanners.map(item => {
                return (
                  <li className="item" key={item.id}>
                    <div className="img-container">
                      {item.image ?
                        <img 
                          className="img" 
                          src={`${process.env.REACT_APP_API_BASE_URL}/public/images/homepage/${item.image}`}
                          alt=""
                        /> :
                        <IoMdImages size={45} className="placeholder-icon" />
                      }
                    </div>
                    <div className="item-info">
                      <span className="primary">{item.title}</span>
                      <span className="secondary">
                        {item.name}
                      </span> 
                    </div>
                    <div className="helper">
                      <div className="action-buttons">
                        <span className="action-button-wrapper">
                          <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          }
        </div>
      </div>
    </div>  
  );
};

export default HomepageManager;