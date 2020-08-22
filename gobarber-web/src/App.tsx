import React from 'react';

import GlobalStyle from './styles/global';
import AppPovider from './hooks';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <AppPovider>
        <Routes />
      </AppPovider>
      <GlobalStyle />
    </>
  );
};

export default App;
