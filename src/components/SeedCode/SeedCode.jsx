import React, { useState } from 'react';
import { generateSeedCode, parseSeedCode } from '../../utils/seedGenerator';
import './SeedCode.scss';

const SeedCode = ({ nameList, onSeedGenerated, seedChanged, setSeedChanged, isLotteryInProgress }) => {
  const [seedData, setSeedData] = useState(null);
  const [showRawSeed, setShowRawSeed] = useState(false);
  const [winnerResult, setWinnerResult] = useState('');

  const handleGenerateSeed = () => {
    if (nameList.length === 0) {
      alert('請先新增名單再生成種子碼');
      return;
    }

    // 生成種子碼，傳入名單長度
    const newSeedData = generateSeedCode(nameList.length);
    
    setSeedData(newSeedData);
    setShowRawSeed(false);
    setWinnerResult('');
    setSeedChanged(false);
    
    if (onSeedGenerated) {
      onSeedGenerated(newSeedData);
    }
  };


  // 監聽自動揭曉結果事件
  React.useEffect(() => {
    const handleRevealWinner = () => {
      // 直接揭曉結果
      if (seedData && nameList.length > 0) {
        setShowRawSeed(true);
        const winner = nameList[seedData.winnerIndex];
        setWinnerResult(winner || '未知');
      }
    };

    // 監聽自動揭曉結果事件
    const seedCodeSection = document.querySelector('.seedcode-section');
    if (seedCodeSection) {
      seedCodeSection.addEventListener('revealWinner', handleRevealWinner);
    }

    return () => {
      if (seedCodeSection) {
        seedCodeSection.removeEventListener('revealWinner', handleRevealWinner);
      }
    };
  }, [seedData, nameList]);

  const copyWinnerResult = () => {
    if (winnerResult) {
      const textToCopy = `中獎者: ${winnerResult} (第 ${seedData?.winnerNumber} 號)`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('中獎結果已複製到剪貼簿！');
      }).catch(() => {
        // 備用方案：使用舊的複製方法
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('中獎結果已複製到剪貼簿！');
      });
    }
  };

  const copyRawSeed = (rawSeed) => {
    if (rawSeed) {
      navigator.clipboard.writeText(rawSeed).then(() => {
        alert('兌獎碼已複製到剪貼簿！');
      }).catch(() => {
        // 備用方案：使用舊的複製方法
        const textArea = document.createElement('textarea');
        textArea.value = rawSeed;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('兌獎碼已複製到剪貼簿！');
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const highlightWinnerIndex = (rawSeed, winnerIndex) => {
    const parts = rawSeed.split('_');
    if (parts.length !== 3) return rawSeed;
    
    return (
      <span>
        {parts[0]}_
        <span className="seedcode__highlight">{parts[1]}</span>
        _{parts[2]}
      </span>
    );
  };

  return (
    <div className="seedcode">
      <div className="seedcode__section">
        <h3 className="seedcode__title">種子碼</h3>
        <div className="seedcode__display">
          {seedData ? (
            <div className="seedcode__content">
              <div className="seedcode__hash">
                <label className="seedcode__label">SHA-256:</label>
                <div className="seedcode__value seedcode__value--hash">
                  {seedData.hashedSeed}
                </div>
              </div>
              
              {showRawSeed && (
                <div className="seedcode__raw">
                  <label className="seedcode__label">兌獎碼:</label>
                  <div className="seedcode__value seedcode__value--raw">
                    {highlightWinnerIndex(seedData.rawSeed, seedData.winnerIndex)}
                    <button 
                      className="seedcode__copy-btn seedcode__copy-btn--inline"
                      onClick={() => copyRawSeed(seedData.rawSeed)}
                      title="複製兌獎碼"
                    >
                      📋
                    </button>
                  </div>
                  <div className="seedcode__breakdown">
                    <div className="seedcode__part">
                      <span className="seedcode__part-label">隨機碼:</span>
                      <span className="seedcode__part-value">{seedData.randomHex}</span>
                    </div>
                    <div className="seedcode__part">
                      <span className="seedcode__part-label">中獎流水號:</span>
                      <span className="seedcode__part-value seedcode__highlight">
                        {seedData.winnerNumber}
                      </span>
                    </div>
                    <div className="seedcode__part">
                      <span className="seedcode__part-label">時間戳:</span>
                      <span className="seedcode__part-value">
                        {formatTimestamp(seedData.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="seedcode__empty">
              <p>尚未生成種子碼</p>
            </div>
          )}
        </div>
      </div>

      <div className="seedcode__section">
        <h3 className="seedcode__title">開獎結果</h3>
        <div className="seedcode__result">
          {isLotteryInProgress ? (
            <div className="seedcode__lottery-progress">
              <div className="seedcode__progress-icon">🎰</div>
              <p>抽獎進行中...</p>
              <div className="seedcode__progress-text">請等待抽獎完成</div>
            </div>
          ) : winnerResult ? (
            <div className="seedcode__winner">
              <span className="seedcode__winner-label">中獎者:</span>
              <span className="seedcode__winner-name">{winnerResult}</span>
              <span className="seedcode__winner-number">
                (第 {seedData?.winnerNumber} 號)
              </span>
              <button 
                className="seedcode__copy-btn"
                onClick={copyWinnerResult}
                title="複製中獎結果"
              >
                📋 複製
              </button>
            </div>
          ) : (
            <div className="seedcode__no-result">
              <p>尚未開獎</p>
            </div>
          )}
        </div>
      </div>

      <div className="seedcode__actions">
        <button 
          className="btn btn--secondary"
          onClick={handleGenerateSeed}
          disabled={nameList.length === 0 || isLotteryInProgress}
        >
          {seedData ? '重新生成種子碼' : '生成種子碼'}
        </button>
        
        {seedChanged && seedData && (
          <div className="seedcode__warning">
            ⚠️ 名單已異動，請重新生成種子碼
          </div>
        )}
      </div>

    </div>
  );
};

export default SeedCode;