import { useState, useCallback } from 'react';
import { ToastMessage } from '../components/StatusToast';

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast
    };

    setMessages(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setMessages([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, description?: string, action?: ToastMessage['action']) => {
    return addToast({ type: 'success', title, description, action });
  }, [addToast]);

  const error = useCallback((title: string, description?: string, action?: ToastMessage['action']) => {
    return addToast({ type: 'error', title, description, action });
  }, [addToast]);

  const info = useCallback((title: string, description?: string, action?: ToastMessage['action']) => {
    return addToast({ type: 'info', title, description, action });
  }, [addToast]);

  const loading = useCallback((title: string, description?: string, category?: ToastMessage['category']) => {
    return addToast({ type: 'loading', title, description, category, duration: 0 });
  }, [addToast]);

  return {
    messages,
    addToast,
    dismissToast,
    clearAllToasts,
    success,
    error,
    info,
    loading
  };
}