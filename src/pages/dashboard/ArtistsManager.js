import React , { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosAddCircle, IoIosCreate, IoMdTrash, IoMdClose, IoMdImages } from 'react-icons/io';
import noScroll from 'no-scroll';
import { DotLoader } from 'react-spinners';

import { Context as ArtistsContext } from '../../context/ArtistsContext';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import { addNotification } from '../../helpers/addNotification';
import ArtistForm from '../../components/forms/ArtistForm';

const ArtistsManager = (props) => {
  const { 
    state: { artistsManager, artistsManagerCount }, 
    getArtistsManager, 
    deleteArtist
  } = useContext(ArtistsContext);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getArtistsManager(search, page);
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
    getArtistsManager(search, data.selected + 1);  
  };

  const onSearchChanged = (text) => {
    setSearch(text);
    setPage(1);
    if (text) {
      getArtistsManager(text, page); 
    } else {
      getArtistsManager(text, 1); 
    }
  };

  const openModalHandler = (artist) => {
    if (artist) {
      setSelectedArtist(artist);
    }
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
  };

  const closeDeletePrompt = () => {
    setShowDeletePrompt(false);
  };

  const deleteArtistHandler = (artist) => {
    setSelectedArtist(artist);
    setShowDeletePrompt(true); 
  };

  const confirmDeleteArtist = () => {
    setIsDeleting(true);
    deleteArtist(selectedArtist.artistid)
      .then(response => {
        setPage(1);
        setSearch(''); 
        getArtistsManager('', 1)
          .then(result => {
            setIsDeleting(false);
            setShowDeletePrompt(false); 
            setSelectedArtist(null);
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
      });
  };

  return (
    <div className="manage-content-page artists-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={selectedArtist ? "Edit Artist" : 'Add Artist'}
          showButton={true}>
          <ArtistForm currentItem={selectedArtist} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardModal
          modalType="delete-prompt"
          isOpen={showDeletePrompt} 
          onClickOutside={closeDeletePrompt}>
          <div className="delete-prompt">
            <div className="wrapper">
              <h2 className="heading">Are you sure you want to delete this artist?</h2>
              <div className="item-info">
                <p><span className="identifier">Artist: </span><span>{selectedArtist?.name}</span></p>
              </div>
              <div className="buttons">
                <button onClick={closeDeletePrompt} className="cancel-btn">Cancel</button>
                <button onClick={confirmDeleteArtist} className={isDeleting ? 'button delete-btn in-progress' : 'button delete-btn'} disabled={isDeleting}>
                  {isDeleting && <div className="sweet-loading">
                    <DotLoader 
                      size={20}
                      color={"#fff"}
                      loading={isDeleting}
                    />
                  </div>}
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <div>
            <h1>Manage Artists</h1>
          </div>
          <form>
            <div className="input-group">
              <input
                type="text" 
                onChange={event => onSearchChanged(event.target.value)} 
                className="input" 
                placeholder="Search artists..."
                value={search}
              />
              {search && <IoMdClose 
                  onClick={() => {
                    setSearch('');
                    getArtistsManager('', 1);
                    setPage(1);
                  }} 
                  className="reset-icon" size={25} 
                />
              }
            </div>
          </form>
          {artistsManager.length > 0 && <ul className="manager-list">
              {artistsManager.map(item => {
                const imageNameParts = item.wwwimage.split('.');
                const coverImage = `${imageNameParts[0]}-small.${imageNameParts[1]}`;
                return (
                  <li className="item" key={item.artistid}>
                    <div className="img-container">
                      {item.wwwimage ?
                        <img 
                          className="img" 
                          src={`${process.env.REACT_APP_API_BASE_URL}/public/images/artists/covers/original/${item.wwwimage}`}
                          alt={item.wwwimage}
                        /> :
                        <IoMdImages size={45} className="placeholder-icon" />
                      }
                    </div>
                    <div className="item-info">
                      <span className="primary">{item.name}</span>
                    </div>
                    <div className="helper">
                      <div className="action-buttons">
                        <span className="action-button-wrapper">
                          <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                        </span>
                        {false && <span className="delete-button-wrapper">
                         <IoMdTrash size={25} className="button" onClick={() => deleteArtistHandler(item)} />
                        </span>}
                      </div>
                      <span>{item.progdate}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          }
          {search && artistsManager.length === 0 && <p className="no-results">No artists found</p>}
          {artistsManagerCount > 1 &&<ReactPaginate 
              pageCount={artistsManagerCount}
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
        <IoIosAddCircle size={45} className="add-icon" onClick={() => {
          setSelectedArtist(null);
          openModalHandler();
        }} />
      </div>
    </div>
  );
}; 

export default ArtistsManager;