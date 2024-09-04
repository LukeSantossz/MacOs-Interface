document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    const dockIcons = document.querySelectorAll('.dock-icon');
    const windows = document.querySelectorAll('.window');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    const dockContainer = document.querySelector('.dock'); // Target for dropped icons

    // Tornar ícones do dock arrastáveis
    dockIcons.forEach(icon => {
        icon.draggable = true;
    });

    // Lidar com o evento de início de arraste para ícones do dock
    dockIcons.forEach(icon => {
        icon.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
        });
    });

    // Lidar com o evento de soltar no desktop
    document.querySelector('.desktop').addEventListener('drop', (event) => {
        event.preventDefault();
        const droppedIconId = event.dataTransfer.getData('text/plain');
        const droppedIcon = document.getElementById(droppedIconId);

        // Verificar se o ícone foi solto dentro da área do dock (ajustar coordenadas se necessário)
        const dockRect = dockContainer.getBoundingClientRect();
        if (event.clientX >= dockRect.left && event.clientX <= dockRect.right &&
            event.clientY >= dockRect.top && event.clientY <= dockRect.bottom) {
            // Insert the dropped icon at the end of the dock container
            dockContainer.appendChild(droppedIcon);
        } else {
            // Mover o ícone para a posição solta na área de trabalho
            droppedIcon.style.position = 'absolute';
            droppedIcon.style.left = `${event.clientX - droppedIcon.offsetWidth / 2}px`;
            droppedIcon.style.top = `${event.clientY - droppedIcon.offsetHeight / 2}px`;
            document.querySelector('.desktop').appendChild(droppedIcon);
        }
    });

    // Lidar com o evento de permitir soltar no desktop (opcional)
    document.querySelector('.desktop').addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    // Tornar ícones da área de trabalho arrastáveis
    icons.forEach(icon => {
        icon.draggable = true;
        icon.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
            // Adicionar classe para estilo de arraste
            event.target.classList.add('dragging');
        });
        icon.addEventListener('dragend', (event) => {
            // Remover classe de estilo de arraste
            event.target.classList.remove('dragging');
        });
    });

    // Função existente para clique em ícones
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

    // Função existente para clique em ícones do dock
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

    // Função existente para movimentação das janelas
    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => {
            let offsetX = e.clientX - window.offsetLeft;
            let offsetY = e.clientY - window.offsetTop;

            function mouseMoveHandler(e) {
                let newLeft = e.clientXdocument.addEventListener('DOMContentLoaded', () => {
                    const icons = document.querySelectorAll('.icon');
                    const dockIcons = document.querySelectorAll('.dock-icon');
                    const windows = document.querySelectorAll('.window');
                    const closeButtons = document.querySelectorAll('.close-btn');
                    
                    const dockContainer = document.querySelector('.dock'); // Target for dropped icons
                
                    // Tornar ícones do dock arrastáveis
                    dockIcons.forEach(icon => {
                        icon.draggable = true;
                    });
                
                    // Lidar com o evento de início de arraste para ícones do dock
                    dockIcons.forEach(icon => {
                        icon.addEventListener('dragstart', (event) => {
                            event.dataTransfer.setData('text/plain', event.target.id);
                        });
                    });
                
                    // Lidar com o evento de soltar no desktop
                    document.querySelector('.desktop').addEventListener('drop', (event) => {
                        event.preventDefault();
                        const droppedIconId = event.dataTransfer.getData('text/plain');
                        const droppedIcon = document.getElementById(droppedIconId);
                
                        // Verificar se o ícone foi solto dentro da área do dock (ajustar coordenadas se necessário)
                        const dockRect = dockContainer.getBoundingClientRect();
                        if (event.clientX >= dockRect.left && event.clientX <= dockRect.right &&
                            event.clientY >= dockRect.top && event.clientY <= dockRect.bottom) {
                            // Insert the dropped icon at the end of the dock container
                            dockContainer.appendChild(droppedIcon);
                        } else {
                            // Mover o ícone para a posição solta na área de trabalho
                            droppedIcon.style.position = 'absolute';
                            droppedIcon.style.left = `${event.clientX - droppedIcon.offsetWidth / 2}px`;
                            droppedIcon.style.top = `${event.clientY - droppedIcon.offsetHeight / 2}px`;
                            document.querySelector('.desktop').appendChild(droppedIcon);
                        }
                    });
                
                    // Lidar com o evento de permitir soltar no desktop (opcional)
                    document.querySelector('.desktop').addEventListener('dragover', (event) => {
                        event.preventDefault();
                    });
                
                    // Tornar ícones da área de trabalho arrastáveis
                    icons.forEach(icon => {
                        icon.draggable = true;
                        icon.addEventListener('dragstart', (event) => {
                            event.dataTransfer.setData('text/plain', event.target.id);
                            // Adicionar classe para estilo de arraste
                            event.target.classList.add('dragging');
                        });
                        icon.addEventListener('dragend', (event) => {
                            // Remover classe de estilo de arraste
                            event.target.classList.remove('dragging');
                        });
                    });
                
                    // Função existente para clique em ícones
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
                
                    // Função existente para clique em ícones do dock
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
                
                    // Função existente para movimentação das janelas
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
                
                    // Função existente para fechamento das janelas
                    closeButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            const windowElement = e.target.closest('.window');
                            windowElement.style.display = 'none';
                        });
                    });
                }); - offsetX;
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

    // Função existente para fechamento das janelas
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const windowElement = e.target.closest('.window');
            windowElement.style.display = 'none';
        });
    });
});