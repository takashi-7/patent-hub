// Patent Hub - 企業詳細ページ JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('企業詳細ページが読み込まれました');
    
    // 機能の初期化
    initializeTabSwitching();
    initializeFavoriteCompanyFeature();
    initializeFollowFeature();
    initializeShareFeature();
    initializeQuickApply();
    
    console.log('✅ 企業詳細ページの全機能が初期化されました');
});

// タブ切り替え機能（求人詳細ページと同様）
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

// お気に入り企業機能
function initializeFavoriteCompanyFeature() {
    const favoriteBtn = document.getElementById('favoriteCompanyBtn');
    
    if (favoriteBtn) {
        // ローカルストレージから状態を読み込み
        const companyId = 'COMPANY_ABC'; // 実際にはページのURLやデータから取得
        const isFavorited = localStorage.getItem(`favorite_company_${companyId}`) === 'true';
        
        // 初期状態を設定
        updateFavoriteCompanyButton(favoriteBtn, isFavorited);
        
        favoriteBtn.addEventListener('click', function() {
            const currentState = localStorage.getItem(`favorite_company_${companyId}`) === 'true';
            const newState = !currentState;
            
            // ローカルストレージに保存
            localStorage.setItem(`favorite_company_${companyId}`, newState.toString());
            
            // ボタンの表示を更新
            updateFavoriteCompanyButton(favoriteBtn, newState);
            
            // 通知表示
            showNotification(
                newState ? 'お気に入り企業に追加しました' : 'お気に入り企業から削除しました',
                newState ? 'success' : 'info'
            );
            
            console.log(`お気に入り企業状態変更: ${newState}`);
        });
    }
}

// お気に入り企業ボタンの表示更新
function updateFavoriteCompanyButton(button, isFavorited) {
    if (isFavorited) {
        button.innerHTML = '💖 お気に入り済み';
        button.style.background = '#e74c3c';
        button.style.borderColor = '#e74c3c';
        button.style.color = 'white';
    } else {
        button.innerHTML = '❤️ お気に入り企業';
        button.style.background = 'white';
        button.style.borderColor = '#1e3c72';
        button.style.color = '#1e3c72';
    }
}

// 求人通知フォロー機能
function initializeFollowFeature() {
    const followBtn = document.getElementById('followCompanyBtn');
    
    if (followBtn) {
        const companyId = 'COMPANY_ABC';
        const isFollowing = localStorage.getItem(`follow_company_${companyId}`) === 'true';
        
        // 初期状態を設定
        updateFollowButton(followBtn, isFollowing);
        
        followBtn.addEventListener('click', function() {
            const currentState = localStorage.getItem(`follow_company_${companyId}`) === 'true';
            const newState = !currentState;
            
            localStorage.setItem(`follow_company_${companyId}`, newState.toString());
            updateFollowButton(followBtn, newState);
            
            showNotification(
                newState ? '求人通知を有効にしました' : '求人通知を無効にしました',
                newState ? 'success' : 'info'
            );
            
            console.log(`企業フォロー状態変更: ${newState}`);
        });
    }
}

// フォローボタンの表示更新
function updateFollowButton(button, isFollowing) {
    if (isFollowing) {
        button.innerHTML = '🔔 通知中';
        button.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
    } else {
        button.innerHTML = '🔔 求人通知を受け取る';
        button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    }
}

// シェア機能
function initializeShareFeature() {
    const shareBtn = document.getElementById('shareCompanyBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Web Share API が利用可能かチェック
            if (navigator.share) {
                navigator.share({
                    title: '特許事務所ABC - 企業情報 | Patent Hub',
                    text: '機械・電気分野のスペシャリスト集団、特許事務所ABCの詳細情報をチェック！',
                    url: window.location.href
                }).then(() => {
                    console.log('企業シェア成功');
                }).catch((error) => {
                    console.log('企業シェアキャンセル:', error);
                    fallbackShareCompany();
                });
            } else {
                // フォールバック機能
                fallbackShareCompany();
            }
        });
    }
}

// シェア機能のフォールバック
function fallbackShareCompany() {
    // URLをクリップボードにコピー
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('企業ページURLをクリップボードにコピーしました', 'success');
    }).catch(() => {
        // さらなるフォールバック
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('企業ページURLをクリップボードにコピーしました', 'success');
    });
}

