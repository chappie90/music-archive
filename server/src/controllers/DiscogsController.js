const axios = require('axios');

const config = {
  BASE_URL: 'https://api.discogs.com',
  KEY: 'sSQtVWLISutHhemegGPx',
  SECRET: 'mFxLnZFgVzIjrQCmYvjDrGoCkSbFzchP',
  USER_AGENT: 'MusicArchive/0.1 +https://music-archive.com'
};

const searchAll = async (req, res) => {
  try {
    const search = req.query.search;
    const category = req.query.category === 'all' ? '' : req.query.category;
    const genre = req.query.genre === 'all' ? '' : req.query.genre;
    const style = req.query.style === 'all' ? '' : req.query.style;
    const country = req.query.country === 'all' ? '' : req.query.country;
    const year = req.query.year === 'all' ? '' : req.query.year;
    const page = req.query.page;

    let queryParams;

    if (category === 'artist' || category === 'label') {
      queryParams = `query=${search ? search : ''}&type=${category}&page=${page}&per_page=20`;
    } else {
      queryParams = `query=${search ? search : ''}&type=${category}&genre=${genre}&style=${
        style}&country=${country}&year=${year}&page=${page}&per_page=20`;
    }

    const response = await axios.get(`${
      config.BASE_URL}/database/search?${queryParams}`,
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

const getRelease = async (req, res) => {
  try {
    const id = req.query.id;

    const release = await axios.get(`${
      config.BASE_URL}/releases/${id}`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    res.status(200).send(release.data);
  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch release' });
  }
};

const getMaster = async (req, res) => {
  try {
    const id = req.query.id;

    const master = await axios.get(`${
      config.BASE_URL}/masters/${id}`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const masterVersions = await axios.get(`${
      config.BASE_URL}/masters/${id}/versions`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const data = {
      master: master.data,
      masterVersions: masterVersions.data
    };

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch master' });
  }
};

const getLabel = async (req, res) => {
  try {
    const id = req.query.id;

    const label = await axios.get(`${
      config.BASE_URL}/labels/${id}`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const labelReleases = await axios.get(`${
      config.BASE_URL}/labels/${id}/releases?year=desc`,
      { 
        headers: { 
          'User-Agent': config.USER_AGENT,
          'Authorization': `Discogs key=${config.KEY}, secret=${config.SECRET}`
        }   
      }
    );

    const data = {
      label: label.data,
      labelReleases: labelReleases.data
    };

    res.status(200).send(data);

  } catch (error) {
    console.error(error);
    res.status(422).send({ message: 'Could not fetch label' });
  }
};

const getReleasesByGenre = async (req, res) => {
  try {
    const genre = req.query.genre;
    const style = req.query.style === 'all' ? '' : req.query.style;
    const page = req.query.page;

    const response = await axios.get(`${
      config.BASE_URL}/database/search?&type=release&genre=${genre}&style=${style}&page=${page}&per_page=20`,
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
  searchAll,
  getArtist,
  getRelease,
  getMaster,
  getLabel,
  getReleasesByGenre,
  getNewReleases
};



