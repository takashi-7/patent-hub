/**
 * Patent Hub ニュース管理システム
 * Googleスプレッドシートからニュースデータを読み込んで表示
 * 
 * 仕組み：
 * - Googleスプレッドシートに手動でニュースを入力
 * - Google Apps Script (GAS) でJSONとして公開
 * - 定期的にJSONを取得してニュース表示を更新
 * - 完全に手動管理で、スクレイピング不要
 */

class PatentNewsManager {
    constructor() {
        // Googleスプレッドシートの設定
        this.spreadsheetConfig = {
            // 実際の運用では、Google Apps Scriptで作成したWebアプリのURLを設定
            // 例: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
            webAppUrl: null, // 実際のGASのWebアプリURLに置き換え
            
            // デモ用のサンプルスプレッドシートURL（実際は存在しない）
            demoMode: true,
            
            // スプレッドシートの列構成
            columns: {
                title: 'A',      // ニュースタイトル
                category: 'B',   // カテゴリ（特許、商標など）
                source: 'C',     // 情報源
                date: 'D',       // 公開日
                summary: 'E',    // 要約
                url: 'F',        // 元記事URL
                priority: 'G',   // 重要度（1-5）
                status: 'H'      // 公開状態（公開/非公開）
            }
        };
        
        this.newsCache = [];
        this.lastUpdate = null;
        this.updateInterval = 10 * 60 * 1000; // 10分間隔（スプレッドシート読み込みなので頻度を上げる）
    }
    
    /**
     * ニュース自動更新を開始
     */
    startNewsCollection() {
        console.log('🔄 ニュース自動更新を開始します...');
        
        // 初回実行
        this.loadNewsFromSpreadsheet();
        
        // 定期実行を設定
        setInterval(() => {
            this.loadNewsFromSpreadsheet();
        }, this.updateInterval);
        
        console.log(`✅ ニュース自動更新が開始されました (${this.updateInterval / 60000}分間隔)`);
    }
    
    /**
     * スプレッドシートからニュースを読み込み
     */
    async loadNewsFromSpreadsheet() {
        console.log('📊 スプレッドシートからニュースを読み込み中...');
        
        try {
            let newsData;
            
            if (this.spreadsheetConfig.demoMode) {
                // デモモード：サンプルデータを生成
                newsData = this.generateSampleNewsData();
                console.log('📝 デモモード: サンプルニュースデータを生成しました');
            } else {
                // 実際のスプレッドシートから取得
                newsData = await this.fetchSpreadsheetData();
                console.log('📡 スプレッドシートからデータを取得しました');
            }
            
            // データを処理してキャッシュに保存
            const processedNews = this.processSpreadsheetNews(newsData);
            
            // キャッシュを更新（完全置き換え）
            this.newsCache = processedNews;
            
            // DOM更新
            this.updateNewsDisplay();
            
            this.lastUpdate = new Date();
            console.log(`🎉 ニュース更新完了: ${processedNews.length}件のニュース`);
            
            // システム管理者への通知
            this.notifyNewsUpdate(processedNews.length);
            
        } catch (error) {
            console.error('❌ スプレッドシート読み込みエラー:', error);
            this.notifyNewsUpdate(0, 'error');
        }
    }
    
