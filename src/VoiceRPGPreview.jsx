import React, { useState, useEffect, useMemo } from 'react';
import './VoiceRPGPreview.css';
import questionData from './data/questions.json';

const VoiceRPGPreview = () => {
  // ゲーム基本ステータス
  const [hp, setHp] = useState(100);
  const [gameState, setGameState] = useState('opening'); // opening, battle, bossTransition, bossBattle, victory, gameover
  
  // 進行管理
  const [beginnerCorrectCount, setBeginnerCorrectCount] = useState(0);
  const [bossHp, setBossHp] = useState(4); // ボスの体力（4正解で勝利）
  const [usedIndices, setUsedIndices] = useState({ beginner: [], boss: [] });
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
    setHp(100);
    setBeginnerCorrectCount(0);
    setBossHp(4);
    setUsedIndices({ beginner: [], boss: [] });
    setGameState('battle');
    nextQuestion(true, 0, 4, { beginner: [], boss: [] });
  };

  // 次の問題を抽出（重複なし）
  const getUnusedQuestion = (type, currentUsed) => {
    const pool = questionData[type];
    const availableIndices = pool.map((_, i) => i).filter(i => !currentUsed[type].includes(i));
    if (availableIndices.length === 0) return pool[Math.floor(Math.random() * pool.length)]; // 万が一使い切ったらランダム
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { q: pool[randomIndex], index: randomIndex };
  };

  // 次の問題へ
  const nextQuestion = (isFirst = false, overrideCount, overrideBossHp, overrideUsed) => {
    setFeedback(null);
    const count = overrideCount !== undefined ? overrideCount : beginnerCorrectCount;
    const bHp = overrideBossHp !== undefined ? overrideBossHp : bossHp;
    const used = overrideUsed !== undefined ? overrideUsed : usedIndices;

    // 道中
    if (count < 8) {
      const { q, index } = getUnusedQuestion('beginner', used);
      const options = generateOptions(q);
      setCurrentQuestion({ ...q, options, index });
      typeMessage(`${isFirst ? "ボイス・トレーニング・クエスト開始！ " : ""}${q.question}`);
    } 
    // ボス戦移行
    else if (gameState !== 'bossBattle' && gameState !== 'victory') {
      setGameState('bossTransition');
      typeMessage("...エリアの最深部に到達した。空気が震えている。喉の支配者が現れた！");
    }
    // ボス戦中
    else if (bHp > 0) {
      const { q, index } = getUnusedQuestion('boss', used);
      const options = generateOptions(q);
      setCurrentQuestion({ ...q, options, index });
      
      // 特殊ギミック：ボスの弱点
      if (bHp === 1) {
        typeMessage(`【!! 弱点露呈 !!】ボスの弱点が見えたようだ！ ${q.question}`);
      } else {
        typeMessage(q.question);
      }
    }
  };

  // ダミー選択肢生成
  const generateOptions = (q) => {
    const dummyPool = ["ビブラート", "閉鎖", "共鳴腔", "軟口蓋", "腹式呼吸", "地声", "裏声", "滑舌", "呼気圧", "倍音", "アンザッツ", "ミックスボイス", "エッジボイス", "喉頭蓋", "鼻腔共鳴", "チェストボイス", "ヘッドボイス"];
    let options = [q.answer];
    const filteredDummy = dummyPool.filter(d => d !== q.answer);
    while (options.length < 4) {
      const randomDummy = filteredDummy[Math.floor(Math.random() * filteredDummy.length)];
      if (!options.includes(randomDummy)) options.push(randomDummy);
    }
    return options.sort(() => 0.5 - Math.random());
  };

  // 回答処理
  const handleAnswer = (selected) => {
    if (isTyping || feedback) return;

    const isCorrect = selected === currentQuestion.answer;
    setFeedback({ isCorrect, explanation: currentQuestion.explanation });

    if (isCorrect) {
      if (gameState === 'bossBattle') {
        const nextBossHp = bossHp - 1;
        setBossHp(nextBossHp);
        setUsedIndices(prev => ({ ...prev, boss: [...prev.boss, currentQuestion.index] }));
        typeMessage("正解！魔王の体力を削った！");
      } else {
        const nextCount = beginnerCorrectCount + 1;
        setBeginnerCorrectCount(nextCount);
        setUsedIndices(prev => ({ ...prev, beginner: [...prev.beginner, currentQuestion.index] }));
        typeMessage("正解！喉のコンディションが整っていく。");
      }
    } else {
      setIsShaking(true);
      setHp(prev => Math.max(0, prev - 25));
      
      if (gameState === 'bossBattle') {
        const nextBossHp = Math.min(4, bossHp + 1);
        setBossHp(nextBossHp);
        typeMessage("不正解！喉にダメージ！...ボスの体力が回復し、弱点が隠れてしまった！");
      } else {
        typeMessage("不正解！喉に負担がかかってしまった！");
      }
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // 勝利判定
  useEffect(() => {
    if (gameState === 'bossBattle' && bossHp <= 0) {
      setGameState('victory');
      typeMessage("QUEST CLEAR! あなたは喉の支配を打ち破り、真の声を手に入れた！");
    }
  }, [bossHp, gameState]);

  // HPが0になった時の処理
  useEffect(() => {
    if (hp <= 0) {
      setGameState('gameover');
      typeMessage("GAME OVER... 喉が完全に枯れてしまった。十分な休養が必要だ。");
    }
  }, [hp]);

  // ボス戦開始
  const startBossBattle = () => {
    setGameState('bossBattle');
    setBossHp(4);
    const { q, index } = getUnusedQuestion('boss', usedIndices);
    const options = generateOptions(q);
    setCurrentQuestion({ ...q, options, index });
    typeMessage(`魔王【ボイス・デーモン】が現れた！喉を壊さず、全ての知識で打ち勝て！ ${q.question}`);
  };

  return (
    <div className="rpg-test-container">
      <div className={`rpg-screen-frame ${isShaking ? 'screen-shake' : ''}`} 
           style={{ backgroundImage: `url('/images/rpg/bg_training.png')`, filter: gameState.includes('boss') ? 'hue-rotate(180deg) brightness(0.6)' : 'none' }}>
        
        {/* ステータスパネル（左上） */}
        <div className="rpg-status-panel">
          <div className="status-row">
            <div className="status-label"><span>Vocal HP</span><span>{hp}%</span></div>
            <div className="gauge-bg">
              <div className="gauge-fill hp" style={{ width: `${hp}%` }}></div>
            </div>
          </div>
          {gameState === 'battle' && (
            <div className="status-row">
              <div className="status-label"><span>探索進捗 (Discovery)</span></div>
              <div className="gauge-bg">
                <div className="gauge-fill mp" style={{ width: `${(beginnerCorrectCount / 8) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* ボスHPゲージ（中央上部：ボス戦のみ） */}
        {gameState === 'bossBattle' && (
          <div className="boss-hp-container" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '60%', textAlign: 'center', zIndex: 100 }}>
            <div style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '0 0 10px #000', marginBottom: '5px' }}>BOSS HP</div>
            <div className="gauge-bg" style={{ height: '20px', border: '2px solid #ff4d4d', boxShadow: '0 0 15px rgba(255, 77, 77, 0.5)' }}>
              <div className="gauge-fill" style={{ width: `${(bossHp / 4) * 100}%`, backgroundColor: '#ff4d4d', transition: 'width 0.5s ease-in-out' }}></div>
            </div>
          </div>
        )}

        {/* モンスターエリア */}
        <div className="rpg-monster-area">
          {gameState === 'battle' && <img src="/images/rpg/monster_slime_v2.png" alt="Monster" className="monster-sprite" style={{ mixBlendMode: 'lighten' }} />}
          {gameState === 'bossBattle' && (
            <img src="/images/rpg/monster_slime_v2.png" alt="Boss" className="monster-sprite" 
                 style={{ transform: 'scale(2.0)', filter: 'hue-rotate(130deg) contrast(1.5) brightness(1.2)', mixBlendMode: 'lighten' }} />
          )}
        </div>

        {/* メッセージ ＆ 選択肢エリア */}
        <div className="rpg-message-area">
          <div style={{ minHeight: '80px' }}>
            <p className="message-text">{message}</p>
          </div>
          
          <div className="rpg-choices-grid">
            {gameState === 'opening' && <button className="rpg-choice-btn" onClick={startGame}>クエストを開始する</button>}
            
            {(gameState === 'battle' || gameState === 'bossBattle') && currentQuestion && !feedback && (
              currentQuestion.options.map((opt, i) => (
                <button key={i} className="rpg-choice-btn" onClick={() => handleAnswer(opt)}>
                  <span className="choice-index">{String.fromCharCode(65 + i)}</span>{opt}
                </button>
              ))
            )}

            {feedback && (
              <div style={{ width: '100%', animation: 'fadeIn 0.3s ease-out' }}>
                <p style={{ color: feedback.isCorrect ? '#4dff88' : '#ff4d4d', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 8px 0' }}>
                  {feedback.isCorrect ? '【SUCCESS】' : '【FAILURE】'} 正解：{currentQuestion.answer}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.4' }}>{feedback.explanation}</p>
                <button className="rpg-choice-btn" style={{ marginTop: '12px', borderColor: 'var(--rpg-gold)' }} onClick={() => nextQuestion()}>
                  次の戦いへ ➔
                </button>
              </div>
            )}

            {gameState === 'bossTransition' && (
              <button className="rpg-choice-btn" style={{ fontSize: '1.2rem', borderColor: '#ff4d4d', color: '#ff4d4d' }} onClick={startBossBattle}>
                魔王に挑む!!
              </button>
            )}

            {(gameState === 'victory' || gameState === 'gameover') && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '2.4rem', color: gameState === 'victory' ? 'gold' : 'red', textShadow: '0 0 15px rgba(212, 175, 55, 0.5)' }}>
                  {gameState === 'victory' ? 'CONGRATULATIONS!' : 'DEFEATED...'}
                </h3>
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
