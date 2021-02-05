import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import ScrollContainer from "react-indiana-drag-scroll";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";


const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargeRow }) {
  const [arrowOpen,setArrowOpen] = useState()
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchUrl]);
  const youtubeOpts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const movieClicked = (moviename,id) => {
    console.log(moviename);
    setArrowOpen(id)
    if (trailerUrl != "") {
      setTrailerUrl("");
      movieTrailer(moviename)
        .then((url) => {
          console.log('url in movieTrailerfunction', url);
          const urlParamV = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParamV.get("v"));
        })
        .catch((err) => console.log(err));
    }
    else {
      movieTrailer(moviename)
        .then((url) => {
          console.log('url in movieTrailerfunction', url);
          const urlParamV = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParamV.get("v"));
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>
      <ScrollContainer className="row__posters">
        {movies.map((movie) => (
          <div className="poster__item">
          <img
            onClick={() =>
              movieClicked(movie.name || movie.title || movie.orginal_name, movie.id)
            }
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`} //use && if theres no else or : otherwise use ?
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          >
          </img>
          {arrowOpen === movie.id && <i className="fa fa-arrow-down"
          onClick = {()=>{setTrailerUrl(""); setArrowOpen("")}}
          />}
          </div>
         
        ))}
      </ScrollContainer>
      {trailerUrl != "" && <YouTube videoId={trailerUrl} opts={youtubeOpts} />}
    </div>
  );
}

export default Row;
