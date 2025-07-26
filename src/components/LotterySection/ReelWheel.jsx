import React, { useEffect, useRef } from 'react';
import './ReelWheel.scss';

const ReelWheel = ({ nameList, isDrawing, isSlowingDown, winnerName, finalWinner }) => {
  const reelRef = useRef(null);
  const reelItems = useRef([]);

  // 生成重複的名單項目
  useEffect(() => {
    if (nameList.length > 0) {
      const repeatedNames = [];
      // 確保有足夠的項目進行循環滾動
      const repeatCount = Math.max(30, Math.ceil(200 / nameList.length));
      for (let i = 0; i < repeatCount; i++) {
        repeatedNames.push(...nameList);
      }
      reelItems.current = repeatedNames;
    } else {
      reelItems.current = [];
    }
  }, [nameList]);

  // 處理停止位置
  useEffect(() => {
    if (isSlowingDown && winnerName && reelRef.current) {
      const reelElement = reelRef.current;
      
      // 計算項目高度和容器高度
      const itemHeight = window.innerWidth >= 768 ? 80 : 60;
      const containerHeight = window.innerWidth >= 768 ? 400 : 300;
      const visibleItems = Math.floor(containerHeight / itemHeight);
      const centerPosition = Math.floor(visibleItems / 2);
      
      // 找到中獎者在原始名單中的索引
      const originalIndex = nameList.findIndex(name => name === winnerName);
      
      // 在重複列表中找到一個合適的位置（選擇中間部分避免邊界問題）
      const startSearchIndex = Math.floor(reelItems.current.length / 3);
      const endSearchIndex = Math.floor(reelItems.current.length * 2 / 3);
      
      let targetIndex = -1;
      for (let i = startSearchIndex; i < endSearchIndex; i += nameList.length) {
        if (i + originalIndex < reelItems.current.length) {
          targetIndex = i + originalIndex;
          break;
        }
      }
      
      if (targetIndex !== -1) {
        // 計算停止位置，讓中獎者出現在中央
        const stopPosition = targetIndex - centerPosition;
        
        reelElement.style.setProperty('--winner-position', stopPosition);
        reelElement.style.setProperty('--item-height', `${itemHeight}px`);
        reelElement.classList.add('reel-stopping');
      }
    }
  }, [isSlowingDown, winnerName, nameList]);

  if (nameList.length === 0) {
    return (
      <div className="reel-static">
        <div className="reel-placeholder">請先新增名單</div>
      </div>
    );
  }

  if (finalWinner) {
    return (
      <div className="reel-static">
        <div className="reel-winner-display">
          <div className="reel-winner-title">停止位置</div>
          <div className="reel-winner-name">{finalWinner}</div>
          <div className="reel-winner-subtitle">等待開獎結果...</div>
        </div>
      </div>
    );
  }

  if (!isDrawing) {
    return (
      <div className="reel-static">
        <div className="reel-preview">
          <div className="reel-preview__title">參與名單</div>
          <div className="reel-preview__count">{nameList.length} 人</div>
          <div className="reel-preview__names">
            {nameList.slice(0, 3).map((name, index) => (
              <span key={index} className="reel-preview__name">
                {name}
              </span>
            ))}
            {nameList.length > 3 && (
              <span className="reel-preview__more">
                ...等 {nameList.length} 人
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reel-spinning">
      <div 
        ref={reelRef}
        className={`reel-items ${isSlowingDown ? 'reel-stopping' : ''}`}
      >
        {reelItems.current.map((name, index) => (
          <div key={`${name}-${index}`} className="reel-item">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelWheel;