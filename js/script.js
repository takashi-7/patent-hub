// Patent Hub JavaScript

// ページ読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('Patent Hub プロトタイプが読み込まれました！');
    
    // スムーズスクロール機能
    setupSmoothScroll();
    
    // 簡単な対話機能
    setupInteractiveElements();
    
    console.log('🚀 Patent Hub - 知財業界の情報プラットフォーム');
});

// スムーズスクロール設定
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 対話的な要素の設定
function setupInteractiveElements() {
    // ニュース項目のクリックイベント
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('ニュース項目がクリックされました:', this.querySelector('h3').textContent);
        });
    });
    
    // 求人項目のクリックイベント
    const jobItems = document.querySelectorAll('.job-item');
    jobItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('求人項目がクリックされました:', this.querySelector('h3').textContent);
        });
    });
    
    // セミナー項目のクリックイベント
    const seminarItems = document.querySelectorAll('.seminar-item');
    seminarItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('セミナー項目がクリックされました:', this.querySelector('h3').textContent);
        });
    });
    
    // 申込ボタンのクリックイベント（.apply-btnのみに制限し、.register-btnは除外）
    const applyBtns = document.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('実際のサイトでは詳細ページまたは申込フォームが開きます！');
        });
    });
    
    // 「もっと見る」ボタンのクリックイベント（プロトタイプ版では無効化）
    // const viewMoreBtns = document.querySelectorAll('.view-more');
    // viewMoreBtns.forEach(btn => {
    //     btn.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         alert('実際のサイトでは一覧ページが開きます！');
    //     });
    // });
}

// 将来的に追加予定の機能用の関数

// ニュース検索機能（将来実装予定）
function searchNews(query) {
    console.log('ニュース検索:', query);
    // 将来的にはAPIからデータを取得
}

// 求人フィルター機能（将来実装予定）
function filterJobs(criteria) {
    console.log('求人フィルター:', criteria);
    // 将来的にはフィルター処理を実装
}

// お気に入り機能（将来実装予定）
function addToFavorites(itemType, itemId) {
    console.log('お気に入りに追加:', itemType, itemId);
    // 将来的にはローカルストレージやDBに保存
}

// 通知機能（将来実装予定）
function showNotification(message, type = 'info') {
    console.log('通知:', message, type);
    // 将来的にはブラウザ通知APIを使用
}

console.log('✅ Patent Hub JavaScript 読み込み完了');