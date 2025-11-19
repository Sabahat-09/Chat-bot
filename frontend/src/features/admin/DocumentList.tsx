import React from 'react';
import { useDocumentList } from './DocumentList.ts';
import Loading from '../../common/Loading';
import Button from '../../common/Button';
import { useAuthStore } from '../../hooks/useAuth';
import './DocumentList.css';

const DocumentList: React.FC = () => {
  const { documents, isLoading, error, handleDelete, handleRefresh } = useDocumentList();
  const { logout } = useAuthStore();

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Document List</h1>
        <div className="admin-header-actions">
          <a href="/chat" className="back-link">
            Back to Chat
          </a>
          <a href="/admin/documents" className="admin-link">
            Upload Document
          </a>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="documents-card">
          <div className="documents-header">
            <h2>Uploaded Documents</h2>
            <Button onClick={handleRefresh} variant="secondary">
              Refresh
            </Button>
          </div>
          {isLoading && (
            <div className="loading-container">
              <Loading size="medium" text="Loading documents..." />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {!isLoading && !error && documents.length === 0 && (
            <div className="empty-state">
              <p>No documents uploaded yet.</p>
              <a href="/admin/documents" className="upload-link">
                Upload your first document
              </a>
            </div>
          )}
          {!isLoading && !error && documents.length > 0 && (
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    <h3 className="document-name">{doc.filename}</h3>
                    <p className="document-meta">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <p className="document-meta">Chunks: {doc.chunk_count || 0}</p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(doc.id)}
                    className="delete-button"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;

