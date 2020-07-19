import createDataContext from './createDataContext';

import API from '../api/api';

const CancelToken = API.CancelToken;
let source;

const homepageReducer = (state, action) => {
  switch (action.type) {
    case 'toggle_menu':
      return { ...state, menuIsOpen: action.payload };
    case 'get_hero_banner':
      return { ...state, heroBanner: action.payload };
    case 'get_top_banners':
      return { ...state, topBanners: action.payload };
    case 'get_bottom_banners':
      return { ...state, bottomBanners: action.payload };
    case 'get_all_banners':
      return { ...state, allHomepageBanners: action.payload };
    default:
      return state;
  }
};

const toggleNavMenu = dispatch => async (value) => {
  dispatch({ type: 'toggle_menu', payload: value });
};  

const getHeroBanner = dispatch => async () => {
  try {
    const response = await API.get('/homepage/herobanner');
    console.log(response.data)

    dispatch({ type: 'get_hero_banner', payload: response.data.heroBanner });
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const getTopBanners = dispatch => async () => {
  try {
    const response = await API.get('/homepage/topbanners');

    dispatch({ type: 'get_top_banners', payload: response.data.topBanners });
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const getBottomBanners = dispatch => async () => {
  try {
    const response = await API.get('/homepage/bottombanners');

    dispatch({ type: 'get_bottom_banners', payload: response.data.bottomBanners });
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const getAllBannersManager = dispatch => async () => {
  try {
    const response = await API.get('/homepage/allbanners');

    const banners = response.data.allBanners.map(item => {
      const bannerParts = item.type.split('_');
      const bannerName = `${bannerParts[0].charAt(0).toUpperCase()}${bannerParts[0].slice(1)} ${
                        bannerParts[1].charAt(0).toUpperCase()}${bannerParts[1].slice(1)} ${
                        item.position !== 0 ? item.position : ''}`;
      return {
        ...item,
        name: bannerName
      };
    });

    dispatch({ type: 'get_all_banners', payload: banners });
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const updateBanner = dispatch => async (bannerData) => {
  console.log(bannerData)
  try {
    return await API.patch('/homepage/banner/update', bannerData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch(err) {
    console.log(err);
    if (err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};


export const { Context, Provider } = createDataContext(
  homepageReducer,
  { 
    toggleNavMenu,
    getHeroBanner,
    getTopBanners,
    getBottomBanners,
    getAllBannersManager,
    updateBanner
  },
  { 
    menuIsOpen: false,
    heroBanner: null,
    topBanners: [],
    bottomBanners: [],
    allHomepageBanners: []
  }
);


