import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const sessionsReducer = (state, action) => {
  switch (action.type) {
    case 'get_sessions':
      return {
        ...state, 
        sessions: action.payload.sessions, 
        sessionsCount: Math.ceil(action.payload.count / 10),
        sessionsYears: action.payload.years 
      };
    case 'get_live_sessions':
      return {
        ...state,
        liveSessions: action.payload.liveSessions
      };
    case 'get_sessions_manager':
      return {
        ...state, 
        sessionsManager: action.payload.sessions, 
        sessionsCountManager: Math.ceil(action.payload.count / 10)
      };
    case 'get_session':
      return { ...state, session: action.payload };
    case 'reset_state':
      return { 
        sessions: [], 
        sessionsCount: 0, 
        session: {}, 
        sessionsYears: [],
        liveSessions: []
      };
    default:
      return state;
  }
};

const getSessionsManager = dispatch => async (yearRange, programmeCode, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { yearRange, programmeCode, page };

    const sessions = await API.get('/sessions/manager', {
      params,
      cancelToken: source.token
    });

    dispatch({ type: 'get_sessions_manager', payload: sessions.data });
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

const getSessionsByYear = dispatch => async (programmeCode, year, page) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { programmeCode, year, page };

    const sessions = await API.get('/sessions/year', { 
      params,
      cancelToken: source.token
    });

    dispatch({ type: 'get_sessions', payload: sessions.data });

    return sessions.data.years;
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

const getBbcLiveSessions = dispatch => async (programmeCode) => {
  try {
    const params = { programmeCode };

    const liveSessions = await API.get('/sessions/live', { params });

    console.log(liveSessions);

    dispatch({ type: 'get_live_sessions', payload: liveSessions.data });
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

const getProgrammeSessions = dispatch => async (programmeCode) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { programmeCode };

    const sessions = await API.get('/sessions/programme', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_sessions', payload: sessions.data });
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


const getSession = dispatch => async (id) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const params = { id };

    const session = await API.get('/session', { 
      params,
      cancelToken: source.token 
    });

    dispatch({ type: 'get_session', payload: session.data });

    return session.data;
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

const saveSession = dispatch => async (sessionData) => {
  try {
    return await API.post('/session/new', sessionData,
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

const updateSession = dispatch => async (sessionData) => {
  try {
    return await API.post('/session/update', sessionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
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

const deleteSession = dispatch => async (session) => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  const params =  { session: JSON.stringify(session) };

  try {
    return await API.delete('/session/delete', { 
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

const resetSessionsState = dispatch => async () => {
  dispatch({ type: 'reset_state' });
};

export const { Context, Provider } = createDataContext(
  sessionsReducer,
  { 
    getSessionsManager, 
    getSessionsByYear, 
    getProgrammeSessions, 
    getSession, 
    saveSession, 
    updateSession, 
    deleteSession, 
    resetSessionsState,
    getBbcLiveSessions
  },
  { 
    sessions: [], 
    sessionsCount: 0, 
    session: {}, 
    sessionsYears: [],
    liveSessions: [],
    sessionsManager: [],
    sessionsCountManager: 0
  }
);

