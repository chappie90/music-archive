import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import API from '../api/api';
import { Context as HomepageContext } from '../context/HomepageContext';
import CustomLink from '../components/CustomLink';

const Home = () => {
  const topBanners = [
    {
      title: 'Foo Fighters',
      link: 'artist/foo-fighters/198282',
      image: 'foofighters.jpg'
    },
    {
      title: 'Jeff Buckley',
      link: 'artist/jeff-buckley/159169',
      image: 'jeffbuckley.jpg'
    },
    {
      title: 'Manu Chao',
      link: 'artist/manu-chao/30773',
      image: 'manuchao.jpeg'
    }
  ];
  const bottomBanners = [
    {
      title: 'Linkin Park',
      link: 'artist/linkin-park/40029',
      image: 'linkinpark.jpg'
    },
    {
      title: 'Metallica',
      link: 'artist/metallica/18839',
      image: 'metallica.jpg'
    },
    {
      title: 'U2',
      link: 'artist/u2/6520',
      image: 'u2.jpg'
    },
    {
      title: 'Allanis Morissette',
      link: 'artist/alanis-morissette/102789',
      image: 'allanismorissette.jpg'
    },
    {
      title: 'Audioslave',
      link: 'artist/audioslave/252455',
      image: 'audioslave.jpg'
    }
  ];

  useEffect(() => {

  }, []);


	return (
    <div className="content-page homepage">
      <section className="header-section">
        <div className="content-wrapper">
          <div className="text">
            <h1 className="heading">The Music Archive</h1>
            <p className="paragraph">
              A comprehensive music database containing your favourite artists, labels and releases.
            </p>
            <Link className="link link-black" to="/search" >
              <button className="button">
                Explore the Music Archive
              </button>
            </Link> 
          </div>
        </div>
        <div className="img-container">
          <img 
            className="img" 
            src="hero-banner.jpg"
            alt="" />
        </div>
      </section>
      <section className="top-banners-section">
        <div className="section-wrapper section-wrapper-green">
        <h2 className="section-heading heading-white">Title</h2>
          <ul className="list">
            {topBanners.map((item, index) => {
              return (
                <li className={index === 0 ? 'item top-banner-big' : 'item top-banner-small'}>
                  <Link className="link link-white" to={item.link}>
                    {item.image && <img 
                      className={index === 0 ? 'img-big' : 'img-small'} 
                      src={item.image} 
                    />}
                    <h1 className="heading heading-white">{item.title}</h1>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="bottom-banners-section">
        <div className="section-wrapper section-wrapper-green-dark">
          <h2 className="section-heading heading-white">{bottomBanners[0]?.section_title}</h2>
          <ul className="list">
            {bottomBanners.map((item, index) => (
              <li className="item">
                <Link className="link link-white" to={item.link}>
                  {item.image && <img 
                    className="img"
                    src={item.image} 
                  />}
                  <h1 className="heading heading-white">{item.title}</h1>
                </Link>   
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
	);
};

export default Home;