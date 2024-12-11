import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ThemeProvider } from './theme/theme';

import MainPage from './pages/MainPage';
function App() {
  return (

    <ThemeProvider>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>


    </ThemeProvider>
    
  );
}

export default App;
