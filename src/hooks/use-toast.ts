
// Minimal no-op implementation of useToast
export const useToast = () => {
  return {
    toast: () => {},
    dismiss: () => {},
    toasts: []
  };
};

export const toast = () => {};
