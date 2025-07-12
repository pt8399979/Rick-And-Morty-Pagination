import React, { useState, useEffect, useRef } from "react";
import "./CharacterPagination.css";

const API_URL = "https://rickandmortyapi.com/api/character";
const STAR_ICON = "https://static.thenounproject.com/png/542578-200.png";

export const CharacterPagination = ({ onLogout }) => {
  const [characters, setCharacters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [genderFilter, setGenderFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [, forceUpdate] = useState(0);
  const currentPageRef = useRef(1);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCharacters = async (page = 1) => {
      try {
        let url = `${API_URL}/?page=${page}&name=${query}`;
        if (genderFilter !== "all") {
          url += `&gender=${genderFilter}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const sorted = (data.results || []).sort((a, b) =>
          sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );

        setCharacters(sorted);
        setTotalPages(data.info?.pages || 1);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        setCharacters([]);
        setTotalPages(1);
      }
    };

    fetchCharacters(currentPageRef.current);
  }, [currentPageRef.current, query, sortOrder, genderFilter]);

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPageRef.current = pageNum;
    forceUpdate((n) => n + 1);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredCharacters = showOnlyFavorites
    ? characters.filter((char) => favorites.includes(char.id))
    : characters;

  return (
    <div className="container-full">
      <header className="header">
        <div className="header-logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rick_and_Morty.svg/800px-Rick_and_Morty.svg.png"
            alt="Rick and Morty"
          />
        </div>

        {/* 🔐 Show logged in user & logout */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "90%", marginBottom: "1rem" }}>
          <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
            Logged in as: <strong>{user?.email}</strong>
          </div>
          <button className="control-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="search-wrapper">
          <img
            src="https://pixsector.com/cache/e7836840/av6584c34aabb39f00a10.png"
            alt="search"
            className="search-icon"
          />
          <input
            type="text"
            placeholder="Search for characters by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls">
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="control-btn"
          >
            {isGridView ? "Switch to List View" : "Switch to Grid View"}
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="control-btn"
          >
            Sort {sortOrder === "asc" ? "Z → A" : "A → Z"}
          </button>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="control-btn"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
          <button
            className="control-btn"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </header>

      <main className={isGridView ? "grid" : "list"}>
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className="card"
            onClick={(e) => {
              if (e.target.classList.contains("star")) return;
              setSelectedCharacter(char);
            }}
          >
            <div className="fav-star">
              <img
                src={STAR_ICON}
                alt="star"
                className={`star ${favorites.includes(char.id) ? "favorite" : ""}`}
                onClick={() => toggleFavorite(char.id)}
              />
            </div>
            <img src={char.image} alt={char.name} />
            <h3>{char.name}</h3>
            <p>Status: {char.status}</p>
            <p>Species: {char.species}</p>
            <p>Gender: {char.gender}</p>
          </div>
        ))}
      </main>

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

      {selectedCharacter && (
        <div className="overlay">
          <div className="overlay-content small-view">
            <button
              className="close-button"
              onClick={() => setSelectedCharacter(null)}
            >
              &times;
            </button>
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
              className="fullscreen-img"
            />
            <h2>{selectedCharacter.name}</h2>
            <p>Status: {selectedCharacter.status}</p>
            <p>Species: {selectedCharacter.species}</p>
            <p>Gender: {selectedCharacter.gender}</p>
            <p>Origin: {selectedCharacter.origin.name}</p>
            <p>Location: {selectedCharacter.location.name}</p>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>
          &copy; 2025 Rick and Morty Explorer &mdash; Created as an educational fan showcase.
        </p>
      </footer>
    </div>
  );
};
