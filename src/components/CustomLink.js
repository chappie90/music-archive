import React from 'react';
import { Link } from 'react-router-dom';

const CustomLink = (props) => {
  let internalLink, externalLink;

  if (props.type === 'external') {
    if (props.url.includes('http')) {
      externalLink = props.url;
    } else {
      externalLink = `//${props.url}`;
    }
  } else {
    if (props.url.includes(window.location.origin)) {
      internalLink = props.url.split(window.location.origin)[1];
    } else {
      internalLink = props.url;
    }
  }
    
  return props.type === 'external' ?
    <a href={externalLink} target="_blank" rel="noopener noreferrer" { ...props }>{props.children}</a> :
    <Link to={internalLink} { ...props}>{props.children}</Link>
};

export default CustomLink;