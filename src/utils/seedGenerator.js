import CryptoJS from 'crypto-js';

/**
 * 生成隨機8碼hex字串
 * @returns {string} 8位隨機hex字串
 */
export const generateRandomHex = () => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * 生成種子碼
 * @param {number} winnerNumber - 中獎者流水號 (1-based)
 * @param {number} nameListLength - 名單總長度
 * @returns {object} 包含原始碼和SHA256雜湊的物件
 */
export const generateSeedCode = (nameListLength) => {
  const randomHex = generateRandomHex();
  const timestamp = Date.now();
  // 隨機生成 1 到 nameListLength 的流水號
  const winnerNumber = Math.floor(Math.random() * nameListLength) + 1;
  const rawSeed = `${randomHex}_${winnerNumber}_${timestamp}`;
  const hashedSeed = CryptoJS.SHA256(rawSeed).toString();
  
  return {
    rawSeed,
    hashedSeed,
    randomHex,
    winnerNumber, // 1-based 流水號
    winnerIndex: winnerNumber - 1, // 0-based 陣列索引
    timestamp
  };
};

/**
 * 驗證種子碼
 * @param {string} rawSeed - 原始種子碼
 * @param {string} hashedSeed - SHA256雜湊值
 * @returns {boolean} 驗證結果
 */
export const verifySeedCode = (rawSeed, hashedSeed) => {
  const computedHash = CryptoJS.SHA256(rawSeed).toString();
  return computedHash === hashedSeed;
};

/**
 * 解析種子碼
 * @param {string} rawSeed - 原始種子碼
 * @returns {object} 解析後的種子碼資訊
 */
export const parseSeedCode = (rawSeed) => {
  const parts = rawSeed.split('_');
  if (parts.length !== 3) {
    throw new Error('Invalid seed code format');
  }
  
  return {
    randomHex: parts[0],
    winnerIndex: parseInt(parts[1], 10),
    timestamp: parseInt(parts[2], 10),
    date: new Date(parseInt(parts[2], 10))
  };
};

/**
 * 根據種子碼和名單長度計算中獎者
 * @param {string} seedCode - 種子碼
 * @param {number} nameListLength - 名單長度
 * @returns {number} 中獎者索引
 */
export const calculateWinner = (seedCode, nameListLength) => {
  if (nameListLength === 0) return -1;
  
  // 使用種子碼的hash值來計算中獎者
  const hash = CryptoJS.SHA256(seedCode).toString();
  
  // 取hash的前8位轉為數字
  const hashNumber = parseInt(hash.substring(0, 8), 16);
  
  // 使用模運算確保結果在名單範圍內
  return hashNumber % nameListLength;
};