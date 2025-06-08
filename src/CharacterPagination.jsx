import React, { useState, useEffect, useRef } from "react";
import "./CharacterPagination.css";

const API_URL = "https://rickandmortyapi.com/api/character";

export const CharacterPagination = () => {
  const [characters, setCharacters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [, forceUpdate] = useState(0); 
  const currentPageRef = useRef(1);
  const itemsPerPage = 10;

  useEffect(() => {
   
    const fetchCharacters = async (page = 1) => {
      try {
        const res = await fetch(`${API_URL}/?page=${page}`);
        const data = await res.json();

        setCharacters(data.results);
        setTotalPages(data.info.pages);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    fetchCharacters(currentPageRef.current);
  }, [currentPageRef.current]);


  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;

    currentPageRef.current = pageNum;
  
    forceUpdate((n) => n + 1);
  };

  return (
    <div className="container">
      <h2>Rick and Morty Characters</h2>
      <div className="grid">
        {characters.map((char) => (
          <div key={char.id} className="card">
            <img src={char.image} alt={char.name} />
            <h3>{char.name}</h3>
            <p>Status: {char.status}</p>
            <p>Species: {char.species}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => goToPage(currentPageRef.current - 1)}
          disabled={currentPageRef.current === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={pageNum === currentPageRef.current ? "active" : ""}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPageRef.current + 1)}
          disabled={currentPageRef.current === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
