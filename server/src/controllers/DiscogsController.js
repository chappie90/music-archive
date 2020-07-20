const axios = require('axios');

const config = {
  BASE_URL: 'https://api.discogs.com',
  KEY: 'sSQtVWLISutHhemegGPx',
  SECRET: 'mFxLnZFgVzIjrQCmYvjDrGoCkSbFzchP',
  USER_AGENT: 'MusicArchive/0.1 +https://music-archive.com'
};

const searchPlaylists = async (req, res) => {
  try {
    const search = req.query.search;
    const category = req.query.category === 'all' ? '' : req.query.category;
    const page = req.query.page;

    const response = await axios.get(`${
      config.BASE_URL}/database/search?query=${
      search ? search : ''}&type=${category}&page=${page}&per_page=20`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );
    res.status(200).send(response.data);

  } catch (err) {
    console.log(err);
    res.status(422).json({ message: 'Could not find any results' });
  }
};

const getNewReleases = async (req, res) => {
  try {
    const page = req.query.page;

    console.log(page)

    const response = await axios.get(`${
      config.BASE_URL}/database/search?&type=release&year=${new Date().getFullYear()}&page=${page}&per_page=50`,
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
    res.status(422).send({ message: 'Could not fetch artists' });
  }
};

const getArtist = async (req, res) => {
  try {
    const id = req.query.id;

    const artist = await axios.get(`${
      config.BASE_URL}/artists/${id}`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const artistReleases = await axios.get(`${
      config.BASE_URL}/artists/${id}/releases?year=desc`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const data = {
      artist: artist.data,
      artistReleases: artistReleases.data
    };

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch artist' });
  }
};

const getReleasesByGenre = async (req, res) => {
  try {
    const genre = req.query.genre;
    const decade = req.query.decade;
    const page = req.query.page;

    const response = await axios.get(`${
      config.BASE_URL}/database/search?&type=release&genre=${genre}&page=${page}&per_page=20`,
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
  searchPlaylists,
  getArtist,
  getReleasesByGenre,
  getNewReleases
};



