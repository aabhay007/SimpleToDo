import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient';
import Tasks from './Tasks';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import './App.css';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider theme={defaultTheme} colorScheme="light">
        <div className="app-container">
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">
                <span className="app-icon">✓</span>
                SimpleToDo
              </h1>
              <p className="app-subtitle">Stay organized and get things done</p>
            </div>
          </header>
          <main className="app-main">
            <Tasks />
          </main>
        </div>
      </Provider>
    </ApolloProvider>
  );
}
