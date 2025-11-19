import React from 'react';
import { useDocumentUpload } from './DocumentUpload.ts';
import Button from '../../common/Button';
import Loading from '../../common/Loading';
import { useAuthStore } from '../../hooks/useAuth';
import './DocumentUpload.css';

const DocumentUpload: React.FC = () => {
  const {
    file,
    fileName,
    error,
    success,
    isLoading,
    handleFileChange,
    handleUpload,
  } = useDocumentUpload();
  const { logout } = useAuthStore();

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Upload Document</h1>
        <div className="admin-header-actions">
          <a href="/chat" className="back-link">
            Back to Chat
          </a>
          <a href="/admin/list" className="admin-link">
            View Documents
          </a>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="upload-card">
          <h2>Upload PDF or Text Document</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="file-input"
                disabled={isLoading}
              />
              <label htmlFor="file-input" className="file-label">
                {fileName || 'Choose File'}
              </label>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <Button type="submit" disabled={!file || isLoading} className="upload-button">
              {isLoading ? (
                <>
                  <Loading size="small" />
                  <span>Uploading...</span>
                </>
              ) : (
                'Upload & Process'
              )}
            </Button>
          </form>
          <div className="upload-info">
            <p>Supported formats: PDF, TXT</p>
            <p>The document will be processed and added to the knowledge base.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;

