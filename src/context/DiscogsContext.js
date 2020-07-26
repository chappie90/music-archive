import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const discogsDataReducer = (state, action) => {
  switch (action.type) {
    case 'search_all':
      return {
        ...state,
        searchResults: action.payload.results,
        resultsCount: action.payload.pagination.pages,
        searchTotal: action.payload.pagination.items
      };
    case 'get_new_releases':
      return { 
        ...state, 
        releases: action.payload.results, 
        releasesCount: action.payload.pagination.pages,
        totalReleases: action.payload.pagination.items
      };
    case 'get_releases_by_genre':
      return {
        ...state,
        releases: action.payload.results,
        releasesCount: action.payload.pagination.pages,
        totalReleases: action.payload.pagination.items
      };
     case 'reset_releases':
      return {
        ...state, 
        releases: [],
        releasesCount: 0,
        totalReleases: ''
      };
    case 'get_artist':
      return { 
        ...state, 
        artist: action.payload.artist,
        artistReleases: action.payload.artistReleases
      };
    case 'get_release':
      return { 
        ...state, 
        release: action.payload
      };
    case 'reset_release':
      return {
        ...state, 
        release: []
      };
    case 'get_master':
      return { 
        ...state, 
        master: action.payload.master,
        masterVersions: action.payload.masterVersions
      };  
    case 'reset_master':
      return {
        ...state, 
        master: []
      };
    case 'get_label':
      return { 
        ...state, 
        label: action.payload.label,
        labelReleases: action.payload.labelReleases
      };
    case 'reset_label':
      return {
        ...state, 
        label: []
      };
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

const searchAll = dispatch => async (search, category, genre, style, country, year, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { search, category, genre, style, country, year, page };

    const response = await API.get('/discogs/search', {
      params,
      cancelToken: source.token
    });

    dispatch({ type: 'search_all', payload: response.data });

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

const getArtist = dispatch => async (id) => {
  try {
    const params = { id };

    const response = await API.get('/discogs/artist', { params });

    dispatch({ type: 'get_artist', payload: response.data });

    return response.data.artist;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const getReleasesByGenre = dispatch => async (genre, style, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { genre, style, page };

    const response = await API.get('/discogs/releases/genre', { 
      params,
      cancelToken: source.token 
    });

    console.log(response.data)

    dispatch({ type: 'get_releases_by_genre', payload: response.data });

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

const getNewReleases = dispatch => async (page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { page };

    const response = await API.get('/discogs/new-releases', { 
      params,
      cancelToken: source.token 
    });

    console.log(response)

    dispatch({ type: 'get_new_releases', payload: response.data });
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

const resetReleases = dispatch => async () => {
  dispatch({ type: 'reset_releases' });
};

const getRelease = dispatch => async (id) => {
  try {
    const params = { id };

    const response = await API.get('/discogs/release', { params });

    dispatch({ type: 'get_release', payload: response.data });

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const resetRelease = dispatch => async () => {
  dispatch({ type: 'reset_release' });
};

const getMaster = dispatch => async (id) => {
  try {
    const params = { id };

    const response = await API.get('/discogs/master', { params });

    console.log('master')
    console.log(response.data)

    dispatch({ type: 'get_master', payload: response.data });

    return response.data.master;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const resetMaster = dispatch => async () => {
  dispatch({ type: 'reset_master' });
};

const getLabel = dispatch => async (id) => {
  try {
    const params = { id };

    const response = await API.get('/discogs/label', { params });

    console.log(response.data)

    dispatch({ type: 'get_label', payload: response.data });

    return response.data.label;
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const resetLabel = dispatch => async () => {
  dispatch({ type: 'reset_label' });
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
  discogsDataReducer,
  { 
    searchAll,
    getArtist,
    getRelease, 
    getMaster,
    getLabel,
    resetRelease,
    resetMaster,
    resetLabel,
    getReleasesByGenre,
    getPlaylistResultsArtist,
    resetLocalArtistsState,
    resetArtistsState,
    searchArtists,
    getNewReleases,
    resetReleases
  },
  { 
    artists: [], 
    artistsCount: 0, 
    releases: [],
    releasesCount: 0,
    labelReleases: [],
    masterVersions: [],
    searchTotal: '',
    totalReleases: '',
    artist: null, 
    release: null,
    master: null,
    artistReleases: [],
    artistPlaylistResults: {}, 
    artistPlaylistResultsCount: 0,
    artistPlaylistProgrammes: [],
    localArtistsReset: false 
  }
);


