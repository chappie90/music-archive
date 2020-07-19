import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import API from '../api/api';
import { Context as HomepageContext } from '../context/HomepageContext';
import CustomLink from '../components/CustomLink';

const Home = () => {

  useEffect(() => {
     testApi();
  }, []);

  const testApi = async () => {
    try {
      const response = await API.get('http://localhost:3006/discorgs');
     console.log(response)
   } catch (err) {
    console.log(err)
   }
  }

	return (
    <div className="content-page homepage">
     {/* <section className="header-section">
        <div className="content-wrapper">
          <div className="text">
            <h1 className="heading">Title</h1>
            <p className="paragraph">Body</p>
            <CustomLink className="link link-black" type="internal">
              <button className="button">
                Button
              </button>
            </CustomLink> 
          </div>
        </div>
        <div className="img-container">
          <img 
            className="img" 
            src={`${process.env.REACT_APP_API_BASE_URL}/public/images/homepage/}`}
            alt="" />
        </div>
      </section>
      <section className="top-banners-section">
        <div className="section-wrapper section-wrapper-green">
        <h2 className="section-heading heading-white">Title</h2>}
          <ul className="list">
            {topBanners.length > 0 && topBanners.map((item, index) => {
              return (
                <li className={index === 0 ? 'item top-banner-big' : 'item top-banner-small'} key={item.id}>
                  <CustomLink className="link link-white" type={item.link_type} url={item.link}>
                    {item.image && <img 
                      className={index === 0 ? 'img-big' : 'img-small'} 
                      src={`${process.env.REACT_APP_API_BASE_URL}/public/images/homepage/${item.image}`} 
                    />}
                    <h1 className="heading heading-white">{item.title}</h1>
                  </CustomLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="bottom-banners-section">
        <div className="section-wrapper section-wrapper-green-dark">
          {bottomBanners[0]?.section_title && <h2 className="section-heading heading-white">{bottomBanners[0]?.section_title}</h2>}
          <ul className="list">
            {bottomBanners.length > 0 && bottomBanners.map((item, index) => (
              <li className="item" key={item.id}>
                <CustomLink className="link link-white" type={item.link_type} url={item.link}>
                  {item.image && <img 
                    className="img"
                    src={`${process.env.REACT_APP_API_BASE_URL}/public/images/homepage/${item.image}`} 
                  />}
                  <h1 className="heading heading-white">{item.title}</h1>
                </CustomLink>   
              </li>
            ))}
          </ul>
        </div>
      </section>*/}
    </div>
	);
};

export default Home;