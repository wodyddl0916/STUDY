import React, { useState } from 'react';
import Home from "../components/Main/Home";
import ElectricStats from "../components/Main/전기통계";
import LeagueStats from "../components/Main/리그통계";
import MyPage from "../components/Main/MyPage";
import "../css/Main.css";

const Main = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('HOME');

  // 메뉴 클릭 시 해당 컴포넌트를 렌더링하는 함수
  const renderContent = () => {
    switch (activeMenu) {
      case 'HOME': return <Home />;
      case '전기통계': return <ElectricStats />;
      case '리그통계': return <LeagueStats />;
      case 'MY PAGE': return <MyPage />;
      default: return <Home />;
    }
  };

  return (
    <div className="main-layout">
      {/* --- GNB 네비게이션 --- */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveMenu('HOME')} style={{cursor: 'pointer'}}>
          <img src="favicon.svg" alt="logo" />
          <span>와트메이트</span>
        </div>
        
        <div className="nav-menu">
          {['HOME', '전기통계', '리그통계', 'MY PAGE'].map((menu) => (
            <div 
              key={menu}
              className={`menu-item ${activeMenu === menu ? 'active' : ''}`}
              onClick={() => setActiveMenu(menu)}
            >
              {menu}
            </div>
          ))}
        </div>

        <div className="nav-utils">
          <button className="logout-btn" onClick={() => onNavigate('login')}>LOGOUT</button>
        </div>
      </nav>

      {/* --- 컴포넌트 렌더링 영역 --- */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Main;