    /**
     * 実際のスプレッドシートからデータを取得
     */
    async fetchSpreadsheetData() {
        if (!this.spreadsheetConfig.webAppUrl) {
            throw new Error('スプレッドシートのWebアプリURLが設定されていません');
        }
        
        try {
            const response = await fetch(this.spreadsheetConfig.webAppUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('スプレッドシートデータ取得エラー:', error);
            throw error;
        }
    }
    
    /**
     * サンプルニュースデータを生成（デモ用）
     */
    generateSampleNewsData() {
        return [
            {
                title: '特許庁、AI関連特許の審査基準を改訂',
                category: '特許',
                source: '特許庁',
                date: '2025-08-09',
                summary: 'AIの技術進歩に対応し、特許審査基準の明確化を図る改訂が行われました。',
                url: 'https://www.jpo.go.jp/news/ai-patent-guidelines.html',
                priority: 5,
                status: '公開'
            },
            {
                title: '国際商標出願件数が過去最高を記録',
                category: '商標',
                source: 'WIPO',
                date: '2025-08-08',
                summary: '2024年の国際商標出願件数が前年比15%増となり、過去最高を記録しました。',
                url: 'https://www.wipo.int/news/trademark-record.html',
                priority: 4,
                status: '公開'
            },
            {
                title: 'スタートアップ向け知財支援プログラム開始',
                category: '支援制度',
                source: 'JETRO',
                date: '2025-08-07',
                summary: '新興企業の知的財産戦略を支援する新たなプログラムがスタートしました。',
                url: 'https://www.jetro.go.jp/startup-ip-support.html',
                priority: 3,
                status: '公開'
            },
            {
                title: '意匠権の保護期間延長について議論開始',
                category: '意匠',
                source: '特許庁',
                date: '2025-08-06',
                summary: '国際的な動向を踏まえ、意匠権の保護期間延長に関する検討が始まりました。',
                url: 'https://www.jpo.go.jp/news/design-protection.html',
                priority: 3,
                status: '公開'
            },
            {
                title: 'グローバル特許データベースの機能拡充',
                category: 'データベース',
                source: 'WIPO',
                date: '2025-08-05',
                summary: 'WIPO Global Brandデータベースに新機能が追加され、検索性が向上しました。',
                url: 'https://www.wipo.int/database-update.html',
                priority: 2,
                status: '公開'
            }
        ];
    }
    
    /**
     * スプレッドシートデータを処理してニュース形式に変換
     */
    processSpreadsheetNews(rawData) {
        const processedNews = [];
        
        // rawDataがスプレッドシートからの生データの場合
        for (const row of rawData) {
            // 公開状態のニュースのみを処理
            if (row.status !== '公開') continue;
            
            const newsItem = {
                id: `spreadsheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: row.title || '',
                category: row.category || '一般',
                source: row.source || 'Patent Hub',
                publishTime: new Date(row.date || new Date()),
                summary: row.summary || '',
                url: row.url || '#',
                priority: parseInt(row.priority) || 3,
                tags: [row.category, '知財ニュース']
            };
            
            // 基本的なバリデーション
            if (newsItem.title && newsItem.title.length >= 5) {
                processedNews.push(newsItem);
            }
        }
        
        // 優先度と日付でソート
        processedNews.sort((a, b) => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority; // 優先度の高い順
            }
            return b.publishTime - a.publishTime; // 新しい順
        });
        
        return processedNews;
    }
    
    /**
     * スプレッドシート設定を更新
     */
    updateSpreadsheetConfig(webAppUrl) {
        this.spreadsheetConfig.webAppUrl = webAppUrl;
        this.spreadsheetConfig.demoMode = false;
        console.log('📊 スプレッドシート設定を更新しました:', webAppUrl);
    }
    
    /**
     * デモモードの切り替え
     */
    setDemoMode(enabled) {
        this.spreadsheetConfig.demoMode = enabled;
        console.log(`📝 デモモード: ${enabled ? 'ON' : 'OFF'}`);
    }
    
    /**
     * ニュースキャッシュに追加
     */
    addNewsToCache(articles) {
        // 新しい記事をキャッシュの先頭に追加
        this.newsCache.unshift(...articles);
        
        // 最新100件のみ保持
        this.newsCache = this.newsCache.slice(0, 100);
        
        // ローカルストレージに保存
        try {
            localStorage.setItem('patent_hub_news_cache', JSON.stringify({
                articles: this.newsCache.slice(0, 50), // 50件まで保存
                lastUpdate: this.lastUpdate
            }));
        } catch (error) {
            console.warn('ニュースキャッシュの保存に失敗:', error);
        }
    }
    
    /**
     * ニュース表示の更新
     */
    updateNewsDisplay() {
        // ホームページのニュースセクションを更新
        this.updateHomePageNews();
        
        // ニュース管理画面があれば更新
        this.updateNewsManagementDisplay();
    }
    
    /**
     * ホームページのニュース表示更新
     */
    updateHomePageNews() {
        const newsContainers = [
            document.getElementById('latestnews-list'),
            document.getElementById('important-news-list'),
            document.getElementById('industry-news-list')
        ];
        
        newsContainers.forEach((container, index) => {
            if (!container) return;
            
            const startIndex = index * 3;
            const newsItems = this.newsCache.slice(startIndex, startIndex + 3);
            
            container.innerHTML = newsItems.map(article => `
                <div class="news-item">
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-time">${this.formatTime(article.publishTime)}</span>
                        <span class="news-category">${article.category}</span>
                    </div>
                    <h3 class="news-title">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </h3>
                    <p class="news-summary">${article.summary}</p>
                </div>
            `).join('');
        });
        
        // 更新時刻を表示
        this.updateLastUpdateTime();
    }
    
    /**
     * ニュース管理画面の表示更新
     */
    updateNewsManagementDisplay() {
        const managementContainer = document.getElementById('news-management-list');
        if (!managementContainer) return;
        
        // システム管理者向けのより詳細な表示
        managementContainer.innerHTML = this.newsCache.slice(0, 20).map(article => `
            <div class="news-management-item">
                <div class="news-header">
                    <h4>${article.title}</h4>
                    <div class="news-controls">
                        <span class="priority-badge priority-${article.priority}">優先度${article.priority}</span>
                        <button onclick="newsManager.toggleArticleVisibility('${article.id}')">表示/非表示</button>
                        <button onclick="newsManager.editArticle('${article.id}')">編集</button>
                    </div>
                </div>
                <div class="news-details">
                    <span class="news-source">${article.source}</span>
                    <span class="news-time">${this.formatTime(article.publishTime)}</span>
                    <span class="news-category">${article.category}</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 最終更新時刻の表示更新
     */
    updateLastUpdateTime() {
        const updateTimeElements = document.querySelectorAll('.news-last-update');
        const timeString = this.lastUpdate ? this.formatTime(this.lastUpdate) : '未取得';
        
        updateTimeElements.forEach(element => {
            element.textContent = `最終更新: ${timeString}`;
        });
    }
    
    /**
     * 時刻フォーマット
     */
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 1分未満
            return '1分前';
        } else if (diff < 3600000) { // 1時間未満
            return `${Math.floor(diff / 60000)}分前`;
        } else if (diff < 86400000) { // 24時間未満
            return `${Math.floor(diff / 3600000)}時間前`;
        } else {
            return date.toLocaleDateString('ja-JP', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    /**
     * システム管理者への更新通知
     */
    notifyNewsUpdate(count) {
        if (count > 0) {
            // システム管理者がログイン中の場合の通知
            const adminSession = localStorage.getItem('system_admin_session');
            if (adminSession) {
                console.log(`📬 システム管理者通知: ${count}件の新しいニュースを取得しました`);
                
                // 実際のシステムでは管理者画面に通知を表示
                if (typeof showSystemNotification === 'function') {
                    showSystemNotification(`${count}件の新しいニュースを自動取得しました`, 'info');
                }
            }
        }
    }
    
    /**
     * 手動でニュース更新を実行
     */
    manualRefresh() {
        console.log('🔄 手動ニュース更新を実行...');
        this.loadNewsFromSpreadsheet();
    }
    
    /**
     * 特定カテゴリのニュースを取得
     */
    getNewsByCategory(category) {
        return this.newsCache.filter(article => 
            article.category === category || 
            article.tags.includes(category)
        );
    }
    
    /**
     * キーワード検索
     */
    searchNews(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.newsCache.filter(article => 
            article.title.toLowerCase().includes(lowerKeyword) ||
            article.summary.toLowerCase().includes(lowerKeyword)
        );
    }
    
    /**
     * ニュースソースの有効/無効切り替え
     */
    toggleNewsSource(sourceKey) {
        if (this.newsSources[sourceKey]) {
            this.newsSources[sourceKey].enabled = !this.newsSources[sourceKey].enabled;
            console.log(`${this.newsSources[sourceKey].name}: ${this.newsSources[sourceKey].enabled ? '有効' : '無効'}`);
        }
    }
    
    /**
     * 統計情報を取得
     */
    getStatistics() {
        const stats = {
            totalArticles: this.newsCache.length,
            lastUpdate: this.lastUpdate,
            sourceBreakdown: {},
            categoryBreakdown: {},
            recentActivity: this.newsCache.slice(0, 10).length
        };
        
        // ソース別統計
        for (const article of this.newsCache) {
            stats.sourceBreakdown[article.source] = (stats.sourceBreakdown[article.source] || 0) + 1;
            stats.categoryBreakdown[article.category] = (stats.categoryBreakdown[article.category] || 0) + 1;
        }
        
        return stats;
    }
}

// グローバルインスタンスを作成
const patentNewsScaper = new PatentNewsManager();

// ページロード時に自動開始
document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからキャッシュを復元
    const cachedData = localStorage.getItem('patent_hub_news_cache');
    if (cachedData) {
        try {
            const { articles, lastUpdate } = JSON.parse(cachedData);
            patentNewsScaper.newsCache = articles || [];
            patentNewsScaper.lastUpdate = lastUpdate ? new Date(lastUpdate) : null;
            console.log(`📰 キャッシュから${articles.length}件のニュースを復元しました`);
        } catch (error) {
            console.warn('ニュースキャッシュの復元に失敗:', error);
        }
    }
    
    // ニュース自動収集を開始
    patentNewsScaper.startNewsCollection();
});

// エクスポート（ES6モジュール使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatentNewsManager;
}

console.log('📰 Patent Hub ニュース自動収集システムが読み込まれました');