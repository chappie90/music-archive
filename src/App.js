import React, { useContext } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import Header from './components/layout/Header';
import NavList from './components/layout/NavList';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import NewReleases from './pages/NewReleases';
import Release from './pages/Release';
import Master from './pages/Master';
import Artist from './pages/Artist';
import Label from './pages/Label';
import Search from './pages/Search';
import Genre from './pages/Genre';
import GenresList from './pages/GenresList';
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
        <Route exact path="/search/:search?" component={Search} />
        <Route exact path="/new-releases/:page" component={NewReleases} />
        <Route exact path="/release/:release/:id" component={Release} />
        <Route exact path="/master/:master/:id" component={Master} />
        <Route exact path="/artist/:artist/:id" component={Artist} />
        <Route exact path="/label/:label/:id" component={Label} />
        <Route exact path="/genres/:genre/:style?/:page" component={Genre} />
        <Route exact path="/genres" component={GenresList} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

