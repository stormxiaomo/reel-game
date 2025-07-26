import React, { useEffect, useRef, useState } from 'react';
import './InfiniteReel.scss';

const InfiniteReel = ({ nameList, isDrawing, isSlowingDown, winnerName, onAnimationComplete }) => {
  const containerRef = useRef(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [animationId, setAnimationId] = useState(null);

  // 項目高度（響應式）
  const getItemHeight = () => window.innerWidth >= 768 ? 80 : 60;
  
  // 容器高度（響應式）
  const getContainerHeight = () => window.innerWidth >= 768 ? 400 : 300;

  // 開始無限滾動動畫
  useEffect(() => {
    if (isDrawing && !isSlowingDown && nameList.length > 0) {
      const itemHeight = getItemHeight();
      const speed = 2; // 每幀移動的像素數
      
      const animate = () => {
        setCurrentOffset(prev => {
          const newOffset = prev + speed;
          // 當滾動超過一個完整循環時重置
          const cycleLength = nameList.length * itemHeight;
          return newOffset >= cycleLength ? 0 : newOffset;
        });
        
        const id = requestAnimationFrame(animate);
        setAnimationId(id);
        return id;
      };
      
      const id = animate();
      setAnimationId(id);
      
      return () => {
        if (id) cancelAnimationFrame(id);
      };
    } else if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
  }, [isDrawing, isSlowingDown, nameList.length]);

  // 處理減速停止
  useEffect(() => {
    if (isSlowingDown && winnerName && nameList.length > 0) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }

      const itemHeight = getItemHeight();
      const containerHeight = getContainerHeight();
      const visibleItems = Math.floor(containerHeight / itemHeight);
      const centerPosition = Math.floor(visibleItems / 2);
      
      // 找到中獎者在名單中的位置
      const winnerIndex = nameList.findIndex(name => name === winnerName);
      
      // 計算目標停止位置
      const targetOffset = (winnerIndex - centerPosition) * itemHeight;
      
      // 平滑動畫到目標位置
      const startOffset = currentOffset;
      const duration = 2000; // 2秒
      const startTime = Date.now();
      
      const smoothStop = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用 ease-out 曲線
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newOffset = startOffset + (targetOffset - startOffset) * easeOut;
        
        setCurrentOffset(newOffset);
        
        if (progress < 1) {
          requestAnimationFrame(smoothStop);
        } else {
          // 動畫完成
          setTimeout(() => {
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }, 500);
        }
      };
      
      smoothStop();
    }
  }, [isSlowingDown, winnerName, nameList, currentOffset, onAnimationComplete]);

  if (nameList.length === 0) {
    return <div className="infinite-reel__empty">請先新增名單</div>;
  }

  return (
    <div className="infinite-reel" ref={containerRef}>
      <div 
        className="infinite-reel__content"
        style={{
          transform: `translateY(-${currentOffset}px)`
        }}
      >
        {/* 渲染多個循環以確保無縫滾動 */}
        {Array.from({ length: 3 }, (_, cycleIndex) => (
          <div key={cycleIndex} className="infinite-reel__cycle">
            {nameList.map((name, index) => (
              <div 
                key={`${cycleIndex}-${index}`} 
                className={`infinite-reel__item ${
                  name === winnerName && !isDrawing ? 'infinite-reel__item--winner' : ''
                }`}
                style={{
                  height: `${getItemHeight()}px`
                }}
              >
                {name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteReel;