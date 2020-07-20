import React, { useContext } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import Header from './components/layout/Header';
import NavList from './components/layout/NavList';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import NewReleases from './pages/NewReleases';
import Artist from './pages/Artist';
import SessionsList from './pages/SessionsList';
import Search from './pages/Search';
import Genre from './pages/Genre';
import PlaylistProgramme from './pages/PlaylistProgramme';
import GenresList from './pages/GenresList';
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
        <Route exact path="/search" component={Search} />
        <Route exact path="/new-releases/:page" component={NewReleases} />
        <Route exact path="/artist/:artist/:id" component={Artist} />
        <Route exact path="/genres/:genre/:decade/:page" component={Genre} />
        <Route exact path="/playlists/:programme/:date/:progcode" component={PlaylistProgramme} />
        <Route exact path="/genres" component={GenresList} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/terms-of-use" component={Terms} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

