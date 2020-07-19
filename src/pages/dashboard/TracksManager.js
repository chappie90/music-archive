import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosAddCircle, IoIosCreate, IoMdTrash, IoMdClose, IoMdImages } from 'react-icons/io';
import { addNotification } from '../../helpers/addNotification';
import { ClipLoader } from 'react-spinners';
import noScroll from 'no-scroll';

import { Context as TracksContext } from '../../context/TracksContext';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import TrackForm from '../../components/forms/TrackForm';

const TracksManager = props => {
  const { 
    state: { tracks, tracksCount }, 
    getTracks,
    deleteTrack,
  } = useContext(TracksContext);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getTracks(search, page);
  }, []);

  useEffect(() => {
    if (modal || showDeletePrompt) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }, [modal, showDeletePrompt]);

  const pageClickHandler = data => {
    if (page === `${data.selected} + 1`) {
      return;
    }
    setPage(data.selected + 1);
    window.scrollTo(0, 0);
    getTracks(search, data.selected + 1);
  };

  const onSearchChanged = (text) => {
    setSearch(text);
    setPage(1);
    if (text) {
      getTracks(text, page);
    } else {
      getTracks('', page);
    }
  };

  const openModalHandler = (track) => {
    if (track) {
      setSelectedTrack(track);
    }
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
    setSelectedTrack(null);
  };

  const closeDeletePrompt = () => {
    setShowDeletePrompt(false);
  };

  const deleteTrackHandler = (track) => {
    console.log(track)
    setSelectedTrack(track);
    setShowDeletePrompt(true); 
  };

  const confirmDeleteTrack = () => {
    setIsLoading(true);
    deleteTrack(selectedTrack.trackid).then(response => {
      setSelectedTrack(null);
      getTracks('', 1);
      setIsLoading(false);
      setShowDeletePrompt(false); 
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
    });
  };

  return (
    <div className="manage-content-page tracks-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={selectedTrack ? "Edit Track" : 'Add Track'}
          showButton={true}
        >
          <TrackForm currentItem={selectedTrack} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardModal
          modalType="delete-prompt"
          isOpen={showDeletePrompt} 
          onClickOutside={closeDeletePrompt}>
          <div className="delete-prompt">
            <div className="wrapper">
              <h2 className="heading">Are you sure you want to delete this track?</h2>
              <div className="item-info">
                <p><span className="identifier">Track Title: </span><span>{selectedTrack?.tracktitle}</span></p>
                <p><span className="identifier">Album Title: </span><span>{selectedTrack?.album.title}</span></p>
                <p><span className="identifier">Artist Name: </span><span>{selectedTrack?.artist?.name}</span></p>
              </div>
              <div className="buttons">
                <button onClick={closeDeletePrompt} className="cancel-btn">Cancel</button>
                <button onClick={confirmDeleteTrack} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <h1>Manage Tracks</h1>
          <form>
            <div className="input-group">
              <input
                type="text" 
                onChange={event => onSearchChanged(event.target.value)} 
                className="input" 
                placeholder="Search tracks..."
                value={search}
              />
              {search && <IoMdClose 
                  onClick={() => {
                    setSearch('');
                    getTracks('', 1);
                    setPage(1);
                  }} 
                  className="reset-icon" size={25} 
                />
              }
            </div>
          </form>
          {tracks.length > 0 && <ul className="manager-list">
              {tracks.map(item => (
                <li className="item" key={item.trackid}>
                  <div className="img-container">
                    {item.artist.wwwimage ?
                      <img 
                        className="img" 
                        src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.artist.wwwimage}`}
                        alt={item.artist.name}
                      /> :
                      <IoMdImages size={45} className="placeholder-icon" />
                    }
                  </div>
                  <div className="item-info">
                    <span className="primary">{item.tracktitle}</span>
                    <span className="secondary">{item.artist.name} - {item.album.title}</span>
                  </div> 
                  <div className="action-buttons">
                    <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                    {false && <IoMdTrash size={25} className="button" onClick={() => deleteTrackHandler(item)} />}
                  </div>
                  
                </li>
              ))}
            </ul>
          }
          {search && tracks.length === 0 && <p className="no-results">No tracks found</p>}
          {tracksCount > 1 && (
            <ReactPaginate 
              pageCount={tracksCount}
              previousLabel={'previous'}
              nextLabel={'next'}
              pageRangeDisplayed={4}
              onPageChange={pageClickHandler}
              containerClassName={'pagination-dark'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
        <IoIosAddCircle size={45} className="add-icon" onClick={() => openModalHandler()} />
      </div>
    </div>
  );
}; 

const styles = { 
  headingContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  heading: {
    marginRight: '20px'
  },
  list: {
    listStyleType: 'none',
    fontSize: 18
  },
  link: {
    color: '#000'
  },
  spinner: {
    display: 'block',
    margin: '0 auto',
  }
};

export default TracksManager;