import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './LP.css';

const LP = () => {
  // Canvaの全9ページ分をセクションとして分割
  const sections = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="lp-container" style={{ background: '#000', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>LP 構築用ベース（全9セクション）</h1>
        <p>抽出した高画質画像を、Canvaのページごとに9つのセクションに分割して並べています。</p>
        <p>「セクション1は〇〇の動きをつけて」「セクション3は画像をボタンにして」などご指示ください。</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {sections.map((num, index) => {
          // 1枚の超縦長画像を9等分して表示する魔法の計算
          // 背景サイズを縦9倍（900%）に設定し、表示位置を0%〜100%でスライドさせます
          const yPos = index * (100 / 8); 
          
          return (
            <section 
              key={num} 
              id={`section-${num}`}
              style={{
                width: '100%',
                maxWidth: '1024px', // PCでも大きく表示されるように元の画像サイズ（1024px）に合わせました
                aspectRatio: '1024.5 / 576', // PDFの正確な解像度から計算したアスペクト比
                backgroundImage: `url('/images/canva_page_1.png')`,
                backgroundSize: '100% auto', // 高さを強制指定せず自動にする（潰れ防止）
                backgroundPosition: `center ${yPos}%`,
                position: 'relative',
                marginBottom: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            >
              {/* セクション番号のラベル */}
              <div style={{
                position: 'absolute', 
                top: '20px', 
                left: '20px', 
                background: 'rgba(81, 112, 255, 0.9)', 
                color: 'white', 
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                border: '2px solid white'
              }}>
                セクション {num}
              </div>
              
              <div className="section-content-overlay" style={{ position: 'absolute', inset: 0 }}>
                {/* 仮置きボタン（授業note） */}
                {num === 4 && (
                  <div className="absolute-btn-wrapper fuwa-fuwa" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <a href="https://note.com/voice_tn_nagi" target="_blank" rel="noreferrer" className="lp-btn primary-btn" style={{ width: '100%', height: '100%', justifyContent: 'center', fontSize: '1.4rem' }}>
                      <span className="btn-icon">📝</span> 授業noteはこちら
                    </a>
                  </div>
                )}
                {/* 仮置きボタン（レッスン予約） */}
                {num === 8 && (
                  <div className="absolute-btn-wrapper fuwa-fuwa" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <a href="https://kaminagi-lab.vercel.app/lesson.html" target="_blank" rel="noreferrer" className="lp-btn secondary-btn" style={{ width: '100%', height: '100%', justifyContent: 'center', fontSize: '1.4rem' }}>
                      <span className="btn-icon">📅</span> レッスン予約はこちら
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<LP />);
