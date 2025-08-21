import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {

  const backendUrl = 'http://localhost:8000';

  const getImageUrl = (path) => {
    if (!path) {
      return 'https://placehold.co/400x200/EFEFEF/AAAAAA?text=No+Image';
    }
    const correctedPath = path.replace(/\\/g, '/').replace('public/', '');
    return `${backendUrl}/${correctedPath}`;
  };

  const authorName = article.author ? `${article.author.first_name} ${article.author.last_name}` : 'Unknown Author';
  const authorImage = article.author && article.author.image 
    ? getImageUrl(article.author.image) 
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const createSnippet = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="article-card">
      <img
        src={getImageUrl(article.coverImage)}
        alt={article.title}
        className="card-cover-image"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x200/EFEFEF/AAAAAA?text=Image+Error'; }}
      />
      <div className="card-content">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-snippet">{createSnippet(article.content, 25)}</p>
        <div className="card-author-info">
          <img
            src={authorImage}
            alt={authorName}
            className="author-avatar"
          />
          <span className="author-name">{authorName}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
