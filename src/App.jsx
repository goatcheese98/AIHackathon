import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/ConfirmDialog';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AltHome } from './pages/AltHome';
import { AltHome2 } from './pages/AltHome2';
import { AltHome3 } from './pages/AltHome3';
import { AltHome4 } from './pages/AltHome4';
import { AltHome5 } from './pages/AltHome5';
import { Library } from './pages/Library';
import { Templates } from './pages/Templates';
import { Editor } from './pages/Editor';
import { Arena } from './pages/Arena';
import { Settings } from './pages/Settings';
import { History } from './pages/History';

function EditorRoute() {
  const { id } = useParams();
  return <Editor key={id || 'new'} />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/alt1" element={<AltHome />} />
                  <Route path="/alt2" element={<AltHome2 />} />
                  <Route path="/alt3" element={<AltHome3 />} />
                  <Route path="/alt4" element={<AltHome4 />} />
                  <Route path="/alt5" element={<AltHome5 />} />
                  <Route path="/app" element={<Library />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/new" element={<EditorRoute />} />
                  <Route path="/edit/:id" element={<EditorRoute />} />
                  <Route path="/arena" element={<Arena />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
