const axios = require('axios');

const config = {
  BASE_URL: 'https://api.discogs.com',
  KEY: 'sSQtVWLISutHhemegGPx',
  SECRET: 'mFxLnZFgVzIjrQCmYvjDrGoCkSbFzchP',
  USER_AGENT: 'MusicArchive/0.1 +https://music-archive.com'
};


const fetchDiscorgs = async (req, res) => {
  try {
    const response = await axios.get(`${config.BASE_URL}/database/search?`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );
    console.log(response);
    res.status(200).send({ data: response.data });
  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch data' });
  }
};

const fetchArtists = async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page;

    const response = await axios.get(`${
      config.BASE_URL}/database/search?query=${
      search ? search : ''}&type=artist&page=${page}&per_page=20`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch data' });
  }
};


module.exports = {
  fetchDiscorgs,
  fetchArtists
};



