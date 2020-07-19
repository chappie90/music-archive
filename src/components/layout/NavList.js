import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Context as ArtistsContext } from '../../context/ArtistsContext';
import { Context as HomepageContext } from '../../context/HomepageContext';

const NavList = props => {
  const { resetLocalArtistsState } = useContext(ArtistsContext);
  const { toggleNavMenu } = useContext(HomepageContext);
  const [activeNav, setActiveNav] = useState('');
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const mainRoute = pathname.split('/')[1];
    switch (mainRoute) {
      case '':
        setActiveNav('home');
        break;
      case 'artists':
      case 'artist':
        setActiveNav('artists');
        break;
      case 'search-playlists':
        setActiveNav('playlists');
        break;
      case 'programmes':
      case 'playlists':
        setActiveNav('programmes');
        break;
      case 'gallery':
        setActiveNav('gallery');
        break;
      case 'dashboard':
        setActiveNav('dashboard');
        break;
    }
  }, [pathname]);


  return (
    <Fragment>
      <ul className={props.class ? 'nav-list-mobile' : 'nav-list'}>
        <li className="item">
          <Link 
            className={`${activeNav === 'home' ? 'nav-link-active' : 'nav-link'} link link-white`} 
            onClick={() =>toggleNavMenu(false)}
            to="/">
            Home
          </Link>
        </li>
        <li className="item">
          <Link
            onClick={(e) => {
              resetLocalArtistsState(true);
              toggleNavMenu(false);
            }}
            className={`${activeNav === 'artists' ? 'nav-link-active' : 'nav-link'} link link-white`} 
            to="/artists/a/1">
            Artists
          </Link>
        </li>
        <li className="item">
          <Link 
            className={`${activeNav === 'playlists' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/search-playlists">
            Playlists
          </Link>
        </li>
        <li className="item">
          <Link 
            className={`${activeNav === 'programmes' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/programmes">
            Programmes
          </Link>
        </li>
        <li className="item">
          <Link 
            className={`${activeNav === 'gallery' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/gallery">
            Gallery
          </Link>
        </li>
        <li className="item">
          <Link 
            className={`${activeNav === 'dashboard' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/dashboard/homepage">
            Dashboard
          </Link>
        </li>
      </ul>
    </Fragment>
  );
}

export default NavList;