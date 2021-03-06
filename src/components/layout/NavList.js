import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Context as DiscogsContext } from '../../context/DiscogsContext';
import { Context as HomepageContext } from '../../context/HomepageContext';

const NavList = props => {
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
      case 'new-releases':
        setActiveNav('new-releases');
        break;
      case 'search':
        setActiveNav('search');
        break;
      case 'genres':
        setActiveNav('genres');
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
              toggleNavMenu(false);
            }}
            className={`${activeNav === 'new-releases' ? 'nav-link-active' : 'nav-link'} link link-white`} 
            to="/new-releases/1">
            New Releases
          </Link>
        </li>
        <li className="item">
          <Link 
            className={`${activeNav === 'genres' ? 'nav-link-active' : 'nav-link'} link link-white`}
            onClick={() => toggleNavMenu(false)}
            to="/genres">
            Browse by Genre
          </Link>
        </li>
      </ul>
    </Fragment>
  );
}

export default NavList;