// 簡単応募機能
function initializeQuickApply() {
    const quickApplyBtns = document.querySelectorAll('.quick-apply-btn');
    
    quickApplyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobCard = this.closest('.company-job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            
            // 簡易応募モーダル表示（実装例）
            showQuickApplyModal(jobTitle);
        });
    });
}

// 簡単応募モーダル表示
function showQuickApplyModal(jobTitle) {
    // モーダル要素の作成
    const modal = document.createElement('div');
    modal.className = 'quick-apply-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeQuickApplyModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>🚀 簡単応募</h3>
                <button class="modal-close" onclick="closeQuickApplyModal()">×</button>
            </div>
            <div class="modal-body">
                <h4>${jobTitle}</h4>
                <p>特許事務所ABC</p>
                <div class="apply-form">
                    <input type="text" placeholder="お名前" class="form-input">
                    <input type="email" placeholder="メールアドレス" class="form-input">
                    <textarea placeholder="簡単な志望動機をお聞かせください" class="form-textarea"></textarea>
                    <div class="form-actions">
                        <button class="cancel-btn" onclick="closeQuickApplyModal()">キャンセル</button>
                        <button class="submit-btn" onclick="submitQuickApply()">応募する</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // スタイル設定
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // フェードイン
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    console.log(`簡単応募モーダル表示: ${jobTitle}`);
}

// モーダルを閉じる
function closeQuickApplyModal() {
    const modal = document.querySelector('.quick-apply-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// 簡単応募送信
function submitQuickApply() {
    const modal = document.querySelector('.quick-apply-modal');
    const inputs = modal.querySelectorAll('.form-input, .form-textarea');
    
    // 簡単な入力チェック
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#ced4da';
        }
    });
    
    if (isValid) {
        closeQuickApplyModal();
        showNotification('応募を受け付けました。企業からの連絡をお待ちください。', 'success');
        console.log('簡単応募送信完了');
    } else {
        showNotification('すべての項目を入力してください', 'error');
    }
}

// 通知表示機能（求人詳細ページと同様）
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
    
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
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
    const animationTargets = document.querySelectorAll('.company-detail-tabs, .business-info-card, .company-job-card, .culture-card');
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

// 企業詳細ページ特有のCSS追加
const additionalCSS = `
.quick-apply-modal .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}

.quick-apply-modal .modal-content {
    background: white;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    z-index: 10001;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.quick-apply-modal .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.quick-apply-modal .modal-header h3 {
    margin: 0;
    color: #1e3c72;
}

.quick-apply-modal .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.quick-apply-modal .modal-close:hover {
    background: #f8f9fa;
    color: #495057;
}

.quick-apply-modal .modal-body {
    padding: 2rem 1.5rem;
}

.quick-apply-modal .modal-body h4 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.quick-apply-modal .modal-body p {
    color: #6c757d;
    margin-bottom: 1.5rem;
}

.quick-apply-modal .apply-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.quick-apply-modal .form-input,
.quick-apply-modal .form-textarea {
    padding: 0.75rem;
    border: 2px solid #ced4da;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.quick-apply-modal .form-input:focus,
.quick-apply-modal .form-textarea:focus {
    outline: none;
    border-color: #1e3c72;
}

.quick-apply-modal .form-textarea {
    min-height: 100px;
    resize: vertical;
}

.quick-apply-modal .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.quick-apply-modal .cancel-btn,
.quick-apply-modal .submit-btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.quick-apply-modal .cancel-btn {
    background: #6c757d;
    color: white;
}

.quick-apply-modal .cancel-btn:hover {
    background: #5a6268;
}

.quick-apply-modal .submit-btn {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
}

.quick-apply-modal .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(30, 60, 114, 0.4);
}
`;

// CSS を動的に追加
const styleElement = document.createElement('style');
styleElement.textContent = additionalCSS;
document.head.appendChild(styleElement);

// パフォーマンス監視
console.log('🏢 Patent Hub 企業詳細ページ - 完全版が読み込まれました');

// 開発用デバッグ機能
if (localStorage.getItem('patent-hub-debug') === 'true') {
    console.log('🔧 デバッグモード: 有効');
    
    // デバッグ情報表示
    window.companyDebug = {
        favoriteStatus: () => localStorage.getItem('favorite_company_COMPANY_ABC'),
        followStatus: () => localStorage.getItem('follow_company_COMPANY_ABC'),
        clearCompanyData: () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('favorite_company_') || key.startsWith('follow_company_')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('企業関連データをクリアしました');
        },
        showQuickApply: () => showQuickApplyModal('テスト求人')
    };
}