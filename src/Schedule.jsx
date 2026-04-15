import React, { useState, useEffect } from 'react';
import './Schedule.css';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // --- 設定：GoogleスプレッドシートのURLと暗証番号 ---
  const SHEET_CSV_URL = 'https://script.google.com/macros/s/AKfycbyXHUpbLBRqjv_ubyOt_Jh-I7_J4Wg-0Z38ciBvfvXwEA4DvZqyVCScGExbzLjo9AcyiA/exec'; // 閲覧用
  const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyXHUpbLBRqjv_ubyOt_Jh-I7_J4Wg-0Z38ciBvfvXwEA4DvZqyVCScGExbzLjo9AcyiA/exec'; // 書き込み用
  const MASTER_PASSWORD = 'gundam00-00'; // 管理用パスワード
  // ------------------------------------------------

  // データ読み込み用
  const fetchSchedule = async () => {
    if (!SHEET_CSV_URL || SHEET_CSV_URL === 'YOUR_SHEET_URL_HERE') return;
    
    setLoading(true);
    try {
      const response = await fetch(`${SHEET_CSV_URL}?t=${new Date().getTime()}`);
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1);
      
      const newDict = {};
      rows.forEach(row => {
        const columns = row.split(',');
        const date = columns[0]?.trim();
        const day = columns[1]?.trim();
        const night = columns[2]?.trim();
        const note = columns[3]?.trim();

        if (date) {
          const formattedDate = date.replace(/\//g, '-');
          newDict[formattedDate] = { 
            day: parseInt(day) || 0, 
            night: parseInt(night) || 0, 
            note: note || '' 
          };
        }
      });
      setScheduleData(newDict);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [SHEET_CSV_URL]);

  // セルの値をトグルする (Admin用)
  const toggleStatus = (dateStr, type) => {
    if (!isAdmin) return;
    
    setScheduleData(prev => {
      const current = prev[dateStr] || { day: 0, night: 0, note: '' };
      // ステータス循環: 0 (空き) -> 1 (予約あり) -> 4 (休み) -> 0
      let nextVal = 0;
      if (current[type] === 0) nextVal = 1;
      else if (current[type] === 1) nextVal = 4;
      else if (current[type] === 4) nextVal = 0;
      
      return {
        ...prev,
        [dateStr]: {
          ...current,
          [type]: nextVal
        }
      };
    });
  };

  // 全データを保存する
  const handleSave = async () => {
    if (!GAS_API_URL || GAS_API_URL === 'YOUR_GAS_WEBAPP_URL_HERE') {
      alert('GAS_API_URL が設定されていません。');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: adminPassword,
          data: scheduleData
        })
      });
      alert('保存リクエストを送信しました。\n(反映まで数秒〜数十秒かかる場合があります)');
      fetchSchedule();
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  // 管理者ログイン/ログアウト
  const handleAdminAuth = () => {
    if (isAdmin) {
      if (window.confirm('ログアウトしますか？')) {
        setIsAdmin(false);
        setAdminPassword('');
      }
      return;
    }
    setShowLoginModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === MASTER_PASSWORD) {
      setAdminPassword(passwordInput);
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      alert('編集モードに切り替わりました。');
    } else {
      alert('パスワードが違います。');
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDisplay = month + 1;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const status = scheduleData[dateStr] || { day: 0, night: 0, note: '' };
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      cells.push(
        <div key={d} className={`calendar-cell ${isToday ? 'today' : ''} ${isAdmin ? 'admin-editable' : ''}`}>
          <span className="date-num">{d}</span>
          <div className="status-indicators">
            <div 
              className={`indicator day ${status.day === 1 ? 'active' : ''} ${status.day === 4 ? 'is-off' : ''}`} 
              onClick={() => isAdmin && toggleStatus(dateStr, 'day')}
              title={status.day === 4 ? "休業" : "昼 (14:00-18:00)"}
            >
              <span>{status.day === 4 ? '休' : '昼'}</span>
            </div>
            <div 
              className={`indicator night ${status.night === 1 ? 'active' : ''} ${status.night === 4 ? 'is-off' : ''}`} 
              onClick={() => isAdmin && toggleStatus(dateStr, 'night')}
              title={status.night === 4 ? "休業" : "夜 (22:00-02:00)"}
            >
              <span>{status.night === 4 ? '休' : '夜'}</span>
            </div>
          </div>
          {status.note && <div className="cell-note">{status.note}</div>}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={`schedule-container fade-in ${isAdmin ? 'admin-mode' : ''}`}>
      {showLoginModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>管理者ログイン</h3>
            <form onSubmit={handleModalSubmit}>
              <input 
                type="password" 
                placeholder="パスワードを入力"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button type="submit" className="login-submit">ログイン</button>
                <button type="button" className="login-cancel" onClick={() => setShowLoginModal(false)}>キャンセル</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>スケジュール</h2>
        {isAdmin && (
          <button 
            className="save-button" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '変更を保存する'}
          </button>
        )}
      </div>
      
      <div className="schedule-intro">
        レッスンの空き状況です。<br />
        <span className="accent-text">昼：14:00〜18:00</span> / <span className="accent-text">夜：22:00〜02:00</span>
        {isAdmin && <div className="admin-badge">【編集モード】アイコンをクリックして切り替え</div>}
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <button onClick={prevMonth} className="month-nav">◀</button>
          <h3 className="current-month" style={{ userSelect: 'none' }}>
            {year}年 {monthDisplay}月
          </h3>
          <button onClick={nextMonth} className="month-nav">▶</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--accent)' }}>読み込み中...</div>
        ) : (
          <div className="calendar-grid">
            <div className="weekday">日</div>
            <div className="weekday">月</div>
            <div className="weekday">火</div>
            <div className="weekday">水</div>
            <div className="weekday">木</div>
            <div className="weekday">金</div>
            <div className="weekday">土</div>
            {renderCells()}
          </div>
        )}

        <div className="calendar-legend">
          <div className="legend-item"><span className="dot active-day"></span> 予約あり(昼)</div>
          <div className="legend-item"><span className="dot active-night"></span> 予約あり(夜)</div>
          <div className="legend-item"><span className="dot empty-dot"></span> 空き</div>
          <div className="legend-item"><span className="dot off-dot"></span> 休業</div>
        </div>
      </div>

      <div className="schedule-footer">
        <p>※リアルタイム更新ではありません。正式な空き状況はメールフォームよりお問い合わせください。</p>
        <button 
          className="admin-login-link" 
          onClick={handleAdminAuth}
          style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', opacity: 0.5 }}
        >
          {isAdmin ? '管理者ログアウト' : '管理者ログイン'}
        </button>
      </div>
    </div>
  );
};

export default Schedule;
