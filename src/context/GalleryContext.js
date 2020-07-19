import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const galleryReducer = (state, action) => {
  switch (action.type) {
    case 'get_images':
      return { 
        ...state, 
        galleryImages: action.payload.images,
        imagesCount: action.payload.count
      };
    default: 
      return state;
  }
};

const getGalleryImages = dispatch => async () => {
  if (source) {
    source.cancel();
  }

  source = CancelToken.source();

  try {
    const response = await API.get('/gallery/images', { 
      cancelToken: source.token 
    });

    console.log(response.data)

    dispatch({ type: 'get_images', payload: response.data });

    return response.data.images;
  } catch (err) {
    if (API.isCancel) {
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
  galleryReducer,
  { getGalleryImages },
  { galleryImages: [], imagesCount: 0 }
);