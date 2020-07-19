import React , { useState, useEffect, useContext } from 'react';
import { IoIosAddCircle, IoIosCreate } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import noScroll from 'no-scroll';

import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import DashboardModal from '../../components/DashboardModal';
import ProgrammeForm from '../../components/forms/ProgrammeForm';
import { addNotification } from '../../helpers/addNotification';

const ProgrammesManager = (props) => {
  const { state: { programmes }, getProgrammes } = useContext(ProgrammesContext);
  const [modal, setModal] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    getProgrammes();
  }, []);

  useEffect(() => {
    if (modal) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }, [modal]);

  const openModalHandler = (programme) => {
    setSelectedProgramme(programme);
    setModal(true);
  };

  const closeModalHandler = () => {
    setModal(false);
  };

  return (
    <div className="manage-content-page programmes-manager">
      <div className="wrapper">
        <DashboardModal
          modalType="edit-form"
          isOpen={modal} 
          closeModal={closeModalHandler} 
          heading={selectedProgramme ? "Edit Programme" : 'Add Programme'}
          showButton={true}>
          <ProgrammeForm currentItem={selectedProgramme} closeModal={closeModalHandler} />
        </DashboardModal>
        <DashboardSidebar />
        <div className="main">
          <div style={styles.headingContainer}>
            <h1>Manage Programmes</h1>
            <div className="sweet-loading">
              <ClipLoader
                css={styles.spinner}
                size={40}
                color={"#123abc"}
                loading={isLoading}
              />
            </div>
          </div>
           <ul className="manager-list">
            {programmes.map(item => (
              <li className="item" key={item.ID}>  
                <div className="item-info">  
                  <span className="primary">{item.Programme}</span>
                </div>
                <div className="action-buttons">
                  <IoIosCreate size={25} className="button" onClick={() => openModalHandler(item)} />
                </div>
              </li>
            ))}
          </ul>
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

export default ProgrammesManager;