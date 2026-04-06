import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import News from "../page/News";
import Recruit from "../page/Recruit";
import ScientificCareer from "../page/ScientificCareer";
import Development from "../page/Development";
import Business from "../page/Business";
import Service from "../page/Service";
import Company from "../page/Company";
import Inquiry from "../page/Inquiry";
import Faq from "../page/Faq";
import ColumnLayout, {
  ColumnArticlePage,
  ColumnCategoriesPage,
  ColumnListPage,
} from "../page/Column";

const AppContent: React.FC = () => {
  return (
    <div>
      <div className="site-layout-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/business" element={<Business />} />
          <Route path="/service" element={<Service />} />
          <Route path="/development" element={<Development />} />
          <Route path="/scientific_career" element={<ScientificCareer />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/news" element={<News />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/column" element={<ColumnLayout />}>
            <Route index element={<ColumnListPage />} />
            <Route path="categories" element={<ColumnCategoriesPage />} />
            <Route path=":articleId" element={<ColumnArticlePage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;
