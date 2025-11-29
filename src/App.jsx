import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Editor } from './pages/Editor';
import { Arena } from './pages/Arena';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<Library />} />
            <Route path="/new" element={<Editor />} />
            <Route path="/edit/:id" element={<Editor />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
