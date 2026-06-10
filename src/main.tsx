import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Cms from './Cms.tsx';
import { PortfolioProvider } from './DataContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cms" element={<Cms />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  </StrictMode>,
);
