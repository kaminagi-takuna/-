const BOOKS = [
  {
    "id": "basic-01",
    "series": "基礎編",
    "number": 1,
    "circle": "①",
    "title": "息の角度",
    "image": "assets/basic-01.webp",
    "lead": "口を起点に、息の角度を捉える。",
    "points": [
      "0度の基準と、上・下の角度",
      "角度設定を変えたときの体感と聞こえ",
      "演技・ナレーションへの使い分け"
    ],
    "samples": [
      "assets/basic-01-sample-1.webp",
      "assets/basic-01-sample-2.webp",
      "assets/basic-01-sample-3.webp",
      "assets/basic-01-sample-4.webp"
    ]
  },
  {
    "id": "basic-02",
    "series": "基礎編",
    "number": 2,
    "circle": "②",
    "title": "虚実",
    "image": "assets/basic-02.webp",
    "lead": "伝えたい声と、自然にこぼれる声を使い分ける。",
    "points": [
      "実と虚の違いを自分の声で試す",
      "伝える意図と力みを分けて考える",
      "相手を受けて、表現を選び直す"
    ],
    "samples": [
      "assets/basic-02-sample-1.webp",
      "assets/basic-02-sample-2.webp",
      "assets/basic-02-sample-3.webp",
      "assets/basic-02-sample-4.webp"
    ]
  },
  {
    "id": "basic-03",
    "series": "基礎編",
    "number": 3,
    "circle": "③",
    "title": "声軸・音軸",
    "image": "assets/basic-03.webp",
    "lead": "声の支点を、動かす・保つ。",
    "points": [
      "声軸と音軸の違い",
      "音程と支点を混同しない比較",
      "人物や場面に合わせた軸の選択"
    ],
    "samples": [
      "assets/basic-03-sample-1.webp",
      "assets/basic-03-sample-2.webp",
      "assets/basic-03-sample-3.webp",
      "assets/basic-03-sample-4.webp"
    ]
  },
  {
    "id": "basic-04",
    "series": "基礎編",
    "number": 4,
    "circle": "④",
    "title": "語尾誘導",
    "image": "assets/basic-04.webp",
    "lead": "相手の語尾を受け、次の語頭を選ぶ。",
    "points": [
      "語尾の高さと虚実を分けて聞く",
      "同調と切り替えを比較する",
      "受け取りから応答までのつながり"
    ],
    "samples": [
      "assets/basic-04-sample-1.webp",
      "assets/basic-04-sample-2.webp",
      "assets/basic-04-sample-3.webp",
      "assets/basic-04-sample-4.webp"
    ]
  },
  {
    "id": "basic-05",
    "series": "基礎編",
    "number": 5,
    "circle": "⑤",
    "title": "トライアングル",
    "image": "assets/basic-05.webp",
    "lead": "個別の技術を、ひとつの表現へつなぐ。",
    "points": [
      "基礎の4つの技術を組み合わせる",
      "同じ文で設定の違いを比べる",
      "学んだ内容を実践へ戻す"
    ],
    "samples": [
      "assets/basic-05-sample-1.webp",
      "assets/basic-05-sample-2.webp",
      "assets/basic-05-sample-3.webp",
      "assets/basic-05-sample-4.webp"
    ]
  },
  {
    "id": "tech-01",
    "series": "技術編",
    "number": 1,
    "circle": "①",
    "title": "地声と身体の基盤",
    "image": "assets/tech-01.webp",
    "lead": "自分の基準を、身体と声から見直す。",
    "points": [
      "普段の地声と身体の状態を知る",
      "姿勢と声の変化を照らし合わせる",
      "自分に合う発声の基準を作る"
    ],
    "samples": [
      "assets/tech-01-sample-1.webp",
      "assets/tech-01-sample-2.webp",
      "assets/tech-01-sample-3.webp",
      "assets/tech-01-sample-4.webp"
    ]
  },
  {
    "id": "tech-02",
    "series": "技術編",
    "number": 2,
    "circle": "②",
    "title": "呼吸と呼気圧",
    "image": "assets/tech-02.webp",
    "lead": "吸う・支える・吐くを整理する。",
    "points": [
      "呼吸と呼気圧を分けて捉える",
      "息の使い方と声の変化を比べる",
      "実習で使う感覚を言葉にする"
    ],
    "samples": [
      "assets/tech-02-sample-1.webp",
      "assets/tech-02-sample-2.webp",
      "assets/tech-02-sample-3.webp",
      "assets/tech-02-sample-4.webp"
    ]
  },
  {
    "id": "tech-03",
    "series": "技術編",
    "number": 3,
    "circle": "③",
    "title": "共鳴空間と口・喉の連動",
    "image": "assets/tech-03.webp",
    "lead": "口と喉の空間を、連動として捉える。",
    "points": [
      "口・喉の空間を意識して試す",
      "響きと息の通り方を比較する",
      "同じ条件へ戻り、再現を確かめる"
    ],
    "samples": [
      "assets/tech-03-sample-1.webp",
      "assets/tech-03-sample-2.webp",
      "assets/tech-03-sample-3.webp",
      "assets/tech-03-sample-4.webp"
    ]
  },
  {
    "id": "tech-04",
    "series": "技術編",
    "number": 4,
    "circle": "④",
    "title": "声の密度と分離の設計",
    "image": "assets/tech-04.webp",
    "lead": "響きの中の、埋める・抜くを設計する。",
    "points": [
      "鼻腔・口腔・咽頭の密度を捉える",
      "部分ごとの密度の配分を試す",
      "子音と母音、響きの分離を聞く"
    ],
    "samples": [
      "assets/tech-04-sample-1.webp",
      "assets/tech-04-sample-2.webp",
      "assets/tech-04-sample-3.webp",
      "assets/tech-04-sample-4.webp"
    ]
  },
  {
    "id": "tech-05",
    "series": "技術編",
    "number": 5,
    "circle": "⑤",
    "title": "自己理解と役づくり",
    "image": "assets/tech-05.webp",
    "lead": "自分の特徴を、役づくりの材料にする。",
    "points": [
      "自分の特徴と役の条件を整理する",
      "役としての選択を言葉にする",
      "試行と振り返りを役づくりに生かす"
    ],
    "samples": [
      "assets/tech-05-sample-1.webp",
      "assets/tech-05-sample-2.webp",
      "assets/tech-05-sample-3.webp",
      "assets/tech-05-sample-4.webp"
    ]
  },
  {
    "id": "tech-06",
    "series": "技術編",
    "number": 6,
    "circle": "⑥",
    "title": "台本読解と表現設計",
    "image": "assets/tech-06.webp",
    "lead": "意味を読み、表現の選択へつなぐ。",
    "points": [
      "台本の情報と解釈を整理する",
      "立てたい言葉と起点を考える",
      "読み方を比べ、意図に合う形を選ぶ"
    ],
    "samples": [
      "assets/tech-06-sample-1.webp",
      "assets/tech-06-sample-2.webp",
      "assets/tech-06-sample-3.webp",
      "assets/tech-06-sample-4.webp"
    ]
  },
  {
    "id": "tech-07",
    "series": "技術編",
    "number": 7,
    "circle": "⑦",
    "title": "尺・間・ペースの制御",
    "image": "assets/tech-07.webp",
    "lead": "限られた時間の中で、伝わり方を整える。",
    "points": [
      "尺・間・ペースを分けて捉える",
      "速度と伝わり方の変化を比べる",
      "条件に合わせて読みを調整する"
    ],
    "samples": [
      "assets/tech-07-sample-1.webp",
      "assets/tech-07-sample-2.webp",
      "assets/tech-07-sample-3.webp",
      "assets/tech-07-sample-4.webp"
    ]
  },
  {
    "id": "tech-08",
    "series": "技術編",
    "number": 8,
    "circle": "⑧",
    "title": "子音・母音と歌唱の設計",
    "image": "assets/tech-08.webp",
    "lead": "子音の入りと母音の続きから、歌を組み立てる。",
    "points": [
      "子音と母音の役割を整理する",
      "音への入りが早い・遅いを比較する",
      "歌詞とタイミングの関係を考える"
    ],
    "samples": [
      "assets/tech-08-sample-1.webp",
      "assets/tech-08-sample-2.webp",
      "assets/tech-08-sample-3.webp",
      "assets/tech-08-sample-4.webp"
    ]
  },
  {
    "id": "tech-09",
    "series": "技術編",
    "number": 9,
    "circle": "⑨",
    "title": "高出力発声と圧縮の応用",
    "image": "assets/tech-09.webp",
    "lead": "高出力の声を、支えと圧縮から考える。",
    "points": [
      "呼気圧・支え・響きを整理する",
      "比喩を実習の手がかりとして使う",
      "無理のない範囲で変化を比較する"
    ],
    "samples": [
      "assets/tech-09-sample-1.webp",
      "assets/tech-09-sample-2.webp",
      "assets/tech-09-sample-3.webp",
      "assets/tech-09-sample-4.webp"
    ]
  },
  {
    "id": "tech-10",
    "series": "技術編",
    "number": 10,
    "circle": "⑩",
    "title": "収録環境とマイク運用",
    "image": "assets/tech-10.webp",
    "lead": "収録条件をそろえ、音の違いを確かめる。",
    "points": [
      "マイクの向き・距離と音質",
      "返し・録音・書き出しの確認",
      "用途に合わせた音源の提出を考える"
    ],
    "samples": [
      "assets/tech-10-sample-1.webp",
      "assets/tech-10-sample-2.webp",
      "assets/tech-10-sample-3.webp",
      "assets/tech-10-sample-4.webp"
    ]
  },
  {
    "id": "tech-11",
    "series": "技術編",
    "number": 11,
    "circle": "⑪",
    "title": "声の聴き分けと指導の見立て",
    "image": "assets/tech-11.webp",
    "lead": "聞こえと本人の説明から、次の試行を選ぶ。",
    "points": [
      "聞こえだけで原因を決めない",
      "本人の感覚と実際の声を照合する",
      "短い再試行とフィードバックを組み立てる"
    ],
    "samples": [
      "assets/tech-11-sample-1.webp",
      "assets/tech-11-sample-2.webp",
      "assets/tech-11-sample-3.webp",
      "assets/tech-11-sample-4.webp"
    ]
  }
];
