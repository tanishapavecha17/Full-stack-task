import React, { useState } from 'react';
import ArticleModal from '../../modals/ArticleModal/ArticleModal';
import './ArticleCard.css';
import './DraftArticleCard.css';

const DraftArticleCard = ({ article, onDelete, onSave }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const backendUrl = 'http://localhost:8000';

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/400x200/EFEFEF/AAAAAA?text=No+Image';
    const correctedPath = path.replace(/\\/g, '/').replace('public/', '');
    return `${backendUrl}/${correctedPath}`;
  };

  const author = article.author || {};
  const authorName = author.first_name ? `${author.first_name} ${author.last_name || ''}`.trim() : 'Unknown Author';
  const authorImage = author.image 
    ? getImageUrl(author.image) 
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const createSnippet = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  const handleSaveAndClose = () => {
    onSave();
    setIsEditModalOpen(false); 
  };

  return (
    <>
      <div className="article-card">
        <div className="card-image-container">
          <img
            src={getImageUrl(article.coverImage)}
            alt={article.title || 'Article Image'}
            className="card-cover-image"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x200/EFEFEF/AAAAAA?text=Image+Error'; }}
          />
          <div className="card-actions">
            <button onClick={() => setIsEditModalOpen(true)} className="action-btn edit-btn" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            </button>
            <button onClick={() => onDelete(article._id)} className="action-btn delete-btn" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
          </div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{article.title || 'Untitled Article'}</h3>
          <p className="card-snippet">{createSnippet(article.content, 25)}</p>
          <div className="card-author-info">
            <img src={authorImage} alt={authorName} className="author-avatar" />
            <span className="author-name">{authorName}</span>
          </div>
        </div>
      </div>


      <ArticleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        articleToEdit={article}
        onSave={handleSaveAndClose}
      />
    </>
  );
};

export default DraftArticleCard;
