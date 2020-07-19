import React , { useState, useEffect, useContext } from 'react';
import { Form, Field } from 'react-final-form';

import { Context as ProgrammesContext } from '../../context/ProgrammesContext';
import { addNotification } from '../../helpers/addNotification';

const ProgrammeForm = ({ closeModal, currentItem }) => {
  const { 
    state: { programmes }, 
    getProgrammes, 
    saveProgramme, 
    updateProgramme,
    checkProgrammeAvailability
  } = useContext(ProgrammesContext);
  const [isSaving, setIsSaving] = useState(false);
  const [programme, setProgramme] = useState('');
  const [programmeRequired, setProgrammeRequired] = useState(false);
  const [programmeAvailable, setProgrammeAvailable] = useState(true);

  useEffect(() => {
    if (currentItem) {
      setProgramme(currentItem.Programme);
    } 
  }, [currentItem])

  const onSearchProgrammes = (text) => {
    setProgrammeRequired(text ? false : true);
    setProgramme(text);
    if (!text) {
      setProgrammeAvailable(true);
      return;
    }
    checkProgrammeAvailability(text)
      .then(response => {
        if (response) setProgrammeAvailable(response.programme ? true : false);
      });
  };

  const onBlur = () => {
    setProgrammeRequired(programme ? false : true);
  };

  const onSubmit = async (formData) => {
    setIsSaving(true);

    if (!programme) {
      setProgrammeRequired(true);
      return;
    }
    if (!programmeAvailable) {
      return;
    }

    formData.Programme = programme;

    if (currentItem) {
      if (formData.Programme !== currentItem.Programme) {
        formData.programmeNameChanged = true;
      }
    }

    const actionFnc = currentItem ? updateProgramme : saveProgramme;
    let title, type, message;
    actionFnc(formData).then(response => {
      getProgrammes()
        .then(result => {
          closeModal();
          if (response.status === 200) {
            title = 'Success!';
            type = 'success';
            message = response.data.message;
            addNotification(title, message, type);
            setIsSaving(false);
          }
        })
        .catch(err => {
          setIsSaving(false);
          if (err.response.status === 422) {
            title = 'Error!'  
            type = 'danger';
            message = err.response.data.message;
            addNotification(title, message, type); 
          }
        });
    });
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={currentItem}
      render={({ handleSubmit, form, submitting, pristine, reset }) => (
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <Field name="Programme">
            {({ input, meta }) => (
              <div className="input-group">
                <div className="input-group-header">
                  <label htmlFor="programme" className="label">Programme Name</label>
                  {programmeRequired && <span className="error input-type">Required</span>}
                  {!programmeAvailable && <span className="error input-type">Another programme with that name already exists</span>}
                </div>
                <input 
                  { ...input }
                  onChange={(event) => onSearchProgrammes(event.target.value)} 
                  onBlur={() => onBlur()}
                  id="programme"
                  type="text" 
                  placeholder="Programme Name"
                  value={programme}
                />
              </div>
            )}
          </Field> 
          <div className="input-group">
            <div className="input-group-header">
              <label htmlFor="station" className="label">Radio Station</label>
              <span className="input-type"> Optional</span>
            </div>
            <Field name="radio_station" id="station" component="input" type="text" placeholder="Station" />
          </div>
          <div className="buttons">
            <button
              className="button dismiss-button" 
              type="button"
              onClick={() => {
                form.reset();
              }}
              disabled={submitting || pristine}
            >
              Reset
            </button>
            <button className="button action-button" type="submit" disabled={isSaving}>
              Submit
            </button>
          </div>
        </form>
      )} />
    );
};

export default ProgrammeForm;