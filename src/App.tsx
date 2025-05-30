import React, { useState } from 'react';
import AppContainer from './components/AppContainer';
import TimerView from './views/TimerView';
import { TimerAppProvider } from './contexts/TimerAppContext';

const App: React.FC = () => {
  return (
    <TimerAppProvider>
      <AppContainer>
        <TimerView />
      </AppContainer>
    </TimerAppProvider>
  );
};

export default App;