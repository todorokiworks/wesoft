import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import News from "../page/News";
import Recruit from "../page/Recruit";
import ScientificCareer from "../page/ScientificCareer";
import Development from "../page/Development";
import Business from "../page/Business";
import Company from "../page/Company";
import Inquiry from "../page/Inquiry";

const AppContent: React.FC = () => {
  return (
    <div>
      <div className="site-layout-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/business" element={<Business />} />
          <Route path="/development" element={<Development />} />
          <Route path="/scientific_career" element={<ScientificCareer />} />
          <Route path="/recruit" element={<Recruit />} />
          <Route path="/news" element={<News />} />
          <Route path="/inquiry" element={<Inquiry />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;
