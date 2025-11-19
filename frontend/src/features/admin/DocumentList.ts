import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Document {
  id: number;
  filename: string;
  uploaded_at: string;
  chunk_count?: number;
}

export const useDocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/documents/list');
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete document');
    }
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  return {
    documents,
    isLoading,
    error,
    handleDelete,
    handleRefresh,
  };
};

