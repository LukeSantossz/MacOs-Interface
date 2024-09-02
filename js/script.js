document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const dockIcons = document.querySelectorAll('.dock-icon');
    const windows = document.querySelectorAll('.window');
    const closeButtons = document.querySelectorAll('.close-btn');

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.id.replace('-icon', '-window');
            const windowElement = document.getElementById(windowId);
            windowElement.style.display = 'flex';
            const iconRect = icon.getBoundingClientRect();
            windowElement.style.top = `${iconRect.bottom + 10}px`; // Posição inicial abaixo do ícone
            windowElement.style.left = `${iconRect.left}px`; // Posição inicial alinhada ao ícone
        });
    });

    dockIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.id.replace('dock-', '') + '-window';
            const windowElement = document.getElementById(windowId);
            windowElement.style.display = 'flex';
            const iconRect = icon.getBoundingClientRect();
            windowElement.style.top = `${iconRect.top - windowElement.offsetHeight - 10}px`; // Posição inicial acima do ícone do dock
            windowElement.style.left = `${iconRect.left}px`; // Posição inicial alinhada ao ícone do dock
        });
    });

    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => {
            let offsetX = e.clientX - window.offsetLeft;
            let offsetY = e.clientY - window.offsetTop;

            function mouseMoveHandler(e) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Limites para a movimentação da janela
                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + window.offsetWidth > window.innerWidth) newLeft = window.innerWidth - window.offsetWidth;
                if (newTop + window.offsetHeight > window.innerHeight - 50) newTop = window.innerHeight - window.offsetHeight - 50;

                window.style.left = `${newLeft}px`;
                window.style.top = `${newTop}px`;
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const windowElement = e.target.closest('.window');
            windowElement.style.display = 'none';
        });
    });
});