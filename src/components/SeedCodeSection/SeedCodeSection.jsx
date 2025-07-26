import React from 'react';
import SeedCode from '../SeedCode/SeedCode';
import './SeedCodeSection.scss';

const SeedCodeSection = ({ nameList, seedChanged, setSeedChanged, onSeedGenerated, seedData, isLotteryInProgress }) => {
  return (
    <div className="seedcode-section main-layout__seedcode">
      <div className="seedcode-section__content">
        <h2 className="seedcode-section__title">種子碼與開獎</h2>
        
        <SeedCode 
          nameList={nameList}
          onSeedGenerated={onSeedGenerated}
          seedChanged={seedChanged}
          setSeedChanged={setSeedChanged}
          isLotteryInProgress={isLotteryInProgress}
        />
      </div>
    </div>
  );
};

export default SeedCodeSection;