import { createContext, useState, useContext, useCallback } from 'react';
import Toast from 'components/shared/Toast';

const ToastContext = createContext(null);

let id = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (toast) => {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          ...toast,
        },
      ]);
    },
    [setToasts]
  );

  const removeToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
      }}
    >
      <div className="fixed top-0 right-0 z-50 w-full max-w-sm">
        {toasts.map((toast, i) => (
          <Toast toast={toast} key={i} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
