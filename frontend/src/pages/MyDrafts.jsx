import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArticleModal from "../modals/ArticleModal/ArticleModal";
import Navbar from "../components/Navbar/Navbar";
import DraftArticleCard from "../components/Cards/DraftArticleCard";
import "./MyDrafts.css";
import axios from "axios";

const MyDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(
        "http://localhost:8000/api/articles?status=draft",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDrafts(response.data?.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [navigate]);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/articles/my-articles/delete/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDrafts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = () => {
    fetchDrafts();
  };

  const renderContent = () => {
    if (loading) return <p className="message">Loading your drafts...</p>;
    if (error) return <p className="message error">{`Error: ${error}`}</p>;
    if (drafts.length === 0)
      return <p className="message">You have no drafts. Create one!</p>;

    return (
      <div className="drafts-grid">
        {drafts.map((draft) => (
          <DraftArticleCard
            key={draft._id}
            article={draft}
            onDelete={handleDelete}
            onSave={handleSave}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="my-drafts-container">
        <div className="drafts-header">
          <h1 style={{
            textAlign:"center"
          }}>My Drafts</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="create-article-btn"
          >
            Create New Article
          </button>
          <div style={{clear:"both"}}></div>
        </div>
        {renderContent()}
      </div>

      <ArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        articleToEdit={null}
        onSave={handleSave}
      />
    </>
  );
};

export default MyDrafts;
