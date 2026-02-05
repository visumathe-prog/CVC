document.addEventListener('deviceready', function() {
    navigator.splashscreen.hide();
}, false);

// Сохранение выбранного языка
let currentLanguage = localStorage.getItem('opencv-learn-lang') || 'en';

// Функция для отметки пройденного урока
function markLessonComplete(lessonNumber) {
    const completed = JSON.parse(localStorage.getItem('opencv-learn-completed') || '[]');
    
    if (!completed.includes(lessonNumber)) {
        completed.push(lessonNumber);
        localStorage.setItem('opencv-learn-completed', JSON.stringify(completed));
        
        // Показываем прогресс в консоли для отладки
        console.log(`✅ Lesson ${lessonNumber} marked as complete!`);
        console.log(`📊 Progress: ${completed.length}/14 lessons (${Math.round((completed.length/14)*100)}%)`);
        
        // Обновляем прогресс на главной странице если она открыта
        updateProgressOnMainPage(completed.length);
    }
}

// Функция для обновления прогресса на главной странице
function updateProgressOnMainPage(completedCount) {
    const progressElement = document.getElementById('progress-count');
    const progressBar = document.querySelector('.progress-fill');
    
    if (progressElement) {
        progressElement.textContent = `${completedCount}/14`;
    }
    
    if (progressBar) {
        const progressPercent = (completedCount / 14) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
}

// Функция для проверки прогресса при загрузке страницы
function checkProgressOnLoad() {
    const completed = JSON.parse(localStorage.getItem('opencv-learn-completed') || '[]');
    console.log(`📈 Current progress: ${completed.length}/14 lessons completed`);
    
    // Обновляем отображение прогресса если на главной странице
    updateProgressOnMainPage(completed.length);
    
    return completed.length;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Установка активного языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });
    
    // Загрузка текста на выбранном языке
    loadLanguage(currentLanguage);
    
    // Обработка кнопки согласия
    const agreeBtn = document.getElementById('agree-btn');
    if (agreeBtn) {
        agreeBtn.addEventListener('click', function() {
            localStorage.setItem('opencv-learn-consent', 'true');
            localStorage.setItem('opencv-learn-lang', currentLanguage);
            window.location.href = 'main.html';
        });
    }
    
    // Проверка согласия для других страниц
    if (!window.location.href.includes('index.html')) {
        const consent = localStorage.getItem('opencv-learn-consent');
        if (!consent) {
            window.location.href = 'index.html';
        }
    }
    
    // Проверяем прогресс при загрузке
    checkProgressOnLoad();
});

// Установка языка
function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    loadLanguage(lang);
}

// Загрузка текста на выбранном языке
function loadLanguage(lang) {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
        const key = element.id;
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}
