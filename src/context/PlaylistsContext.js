import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const playlistsReducer = (state, action) => {
  switch (action.type) {
    case 'get_playlists':
      return { 
        ...state, 
        playlists: action.payload.playlists, 
        playlistsCount: Math.ceil(action.payload.count / 10),
        playlistsYears: action.payload.years 
      };
    case 'get_playlists_by_date':
      return { 
        ...state, 
        playlistsGroupByDate: action.payload.playlists, 
        playlistsYears: action.payload.years 
      };
    case 'get_playlists_manager':
      return { 
        ...state, 
        playlistsManager: action.payload.playlists, 
        playlistsCountManager: Math.ceil(action.payload.count / 10)
      };
    case 'get_playlist':
      return { 
        ...state,
        playlist: action.payload.playlist.playlist,
        playlistIntro: action.payload.playlist.intro,
        morePlaylists: action.payload.morePlaylists
      };
    case 'reset_state':
      return {
        ...state, 
        playlists: [], 
        playlistsCount: 0,
        playlistsGroupByDate: {}, 
        playlist: [], 
        playlistIntro: null,
        playlistsYears: [], 
        mostPlayed: [], 
        mostPlayedCount: 0,
        morePlaylists: []
      };
    case 'reset_search_state':
      return {
         ...state, 
        playlists: [], 
        playlistsCount: 0
      }
    case 'get_most_played':
      return { 
        ...state, 
        mostPlayed: action.payload.mostPlayed,
        mostPlayedCount: Math.ceil(action.payload.count / 10 )
      };
    default:
      return state;
  }
};

const getPlaylistsManager = dispatch => async (yearRange, programmeCode, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { yearRange, programmeCode, page };

    const response = await API.get('/playlists/manager', {
      params,
      cancelToken: source.token
    });

    console.log(response.data)

    dispatch({ type: 'get_playlists_manager', payload: response.data });
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

const getPlaylistsByYear = dispatch => async (programmeCode, year, page) => {
  try {
    const params = { programmeCode, year, page };

    const response = await API.get('/playlists/year', { params });

    dispatch({ type: 'get_playlists_by_date', payload: response.data });

    return response.data.years;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const getPlaylist = dispatch => async (programmeCode, date) => {
  try {
    const params = { programmeCode, date };

    const playlist = await API.get('/playlist', { params });

    dispatch ({ type: 'get_playlist', payload: playlist.data });
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const savePlaylist = dispatch => async (playlistData) => {
  try {
    return await API.post('/playlist/new', playlistData,
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

const updatePlaylist = dispatch => async (playlistData) => {
  try {
    return await API.patch('/playlist/update', playlistData, 
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

const deletePlaylist = dispatch => async (progcode) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { progcode };

    return await API.delete('/playlist/delete', { 
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

const resetPlaylistsState = dispatch => async () => {
  dispatch({ type: 'reset_state' });
};

const resetPlaylistsSearchState = dispatch => async () => {
  dispatch({ type: 'reset_search_state' });
};

const searchPlaylists = dispatch => async (search, category, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, category, page };

    const response = await API.get('/playlists/search', {
      params,
      cancelToken: source.token
    });

    dispatch({ type: 'get_playlists', payload: response.data });

    return response.data.playlists;
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

const getMostPlayed = dispatch => async (category, numberOfResults, yearRange, programme, page, offset) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { category, numberOfResults, yearRange, programme, page, offset };

    const response = await API.get('/playlists/top', {
     params, 
     cancelToken: source.token
    });

    dispatch({ type: 'get_most_played', payload: response.data });

    return response.data.mostPlayed;
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
  playlistsReducer,
  { 
    getPlaylist, 
    savePlaylist, 
    updatePlaylist, 
    deletePlaylist, 
    getPlaylistsByYear, 
    resetPlaylistsState,
    searchPlaylists,
    getMostPlayed,
    getPlaylistsManager,
    resetPlaylistsSearchState
  },
  { 
    playlists: [], 
    playlistsCount: 0, 
    playlistsGroupByDate: {}, 
    playlistsGroupByDateCount: 0, 
    playlist: [], 
    playlistIntro: null,
    morePlaylists: [],
    playlistsYears: [], 
    mostPlayed: [], 
    mostPlayedCount: 0,
    playlistsManager: [],
    playlistsCountManager: 0
  }
);

