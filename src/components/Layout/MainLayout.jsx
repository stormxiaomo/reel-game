import React from 'react';
import './MainLayout.scss';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="main-layout__container">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;