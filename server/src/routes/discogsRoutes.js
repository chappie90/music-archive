const express = require('express');

const DiscogsCtrl = require('../controllers/DiscogsController');

const router = express.Router();

router.get('/discogs/search', DiscogsCtrl.searchPlaylists);
router.get('/discogs/artists', DiscogsCtrl.getArtists);
router.get('/discogs/artist', DiscogsCtrl.getArtist);
router.get('/discogs/releases/genre', DiscogsCtrl.getReleasesByGenre);

module.exports = router;