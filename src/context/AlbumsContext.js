import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const albumsReducer = (state, action) => {
  switch (action.type) {
    case 'get_albums_manager':
      return {
        ...state, 
        albums: action.payload.albums, 
        albumsCount: Math.ceil(action.payload.count / 10) 
      };
    default:
      return state;
  }
};

const getAlbumsManager = dispatch => async (search, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, page };

    const albums = await API.get('/albums', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_albums_manager', payload: albums.data });
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

const getAlbum = dispatch => async (id) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { id };

    const response = await API.get('/album', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_album', payload: response.data });
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

const saveAlbum = dispatch => async (albumData) => {
  try {
    return await API.post('/album/new', albumData, 
      { 
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const updateAlbum = dispatch => async (albumData) => {
  try {
    return await API.patch('/album/update', albumData,
    { 
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const deleteAlbum = dispatch => async (albumId) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { albumId };

    return await API.delete('/album/delete', { 
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

const searchAlbums = dispatch => async (search, exactSearch) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
   const params = { search, exactSearch };

    const response = await API.get('/albums/search', { 
      params,
      cancelToken: source.token 
    });

    return response.data.albums;
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
  albumsReducer,
  { getAlbumsManager, getAlbum, saveAlbum, updateAlbum, deleteAlbum, searchAlbums },
  { albums: [], albumsCount: 0 }
);

