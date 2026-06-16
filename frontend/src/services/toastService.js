const listeners = new Set();

function emit(toast) {
  listeners.forEach((listener) => listener(toast));
}

export function subscribeToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const toast = {
  success(message, options = {}) {
    emit({ type: 'success', message, ...options });
  },
  error(message, options = {}) {
    emit({ type: 'error', message, ...options });
  },
  warning(message, options = {}) {
    emit({ type: 'warning', message, ...options });
  },
};
