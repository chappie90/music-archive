import React, { useState } from 'react';
import Modal from 'react-modal';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const DashboardModal = ({ children, isOpen, onClickOutside, openModal, closeModal, heading, showButton, modalType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const spinnerLoadingHandler = (state) => {
    setIsLoading(state);
  };

  return (
    <Modal
      className={modalType === 'edit-form' ? "edit-form-modal" : "delete-prompt-modal"}
      isOpen={isOpen} 
      onRequestClose={onClickOutside}
    > 
      <div className="sweet-loading">
        <ClipLoader
          size={40}
          color={"#123abc"}
          loading={isLoading}
        />
      </div>
      {heading && <div className="modal-header">
          <h2 className="heading">{heading }</h2>
          {showButton && <button className="button dismiss-button" onClick={closeModal}>Close</button>}
        </div>
      }
        {children}
    </Modal>
  );
};

Modal.setAppElement('#root');

export default DashboardModal;