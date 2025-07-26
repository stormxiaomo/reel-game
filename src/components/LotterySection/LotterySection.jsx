import React, { useState, useEffect } from 'react';
import './LotterySection.scss';

const LotterySection = ({ nameList, seedChanged, seedData, onStartLottery }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [reelItems, setReelItems] = useState([]);
  const [isSlowingDown, setIsSlowingDown] = useState(false);
  const [finalWinner, setFinalWinner] = useState(null);

  // 同步名單到 reel 軸 - 簡化處理，因為現在直接在 JSX 中生成循環
  useEffect(() => {
    // 不需要預先生成 reelItems，直接在 JSX 中循環 nameList
  }, [nameList]);

  const handleStartLottery = () => {
    if (nameList.length === 0) {
      alert('請先新增名單');
      return;
    }

    if (!seedData || seedChanged) {
      alert('請先生成種子碼');
      return;
    }

    // 重置狀態
    setIsDrawing(true);
    setIsSlowingDown(false);
    setFinalWinner(null);
    
    // 通知父組件開始抽獎
    if (onStartLottery) {
      onStartLottery();
    }
    
    // 計算中獎者
    const winnerIndex = seedData.winnerIndex;
    const winnerName = nameList[winnerIndex];
    
    // 8秒快速旋轉後開始減速
    setTimeout(() => {
      setIsSlowingDown(true);
      
      // 設置 CSS 變數來控制停止位置
      const reelContainer = document.querySelector('.reel-container-inner');
      if (reelContainer) {
        // 計算停止位置：讓中獎者出現在視窗中央
        const itemHeight = window.innerWidth >= 768 ? 80 : 60;
        const containerHeight = window.innerWidth >= 768 ? 400 : 300;
        const centerOffset = Math.floor(containerHeight / 2 / itemHeight);
        
        // 找到中獎者在原始名單中的位置
        const originalIndex = nameList.findIndex(name => name === winnerName);
        
        // 計算停止位置：在中間的循環中找到目標
        const middleCycle = 25; // 選擇中間的循環
        const targetIndex = middleCycle * nameList.length + originalIndex;
        const stopPosition = targetIndex - centerOffset;
        
        reelContainer.style.setProperty('--winner-position', stopPosition);
        reelContainer.style.setProperty('--item-height', `${itemHeight}px`);
        reelContainer.classList.add('reel-stopping');
      }
      
      // 2秒減速動畫後完全停止
      setTimeout(() => {
        setIsDrawing(false);
        setFinalWinner(winnerName);
        
        // 等待DOM更新後滾動到中獎者位置
        setTimeout(() => {
          const winnerElement = document.getElementById('winner-item');
          const container = document.getElementById('final-reel-state');
          if (winnerElement && container) {
            const containerHeight = container.offsetHeight;
            const winnerTop = winnerElement.offsetTop;
            const winnerHeight = winnerElement.offsetHeight;
            const scrollTop = winnerTop - (containerHeight / 2) + (winnerHeight / 2);
            
            container.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          }
          
          // 再延遲1秒自動顯示結果
          setTimeout(() => {
            if (onStartLottery) {
              onStartLottery('reveal');
            }
          }, 1000);
        }, 100);
      }, 2000);
    }, 8000);
  };

  return (
    <div className="lottery-section main-layout__lottery">
      <div className="lottery-section__content">
        <h2 className="lottery-section__title">抽獎輪盤</h2>
        
        {/* Reel 軸區域 */}
        <div className="lottery-section__reel">
          <div className="reel-container">
            <div className="reel-frame">
              <div className="reel-window">
                {isDrawing ? (
                  <div className="reel-spinning">
                    <div 
                      className={`reel-container-inner ${isSlowingDown ? 'reel-stopping' : ''}`}
                      data-winner-index={seedData?.winnerIndex}
                      style={{
                        '--name-count': nameList.length
                      }}
                    >
                      {/* 創建足夠多的循環確保所有名字都能顯示 */}
                      {Array.from({ length: 50 }, (_, cycleIndex) => (
                        <div key={cycleIndex} className="reel-cycle">
                          {nameList.map((name, index) => (
                            <div key={`${cycleIndex}-${index}`} className="reel-item">
                              {name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : finalWinner ? (
                  <div className="reel-static">
                    <div className="reel-final-state" id="final-reel-state">
                      {/* 前置循環 */}
                      <div className="reel-cycle-final">
                        {nameList.map((name, index) => (
                          <div key={`final-pre-${index}`} className="reel-final-item">
                            {name}
                          </div>
                        ))}
                      </div>
                      
                      {/* 主要顯示區域 */}
                      <div className="reel-main-final">
                        {nameList.map((name, index) => (
                          <div 
                            key={`final-main-${index}`}
                            className={`reel-final-item ${name === finalWinner ? 'reel-final-item--winner' : ''}`}
                            id={name === finalWinner ? 'winner-item' : ''}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                      
                      {/* 後置循環 */}
                      <div className="reel-cycle-final">
                        {nameList.map((name, index) => (
                          <div key={`final-post-${index}`} className="reel-final-item">
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="reel-static">
                    <div className="reel-preview-container">
                      {nameList.length > 0 ? (
                        <div className="reel-preview-list">
                          <div className="reel-preview__header">
                            <div className="reel-preview__title">參與名單</div>
                            <div className="reel-preview__count">{nameList.length} 人</div>
                          </div>
                          <div className="reel-preview__all-names">
                            {nameList.map((name, index) => (
                              <div key={index} className="reel-preview__name-item">
                                <span className="reel-preview__number">{index + 1}</span>
                                <span className="reel-preview__name">{name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="reel-preview__empty">請先新增名單</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="lottery-section__controls">
          <button 
            className={`btn btn--primary btn--large ${isDrawing ? 'btn--drawing' : ''}`}
            onClick={handleStartLottery}
            disabled={isDrawing || nameList.length === 0 || !seedData || seedChanged}
          >
            {isDrawing ? '抽獎中...' : '開始抽獎'}
          </button>
          
          {isDrawing && (
            <div className="lottery-section__progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p>抽獎進行中，請稍候...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotterySection;