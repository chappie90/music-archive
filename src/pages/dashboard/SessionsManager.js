import React , { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosAddCircle, IoIosCreate, IoMdTrash, IoMdImages } from 'react-icons/io';
import { DotLoader } from 'react-spinners';
import DatePicker from 'react-datepicker';
import noScroll from 'no-scroll';

import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { addNotification } from '../../helpers/addNotification';
import { formatDate } from '../../helpers/formatDate';
import DashboardModal from '../../components/DashboardModal';
import { Context as SessionsContext } from '../../context/SessionsContext';
import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import SessionForm from '../../components/forms/SessionForm';

const SessionsManager = (props) => {
  const { 
    state: { sessionsManager, sessionsCountManager }, 
    getSessionsManager, 
    deleteSession 
  } = useContext(SessionsContext);
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [startDate, setStartDate] = useState(new Date('1998-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [programme, setProgramme] = useState('all');

  useEffect(() => {
    if (programmes.length === 0) {
      getProgrammes();
    }
    setIsLoading(true);
    getSessionsManager([startDate, endDate], programme, page)
      .then(response => {
        setIsLoading(false);
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
    window.scrollTo(0, 0);
    getSessionsManager([startDate, endDate], programme, data.selected + 1);
  };

  const setDateRangeHandler = (type, value) => {
    if (type === 0) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    const range = [startDate, endDate];
    getSessionsManager(range, programme, page);
  };

  const programmeSetHandler = (e) => {
    setPage(1);
    setProgramme(e.target.value);
    getSessionsManager([startDate, endDate], e.target.value, page);
  };

  const openModalHandler = (session) => {
    if (session) {
      setSelectedSession(session);
    }
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
    setSelectedSession(null);
  };

  const closeDeletePrompt = () => {
    setShowDeletePrompt(false);
  };

  const deleteSessionHandler = (session) => {
    setSelectedSession(session);
    setShowDeletePrompt(true); 
  };

  const confirmDeleteSession = () => {
    setIsDeleting(true);
    deleteSession(selectedSession)
      .then(response => {
        getSessionsManager([startDate, endDate], programme, page)
          .then(result => {
            setIsDeleting(false);
            setShowDeletePrompt(false);
            setSelectedSession(null);
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
    <div className="manage-content-page sessions-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={selectedSession ? "Edit Session" : 'Add Session'}
          showButton={true}>
          <SessionForm currentItem={selectedSession} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardModal
          modalType="delete-prompt"
          isOpen={showDeletePrompt} 
          onClickOutside={closeDeletePrompt}>
          <div className="delete-prompt">
            <div className="wrapper">
              <h2 className="heading">Are you sure you want to delete this session?</h2>
              <div className="item-info">
                <p><span className="identifier">Date: </span><span>{formatDate(selectedSession?.progdate)}</span></p>
                <p><span className="identifier">Artist: </span><span>{selectedSession?.artistName}</span></p>
              </div>
              <div className="buttons">
                <button onClick={closeDeletePrompt} className="cancel-btn">Cancel</button>
                <button onClick={confirmDeleteSession} className={isDeleting ? 'button delete-btn in-progress' : 'button delete-btn'} disabled={isDeleting}>
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
          <div style={styles.headingContainer}>
            <h1>Manage Sessions</h1>
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
          {sessionsManager && sessionsManager.length > 0 && <ul className="manager-list">
              {sessionsManager.map(item => {

                return (
                  <li className="item" key={item.id}>
                    <div className="img-container">
                      {item.image ?
                        <img 
                          className="img-no-crop" 
                          src={`${process.env.REACT_APP_API_BASE_URL}/public/images/sessions/original/${item.image}`}
                          alt=""
                        /> :
                        <IoMdImages size={45} className="placeholder-icon" />
                      }
                    </div>
                    <div className="item-info">
                      <span className="primary">{item.artistName}</span>
                      <span className="secondary">
                        {programmes.filter(p => p.shortcode === item.progcode.charAt(0))[0]?.Programme}
                      </span> 
                    </div>
                    <div className="helper">
                      <div className="action-buttons">
                        <span className="action-button-wrapper">
                          <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                        </span>
                        <span className="delete-button-wrapper">
                         <IoMdTrash size={25} className="button" onClick={() => deleteSessionHandler(item)} />
                        </span>
                      </div>
                      <span className="date">{formatDate(item.progdate)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          }
          {!isLoading && sessionsManager && sessionsManager.length === 0 && <p className="no-results">No sessions found</p>}
          {sessionsCountManager > 1 && <ReactPaginate 
              pageCount={sessionsCountManager}
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
  spinner: {
    display: 'block',
    margin: '0 auto',
  }
};

export default SessionsManager;

