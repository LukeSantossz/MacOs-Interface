// Função para atualizar a barra de ícones ao passar o mouse sobre eles
const icons = document.querySelectorAll(".ico");
const length = icons.length;

// Adiciona eventos de mouseover e mouseleave a cada ícone
icons.forEach((item, index) => {
  item.addEventListener("mouseover", (e) => {
    focus(e.target, index);
  });
  item.addEventListener("mouseleave", () => {
    // Restaura o estilo original de todos os ícones quando o mouse sai
    icons.forEach((icon) => {
      icon.style.transform = "scale(1) translateY(0px)";
    });
  });
});

// Função que aplica o estilo de foco aos ícones
const focus = (elem, index) => {
  const previous = index - 1;
  const previous1 = index - 2;
  const next = index + 1;
  const next2 = index + 2;

  // Aplica transformação ao ícone atualmente em foco
  elem.style.transform = "scale(1.5) translateY(-10px)";

  // Aplica transformação aos ícones adjacentes
  if (previous >= 0) {
    icons[previous].style.transform = "scale(1.2) translateY(-6px)";
  }
  if (previous1 >= 0) {
    icons[previous1].style.transform = "scale(1.1)";
  }
  if (next < icons.length) {
    icons[next].style.transform = "scale(1.2) translateY(-6px)";
  }
  if (next2 < icons.length) {
    icons[next2].style.transform = "scale(1.1)";
  }
};

// Função para atualizar o tempo exibido na barra
function updateTime() {
  const menuTime = document.querySelector('.menu-time');
  const now = new Date();

  // Opções para formatação da data
  const options = { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  
  // Formata a data e hora
  const formattedParts = now.toLocaleDateString('pt-BR', options).split(' ');
  const formattedTime = `${capitalize(formattedParts[0])} ${formattedParts[1]} ${formattedParts[2]} ${formattedParts[3]} ${formattedParts[4]}`;

  // Atualiza o conteúdo do elemento de tempo
  menuTime.textContent = formattedTime;
}

// Função para capitalizar a primeira letra de uma string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Atualiza o tempo a cada segundo
setInterval(updateTime, 1000);

// Chama a função para definir o tempo inicial
updateTime();

let modalCounter = 0;

// Função para criar uma nova modal
function createModal(title) {
  const modalsContainer = document.getElementById('modals-container');
  const modalId = `modal-${modalCounter++}`;
  
  const modalHTML = `
    <div id="${modalId}" class="modal">
      <div class="modal-header">
        <div class="modal-controls">
          <span class="modal-close"></span>
          <span class="modal-minimize"></span>
          <span class="modal-maximize"></span>
        </div>
        <div class="modal-title">${title}</div>
      </div>
      <div class="modal-content">
        <!-- Conteúdo da modal -->
      </div>
    </div>
  `;
  
  modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById(modalId);
  addModalEvents(modal);
  return modal;
}

// Função para fechar a modal
function closeModal(modal) {
  modal.classList.add('closing');
  modal.classList.remove('show');
  
  // Remove a modal após a conclusão da animação
  modal.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'opacity') {
      modal.removeEventListener('transitionend', handler);
      modal.remove();
    }
  });
}

// Função para abrir uma nova modal
function openModal(title) {
  const modal = createModal(`~macos/single-div/${title.toLowerCase()}`);
  
  // Posiciona a modal no centro da tela
  const rect = modal.getBoundingClientRect();
  const centerX = (window.innerWidth - rect.width) / 2;
  const centerY = (window.innerHeight - rect.height) / 2;
  
  modal.style.left = `${centerX}px`;
  modal.style.top = `${centerY}px`;
  
  // Exibe a modal
  modal.style.display = 'flex';
  
  // Força um reflow para garantir que a animação seja aplicada
  modal.offsetHeight;
  
  // Adiciona a classe 'show' para iniciar a animação
  modal.classList.add('show');
  
  // Adiciona os eventos de arrastar
  addDragEvents(modal);
}

// Função para adicionar eventos de arrastar à modal
function addDragEvents(modal) {
  const header = modal.querySelector('.modal-header');
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  function dragStart(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = modal.offsetLeft;
    startTop = modal.offsetTop;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }
  
  function drag(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    const newLeft = startLeft + dx;
    const newTop = startTop + dy;
    
    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
  }
  
  function dragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  }
  
  header.addEventListener('mousedown', dragStart);
}

// Função para adicionar todos os eventos à modal
function addModalEvents(modal) {
  addDragEvents(modal);

  // Adiciona evento de clique ao botão de fechar
  const closeButton = modal.querySelector('.modal-close');
  closeButton.addEventListener('click', () => closeModal(modal));

  // Adiciona evento de clique ao botão de maximizar (verde)
  const maximizeButton = modal.querySelector('.modal-maximize');
  maximizeButton.addEventListener('click', () => toggleMaximize(modal));

  // Adiciona evento de clique ao botão de minimizar (amarelo)
  const minimizeButton = modal.querySelector('.modal-minimize');
  minimizeButton.addEventListener('click', () => toggleMinimize(modal));
}

