import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const tracksReducer = (state, action) => {
  switch (action.type) {
    case 'get_tracks':
      return {
        ...state, 
        tracks: action.payload.tracks, 
        tracksCount: Math.ceil(action.payload.count / 10) 
      };
    default:
      return state;
  }
};

const getTracks = dispatch => async (search, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try { 
    const params = { search, page };

    const tracks = await API.get('/tracks', { 
      params,
      cancelToken: source.token 
    });

    console.log(tracks.data)

    dispatch({ type: 'get_tracks', payload: tracks.data });
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

const getTrack = dispatch => async (trackId) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { trackId };

    const response = await API.get('/track', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_track', payload: response.data });
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

const saveTrack = dispatch => async (formData) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    return await API.post('/track/new', { 
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

const updateTrack = dispatch => async (formData) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    return await API.patch('/track/update', { 
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

const deleteTrack = dispatch => async (trackId) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();
  
  try {
    const params = { trackId };

    return await API.delete('/track/delete', { 
      params,
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

const searchTracks = dispatch => async (search, exactSearch) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, exactSearch };

    const response = await API.get('/tracks/search', { 
      params,
      cancelToken: source.token 
    });

    return response.data.tracks;
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
  tracksReducer,
  { getTracks, getTrack, saveTrack, updateTrack, deleteTrack, searchTracks },
  { tracks: [], tracksCount: 0 }
);