// Patent Hub - 求人詳細ページ JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('求人詳細ページが読み込まれました');
    
    // 機能の初期化
    initializeContactToggle();
    initializeTabSwitching();
    initializeFavoriteFeature();
    initializeShareFeature();
    initializeCopyFeature();
    
    console.log('✅ 求人詳細ページの全機能が初期化されました');
});

// 連絡先情報の表示・非表示
function initializeContactToggle() {
    const showContactBtn = document.getElementById('showContactBtn');
    const contactInfo = document.getElementById('contactInfo');
    
    if (showContactBtn && contactInfo) {
        showContactBtn.addEventListener('click', function() {
            if (contactInfo.style.display === 'none' || !contactInfo.style.display) {
                // 連絡先情報を表示
                contactInfo.style.display = 'block';
                contactInfo.style.opacity = '0';
                
                // フェードインアニメーション
                setTimeout(() => {
                    contactInfo.style.transition = 'opacity 0.5s ease-in-out';
                    contactInfo.style.opacity = '1';
                }, 10);
                
                // ボタンテキスト変更
                showContactBtn.innerHTML = '📧 連絡先を非表示';
                showContactBtn.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
                
                // スクロールして連絡先まで移動
                setTimeout(() => {
                    contactInfo.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 100);
                
            } else {
                // 連絡先情報を非表示
                contactInfo.style.transition = 'opacity 0.3s ease-in-out';
                contactInfo.style.opacity = '0';
                
                setTimeout(() => {
                    contactInfo.style.display = 'none';
                }, 300);
                
                // ボタンテキスト変更
                showContactBtn.innerHTML = '📧 応募する';
                showContactBtn.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
            }
        });
    }
}

// タブ切り替え機能
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 現在アクティブなパネルをフェードアウト
            const currentActivePane = document.querySelector('.tab-pane.active');
            if (currentActivePane) {
                currentActivePane.style.opacity = '0';
                setTimeout(() => {
                    currentActivePane.classList.remove('active');
                }, 150);
            }
            
            // すべてのタブボタンをリセット
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 選択されたタブボタンをアクティブに
            this.classList.add('active');
            
            // 新しいタブパネルをフェードイン
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                setTimeout(() => {
                    targetPane.classList.add('active');
                    // CSSトランジションを再トリガー
                    targetPane.offsetHeight; // reflow をトリガー
                    targetPane.style.opacity = '1';
                }, 150);
            }
            
            console.log(`タブ切り替え: ${targetTab}`);
        });
    });
}

// お気に入り機能
function initializeFavoriteFeature() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    if (favoriteBtn) {
        // ローカルストレージから状態を読み込み
        const jobId = 'PH001'; // 実際にはページのURLやデータから取得
        const isFavorited = localStorage.getItem(`favorite_${jobId}`) === 'true';
        
        // 初期状態を設定
        updateFavoriteButton(favoriteBtn, isFavorited);
        
        favoriteBtn.addEventListener('click', function() {
            const currentState = localStorage.getItem(`favorite_${jobId}`) === 'true';
            const newState = !currentState;
            
            // ローカルストレージに保存
            localStorage.setItem(`favorite_${jobId}`, newState.toString());
            
            // ボタンの表示を更新
            updateFavoriteButton(favoriteBtn, newState);
            
            // 通知表示
            showNotification(
                newState ? 'お気に入りに追加しました' : 'お気に入りから削除しました',
                newState ? 'success' : 'info'
            );
            
            console.log(`お気に入り状態変更: ${newState}`);
        });
    }
}

// お気に入りボタンの表示更新
function updateFavoriteButton(button, isFavorited) {
    if (isFavorited) {
        button.innerHTML = '💖 お気に入り済み';
        button.style.background = '#e74c3c';
        button.style.borderColor = '#e74c3c';
        button.style.color = 'white';
    } else {
        button.innerHTML = '❤️ お気に入り';
        button.style.background = 'white';
        button.style.borderColor = '#1e3c72';
        button.style.color = '#1e3c72';
    }
}

// シェア機能
function initializeShareFeature() {
    const shareBtn = document.getElementById('shareBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Web Share API が利用可能かチェック
            if (navigator.share) {
                navigator.share({
                    title: '特許技術者（機械・電気） - 特許事務所ABC | Patent Hub',
                    text: '年収500-800万円、東京都港区勤務の求人情報',
                    url: window.location.href
                }).then(() => {
                    console.log('シェア成功');
                }).catch((error) => {
                    console.log('シェアキャンセル:', error);
                    fallbackShare();
                });
            } else {
                // フォールバック機能
                fallbackShare();
            }
        });
    }
}

// シェア機能のフォールバック
function fallbackShare() {
    // URLをクリップボードにコピー
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('求人URLをクリップボードにコピーしました', 'success');
    }).catch(() => {
        // さらなるフォールバック
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('求人URLをクリップボードにコピーしました', 'success');
    });
}

// メールアドレスコピー機能
function initializeCopyFeature() {
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailAddress = document.getElementById('emailAddress');
    
    if (copyEmailBtn && emailAddress) {
        copyEmailBtn.addEventListener('click', function() {
            const email = emailAddress.textContent;
            
            navigator.clipboard.writeText(email).then(() => {
                // ボタンの表示を一時的に変更
                const originalText = copyEmailBtn.textContent;
                copyEmailBtn.textContent = 'コピー完了!';
                copyEmailBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    copyEmailBtn.textContent = originalText;
                    copyEmailBtn.style.background = '#28a745';
                }, 2000);
                
                showNotification('メールアドレスをコピーしました', 'success');
                console.log(`メールアドレスコピー: ${email}`);
            }).catch(() => {
                showNotification('コピーに失敗しました', 'error');
            });
        });
    }
}

// 通知表示機能
function showNotification(message, type = 'info') {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // スタイル設定
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // タイプ別の色設定
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    
    // DOMに追加
    document.body.appendChild(notification);
    
    // フェードイン
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // 3秒後にフェードアウト
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 関連求人カードのクリック処理
document.addEventListener('click', function(event) {
    const relatedJobCard = event.target.closest('.related-job-card');
    if (relatedJobCard) {
        console.log('関連求人カードクリック:', relatedJobCard.querySelector('h4').textContent);
        // 実際のサイトでは該当の求人詳細ページに遷移
        showNotification('実際のサイトでは求人詳細ページが開きます', 'info');
    }
});

// スクロール時の表示効果
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 監視対象の要素を設定
    const animationTargets = document.querySelectorAll('.job-detail-tabs, .company-section, .related-jobs');
    animationTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(30px)';
        target.style.transition = 'all 0.6s ease-out';
        observer.observe(target);
    });
}

// ページロード完了後にスクロール効果を初期化
window.addEventListener('load', function() {
    initializeScrollEffects();
});

// パフォーマンス監視
console.log('🚀 Patent Hub 求人詳細ページ - 高機能版が読み込まれました');

// 開発用デバッグ機能
if (localStorage.getItem('patent-hub-debug') === 'true') {
    console.log('🔧 デバッグモード: 有効');
    
    // デバッグ情報表示
    window.debugInfo = {
        favoriteStatus: () => localStorage.getItem('favorite_PH001'),
        clearFavorites: () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('favorite_')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('お気に入りデータをクリアしました');
        }
    };
}