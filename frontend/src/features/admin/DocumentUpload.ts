import { useState, FormEvent, ChangeEvent } from 'react';
import api from '../../services/api';

export const useDocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a PDF or TXT file');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Don't set Content-Type header - browser will set it automatically with boundary
      // The Authorization header from the interceptor will still be included
      await api.post('/documents/upload', formData);

      setSuccess('Document uploaded and processed successfully!');
      setFile(null);
      setFileName('');
    } catch (err: any) {
      // Handle different error response formats
      let errorMessage = 'Upload failed. Please try again.';

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail
            .map((e: any) => e.msg || JSON.stringify(e))
            .join(', ');
        } else if (typeof err.response.data.detail === 'object') {
          errorMessage = JSON.stringify(err.response.data.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/chat';
  };

  return {
    file,
    fileName,
    error,
    success,
    isLoading,
    handleFileChange,
    handleUpload,
    handleBack,
  };
};

