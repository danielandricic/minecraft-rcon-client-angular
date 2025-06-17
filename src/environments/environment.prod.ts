export const environment = {
  production: true,
  apiUrl: (window as any)?.env?.API_URL || 'http://andricic.at:5000/api'
};
