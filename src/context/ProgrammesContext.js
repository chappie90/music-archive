import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const programmesReducer = (state, action) => {
  switch (action.type) {
    case 'get_programmes':
      return { ...state, programmes: action.payload };
    default:
      return state;
  }
};

const getProgrammes = dispatch => async () => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const programmes = await API.get('/programmes', {
      cancelToken: source.token
    });

    dispatch({ type: 'get_programmes', payload: programmes.data });
  } catch (err) {
    if (API.isCancel(err)) {
      console.log('Request cancelled', err);
    } else {
      console.log(err);
      if (err.response) {
        console.log(err.response.data.message);
      }
      throw err;
    }
  }
};

const saveProgramme = dispatch => async (formData) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    return await API.post('/programmes/new', { 
      formData,
      cancelToken: source.token 
    });
  } catch (err) {
    if (API.isCancel(err)) {
      console.log('Request cancelled', err);
    } else {
      console.log(err);
      if (err.response) {
        console.log(err.response.data.message);
      }
      throw err;
    }
  }
};

const updateProgramme = dispatch => async (formData) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    return await API.patch('/programmes/update', { 
      formData,
      cancelToken: source.token 
    }); 
  } catch (err) {
    if (API.isCancel(err)) {
      console.log('Request cancelled', err);
    } else {
      console.log(err);
      if (err.response) {
        console.log(err.response.data.message);
      }
      throw err;
    }
  }
};

const checkProgrammeAvailability = dispatch => async (search) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search };

    const response = await API.get('/programmes/check', { 
      params,
      cancelToken: source.token 
    });

    return response.data;
  } catch (err) {
    if (API.isCancel(err)) {
      console.log('Request cancelled', err);
    } else {
      console.log(err);
      if (err.response) {
        console.log(err.response.data.message);
      }
      throw err;
    }
  }
};

export const { Context, Provider } = createDataContext(
  programmesReducer,
  { getProgrammes, saveProgramme, updateProgramme, checkProgrammeAvailability },
  { programmes: [] }
);  