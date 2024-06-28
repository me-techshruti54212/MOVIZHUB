import React from 'react'
import {useState,useEffect} from "react"
const KEY = "679dfbf1";

export function useMovies(query,callback){
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(
        function () {

          const controller = new AbortController();
          async function fetchMovies() {
            try {
              setError("");
              setIsLoading(true);
              const res = await fetch(
                `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
                { signal: controller.signal }
              );
    
              if (!res.ok)
                throw new Error("Something went wrong with fetching movies");
    
              const data = await res.json();
              if (data.Response === "False") throw new Error("Movie not found");
    
              setMovies(data.Search);
              console.log(data.Search);
            } catch (err) {
              console.error(err.message);
              if (err.name != "AbortError") setError(err.message);
            } finally {
              setIsLoading(false);
            }
          }
          if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
          }
        //   onCloseMovie();
        callback?.();

          fetchMovies();
    
          return function () {
            controller.abort();
          };
        },
        [query]
      );
  
      return {movies,error,isLoading};
}