// Função para alternar entre o tamanho normal e maximizado
function toggleMaximize(modal) {
  if (modal.classList.contains('maximized')) {
    // Restaurar ao tamanho original
    modal.classList.remove('maximized');
    modal.style.width = modal.getAttribute('data-original-width');
    modal.style.height = modal.getAttribute('data-original-height');
    modal.style.left = modal.getAttribute('data-original-left');
    modal.style.top = modal.getAttribute('data-original-top');
  } else {
    // Maximizar
    if (!modal.hasAttribute('data-original-width')) {
      // Salvar dimensões e posição originais
      modal.setAttribute('data-original-width', modal.style.width);
      modal.setAttribute('data-original-height', modal.style.height);
      modal.setAttribute('data-original-left', modal.style.left);
      modal.setAttribute('data-original-top', modal.style.top);
    }

    const maxSize = Math.min(window.innerWidth, window.innerHeight) * 0.7; // 70% do menor lado da tela

    modal.classList.add('maximized');
    modal.style.width = `${maxSize}px`;
    modal.style.height = `${maxSize}px`;
    modal.style.left = `${(window.innerWidth - maxSize) / 2}px`;
    modal.style.top = `${(window.innerHeight - maxSize) / 2}px`;
  }
}

// Função para alternar entre o tamanho normal e minimizado
function toggleMinimize(modal) {
  if (modal.classList.contains('maximized')) {
    toggleMaximize(modal); // Primeiro, restaure do estado maximizado
  } else if (modal.classList.contains('minimized')) {
    // Restaurar ao tamanho original
    modal.classList.remove('minimized');
    modal.style.width = modal.getAttribute('data-original-width');
    modal.style.height = modal.getAttribute('data-original-height');
  } else {
    // Minimizar
    if (!modal.hasAttribute('data-original-width')) {
      // Salvar dimensões originais
      modal.setAttribute('data-original-width', modal.style.width);
      modal.setAttribute('data-original-height', modal.style.height);
    }
    modal.classList.add('minimized');
    modal.style.width = '200px';
    modal.style.height = '40px';
  }
}

// Adiciona eventos de clique aos itens da dock
const dockItems = document.querySelectorAll('.dock-container li');
dockItems.forEach((item) => {
  item.addEventListener('click', () => {
    openModal(item.querySelector('.name').textContent);
  });
});

let isDaytime = true; // Variável para controlar se é dia ou noite
let manualOverrideTimer = null; // Timer para restaurar o papel de parede original

function getTimeBasedWallpaper() {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? '../Pictures/MacOsWallpaperDay.jpg' : '../Pictures/MacOswallpaper.jpg';
}

function updateWallpaper(manual = false) {
  const wallpaperPath = manual ? (isDaytime ? '../Pictures/MacOswallpaper.jpg' : '../Pictures/MacOsWallpaperDay.jpg') : getTimeBasedWallpaper();

  const backgroundContainer = document.querySelector('.background-container');
  
  // Cria um novo elemento de imagem para a transição
  const newBackground = document.createElement('div');
  newBackground.style.backgroundImage = `url('${wallpaperPath}')`;
  newBackground.style.position = 'absolute';
  newBackground.style.top = '0';
  newBackground.style.left = '0';
  newBackground.style.width = '100%';
  newBackground.style.height = '100%';
  newBackground.style.backgroundSize = 'cover';
  newBackground.style.backgroundPosition = 'center';
  newBackground.style.opacity = '0';
  newBackground.style.transition = 'opacity 1s ease-in-out';

  // Adiciona o novo fundo
  backgroundContainer.appendChild(newBackground);

  // Força um reflow para garantir que a transição seja aplicada
  newBackground.offsetHeight;

  // Faz o fade in do novo fundo
  newBackground.style.opacity = '1';

  // Remove o fundo antigo após a transição
  setTimeout(() => {
    while (backgroundContainer.childNodes.length > 1) {
      backgroundContainer.removeChild(backgroundContainer.firstChild);
    }
  }, 1000);

  if (manual) {
    isDaytime = !isDaytime; // Alterna entre dia e noite apenas se for uma mudança manual
    
    // Limpa o temporizador existente, se houver
    if (manualOverrideTimer) {
      clearTimeout(manualOverrideTimer);
    }
    
    // Define um novo temporizador para restaurar o papel de parede original após 5 segundos
    manualOverrideTimer = setTimeout(() => {
      updateWallpaper(false); // Chama updateWallpaper com manual = false para restaurar o papel de parede baseado no horário
      manualOverrideTimer = null;
    }, 5000);
  }
}

// Função para atualizar o papel de parede baseado no horário atual
function updateTimeBasedWallpaper() {
  if (!manualOverrideTimer) { // Só atualiza se não houver uma mudança manual recente
    updateWallpaper(false);
  }
}

// Adiciona evento de clique ao botão de teste
document.getElementById('toggle-wallpaper').addEventListener('click', () => updateWallpaper(true));

// Chama a função imediatamente para definir o papel de parede inicial
updateTimeBasedWallpaper();

// Atualiza o papel de parede a cada minuto
setInterval(updateTimeBasedWallpaper, 60000);