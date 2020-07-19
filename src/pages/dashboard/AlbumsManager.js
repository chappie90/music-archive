import React , { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosAddCircle, IoIosCreate, IoMdTrash, IoMdClose, IoMdImages } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import noScroll from 'no-scroll';

import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import { addNotification } from '../../helpers/addNotification';
import { Context as AlbumsContext } from '../../context/AlbumsContext';
import AlbumForm from '../../components/forms/AlbumForm';

const AlbumsManager = (props) => {
  const { state: { albums, albumsCount }, getAlbumsManager, deleteAlbum } = useContext(AlbumsContext);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAlbumsManager(search, page);
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
    getAlbumsManager(search, data.selected + 1);
  };

  const onSearchChanged = (text) => {
    setSearch(text);
    setPage(1);
    if (text) {
      getAlbumsManager(text, page);
    } else {
      getAlbumsManager(text, 1);
    }
  };

  const openModalHandler = (album) => {
    if (album) {
      setSelectedAlbum(album);
    }
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
    setSelectedAlbum(null);
  };

  const closeDeletePrompt = () => {
    setShowDeletePrompt(false);
  };

  const deleteAlbumHandler = (album) => {
    console.log(album)
    setSelectedAlbum(album);
    setShowDeletePrompt(true); 
  };

  const confirmDeleteAlbum = () => {
    setIsLoading(true);
    deleteAlbum(selectedAlbum.albumid).then(response => {
      getAlbumsManager(search, page);
      setPage(1);
      setSearch('');
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
    <div className="manage-content-page albums-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={selectedAlbum ? "Edit Album" : 'Add Album'}
          showButton={true}
        >
          <AlbumForm currentItem={selectedAlbum} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardModal
          modalType="delete-prompt"
          isOpen={showDeletePrompt} 
          onClickOutside={closeDeletePrompt}>
          <div className="delete-prompt">
            <div className="wrapper">
              <h2 className="heading">Are you sure you want to delete this album?</h2>
              <div className="item-info">
                <p><span className="identifier">Album Title: </span><span>{selectedAlbum?.title}</span></p>
                <p><span className="identifier">Artist Name: </span><span>{selectedAlbum?.artist.name}</span></p>
              </div>
              <div className="buttons">
                <button onClick={closeDeletePrompt} className="cancel-btn">Cancel</button>
                <button onClick={confirmDeleteAlbum} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <div style={styles.headingContainer}>
            <h1>Manage Albums</h1>
            <div className="sweet-loading">
              <ClipLoader
                css={styles.spinner}
                size={40}
                color={"#123abc"}
                loading={isLoading} />
              </div>
            </div>
            <form>
              <div className="input-group">
                <input
                  type="text" 
                  onChange={event => onSearchChanged(event.target.value)} 
                  className="input" 
                  placeholder="Search albums..."
                  value={search}
                />
                {search && <IoMdClose 
                    onClick={() => {
                      setSearch('');
                      getAlbumsManager('', 1);
                      setPage(1);
                    }} 
                    className="reset-icon" size={25} 
                  />
                }
              </div>
            </form>
          {albums.length > 0 && <ul className="manager-list">
              {albums.map(item => (
                <li className="item" key={item.albumid}>
                  <div className="img-container">
                    {item.url ? 
                      <img src={`http://images.amazon.com/images/P/${item.url}`} alt={item.title} className="img" /> :
                      <IoMdImages size={45} className="placeholder-icon" />
                    }
                  </div>
                  <div className="item-info">
                    <span className="primary">{item.title}</span>
                    <span className="secondary">{item.artist?.name}</span>
                  </div>
                    <div className="action-buttons">
                      <span className="action-button-wrapper">
                        <IoIosCreate className="button" size={25} onClick={() => openModalHandler(item)} />
                      </span>
                      {false && <span className="delete-button-wrapper">
                       <IoMdTrash className="button" size={25} onClick={() => deleteAlbumHandler(item)} />
                      </span>}
                    </div>
                </li>
              ))}
            </ul>
          } 
          {search && albums.length === 0 && <p className="no-results">No albums found</p>}
          {albumsCount > 1 && (
            <ReactPaginate 
              pageCount={albumsCount}
              previousLabel={'previous'}
              nextLabel={'next'}
              pageRangeDisplayed={4}
              onPageChange={pageClickHandler}
              containerClassName={'pagination-dark'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
              forcePage={page - 1}
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
  spinner: {
    display: 'block',
    margin: '0 auto',
  }
};

export default AlbumsManager;