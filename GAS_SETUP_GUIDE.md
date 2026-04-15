# Google Apps Script (GAS) セットアップ手順

スケジュールをWebサイトから更新できるようにするために、以下の手順でGoogleスプレッドシートにプログラムを設定してください。

## 1. スプレッドシート側の準備
まず、スプレッドシートの構造が以下のようになっていることを確認してください。
- **1行目（ヘッダー）**: `日付`, `昼`, `夜`, `備考`
- **データ形式**:
    - 日付: `2024/04/15` 形式
    - 昼/夜: `0` (空き) または `1` (予約あり) または `4` (休み)

## 2. GASエディタを開く
1. 該当のスプレッドシートを開きます。
2. メニューの **[拡張機能] > [Apps Script]** をクリックします。

## 3. コードの貼り付け
エディタが開いたら、最初からある `function myFunction() {...}` を全て消去し、以下のコードをコピー＆ペーストしてください。

```javascript
// --- 設定：WEBサイト側の MASTER_PASSWORD と一致させてください ---
const ADMIN_PASSWORD = "7921"; 

// スプレッドシートからデータを取得する (GETリクエスト)
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // CSV形式で返却
  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });
  
  return ContentService.createTextOutput(csvContent).setMimeType(ContentService.MimeType.TEXT);
}

// WEBサイトからの更新を受け取る (POSTリクエスト)
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    // パスワードチェック
    if (params.password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid password"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = params.data; // オブジェクト形式 { "2024-04-15": {day: 1, night: 0, note: ""}, ... }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // スプレッドシートの各行をループして更新
    for (let i = 1; i < values.length; i++) {
      let dateObj = values[i][0];
      let dateStr = "";
      
      if (dateObj instanceof Date) {
        // GAS上のDateオブジェクトを yyyy-MM-dd に変換
        dateStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        dateStr = String(dateObj).replace(/\//g, '-');
      }
      
      if (data[dateStr]) {
        values[i][1] = data[dateStr].day;   // 昼
        values[i][2] = data[dateStr].night; // 夜
        // values[i][3] = data[dateStr].note; // 備考を更新したい場合は有効化
      }
    }
    
    // シートに一括書き込み
    range.setValues(values);
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 4. デプロイ（公開設定）
ここが一番重要です。
1. エディタ右上の **[デプロイ] > [新しいデプロイ]** をクリックします。
2. 種類の選択（歯車アイコン）で **[ウェブアプリ]** を選択します。
3. 設定を以下のようにします：
    - **説明**: 任意（例: Schedule API）
    - **次のユーザーとして実行**: **[自分]**
    - **アクセスできるユーザー**: **[全員]** （※Googleアカウントなしでもアクセスできるようにするため）
4. **[デプロイ]** をクリックします。
5. 「アクセスを承認」と出たら、自分のGoogleアカウントを選択し、**[Advanced/詳細] > [Go to ... (unsafe)]** をクリックして承認してください。
6. 完了画面で発行される **「ウェブアプリのURL」** をコピーします。

## 5. Webサイト側の設定
コピーした「ウェブアプリのURL」を、`src/Schedule.jsx` 内の以下の場所に貼り付けて保存してください。

```javascript
const GAS_API_URL = 'ここにコピーしたURLを貼る';
```

以上で設定完了です！
Webサイトのスケジュール画面でタイトルを5回クリックしてログインし、変更を試してみてください。
