import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default MetaTags;