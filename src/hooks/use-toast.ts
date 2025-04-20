
// Minimal no-op implementation of useToast
export const useToast = () => {
  return {
    toast: (options?: any) => {}, // Accept options object but do nothing with it
    dismiss: (toastId?: string) => {}, // Accept toastId but do nothing with it
    toasts: []
  };
};

// Global toast function that accepts options but does nothing
export const toast = (options?: any) => {};
