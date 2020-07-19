const express = require('express');

const DiscogsCtrl = require('../controllers/DiscogsController');

const router = express.Router();

router.get('/discogs', DiscogsCtrl.fetchDiscorgs);
router.get('/discogs/artists', DiscogsCtrl.fetchArtists);

module.exports = router;