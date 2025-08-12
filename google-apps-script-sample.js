/**
 * Patent Hub ニュース管理用 Google Apps Script
 * 
 * 設定手順：
 * 1. Google スプレッドシートを作成
 * 2. 以下の列を設定：
 *    A列: ニュースタイトル
 *    B列: カテゴリ（特許、商標、意匠など）
 *    C列: 情報源（特許庁、WIPOなど）
 *    D列: 公開日（YYYY-MM-DD形式）
 *    E列: 要約
 *    F列: 元記事URL
 *    G列: 重要度（1-5の数値）
 *    H列: 公開状態（公開/非公開）
 * 
 * 3. Google Apps Script エディタでこのコードを貼り付け
 * 4. ウェブアプリとしてデプロイ
 * 5. デプロイURLをPatent Hubの設定に追加
 */

function doGet() {
  try {
    // スプレッドシートIDを設定（実際のスプレッドシートIDに置き換えてください）
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // データを取得（ヘッダー行を除く）
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // ヘッダー行を除いてデータを処理
    const headers = values[0];
    const data = values.slice(1);
    
    // JSONデータを構築
    const newsData = [];
    
    for (const row of data) {
      // 空の行をスキップ
      if (!row[0] || row[0].toString().trim() === '') continue;
      
      const newsItem = {
        title: row[0] || '',
        category: row[1] || '一般',
        source: row[2] || 'Patent Hub',
        date: formatDate(row[3]) || new Date().toISOString().split('T')[0],
        summary: row[4] || '',
        url: row[5] || '#',
        priority: parseInt(row[6]) || 3,
        status: row[7] || '公開'
      };
      
      // 基本的なバリデーション
      if (newsItem.title && newsItem.title.length >= 5) {
        newsData.push(newsItem);
      }
    }
    
    // JSON形式でレスポンスを返す
    const response = {
      success: true,
      data: newsData,
      lastUpdate: new Date().toISOString(),
      count: newsData.length
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      data: []
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

/**
 * 日付をYYYY-MM-DD形式に変換
 */
function formatDate(dateValue) {
  if (!dateValue) return null;
  
  try {
    let date;
    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      date = new Date(dateValue);
    }
    
    if (isNaN(date.getTime())) return null;
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('日付変換エラー:', error);
    return null;
  }
}

/**
 * スプレッドシートの構造を確認するためのテスト関数
 */
function testSpreadsheetStructure() {
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    console.log('スプレッドシート名:', spreadsheet.getName());
    console.log('シート名:', sheet.getName());
    
    const range = sheet.getDataRange();
    console.log('データ範囲:', range.getA1Notation());
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('ヘッダー:', headers);
    
    const sampleData = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('サンプルデータ:', sampleData);
    
  } catch (error) {
    console.error('テストエラー:', error);
  }
}

/**
 * サンプルデータを挿入する関数（初期設定用）
 */
function insertSampleData() {
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // ヘッダーを設定
    const headers = [
      'ニュースタイトル',
      'カテゴリ',
      '情報源',
      '公開日',
      '要約',
      '元記事URL',
      '重要度',
      '公開状態'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // サンプルデータを追加
    const sampleData = [
      [
        '特許庁、AI関連特許の審査基準を改訂',
        '特許',
        '特許庁',
        '2025-08-09',
        'AIの技術進歩に対応し、特許審査基準の明確化を図る改訂が行われました。',
        'https://www.jpo.go.jp/news/ai-patent-guidelines.html',
        5,
        '公開'
      ],
      [
        '国際商標出願件数が過去最高を記録',
        '商標',
        'WIPO',
        '2025-08-08',
        '2024年の国際商標出願件数が前年比15%増となり、過去最高を記録しました。',
        'https://www.wipo.int/news/trademark-record.html',
        4,
        '公開'
      ],
      [
        'スタートアップ向け知財支援プログラム開始',
        '支援制度',
        'JETRO',
        '2025-08-07',
        '新興企業の知的財産戦略を支援する新たなプログラムがスタートしました。',
        'https://www.jetro.go.jp/startup-ip-support.html',
        3,
        '公開'
      ]
    ];
    
    sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
    
    console.log('サンプルデータを挿入しました');
    
  } catch (error) {
    console.error('サンプルデータ挿入エラー:', error);
  }
}

/**
 * デプロイメントの設定を確認する関数
 */
function checkDeployment() {
  console.log('デプロイメント確認:');
  console.log('1. このスクリプトをウェブアプリとしてデプロイしてください');
  console.log('2. 実行ユーザー: 自分');
  console.log('3. アクセス権限: 全員（匿名ユーザーを含む）');
  console.log('4. デプロイ後のURLをPatent Hubに設定してください');
}