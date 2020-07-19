import React, { useContext } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import Header from './components/layout/Header';
import NavList from './components/layout/NavList';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ArtistsList from './pages/ArtistsList';
import Artist from './pages/Artist';
import SessionsList from './pages/SessionsList';
import PlaylistsSearch from './pages/PlaylistsSearch';
import PlaylistsListProgramme from './pages/PlaylistsListProgramme';
import PlaylistProgramme from './pages/PlaylistProgramme';
import Programmes from './pages/Programmes';
import Gallery from './pages/Gallery';
import Terms from './pages/Terms';
import { Context as HomepageContext } from './context/HomepageContext';
import './styles/scss/styles.scss';

const App = () => {
  const { state: { menuIsOpen } } = useContext(HomepageContext);

  return (
    <div className="site-wrapper">
      <ReactNotification />
      <Header />
      {menuIsOpen && 
        <div className="nav-mobile-container">
          <NavList class="nav-list-mobile" />
        </div>
      }
      <main className="main">
        <Route exact path="/" component={Home} />
        <Route exact path="/artists/:letter/:search?/:page" component={ArtistsList} />
        <Route exact path="/artist/:artist/:id" component={Artist} />
        <Route exact path="/search-playlists" component={PlaylistsSearch} />
        <Route exact path="/playlists/:programme/:shortcode/:year/:page" component={PlaylistsListProgramme} />
        <Route exact path="/playlists/:programme/:date/:progcode" component={PlaylistProgramme} />
        <Route exact path="/sessions/:programme/:shortcode/:year/:page" component={SessionsList} />
        <Route path="/programmes" component={Programmes} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/terms-of-use" component={Terms} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

