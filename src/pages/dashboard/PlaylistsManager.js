import React , { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosAddCircle, IoIosCreate, IoMdTrash } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import DatePicker from 'react-datepicker';
import noScroll from 'no-scroll';

import { Context as PlaylistsContext } from '../../context/PlaylistsContext';
import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import PlaylistForm from '../../components/forms/PlaylistForm';
import { addNotification } from '../../helpers/addNotification';
import { formatDate } from '../../helpers/formatDate';

const PlaylistsManager = (props) => {
  const {
    state: { playlistsManager, playlistsCountManager }, 
    getPlaylistsManager, 
    deletePlaylist 
  } = useContext(PlaylistsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date('1970-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [programme, setProgramme] = useState('all');

  useEffect(() => {
    if (programmes.length === 0) {
      getProgrammes();
    }
    setIsLoading(true);
    getPlaylistsManager([startDate, endDate], programme, page)
      .then(response => {
        setIsLoading(false)
      });
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
    getPlaylistsManager([startDate, endDate], programme, data.selected + 1);
  };

  const setDateRangeHandler = (type, value) => {
    if (type === 0) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    const range = [startDate, endDate];
    getPlaylistsManager(range, programme, page);
  };

  const programmeSetHandler = (e) => {
    setPage(1);
    setProgramme(e.target.value);
    
    getPlaylistsManager([startDate, endDate], e.target.value, page);
  };

  const openModalHandler = (playlist) => {
    if (playlist) {
      setSelectedPlaylist(playlist);
    }
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
    setSelectedPlaylist(null);
  };

  const closeDeletePrompt = () => {
    setShowDeletePrompt(false);
  };

  const deletePlaylistHandler = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowDeletePrompt(true); 
  };

  const confirmDeletePlaylist = () => {
    setIsLoading(true);
    deletePlaylist(selectedPlaylist.progcode).then(response => {
      setSelectedPlaylist(null);
      getPlaylistsManager([startDate, endDate], programme, 1);
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
    <div className="manage-content-page playlists-manager">
      <div className="wrapper">
        <DashboardModal
          isOpen={modal} 
          modalType="edit-form"
          closeModal={closeModalHandler} 
          currentItem={selectedPlaylist}
          heading={selectedPlaylist ? "Edit Playlist" : 'Add Playlist'}
          showButton={true}
          isActive="playlists">
          <PlaylistForm currentItem={selectedPlaylist} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardModal
          modalType="delete-prompt"
          isOpen={showDeletePrompt} 
          onClickOutside={closeDeletePrompt}>
          <div className="delete-prompt">
            <div className="wrapper">
              <h2 className="heading">Are you sure you want to delete this playlist?</h2>
              <div className="item-info">
                <p><span className="identifier">Date: </span><span>{formatDate(selectedPlaylist?.date)}</span></p>
                <p>
                  <span className="identifier">Programme: </span>
                  <span> 
                    {programmes.filter(p => p.shortcode === selectedPlaylist?.playlistArr[0].progletter)[0]?.Programme}
                  </span>
                </p>
              </div>
              <div className="buttons">
                <button onClick={closeDeletePrompt} className="cancel-btn">Cancel</button>
                <button onClick={confirmDeletePlaylist} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <div style={styles.headingContainer}>
            <h1>Manage Playlists</h1>
            {/*<div className="sweet-loading">
              <ClipLoader
                css={styles.spinner}
                size={40}
                color={"#123abc"}
                loading={isLoading}
              />
            </div>*/}
          </div>
          <div className="filters-wrapper">
            <div className="date-input">
              <DatePicker
                selected={startDate}
                onChange={val => setDateRangeHandler(0, val)}
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={10}
                adjustDateOnChange
              />
            </div>
            <div className="date-input">
              <DatePicker
                selected={endDate}
                onChange={val => setDateRangeHandler(1, val)}
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={10}
                adjustDateOnChange
              />
            </div>
            <select className="filter" onChange={programmeSetHandler} name="programme">
              <option value='all'>All Programmes</option>
              {programmes.map(item => (
                <option key={item.ID} value={item.shortcode}>{item.Programme}</option>
              ))}
            </select>
          </div>
          {playlistsManager.length > 0 && <ul className="manager-list">
              {playlistsManager.map((item, index) => {
                if (item.playlistArr.length === 0) {
                  return;
                }
                return (
                  <li className="item" key={index}>
                    <div className="item-info">
                      <span className="primary">{formatDate(item.date)}</span>
                      <span className="secondary">
                        {programmes.filter(p => p.shortcode === item.playlistArr[0].progletter)[0]?.Programme}
                      </span> 
                    </div>
                    <div className="action-buttons">
                      <span className="action-button-wrapper">
                        <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                      </span>
                      <span className="delete-button-wrapper">
                       <IoMdTrash size={25} className="button" onClick={() => deletePlaylistHandler(item)} />
                      </span>
                    </div>      
                  </li>
                );
              })}
            </ul>
          }
          {!isLoading && playlistsManager.length === 0 && <p className="no-results">No playlists found</p>}
          {playlistsCountManager > 1 && <ReactPaginate 
              pageCount={playlistsCountManager}
              previousLabel={'previous'}
              nextLabel={'next'}
              pageRangeDisplayed={4}
              onPageChange={pageClickHandler}
              containerClassName={'pagination-dark'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              forcePage={page - 1}
            />
          }
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
  addIcon: {
    cursor: 'pointer',
    marginTop: 20
  },
  editIcon: {
    cursor: 'pointer'
  },
  spinner: {
    display: 'block',
    margin: '0 auto',
  }
};

export default PlaylistsManager;