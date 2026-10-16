import React, { useState, useEffect, useRef } from 'react'
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data';


const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState(cards_data)
  const cardsRef = useRef();
  const accessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const cardsElement = cardsRef.current;
    const controller = new AbortController();

    cardsElement.addEventListener("wheel", handleWheel);

    if (accessToken) {
      const authorization = ['Bearer', accessToken].join(' ');
      fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, {
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
            throw new Error('TMDB response did not include movie results');
          }
          setApiData(response.results);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error('Unable to load movies from TMDB:', error);
          }
        });
    }

    return () => {
      controller.abort();
      cardsElement.removeEventListener("wheel", handleWheel);
    };
  }, [accessToken]);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const image = card.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
            : card.image;
          const name = card.title ?? card.original_title ?? card.name;

          return (
            <div className="card" key={card.id ?? name ?? index}>
              <img src={image} alt={name ?? ''} />
              <p>{name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards
