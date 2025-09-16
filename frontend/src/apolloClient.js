import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Prefer explicit env var if provided; otherwise use localhost for dev and Render in prod
const apiUrl =
  import.meta.env?.VITE_API_URL?.trim() ||
  ((typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:8081/graphql'
    : 'https://simpletodo-backend.onrender.com/graphql');

export const client = new ApolloClient({
  link: new HttpLink({
    uri: apiUrl,
    fetchOptions: { mode: 'cors' },
  }),
  cache: new InMemoryCache(),
});
