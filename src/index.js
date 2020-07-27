import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider as HomepageProvider } from './context/HomepageContext';
import { Provider as DiscogsProvider } from './context/DiscogsContext';
import { Provider as PlaylistsProvider } from './context/PlaylistsContext';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.render(
<BrowserRouter>
  <PlaylistsProvider>
      <DiscogsProvider>
        <HomepageProvider>
            <ScrollToTop />
            <App />
        </HomepageProvider>
      </DiscogsProvider>
  </PlaylistsProvider>
</BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) module.hot.accept();