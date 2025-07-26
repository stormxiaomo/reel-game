import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Header from './components/Header/Header';
import NameList from './components/NameList/NameList';
import LotterySection from './components/LotterySection/LotterySection';
import SeedCodeSection from './components/SeedCodeSection/SeedCodeSection';
import './styles/base.scss';
import './styles/components.scss';

function App() {
  const [nameList, setNameList] = useState([]);
  const [seedChanged, setSeedChanged] = useState(false);
  const [seedData, setSeedData] = useState(null);
  const [isLotteryInProgress, setIsLotteryInProgress] = useState(false);

  const handleNameListChange = () => {
    setSeedChanged(true);
  };

  const handleSeedGenerated = (newSeedData) => {
    setSeedData(newSeedData);
  };

  const handleStartLottery = (action) => {
    if (action === 'reveal') {
      // 自動揭曉結果
      setIsLotteryInProgress(false);
      const seedCodeSection = document.querySelector('.seedcode-section');
      if (seedCodeSection) {
        const event = new CustomEvent('revealWinner');
        seedCodeSection.dispatchEvent(event);
      }
    } else {
      setIsLotteryInProgress(true);
      console.log('抽獎開始！');
    }
  };

  return (
    <MainLayout>
      <Header />
      
      <SeedCodeSection 
        nameList={nameList}
        seedChanged={seedChanged}
        setSeedChanged={setSeedChanged}
        onSeedGenerated={handleSeedGenerated}
        seedData={seedData}
        isLotteryInProgress={isLotteryInProgress}
      />
      
      <LotterySection 
        nameList={nameList}
        seedChanged={seedChanged}
        seedData={seedData}
        onStartLottery={handleStartLottery}
      />
      
      <NameList 
        nameList={nameList}
        setNameList={setNameList}
        onNameListChange={handleNameListChange}
        isLotteryInProgress={isLotteryInProgress}
      />
    </MainLayout>
  );
}

export default App;