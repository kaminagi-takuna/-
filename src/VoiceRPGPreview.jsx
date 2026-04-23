import React, { useState, useEffect } from 'react';
import './VoiceRPGPreview.css';
import questionData from './data/questions.json';

const VoiceRPGPreview = () => {
  // ゲーム基本ステータス
  const [hp, setHp] = useState(100);
  const [gameState, setGameState] = useState('opening'); // opening, battle, bossTransition, bossBattle, victory, gameover
  
  // 進行管理
  const [beginnerCorrectCount, setBeginnerCorrectCount] = useState(0);
  const [bossHp, setBossHp] = useState(4);
  const [usedIndices, setUsedIndices] = useState({ beginner: [], boss: [] });
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false); // 画面赤フラッシュ用
  const [monsterEffect, setMonsterEffect] = useState(''); // モンスター被弾用
  const [feedback, setFeedback] = useState(null);

  // --- SE (Web Audio API) ---
  const playSound = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        oscillator.start();
        oscillator.stop(now + 0.1);
      } else if (type === 'slash') {
        // 攻撃音
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start();
        oscillator.stop(now + 0.2);
      } else if (type === 'impact') {
        // ダメージ音 (ノイズ風)
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.linearRampToValueAtTime(40, now + 0.4);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        oscillator.start();
        oscillator.stop(now + 0.4);
      }
    } catch (e) { console.error("Audio error", e); }
  };

  // タイピング演出
  const typeMessage = (text) => {
    if (!text) return;
    setIsTyping(true);
    let currentText = "";
    let i = 0;
    setMessage("");
    const timer = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessage(currentText);
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 25);
  };

  // ゲーム開始
  const startGame = () => {
    playSound('click');
    setHp(100);
    setBeginnerCorrectCount(0);
    setBossHp(4);
    setUsedIndices({ beginner: [], boss: [] });
    setGameState('battle');
    nextQuestion(true, 0, 4, { beginner: [], boss: [] });
  };

  // 次の問題抽出
  const getUnusedQuestion = (type, currentUsed) => {
    const pool = questionData[type];
    const availableIndices = pool.map((_, i) => i).filter(i => !currentUsed[type].includes(i));
    if (availableIndices.length === 0) return { q: pool[0], index: 0 };
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { q: pool[randomIndex], index: randomIndex };
  };

  const nextQuestion = (isFirst = false, overrideCount, overrideBossHp, overrideUsed) => {
    setFeedback(null);
    setMonsterEffect('');
    const count = overrideCount !== undefined ? overrideCount : beginnerCorrectCount;
    const bHp = overrideBossHp !== undefined ? overrideBossHp : bossHp;
    const used = overrideUsed !== undefined ? overrideUsed : usedIndices;

    if (count < 8) {
      const { q, index } = getUnusedQuestion('beginner', used);
      const options = generateOptions(q);
      setCurrentQuestion({ ...q, options, index });
      typeMessage(`${isFirst ? "ボイス・トレーニング・クエスト開始！ " : ""}${q.question}`);
    } else if (gameState !== 'bossBattle' && gameState !== 'victory' && gameState !== 'bossTransition') {
      setGameState('bossTransition');
      typeMessage("エリアの最深部に到達。喉の支配者が現れた！");
    } else if (bHp > 0) {
      const { q, index } = getUnusedQuestion('boss', used);
      const options = generateOptions(q);
      setCurrentQuestion({ ...q, options, index });
      if (bHp === 1) typeMessage(`【!! 弱点露呈 !!】 ${q.question}`);
      else typeMessage(q.question);
    }
  };

  const generateOptions = (q) => {
    const pool = ["ビブラート", "閉鎖", "共鳴腔", "軟口蓋", "腹式呼吸", "地声", "裏声", "滑舌", "呼気圧", "倍音", "アンザッツ", "喉頭蓋"];
    let options = [q.answer];
    while (options.length < 4) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (!options.includes(r)) options.push(r);
    }
    return options.sort(() => 0.5 - Math.random());
  };

  const handleAnswer = (selected) => {
    if (isTyping || feedback) return;
    playSound('click');

    const isCorrect = selected === currentQuestion.answer;
    setFeedback({ isCorrect, explanation: currentQuestion.explanation });

    if (isCorrect) {
      // 攻撃演出
      playSound('slash');
      setMonsterEffect('monster-hit');
      
      if (gameState === 'bossBattle') {
        setBossHp(prev => prev - 1);
        setUsedIndices(prev => ({ ...prev, boss: [...prev.boss, currentQuestion.index] }));
        typeMessage("正解！魔王にダメージを与えた！");
      } else {
        setBeginnerCorrectCount(prev => prev + 1);
        setUsedIndices(prev => ({ ...prev, beginner: [...prev.beginner, currentQuestion.index] }));
        typeMessage("正解！喉のコンディションが整っていく。");
      }
    } else {
      // 被弾演出
      playSound('impact');
      setIsShaking(true);
      setIsFlashing(true);
      setHp(prev => Math.max(0, prev - 25));
      setTimeout(() => { setIsShaking(false); setIsFlashing(false); }, 400);

      if (gameState === 'bossBattle') {
        setBossHp(prev => Math.min(4, prev + 1));
        typeMessage("不正解！ボスの体力が回復し、弱点が隠れた！");
      } else {
        typeMessage("不正解！喉に負担がかかってしまった！");
      }
    }
  };

  useEffect(() => {
    if (gameState === 'bossBattle' && bossHp <= 0) {
      setGameState('victory');
      typeMessage("QUEST CLEAR! あなたは真の声を手に入れた！");
    }
  }, [bossHp, gameState]);

  useEffect(() => {
    if (hp <= 0) {
      setGameState('gameover');
      typeMessage("GAME OVER... 喉が枯れてしまった。休養が必要だ。");
    }
  }, [hp]);

  const startBossBattle = () => {
    playSound('click');
    setGameState('bossBattle');
    setBossHp(4);
    nextQuestion(false, 8, 4);
  };

  return (
    <div className="rpg-test-container">
      <div className={`rpg-screen-frame ${isShaking ? 'screen-shake' : ''} ${isFlashing ? 'flash-red' : ''}`} 
           style={{ backgroundImage: `url('/images/rpg/bg_training.png')`, filter: gameState.includes('boss') ? 'hue-rotate(180deg) brightness(0.6)' : 'none' }}>
        
        <div className="rpg-status-panel">
          <div className="status-row">
            <div className="status-label"><span>Vocal HP</span><span>{hp}%</span></div>
            <div className="gauge-bg"><div className="gauge-fill hp" style={{ width: `${hp}%` }}></div></div>
          </div>
          {gameState === 'battle' && (
            <div className="status-row">
              <div className="status-label"><span>Discovery</span></div>
              <div className="gauge-bg"><div className="gauge-fill mp" style={{ width: `${(beginnerCorrectCount / 8) * 100}%` }}></div></div>
            </div>
          )}
        </div>

        {gameState === 'bossBattle' && (
          <div className="boss-hp-container" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center', zIndex: 100 }}>
            <div style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1rem', textShadow: '0 0 10px #000', marginBottom: '5px' }}>BOSS HP</div>
            <div className="gauge-bg" style={{ height: '15px', border: '1px solid #ff4d4d' }}>
              <div className="gauge-fill" style={{ width: `${(bossHp / 4) * 100}%`, backgroundColor: '#ff4d4d' }}></div>
            </div>
          </div>
        )}

        <div className="rpg-monster-area">
          {gameState === 'battle' && <img src="/images/rpg/monster_slime_v2.png" alt="Monster" className={`monster-sprite ${monsterEffect}`} style={{ mixBlendMode: 'lighten' }} />}
          {gameState === 'bossBattle' && <img src="/images/rpg/monster_slime_v2.png" alt="Boss" className={`monster-sprite ${monsterEffect}`} style={{ transform: 'scale(2)', filter: 'hue-rotate(130deg) contrast(1.5) brightness(1.2)', mixBlendMode: 'lighten' }} />}
        </div>

        <div className="rpg-message-area">
          <div style={{ minHeight: '60px' }}><p className="message-text">{message}</p></div>
          <div className="rpg-choices-grid">
            {gameState === 'opening' && <button className="rpg-choice-btn" onClick={startGame}>クエストを開始する</button>}
            {(gameState === 'battle' || gameState === 'bossBattle') && currentQuestion && !feedback && (
              currentQuestion.options.map((opt, i) => (
                <button key={i} className="rpg-choice-btn" onClick={() => handleAnswer(opt)}><span className="choice-index">{String.fromCharCode(65 + i)}</span>{opt}</button>
              ))
            )}
            {feedback && (
              <div style={{ width: '100%' }}>
                <p style={{ color: feedback.isCorrect ? '#4dff88' : '#ff4d4d', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 5px 0' }}>{feedback.isCorrect ? '【SUCCESS】' : '【FAILURE】'} {currentQuestion.answer}</p>
                <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>{feedback.explanation}</p>
                <button className="rpg-choice-btn" style={{ marginTop: '10px' }} onClick={() => nextQuestion()}>次の戦いへ ➔</button>
              </div>
            )}
            {gameState === 'bossTransition' && <button className="rpg-choice-btn" onClick={startBossBattle}>魔王に挑む!!</button>}
            {(gameState === 'victory' || gameState === 'gameover') && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '2rem', color: gameState === 'victory' ? 'gold' : 'red' }}>{gameState === 'victory' ? 'CONGRATULATIONS!' : 'DEFEATED...'}</h3>
                <button className="rpg-choice-btn" onClick={() => setGameState('opening')}>タイトルへ戻る</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRPGPreview;
