
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const serveIndex = require('serve-index');

const discogsRoutes = require('./src/routes/discogsRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

global.appRoot = path.resolve(__dirname);

app.use(discogsRoutes);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.SERVER_PORT || 3006;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



