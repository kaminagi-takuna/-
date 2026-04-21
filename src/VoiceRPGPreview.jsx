import React, { useState, useEffect } from 'react';
import './VoiceRPGPreview.css';

const VoiceRPGPreview = () => {
  const [hp, setHp] = useState(100);
  const [mp, setMp] = useState(50);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [gameState, setGameState] = useState('start');

  const fullMessage = gameState === 'start' 
    ? "喉鳴りのスライムが現れた！\n喉がイガイガして、本来の声が出せそうにない..."
    : gameState === 'damage'
    ? "無理やり咳払いをした！喉に 20 のダメージ！"
    : gameState === 'correct'
    ? "リップロールで喉を解した！スライムの動きが鈍くなった！"
    : "あなたの勝利です！喉の状態が回復しました。";

  // タイピング演出
  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    setMessage('');
    const timer = setInterval(() => {
      setMessage((prev) => prev + fullMessage.charAt(i));
      i++;
      if (i >= fullMessage.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleChoice = (type) => {
    if (isTyping) return;

    if (type === 'A') {
      setIsShaking(true);
      setHp(prev => Math.max(0, prev - 20));
      setGameState('damage');
      setTimeout(() => setIsShaking(false), 500);
    } else {
      setGameState('correct');
      setMp(prev => Math.min(100, prev + 10));
    }
  };

  return (
    <div className="rpg-test-container">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#d4af37', margin: '0 0 10px 0' }}>RPG Test UI Prototype</h2>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>※これは開発用のテスト画面です</p>
      </div>

      <div className={`rpg-screen-frame ${isShaking ? 'screen-shake' : ''}`} 
           style={{ backgroundImage: `url('/images/rpg/bg_training.png')` }}>
        
        {/* ステータスパネル */}
        <div className="rpg-status-panel">
          <div className="status-row">
            <div className="status-label">
              <span>HP (喉の耐久値)</span>
              <span>{hp} / 100</span>
            </div>
            <div className="gauge-bg">
              <div className="gauge-fill hp" style={{ width: `${hp}%` }}></div>
            </div>
          </div>
          <div className="status-row">
            <div className="status-label">
              <span>MP (呼気圧)</span>
              <span>{mp} / 100</span>
            </div>
            <div className="gauge-bg">
              <div className="gauge-fill mp" style={{ width: `${mp}%` }}></div>
            </div>
          </div>
        </div>

        {/* モンスターエリア */}
        <div className="rpg-monster-area">
          <img src="/images/rpg/monster_slime.png" alt="Monster" className="monster-sprite" />
        </div>

        {/* VTuberプレースホルダー */}
        <div className="vtuber-placeholder">
          配信者の立ち絵スペース<br />(OBS等で重ねる想定)
        </div>

        {/* メッセージ ＆ 選択肢エリア */}
        <div className="rpg-message-area">
          <p className="message-text">
            {message}
          </p>
          
          <div className="rpg-choices-grid">
            <button className="rpg-choice-btn" onClick={() => handleChoice('A')}>
              <span className="choice-index">A</span> 
              無理やり咳払いして声を出す
            </button>
            <button className="rpg-choice-btn" onClick={() => handleChoice('B')}>
              <span className="choice-index">B</span> 
              リップロールで声帯をほぐす
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => { setHp(100); setMp(50); setGameState('start'); }}
        style={{ marginTop: '30px', background: 'none', border: '1px solid #333', color: '#666', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }}
      >
        リセット
      </button>
    </div>
  );
};

export default VoiceRPGPreview;
