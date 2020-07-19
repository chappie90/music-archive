import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const artistsReducer = (state, action) => {
  switch (action.type) {
    case 'get_artists':
      return { 
        ...state, 
        artists: action.payload.results, 
        artistsCount: action.payload.pagination.pages 
      };
    case 'get_artist':
      return { ...state, artist: action.payload };
    case 'get_artist_playlist_results':
      return {
        ...state, 
        artistPlaylistResults: action.payload.artistPlaylists,
        artistPlaylistResultsCount: Math.ceil(action.payload.count / 10),
        artistPlaylistProgrammes: action.payload.programmes 
      };
    case 'reset_local_artists_state':
      return { ...state, localArtistsReset: action.payload };
    case 'reset_artists_state':
      return {
        ...state, 
        artists: [], 
        artistsCount: 0, 
        artist: null,
        artistPlaylistResults: {},
        artistPlaylistResultsCount: 0
      };
    default:
      return state;
  }
};

const getArtists = dispatch => async (letter, search, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { letter, search, page };

    const response = await API.get('/discogs/artists', { 
      params,
      cancelToken: source.token 
    });

    console.log(response)

    dispatch({ type: 'get_artists', payload: response.data });

    return response.data.artists;
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

const getArtistsManager = dispatch => async (search, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, page };

    const response = await API.get('/artists/manager', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_artists_manager', payload: response.data });

    return response.data.artists;
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

const getArtist = dispatch => async (id) => {
  try {
    const params = { id };

    const response = await API.get('/artist', { params });

    dispatch({ type: 'get_artist', payload: response.data });

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const saveArtist = dispatch => async (artistData) => {
  try {
    return await API.post('/artist/new', artistData,
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

const updateArtist = dispatch => async (artistData) => {
  try {
    return await API.patch('/artist/update', artistData,
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

const deleteArtist = dispatch => async (artistId) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { artistId };

    return await API.delete('/artist/delete', { 
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

const checkArtistAvailability = dispatch => async (search) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search };

    const response = await API.get('/artist/check', { 
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

const getPlaylistResultsArtist = dispatch => async (artistId, page) => {
  try {
    const params = { artistId, page };

    const response = await API.get('/artist/playlists', { params });

    dispatch({ type: 'get_artist_playlist_results', payload: response.data });
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const searchArtists = dispatch => async (search, exactSearch) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, exactSearch };

    const response = await API.get('/artists/search', { 
      params,
      cancelToken: source.token 
    });

    return response.data.artists;
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

const resetArtistsState = dispatch => async () => {
   dispatch({ type: 'reset_artists_state' });
};

const resetLocalArtistsState = dispatch => async (state) => {
   dispatch({ type: 'reset_local_artists_state', payload: state });
};

export const { Context, Provider } = createDataContext(
  artistsReducer,
  { 
    getArtists, 
    getArtist, 
    saveArtist, 
    updateArtist, 
    deleteArtist, 
    checkArtistAvailability, 
    getPlaylistResultsArtist,
    resetLocalArtistsState,
    resetArtistsState,
    getArtistsManager,
    searchArtists
  },
  { 
    artists: [], 
    artistsCount: 0, 
    artist: null, 
    artistsManager: [],
    artistsManagerCount: 0,
    artistPlaylistResults: {}, 
    artistPlaylistResultsCount: 0,
    artistPlaylistProgrammes: [],
    localArtistsReset: false 
  }
);


