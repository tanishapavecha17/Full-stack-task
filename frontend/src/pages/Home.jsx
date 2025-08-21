import React, { useState, useEffect, useCallback } from "react"; 
import axios from 'axios';
import ArticleCard from "../components/Cards/ArticleCard";
import SearchBar from "../components/SearchBar/SearchBar";
import Pagination from "../components/pagination/Pagination";
import Sidebar from "../components/Sidebar/Sidebar";
import './Home.css';
import Navbar from "../components/Navbar/Navbar";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      const params = { page: currentPage, limit: 9 };
      
      let url = 'http://localhost:8000/api/articles/';
      if (searchQuery) {
        url += `search/${encodeURIComponent(searchQuery)}`;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: params 
        });

        const articlesArray = response.data?.data?.articles || response.data?.data || response.data?.articles || [];
        const paginationInfo = response.data?.data?.pagination || response.data?.pagination || null;
       

        setArticles(articlesArray);
        setPaginationData(paginationInfo);

      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [searchQuery, currentPage]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const renderArticleContent = () => {
    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error}</p>;
    if (articles.length === 0) return <p>No articles found.</p>;
    
    return (
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    );
  };

  const isAdmin = user && user.role === 'Admin';

  return (
    <div>
      <Navbar />
      <div className="home-layout">
        {isAdmin && <Sidebar />}
        <div className={isAdmin ? "main-content-with-sidebar" : "main-content-full"}>
          <div className="home-content">
            <h1>Latest Articles</h1>
            <SearchBar onSearch={handleSearch} />
            {renderArticleContent()}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData?.pages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
