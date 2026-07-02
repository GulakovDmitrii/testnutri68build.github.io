// Бургер-меню
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

if (window.location.pathname.includes('services')) {
    
    document.addEventListener('DOMContentLoaded', () => {
    const serviceButtons = document.querySelectorAll('.service-card .btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Вы выбрали услугу! Скоро с вами свяжется наш специалист.');
        });
    });
});

    document.addEventListener('DOMContentLoaded', () => {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.02)';
            });
        });
    });
}
burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Анимация бургер-иконки
    burger.classList.toggle('active');
});

// Выпадающее меню на мобильных
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        // Только на мобильных устройствах
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.burger')) {
        navMenu.classList.remove('active');
        burger.classList.remove('active');
        dropdowns.forEach(d => d.classList.remove('active'));
    }
});

// Закрытие меню при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        burger.classList.remove('active');
        dropdowns.forEach(d => d.classList.remove('active'));
    }
});

// Элементы плавающей кнопки чата
const chatBtn = document.getElementById('chatBtn');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');

// Открытие всплывающего меню
chatBtn.addEventListener('click', () => {
    chatPopup.classList.toggle('active');
});

// Закрытие всплывающего меню кнопкой «×»
closeChat.addEventListener('click', () => {
    chatPopup.classList.remove('active');
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.chat-floating-btn') &&
        !e.target.closest('.chat-popup') &&
        chatPopup.classList.contains('active')) {
        chatPopup.classList.remove('active');
    }
});

// Закрытие меню по клавише Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatPopup.classList.contains('active')) {
        chatPopup.classList.remove('active');
    }
});

// Элементы кнопки "Наверх"
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Показ/скрытие кнопки при скролле
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

// Плавный скролл наверх при клике
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Дополнительно: скрытие кнопки при загрузке страницы, если пользователь уже наверху
document.addEventListener('DOMContentLoaded', () => {
    if (window.pageYOffset <= 300) {
        scrollTopBtn.classList.remove('active');
    }
});

// Элементы галереи
const galleryTrack = document.getElementById('galleryTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicatorsContainer');

// Переменные для управления галереей
let currentIndex = 0;
const items = document.querySelectorAll('.gallery-item');
const totalItems = items.length;

// Создаём индикаторы
function createIndicators() {
    indicatorsContainer.innerHTML = '';
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
}

// Переход к слайду
function goToSlide(index) {
    if (index < 0) index = totalItems - 1;
    if (index >= totalItems) index = 0;
    
    currentIndex = index;
    galleryTrack.style.transform = `translateX(-${index * (320)}px)`; // 300px + 20px gap
    
    // Обновляем индикаторы
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

// Следующий слайд
function nextSlide() {
    goToSlide(currentIndex + 1);
}

// Предыдущий слайд
function prevSlide() {
    goToSlide(currentIndex - 1);
}

// Плавный скролл при колесе мыши
galleryTrack.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
});

// Обработчики событий
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Инициализация
createIndicators();

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.header-container');
    const body = document.body;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    // Точка, после которой фиксируем (обычно это высота хедера)
    const scrollThreshold = headerHeight; 

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY || window.pageYOffset;

        if (pageYOffset >= 300) {
            container.classList.add('is-fixed');
        } else {
            container.classList.remove('is-fixed');
        }
    });
});


// Элементы кнопки "На главную"
const backToHomeBtn = document.getElementById('backToHomeBtn');

// Показ/скрытие кнопки при скролле
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToHomeBtn.style.display = 'block';
    } else {
        backToHomeBtn.style.display = 'none';
    }
});

// Переход на главную при клике
backToHomeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});




// Дополнительно: автоматическая прокрутка каждые 5 секунд (опционально)
// let autoSlide = setInterval(nextSlide, 5000);

// Останавливаем автопрокрутку при наведении
// galleryTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
// galleryTrack.addEventListener('mouseleave', () => {
//     autoSlide = setInterval(nextSlide, 5000);
// });