document.addEventListener('DOMContentLoaded', function() {
    let isCalibrated = false;
    let calibration = { beta: 0, gamma: 0 };
    
    // 1. Функция калибровки (вызывается один раз при первом наклоне или по кнопке)
    function calibrate(event) {
        if (!isCalibrated && event) {
            calibration = {
                beta: event.beta || 0,
                gamma: event.gamma || 0
            };
            isCalibrated = true;
            console.log('Device calibrated');
        }
    }

    function handleDeviceOrientation(event) {
        // Если еще не откалибровано, калибруем прямо сейчас (первый кадр)
        if (!isCalibrated) {
            calibrate(event);
        }

        const rawBeta = event.beta !== null ? event.beta : 0;
        const rawGamma = event.gamma !== null ? event.gamma : 0;

        // Вычитаем калибровочные значения
        let beta = rawBeta - calibration.beta;
        let gamma = rawGamma - calibration.gamma;

        // 2. Коррекция под ориентацию экрана
        // В портретной ориентации: gamma = X, beta = Y
        // В ландшафтной ориентации оси часто меняются местами или инвертируются в зависимости от браузера.
        // Самый надежный способ - определить ориентацию и применить поправку.
        const isLandscape = window.innerHeight < window.innerWidth;

        if (isLandscape) {
            // В ландшафте оси часто нужно поменять местами или инвертировать одну из них
            // Пробуй этот вариант, если текст все еще едет не туда:
            const temp = beta;
            beta = gamma;
            gamma = -temp; 
        }

        // Ограничиваем диапазон (чтобы не было резких скачков)
        const maxTilt = 45;
        
        // Clamp значения
        const clampedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
        const clampedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));

        // Расчет углов для CSS
        // Коэффициент 0.133 примерно равен 6/45. Подбирай под свой дизайн.
        const moveY = -(clampedBeta / maxTilt) * 6; 
        const moveX = (clampedGamma / maxTilt) * 6;

        updateCSSVariables(moveX, moveY);
    }

    function updateCSSVariables(x, y) {
        document.documentElement.style.setProperty('--tilt-x', `${x}deg`);
        document.documentElement.style.setProperty('--tilt-y', `${y}deg`);
    }

    // Обработка мыши (Desktop)
    function handleMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 2 - 1) * 5; // -5 до 5
        const y = ((e.clientY - rect.top) / rect.height * 2 - 1) * 5;
        
        updateCSSVariables(x, -y); // Инвертируем Y для мыши, чтобы соответствовало наклону
    }

    if ('DeviceOrientationEvent' in window) {
        // Используем throttle для производительности
        window.addEventListener('deviceorientation', throttle(handleDeviceOrientation, 100));
        
        // ВАЖНО: Перекалибровать при смене ориентации экрана
        window.addEventListener('orientationchange', () => {
            isCalibrated = false; // Сброс калибровки при повороте
            console.log('Orientation changed, recalibrating...');
        });
        
        window.addEventListener('resize', () => {
             // Проверка на переход в ландшафт/портрет
             if((window.innerHeight > window.innerWidth) !== (window.innerHeight <= window.innerWidth)) {
                 isCalibrated = false; 
             }
        });
    }

    document.addEventListener('mousemove', throttle(handleMouseMove, 50));
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
