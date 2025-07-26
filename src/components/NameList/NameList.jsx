import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './NameList.scss';

const NameList = ({ nameList, setNameList, onNameListChange, isLotteryInProgress }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNames, setNewNames] = useState('');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  const handleAddNames = () => {
    if (!newNames.trim()) return;
    
    // Split by comma or newline and filter empty strings
    let names = newNames
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (names.length > 0) {
      let updatedList = [...nameList, ...names];
      let duplicateCount = 0;
      let addedCount = names.length;
      
      if (removeDuplicates) {
        const originalLength = updatedList.length;
        updatedList = [...new Set(updatedList)];
        duplicateCount = originalLength - updatedList.length;
        addedCount = updatedList.length - nameList.length;
      }
      
      setNameList(updatedList);
      onNameListChange && onNameListChange();
      setNewNames('');
      setShowAddModal(false);
      
      // 顯示添加結果
      if (duplicateCount > 0) {
        alert(`成功新增 ${addedCount} 個名單，已排除 ${duplicateCount} 個重複名稱`);
      } else if (addedCount > 0) {
        alert(`成功新增 ${addedCount} 個名單`);
      }
    }
  };

  const handleRemoveName = (index) => {
    const updatedList = nameList.filter((_, i) => i !== index);
    setNameList(updatedList);
    onNameListChange && onNameListChange();
  };

  const handleClearAll = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      setNameList([]);
      onNameListChange && onNameListChange();
    }
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset the input value to allow selecting the same file again
    event.target.value = '';

    // Import ExcelJS dynamically to reduce bundle size
    import('exceljs').then(({ Workbook }) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const workbook = new Workbook();
          await workbook.xlsx.load(e.target.result);
          
          const worksheet = workbook.getWorksheet(1); // Get first worksheet
          const names = [];
          
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 0) { // Skip header if needed
              const cellValue = row.getCell(1).value; // Get first column
              if (cellValue && typeof cellValue === 'string') {
                const name = cellValue.trim();
                if (name) names.push(name);
              }
            }
          });
          
          if (names.length > 0) {
            let updatedList = [...nameList, ...names];
            let duplicateCount = 0;
            let addedCount = names.length;
            
            if (removeDuplicates) {
              const originalLength = updatedList.length;
              updatedList = [...new Set(updatedList)];
              duplicateCount = originalLength - updatedList.length;
              addedCount = updatedList.length - nameList.length;
            }
            
            setNameList(updatedList);
            onNameListChange && onNameListChange();
            
            // 顯示匯入結果
            if (duplicateCount > 0) {
              alert(`成功匯入 ${addedCount} 個名單，已排除 ${duplicateCount} 個重複名稱`);
            } else {
              alert(`成功匯入 ${addedCount} 個名單`);
            }
          } else {
            alert('Excel 檔案中沒有找到有效的名單');
          }
        } catch (error) {
          console.error('Excel import error:', error);
          alert('Excel 檔案讀取失敗，請確認檔案格式正確');
        }
      };
      reader.readAsArrayBuffer(file);
    }).catch(error => {
      console.error('ExcelJS import error:', error);
      alert('Excel 功能載入失敗');
    });
  };

  return (
    <div className="namelist main-layout__namelist">
      <div className="namelist__header">
        <h2 className="namelist__title">待抽獎名單</h2>
        <div className="namelist__actions">
          <button 
            className="btn btn--primary btn--small"
            onClick={() => setShowAddModal(true)}
            disabled={isLotteryInProgress}
          >
            新增
          </button>
          <label className={`btn btn--secondary btn--small ${isLotteryInProgress ? 'btn--disabled' : ''}`}>
            匯入
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              style={{ display: 'none' }}
              disabled={isLotteryInProgress}
            />
          </label>
          <button 
            className="btn btn--secondary btn--small"
            onClick={handleClearAll}
            disabled={nameList.length === 0 || isLotteryInProgress}
          >
            一鍵清除
          </button>
        </div>
        
        <div className="namelist__settings">
          <label className="namelist__checkbox">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              disabled={isLotteryInProgress}
            />
            <span className="namelist__checkbox-text">自動排除重複名稱</span>
          </label>
        </div>
      </div>

      <div className="namelist__content">
        {nameList.length === 0 ? (
          <div className="namelist__empty">
            <p>尚無名單，請新增或匯入名單</p>
          </div>
        ) : (
          <ul className="list namelist__list">
            {nameList.map((name, index) => (
              <li key={`${name}-${index}`} className="list__item">
                <div className="list__content">
                  <span className="list__number">{index + 1}</span>
                  <span className="list__name">{name}</span>
                </div>
                <div className="list__actions">
                  <button 
                    className="list__remove"
                    onClick={() => handleRemoveName(index)}
                    disabled={isLotteryInProgress}
                  >
                    移除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={showAddModal && !isLotteryInProgress}
        onClose={() => setShowAddModal(false)}
        title="新增名單"
      >
        <div className="form__group">
          <label className="form__label">
            輸入名單 (可使用逗號或換行分隔多個名單)
          </label>
          <textarea
            className="form__textarea"
            value={newNames}
            onChange={(e) => setNewNames(e.target.value)}
            placeholder="請輸入名單，例如：&#10;張三&#10;李四&#10;或者：張三,李四"
            rows={6}
            disabled={isLotteryInProgress}
          />
          <div className="form__help">
            <span className="form__help-text">提示：可以使用逗號(,)或換行符號來一次新增多筆名單</span>
            {removeDuplicates && (
              <>
                <br />
                <span className="form__help-enabled">✅ 已啟用自動排除重複名稱</span>
              </>
            )}
          </div>
        </div>
        <div className="modal__footer">
          <button 
            className="btn btn--secondary"
            onClick={() => setShowAddModal(false)}
          >
            取消
          </button>
          <button 
            className="btn btn--primary"
            onClick={handleAddNames}
            disabled={!newNames.trim() || isLotteryInProgress}
          >
            確認新增
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NameList;