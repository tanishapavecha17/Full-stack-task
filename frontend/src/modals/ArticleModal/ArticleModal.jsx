import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup'; // Import yup
import './ArticleModal.css';


const articleSchema = yup.object().shape({
  title: yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters long.')
    .required('Title is required.'),
  content: yup.string()
    .trim()
    .min(10, 'Content must be at least 10 characters long.')
    .required('Content is required.'),
  image: yup.mixed().required('A cover image is required.'),
});

const ArticleModal = ({ isOpen, onClose, articleToEdit, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft'); 
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({}); 

  const isEditMode = Boolean(articleToEdit);
  const backendUrl = 'http://localhost:8000';

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setTitle(articleToEdit.title || '');
        setContent(articleToEdit.content || '');
        setStatus(articleToEdit.status || 'draft'); 
        if (articleToEdit.coverImage) {
          const correctedPath = articleToEdit.coverImage.replace(/\\/g, '/').replace('public/', '');
          setImagePreview(`${backendUrl}/${correctedPath}`);
        } else {
          setImagePreview(null);
        }
      } else {
        setTitle('');
        setContent('');
        setStatus('draft');
        setImageFile(null);
        setImagePreview(null);
      }
      setError('');
      setFormErrors({});
    }
  }, [isOpen, articleToEdit, isEditMode, backendUrl]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    
    try {
      await articleSchema.validate({
        title: title,
        content: content,
        image: imageFile || imagePreview, 
      }, { abortEarly: false }); 
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach(err => {
        if (!newErrors[err.path]) {
          newErrors[err.path] = err.message;
        }
      });
      setFormErrors(newErrors);
      return; 
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', status); 
    if (imageFile) {
      formData.append('coverImage', imageFile);
    }
    
    const url = isEditMode
      ? `http://localhost:8000/api/articles/edit-article/${articleToEdit._id}`
      : 'http://localhost:8000/api/articles/new-article';
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      if (!responseData.success) throw new Error(responseData.message || 'Failed to save article.');

      onSave(); 
      onClose(); 

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditMode ? 'Edit Draft' : 'Create New Article'}</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title<span><sup style={{color:"red",fontSize:"14px"}}>*</sup></span></label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && <p className="validation-error">{formErrors.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="content">Content<span><sup style={{color:"red",fontSize:"14px"}}>*</sup></span></label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            ></textarea>
            {formErrors.content && <p className="validation-error">{formErrors.content}</p>}
          </div>
          <div className="form-group">
            <label>Cover Image<span><sup style={{color:"red",fontSize:"14px"}}>*</sup></span></label>
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            <label htmlFor="image-upload" className="custom-file">Choose File</label>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
            {formErrors.image && <p className="validation-error">{formErrors.image}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
