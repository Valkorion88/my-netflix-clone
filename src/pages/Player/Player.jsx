import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png'

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoResult, setVideoResult] = useState(null);
  const accessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

  useEffect(() => {
    if (!id || !accessToken) {
      return;
    }

    const controller = new AbortController();
    const authorization = ['Bearer', accessToken].join(' ');

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, {
      headers: {
        accept: 'application/json',
        Authorization: authorization,
      },
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`TMDB request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(response => {
        if (!Array.isArray(response.results)) {
          throw new Error('TMDB response did not include video results');
        }

        const youtubeVideos = response.results.filter(item => item.site === 'YouTube');
        const selectedVideo =
          youtubeVideos.find(item => item.type === 'Trailer') ??
          youtubeVideos.find(item => item.type === 'Teaser') ??
          youtubeVideos[0];

        if (!selectedVideo) {
          setVideoResult({
            id,
            error: 'No YouTube trailer or teaser is available for this movie.',
          });
          return;
        }

        setVideoResult({ id, video: selectedVideo });
      })
      .catch(requestError => {
        if (requestError.name !== 'AbortError') {
          console.error('Unable to load movie video from TMDB:', requestError);
          setVideoResult({
            id,
            error: 'Unable to load this video. Please try again later.',
          });
        }
      });

    return () => controller.abort();
  }, [accessToken, id]);

  const currentResult = videoResult?.id === id ? videoResult : null;
  const video = currentResult?.video;
  const message =
    !id ? 'No movie was selected.' :
    !accessToken ? 'TMDB access token is not configured.' :
    currentResult?.error || 'Loading video...';

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Go back" onClick={() => navigate(-1)} />
      {video ? (
        <iframe
          width='90%'
          height='90%'
          src={`https://www.youtube.com/embed/${video.key}`}
          title={video.name}
          frameBorder='0'
          allowFullScreen
        />
      ) : (
        <p>{message}</p>
      )}
      <div className="player-info">
        {video && (
          <>
            <p>{video.published_at.slice(0,10)}</p>
            <p>{video.name}</p>
            <p>{video.type}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Player
