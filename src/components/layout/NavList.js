import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Context as DiscogsContext } from '../../context/DiscogsContext';
import { Context as HomepageContext } from '../../context/HomepageContext';

const NavList = props => {
  const { resetLocalArtistsState } = useContext(DiscogsContext);
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
      case 'search':
        setActiveNav('search');
        break;
      case 'genres':
        setActiveNav('genres');
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
            className={`${activeNav === 'search' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/search">
            Search
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
            className={`${activeNav === 'genres' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/genres">
            Genres
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
      </ul>
    </Fragment>
  );
}

export default NavList;