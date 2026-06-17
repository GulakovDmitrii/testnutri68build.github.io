document.addEventListener('DOMContentLoaded', function() {
    let hasDeviceOrientation = false;
    let calibration = { beta: 0, gamma: 0 };
    let isCalibrated = false;

    // Функция калибровки (первый наклон = нейтральное положение)
    function calibrate(event) {
        if (!isCalibrated) {
            calibration = {
                beta: event.beta || 0,
                gamma: event.gamma || 0
            };
            isCalibrated = true;
        }
    }

    // Обработка наклона устройства
    function handleDeviceOrientation(event) {
        calibrate(event);

        const beta = (event.beta || 0) - calibration.beta; // Наклон вперёд/назад
        const gamma = (event.gamma || 0) - calibration.gamma; // Наклон влево/вправо

        // Ограничиваем диапазон наклона (макс. 45 deg в каждую сторону)
        const maxTilt = 45;
        const clampedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
        const clampedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));

        // Преобразуем в градусы для CSS-переменных (макс. ±6 deg)
        const mouseX = (clampedBeta / maxTilt) * 6;
        const mouseY = (clampedGamma / maxTilt) * 6;

        updateCSSVariables(mouseX, mouseY);
    }

    // Обработка движения мыши (для десктопа)
    function handleMouseMove(e) {
        const mouseX = (e.clientX - window.innerWidth / 2) * -0.01;
        const mouseY = (e.clientY - window.innerHeight / 2) * -0.01;

        updateCSSVariables(mouseX, mouseY);
    }

    // Единая функция обновления CSS‑переменных
    function updateCSSVariables(x, y) {
        document.documentElement.style.setProperty('--mouse-x', `${x}deg`);
        document.documentElement.style.setProperty('--mouse-y', `${y}deg`);
    }

    // Проверяем поддержку Device Orientation API
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', throttle(handleDeviceOrientation, 100));
        hasDeviceOrientation = true;
    }

    // Подключаем обработчик мыши
    document.addEventListener('mousemove', throttle(handleMouseMove, 50));

    // Отключаем mousemove на мобильных при касании экрана
    if (hasDeviceOrientation) {
        document.addEventListener('touchstart', () => {
            document.removeEventListener('mousemove', handleMouseMove);
        });
    }
});

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

if (typeof DeviceMotionEvent.requestPermission === 'function') {
    const enableMotionBtn = document.getElementById('enableMotion');
    enableMotionBtn.style.display = 'block';

    enableMotionBtn.addEventListener('click', () => {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleDeviceOrientation);
                    enableMotionBtn.style.display = 'none';
                }
            })
            .catch(console.error);
    });
}

const btnStart = document.querySelector('.btn-start');

btnStart.addEventListener('click', () => {
    window.location.href = 'index.html';
});