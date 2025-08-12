// Patent Hub - 求人一覧ページ JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('求人一覧ページが読み込まれました');
    
    // 機能の初期化
    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeFavorites();
    initializePagination();
    
    console.log('✅ 求人一覧ページの全機能が初期化されました');
});

// グローバル変数
let allJobs = [];
let filteredJobs = [];
let currentPage = 1;
const jobsPerPage = 10;

// 検索機能の初期化
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // 検索実行
        const performSearch = () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterAndDisplayJobs();
            console.log(`検索実行: "${searchTerm}"`);
        };
        
        // 検索ボタンクリック
        searchBtn.addEventListener('click', performSearch);
        
        // Enterキーで検索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // リアルタイム検索（500ms後）
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAndDisplayJobs();
            }, 500);
        });
    }
}

// フィルター機能の初期化
function initializeFilters() {
    // 初期データの取得
    loadJobData();
    
    // チェックボックスフィルターのイベント
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`フィルター変更: ${this.name} - ${this.value} - ${this.checked}`);
            filterAndDisplayJobs();
        });
    });
    
    // 年収フィルターのイベント
    const salaryInputs = document.querySelectorAll('#salaryMin, #salaryMax');
    salaryInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(this.filterTimeout);
            this.filterTimeout = setTimeout(() => {
                filterAndDisplayJobs();
            }, 800);
        });
    });
    
    // フィルターリセット
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetAllFilters();
            filterAndDisplayJobs();
            showNotification('フィルター条件をリセットしました', 'info');
        });
    }
}

// 求人データの読み込み（実際のサイトではAPIから取得）
function loadJobData() {
    // 現在表示されている求人カードからデータを抽出
    const jobCards = document.querySelectorAll('.job-card');
    allJobs = Array.from(jobCards).map((card, index) => {
        return {
            id: card.dataset.jobId || `job_${index + 1}`,
            element: card,
            title: card.querySelector('.job-title').textContent,
            company: card.querySelector('.company-name').textContent,
            category: card.dataset.category,
            location: card.dataset.location,
            salaryMin: parseInt(card.dataset.salaryMin),
            salaryMax: parseInt(card.dataset.salaryMax),
            experience: card.dataset.experience,
            date: new Date(card.dataset.date),
            searchableText: (
                card.querySelector('.job-title').textContent + ' ' +
                card.querySelector('.company-name').textContent + ' ' +
                card.dataset.category + ' ' +
                card.dataset.location + ' ' +
                card.dataset.experience
            ).toLowerCase()
        };
    });
    
    filteredJobs = [...allJobs];
    console.log(`求人データ読み込み完了: ${allJobs.length}件`);
}

// フィルター実行と表示更新
function filterAndDisplayJobs() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const selectedCategories = getSelectedValues('category');
    const selectedLocations = getSelectedValues('location');
    const selectedExperience = getSelectedValues('experience');
    const salaryMin = parseInt(document.getElementById('salaryMin').value) || 0;
    const salaryMax = parseInt(document.getElementById('salaryMax').value) || 9999;
    
    // フィルター実行
    filteredJobs = allJobs.filter(job => {
        // 検索キーワード
        const matchesSearch = !searchTerm || job.searchableText.includes(searchTerm);
        
        // カテゴリフィルター
        const matchesCategory = selectedCategories.length === 0 || 
                               selectedCategories.includes(job.category);
        
        // 勤務地フィルター
        const matchesLocation = selectedLocations.length === 0 || 
                               selectedLocations.some(loc => job.location.includes(loc)) ||
                               (selectedLocations.includes('リモートOK') && job.location.includes('リモート'));
        
        // 経験レベルフィルター
        const matchesExperience = selectedExperience.length === 0 || 
                                 selectedExperience.includes(job.experience);
        
        // 年収フィルター
        const matchesSalary = (job.salaryMin >= salaryMin * 10) && (job.salaryMax <= salaryMax * 10);
        
        return matchesSearch && matchesCategory && matchesLocation && 
               matchesExperience && matchesSalary;
    });
    
    // ソート適用
    applySorting();
    
    // 結果表示更新
    updateJobDisplay();
    updateJobCount();
    updatePagination();
    
    console.log(`フィルター結果: ${filteredJobs.length}件`);
}

// 選択されたフィルター値を取得
function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// すべてのフィルターをリセット
function resetAllFilters() {
    // 検索入力をクリア
    document.getElementById('searchInput').value = '';
    
    // チェックボックスをクリア
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // 年収入力をクリア
    document.getElementById('salaryMin').value = '';
    document.getElementById('salaryMax').value = '';
    
    // ソートをリセット
    document.getElementById('sortSelect').value = 'newest';
    
    currentPage = 1;
}

