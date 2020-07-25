const express = require('express');

const DiscogsCtrl = require('../controllers/DiscogsController');

const router = express.Router();

router.get('/discogs/search', DiscogsCtrl.searchAll);
router.get('/discogs/new-releases', DiscogsCtrl.getNewReleases);
router.get('/discogs/artist', DiscogsCtrl.getArtist);
router.get('/discogs/release', DiscogsCtrl.getRelease);
router.get('/discogs/master', DiscogsCtrl.getMaster);
router.get('/discogs/label', DiscogsCtrl.getLabel);
router.get('/discogs/releases/genre', DiscogsCtrl.getReleasesByGenre);

module.exports = router;