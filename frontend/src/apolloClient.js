import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apiUrl = 'http://localhost:8081/graphql';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: apiUrl,
    fetchOptions: { mode: 'cors' },
  }),
  cache: new InMemoryCache(),
});
