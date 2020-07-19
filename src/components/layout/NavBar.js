import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import noScroll from 'no-scroll';

import NavList from './NavList';
import { Context as HomepageContext } from '../../context/HomepageContext';

const NavBar = (props) => {
  const { state: { menuIsOpen }, toggleNavMenu } = useContext(HomepageContext);

  useEffect(() => {
    if (menuIsOpen) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }, [menuIsOpen]);

  return (
    <div className="navigation">
      <div onClick={() => toggleNavMenu(!menuIsOpen)} className={menuIsOpen ? 'menu open' : 'menu'}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <NavList />
    </div>
  );
}

export default NavBar;