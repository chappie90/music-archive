import React, { useContext }  from 'react';
import { Link } from 'react-router-dom';

import { Context as HomepageContext } from '../../context/HomepageContext';
import NavBar from './NavBar';
import SocialLinks from '../SocialLinks';

const Header = (props) => {
  const { toggleNavMenu } = useContext(HomepageContext);

  return (
    <div className="header">
      <div className="wrapper">
        <Link 
          className="logo"
          to="/"
          onClick={() =>toggleNavMenu(false)}>
          <img src="/logo.svg" alt="logo" />
        </Link>
        <NavBar />
      </div>
    </div>
  );
}

export default Header;