import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppHeader from "./common/Header";
import AppContent from "./common/Content";
import AppFooter from "./common/Footer";
import ScrollToTop from "./common/ScrollToTop";
import { getRouterBasename } from "./config";

const App: React.FC = () => {
  return (
    <Router basename={getRouterBasename()}>
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
};

const MainLayout: React.FC = () => {
  return (
    <>
      <AppHeader />
      <AppContent />
      <AppFooter />
    </>
  );
};

export default App;
