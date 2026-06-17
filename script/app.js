document.addEventListener('mousemove', e => {
    Object.assign(document.documentElement, {
        style:`
            --mouse-x: ${(e.clientX - window.innerWidth / 2) * -.01}deg;
            --mouse-y: ${(e.clientY - window.innerHeight / 2) * -.01}deg;
        `
    })
})