/**
 * 名單處理工具函數
 */

/**
 * 檢查名單中是否有重複項目
 * @param {string[]} nameList - 名單陣列
 * @returns {object} 包含重複資訊的物件
 */
export const checkDuplicates = (nameList) => {
  const nameCount = {};
  const duplicates = [];
  
  nameList.forEach((name, index) => {
    if (nameCount[name]) {
      nameCount[name].push(index);
      if (nameCount[name].length === 2) {
        // 第一次發現重複時，將所有相同名稱的索引都加入
        duplicates.push({
          name,
          indices: nameCount[name]
        });
      } else {
        // 更新已存在的重複項目
        const existingDuplicate = duplicates.find(d => d.name === name);
        if (existingDuplicate) {
          existingDuplicate.indices = nameCount[name];
        }
      }
    } else {
      nameCount[name] = [index];
    }
  });
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    totalDuplicateCount: duplicates.reduce((sum, d) => sum + d.indices.length - 1, 0)
  };
};

/**
 * 移除名單中的重複項目
 * @param {string[]} nameList - 名單陣列
 * @returns {object} 包含處理結果的物件
 */
export const removeDuplicateNames = (nameList) => {
  const originalLength = nameList.length;
  const uniqueNames = [...new Set(nameList)];
  const duplicateCount = originalLength - uniqueNames.length;
  
  return {
    uniqueNames,
    duplicateCount,
    originalLength,
    removedCount: duplicateCount
  };
};

/**
 * 驗證名稱格式
 * @param {string} name - 名稱
 * @returns {object} 驗證結果
 */
export const validateName = (name) => {
  const trimmedName = name.trim();
  
  return {
    isValid: trimmedName.length > 0 && trimmedName.length <= 50,
    trimmedName,
    errors: [
      ...(trimmedName.length === 0 ? ['名稱不能為空'] : []),
      ...(trimmedName.length > 50 ? ['名稱長度不能超過50個字元'] : [])
    ]
  };
};

/**
 * 批量處理名稱輸入
 * @param {string} input - 輸入字串
 * @param {boolean} removeDuplicates - 是否移除重複
 * @returns {object} 處理結果
 */
export const processNameInput = (input, removeDuplicates = true) => {
  // 分割並清理名稱
  let names = input
    .split(/[,\n]/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
  
  // 驗證每個名稱
  const validationResults = names.map(validateName);
  const validNames = validationResults
    .filter(result => result.isValid)
    .map(result => result.trimmedName);
  
  const invalidNames = validationResults
    .filter(result => !result.isValid)
    .map((result, index) => ({
      name: names[index],
      errors: result.errors
    }));
  
  // 移除重複項目（如果啟用）
  let finalNames = validNames;
  let duplicateInfo = { duplicateCount: 0 };
  
  if (removeDuplicates && validNames.length > 0) {
    duplicateInfo = removeDuplicateNames(validNames);
    finalNames = duplicateInfo.uniqueNames;
  }
  
  return {
    originalCount: names.length,
    validCount: validNames.length,
    finalCount: finalNames.length,
    invalidCount: invalidNames.length,
    duplicateCount: duplicateInfo.duplicateCount || 0,
    finalNames,
    invalidNames,
    hasErrors: invalidNames.length > 0
  };
};