// ソート機能の初期化
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log(`ソート変更: ${this.value}`);
            applySorting();
            updateJobDisplay();
            updatePagination();
        });
    }
}

// ソート実行
function applySorting() {
    const sortType = document.getElementById('sortSelect').value;
    
    filteredJobs.sort((a, b) => {
        switch (sortType) {
            case 'newest':
                return b.date - a.date; // 新しい順
            case 'salary':
                return b.salaryMax - a.salaryMax; // 年収の高い順
            case 'updated':
                return b.date - a.date; // 更新順（簡易実装）
            default:
                return 0;
        }
    });
}

// お気に入り機能の初期化
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const jobId = btn.dataset.jobId;
        if (jobId) {
            // 初期状態を設定
            const isFavorited = localStorage.getItem(`favorite_${jobId}`) === 'true';
            updateFavoriteButton(btn, isFavorited);
            
            // クリックイベント
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const currentState = localStorage.getItem(`favorite_${jobId}`) === 'true';
                const newState = !currentState;
                
                localStorage.setItem(`favorite_${jobId}`, newState.toString());
                updateFavoriteButton(btn, newState);
                
                showNotification(
                    newState ? 'お気に入りに追加しました' : 'お気に入りから削除しました',
                    newState ? 'success' : 'info'
                );
            });
        }
    });
}

// お気に入りボタンの表示更新
function updateFavoriteButton(button, isFavorited) {
    if (isFavorited) {
        button.innerHTML = '💖';
        button.classList.add('favorited');
        button.style.opacity = '1';
    } else {
        button.innerHTML = '❤️';
        button.classList.remove('favorited');
        button.style.opacity = '0.6';
    }
}

// 求人表示の更新
function updateJobDisplay() {
    const jobsGrid = document.getElementById('jobsGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredJobs.length === 0) {
        // 検索結果なし
        jobsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    } else {
        jobsGrid.style.display = 'grid';
        noResults.style.display = 'none';
    }
    
    // ページネーション適用
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);
    
    // すべての求人カードを非表示
    allJobs.forEach(job => {
        job.element.style.display = 'none';
    });
    
    // フィルター結果の求人カードを表示
    jobsToShow.forEach(job => {
        job.element.style.display = 'block';
    });
    
    // スクロールをトップに
    if (currentPage > 1) {
        document.querySelector('.results-header').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 求人件数の更新
function updateJobCount() {
    const jobCountElement = document.getElementById('jobCount');
    if (jobCountElement) {
        jobCountElement.textContent = filteredJobs.length;
    }
}

// ページネーション機能の初期化
function initializePagination() {
    // 検索条件クリアボタン
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            resetAllFilters();
            filterAndDisplayJobs();
            showNotification('検索条件をクリアしました', 'info');
        });
    }
    
    // ページネーションボタンのイベント（簡易実装）
    const paginationBtns = document.querySelectorAll('.pagination-btn, .pagination-number');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('prev') && currentPage > 1) {
                currentPage--;
                updateJobDisplay();
                updatePagination();
            } else if (this.classList.contains('next') && hasNextPage()) {
                currentPage++;
                updateJobDisplay();
                updatePagination();
            } else if (this.classList.contains('pagination-number')) {
                const pageNum = parseInt(this.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                    updateJobDisplay();
                    updatePagination();
                }
            }
        });
    });
}

// 次のページがあるかチェック
function hasNextPage() {
    return currentPage * jobsPerPage < filteredJobs.length;
}

// ページネーション表示の更新
function updatePagination() {
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    // 前へボタン
    const prevBtn = document.querySelector('.pagination-btn.prev');
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    // 次へボタン
    const nextBtn = document.querySelector('.pagination-btn.next');
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    // ページ番号の更新（簡易実装）
    const pageNumbers = document.querySelectorAll('.pagination-number');
    pageNumbers.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === currentPage) {
            btn.classList.add('active');
        }
    });
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

// スクロール時のパフォーマンス最適化
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(function() {
            // スクロール時の処理（必要に応じて追加）
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// デバッグ用関数
if (localStorage.getItem('patent-hub-debug') === 'true') {
    window.jobsDebug = {
        showAllJobs: () => console.log(allJobs),
        showFilteredJobs: () => console.log(filteredJobs),
        getCurrentPage: () => currentPage,
        resetFilters: () => {
            resetAllFilters();
            filterAndDisplayJobs();
        }
    };
    console.log('🔧 デバッグモード: jobsDebug オブジェクトが利用可能です');
}

console.log('🚀 Patent Hub 求人一覧ページ - 完全版が読み込まれました');