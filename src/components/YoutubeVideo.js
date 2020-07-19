import React from 'react';

const YoutubeVideo = ({ videoId }) => {
  return (
    <div className="youtube-video">
      <iframe src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder='0'
        allow='autoplay; encrypted-media'
        allowFullScreen
        title='video'
      />
    </div>
  );
};

export default YoutubeVideo;
