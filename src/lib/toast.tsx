import toast, { Toaster } from 'react-hot-toast';

// Custom toast styles matching our design
const toastConfig = {
  success: {
    duration: 3000,
    style: {
      background: 'var(--color-success-50)',
      color: 'var(--color-success-700)',
      border: '1px solid var(--color-success-200)',
    },
    iconTheme: {
      primary: 'var(--color-success-600)',
      secondary: 'white',
    },
  },
  error: {
    duration: 4000,
    style: {
      background: 'var(--color-danger-50)',
      color: 'var(--color-danger-700)',
      border: '1px solid var(--color-danger-200)',
    },
    iconTheme: {
      primary: 'var(--color-danger-600)',
      secondary: 'white',
    },
  },
  loading: {
    duration: Infinity,
    style: {
      background: 'var(--color-primary-50)',
      color: 'var(--color-primary-700)',
      border: '1px solid var(--color-primary-200)',
    },
    iconTheme: {
      primary: 'var(--color-primary-600)',
      secondary: 'white',
    },
  },
};

export const showToast = {
  success: (message: string) => toast.success(message, toastConfig.success),
  error: (message: string) => toast.error(message, toastConfig.error),
  loading: (message: string) => toast.loading(message, toastConfig.loading),
  dismiss: (id?: string) => toast.dismiss(id),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      success: toastConfig.success,
      error: toastConfig.error,
      loading: toastConfig.loading,
    });
  },
};

export { Toaster };
