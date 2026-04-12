import { useState, useEffect } from 'react'
import './App.css'

const TweetEmbed = ({ tweetId }) => {
  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
    }
  }, [tweetId]);

  return (
    <div className="tweet-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', width: '100%' }}>
      <blockquote className="twitter-tweet" data-theme="dark" data-width="500">
        <a href={`https://twitter.com/x/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
};

const NoteEmbed = ({ noteId }) => {
  return (
    <div className="note-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', width: '100%' }}>
      <iframe
        className="note-embed"
        src={`https://note.com/embed/notes/${noteId}`}
        style={{ border: 0, display: 'block', maxWidth: '100%', width: '550px', height: '400px', borderRadius: '12px', background: '#fff' }}
        title="Note Embed"
      ></iframe>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="page-content fade-in">
            <h2>自己紹介</h2>
            
            <div className="section-block">
              <h3 className="section-title">PROFILE</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ボイストレーナー・声優講師・ボイスサンプル原稿作成<br/>レコーディングディレクター（歌・セリフ）</p>
              <p style={{ color: 'var(--accent)', marginTop: '0.5rem' }}>様々な経験と実績に裏打ちされた技術を通話で惜しみなくお届けします。</p>

              <div className="profile-details">
                北海道出身・在住。札幌で舞台・ラジオドラマ声優などを経験。<br/>
                その時期に先輩方のおかげで「体の動きが声に乗る大切さ」を学び、声と身体の関係性を学びなおす。<br/>
                声を聴くだけで姿勢・体の状態が把握できるまでとなり、その技術を使用して通話レッスンを開始。<br/><br/>
                発声のロジックと演技のロジックを組み合わせた指導は、現在声優やVtuberといった配信者にも信頼を得るに至り、10年以上のレッスン実績を持つ。<br/>
                声でお悩みの方。機材でお悩みの方。プロを目指す方。遊びの範囲で気軽にレッスンしたい方。<br/>
                必ずあなたの助けになります。
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '4rem 0' }}>
              {/* ご自身で public/images/profile.jpg に画像を配置していただくと表示されます */}
              <img src="/images/profile.jpg" alt="なぎぃ/神薙拓那" style={{ maxWidth: '100%', width: '350px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div className="section-block">
              <h3 className="section-title" style={{ fontSize: '1.8rem', borderBottom: 'none', justifyContent: 'center' }}>なぎぃ/神薙拓那</h3>
              
              <div className="content-card" style={{ marginTop: '2rem', padding: '2.5rem', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'inline-block' }}>好きな物</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>🍽 食べ物</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.8' }}>
                      サーモン / えんがわ<br/>
                      ボロネーゼ / ファミチキ / カレー
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>🥤 飲み物</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.8' }}>
                      メロンソーダ / ガラナ<br/>
                      NOPE / 午後の紅茶
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>🎬 アニメ</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.8' }}>
                      Ｇガンダム / Ｗガンダム<br/>
                      異世界食堂 / とんでもスキルで異世界飯<br/>
                      頭文字Ｄ
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>📺 ドラマ</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.8' }}>
                      おっさんずラブ / ロイヤルファミリー
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>🎮 ゲーム</strong>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.8' }}>
                      レーシングラグーン / せがれいじり<br/>
                      あつまれどうぶつの森 / スプラトゥーン３
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'lessons':
        return (
          <div className="page-content fade-in">
            <h2>レッスン内容及び金額表</h2>
            <div className="info-banner">
              <p style={{ lineHeight: '1.8' }}>
                <strong style={{ color: 'var(--accent)' }}>レッスン実施時間</strong>: 14:00～18:00 / 22:00～02:00<br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>※在宅介護のため上記の時間とさせていただいております。<br/>
                ※上記以上の時間や、時間外を希望の場合は応相談となります。<br/>
                ※お支払いは銀行振り込み（後払い）のみの対応となります。</span>
              </p>
            </div>

            <div className="pricing-cards">
              <div className="price-card">
                <h3>昼間</h3>
                <p className="desc">夜コースと同じ内容ですが、介護の関係で昼間の時間をレッスンに割くため値上がりしています。</p>
                <ul>
                  <li><span>60分</span><span>10,000円</span></li>
                  <li><span>120分</span><span>15,000円</span></li>
                  <li><span>180分</span><span>20,000円</span></li>
                </ul>
              </div>

              <div className="price-card popular">
                <h3>夜間</h3>
                <p className="desc">時間を確保しやすい夜間のため、お安めの基本料金でお受けできます。ディレクション等も幅広く対応。</p>
                <ul>
                  <li><span>60分</span><span>5,000円</span></li>
                  <li><span>120分</span><span>8,000円</span></li>
                  <li><span>180分</span><span>10,000円</span></li>
                </ul>
              </div>

              <div className="price-card pro">
                <h3>プロコース</h3>
                <p className="desc">踏み込んだ深い内容向け。プロの現場で通用する情報を実践して持ち帰るブーストコースです。</p>
                <ul>
                  <li><span>60分</span><span>15,000円</span></li>
                  <li><span>120分</span><span>24,000円</span></li>
                  <li><span>180分</span><span>32,000円</span></li>
                </ul>
              </div>
            </div>
            <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              月に何度かご依頼いただいた場合、お値下げの交渉も受け付けております。
            </p>
          </div>
        );
      case 'twitter':
        return (
          <div className="page-content fade-in">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: 'none' }}>
              <span style={{ fontSize: '2.5rem' }}>𝕏</span> 
              <span>最新の発信</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              声優・ナレーターとしての活動や、独自のメソッドを発信しています。
            </p>
            <div className="sns-feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <TweetEmbed tweetId="2041389006500634862" />
              <TweetEmbed tweetId="2040987860225179792" />
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="https://x.com/Voice_Tac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>X (Twitter) アカウントへ ↗</a>
            </p>
          </div>
        );
      case 'note':
        return (
          <div className="page-content fade-in">
            <h2 style={{ borderBottom: 'none' }}>note 執筆記事</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              ロジカルな発声理論から現場スキルまで、声にまつわるより深い考察。
            </p>
            <div className="sns-feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <NoteEmbed noteId="ndfa02e7a1680" />
              <NoteEmbed noteId="n64186d974d46" />
              <NoteEmbed noteId="nbb4d09d775ff" />
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="https://note.com/voice_tn_nagi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>noteマガジンへ ↗</a>
            </p>
          </div>
        );
      case 'canva':
        return (
          <div className="page-content fade-in">
            <div className="hero-section">
              <h2 style={{ fontSize: '3.6rem', borderBottom: 'none', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>気軽に 自宅で 巧くなる</h2>
              <p className="hero-sub">自宅で変わる、ボイスデザイン<br/>発信者の声をより良くする 新しいカタチ</p>
            </div>

            <div className="content-card" style={{ textAlign: 'center', padding: '4rem 2rem', marginBottom: '4rem' }}>
              <img 
                src="/images/bana.jpg" 
                alt="メインバナー" 
                style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} 
              />
              <h3 style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '2rem', letterSpacing: '0.15em', fontWeight: '800' }}>
                【ボイトレ×芝居×歌】
              </h3>
              <p style={{ fontSize: '1.3rem', lineHeight: '2.5', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                プロ志望をプロにするメソッド<br />
                10年以上の指導を重ね<br />
                構造と感覚をリンクさせるレッスンで<br />
                あなたを「なりたい自分」にします
              </p>
            </div>

            <div className="section-block">
              <h3 className="section-title" style={{ fontSize: '1.4rem' }}>Discord通話レッスン</h3>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img src="/images/voice.jpg" alt="Discord通話レッスン" style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', textAlign: 'center' }}>
                カメラ不要の通話レッスン。<br/>
                ボイトレ、声優の芝居レッスンから朗読レッスン<br/>
                初心者の基本発声まで承ります。<br/><br/>
                まずはお気軽にメールフォームからお問い合わせください。
              </p>
            </div>

            <div className="section-block">
              <h3 className="section-title" style={{ fontSize: '1.4rem' }}>原稿依頼詳細（サンプル）</h3>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img src="/images/genkou.jpg" alt="原稿依頼詳細" style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="script-examples">
                <details>
                  <summary>例１：車の哲学風</summary>
                  <p>車とは、移動の道具か。その問いに、我々はこう答えるのだ。<br/>いいや、人生の相棒だ、と。<br/>スムーズに加速するハイブリッドエンジン。<br/>長時間走行にも安心なドライビングシート。<br/>人馬一体。走る喜びを、あなたにも。</p>
                </details>
                <details>
                  <summary>例２：ラーメン（探求と芸術）</summary>
                  <p>ラーメン。それは努力と探究の先に辿り着く芸術。<br/>四日間煮込んだ白濁の濃厚豚骨スープ。<br/>口に入れた瞬間は濃密な豚骨が。しかし飲み込むとスッと消えていく濃厚さを残さないあっさりとした後味。<br/>掬い上げたレンゲから零れ落ちる一滴は、まさに神の一雫だ。</p>
                </details>
                <details>
                  <summary>例３：ドキュメンタリー風</summary>
                  <p>スタジオに篭り、十時間が過ぎた。坂本はギターを弾きながらノートにメモをとる。<br/>浮かぶアイディアの全てを零すまいとするその姿勢が、彼の音楽を、彼の音たらしめている。<br/>坂本の食事は、まだ先になりそうだ。</p>
                </details>
                <details>
                  <summary>例４：競馬（熱狂と実況）</summary>
                  <p>四つ足が駆けるこの舞台で、勝ち残るのはたった一頭。逃げるもの、追うもの、埋もれるもの。<br/>最後の直線で前に出ること。凌ぎを削ったプライドが沈む、アカネイロステークス。<br/>最期に勝鬨を上げるその時まで、我々はただ、声を枯らすのみ。<br/>刮目せよ。この、歴史の一瞬を。</p>
                </details>
              </div>
            </div>

            <div className="section-block">
              <h3 className="section-title" style={{ fontSize: '1.4rem' }}>ボーカルセレクト</h3>
              <div className="price-card popular" style={{ padding: '1.5rem 2rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>基本料金</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent)' }}>10,000円</span>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                  歌ってみたを作成する方の、ボーカルセレクトを行います。<br/>
                  フル歌唱のボーカル音源を３本お送りいただき、ベストテイクを組み合わせます。<br/><br/>
                  <span style={{ color: '#f59e0b', fontSize: '0.95rem', fontWeight: 'bold' }}>※ボーカル音源１本追加につき ＋4,000円とさせていただきます。</span>
                </p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="page-content fade-in">
            <h2>お問い合わせ</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)', textAlign: 'center'}}>
              レッスンのお申し込みや、各種お問い合わせはこちらからお願いいたします。
            </p>

            <div className="content-card" style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                入力フォーム途中にあるフリースペースに、以下の内容をご記入ください。
              </h4>
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>・ボイトレ含むレッスンの場合</strong><br/>
                  希望内容とご希望の日時、単発、複数回などご記入ください。上記項目でご記入いただいたDiscordアカウントをこちらで登録し、ご連絡いたします。
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>・原稿依頼の場合</strong><br/>
                  必要な原稿の分数、本数、ご予算などをご記入ください。<br/>
                  上記項目でご記入いただいたDiscordアカウントを登録しご連絡、もしくはメールアドレスにてご連絡いたします。
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>個人のご依頼</strong>　お名前、使用目的、ご予算、あれば原稿内容
                </li>
                <li style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>法人のご依頼</strong>　会社名、案件内容、競合の有無、可能であればご予算
                </li>
                <li style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  上記項目でご記入いただいたDiscordアカウントを登録しご連絡、<br/>
                  もしくはメールアドレスにてご連絡いたします。
                </li>
              </ul>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: '12px' }}>
              <iframe
                id="JotFormIFrame-253502863799066"
                title="お問い合わせフォーム"
                onLoad={(e) => window.parent.scrollTo(0,0)}
                allowtransparency="true"
                allowFullScreen={true}
                allow="geolocation; microphone; camera"
                src="https://form.jotform.com/253502863799066"
                frameBorder="0"
                style={{ minWidth: '100%', maxWidth: '100%', height: '800px', border: 'none', overflowY: 'auto' }}
                scrolling="yes"
              ></iframe>
            </div>
          </div>
        );
      default:
        return <div>選択してください。</div>;
    }
  }

  useEffect(() => {
    if (activeTab === 'twitter') {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeTab]);

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <h1 className="logo" style={{ fontFamily: 'var(--font-en)', fontSize: '1.6rem', lineHeight: '1.1', textAlign: 'left', fontWeight: '800', marginLeft: '1.2rem' }}>
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>K</span>AMINAGI<br />
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>O</span>NLINE<br />
          <span style={{ fontSize: '2.8rem', color: 'var(--accent)' }}>L</span>ESSON
        </h1>
        <ul className="nav-menu">
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>自己紹介</li>
          <li className={activeTab === 'lessons' ? 'active' : ''} onClick={() => setActiveTab('lessons')}>レッスン内容及び金額表</li>
          <li className={activeTab === 'canva' ? 'active' : ''} onClick={() => setActiveTab('canva')}>
            <span>依頼詳細</span>
          </li>
          <li className={activeTab === 'twitter' ? 'active' : ''} onClick={() => setActiveTab('twitter')}>
            <span style={{ fontFamily: 'var(--font-en)' }}>Twitter</span>
            <a href="https://x.com/Voice_Tac" target="_blank" rel="noopener noreferrer" className="external-link" onClick={(e) => e.stopPropagation()} title="別窓で開く">↗</a>
          </li>
          <li className={activeTab === 'note' ? 'active' : ''} onClick={() => setActiveTab('note')}>
            <span style={{ fontFamily: 'var(--font-en)' }}>note</span>
            <a href="https://note.com/voice_tn_nagi" target="_blank" rel="noopener noreferrer" className="external-link" onClick={(e) => e.stopPropagation()} title="別窓で開く">↗</a>
          </li>
          <li className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>メールフォーム</li>
        </ul>
      </nav>
      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
