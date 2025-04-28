const icons = document.querySelectorAll(".ico");
const length = icons.length;

icons.forEach((item, index) => {
  item.addEventListener("mouseover", (e) => {
    focus(e.target, index);
    e.target.closest('li').querySelector('.name').style.visibility = 'visible';
  });
  item.addEventListener("mouseleave", (e) => {
    icons.forEach((icon) => {
      icon.style.transform = "scale(1) translateY(0px)";
    });
    e.target.closest('li').querySelector('.name').style.visibility = 'hidden';
  });
});

const focus = (elem, index) => {
  const previous = index - 1;
  const previous1 = index - 2;
  const next = index + 1;
  const next2 = index + 2;

  elem.style.transform = "scale(1.5) translateY(-10px)";

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

function updateTime() {
  const menuTime = document.querySelector('.menu-time');
  const now = new Date();

  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };

  const formattedParts = now.toLocaleDateString('pt-BR', options).split(' ');
  const formattedTime = `${capitalize(formattedParts[0])} ${formattedParts[1]} ${formattedParts[2]} ${formattedParts[3]} ${formattedParts[4]}`;

  menuTime.textContent = formattedTime;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

setInterval(updateTime, 1000);
updateTime();

let modalCounter = 0;

function createModal(title) {
  console.log(`Criando modal com título: ${title}`);
  const modalsContainer = document.getElementById('modals-container');
  const modalId = `modal-${modalCounter++}`;

  const modalHTML = `
    <div id="${modalId}" class="modal" data-app="${title}">
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

function closeModal(modal) {
  modal.classList.add('closing');
  modal.classList.remove('show');

  modal.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'opacity') {
      modal.removeEventListener('transitionend', handler);
      modal.remove();

      const appName = Object.keys(openWindows).find(key => openWindows[key] === modal);
      if (appName) {
        console.log(`Fechando modal para ${appName}`);
        delete openWindows[appName];
        updateDockIndicator(appName, false);
      } else {
        console.warn('Não foi possível encontrar o appName para a modal fechada');
      }
    }
  });
}

function openModal(title) {
  console.log(`Abrindo modal para: ${title}`);
  const modal = createModal(title);

  const rect = modal.getBoundingClientRect();
  const centerX = (window.innerWidth - rect.width) / 2;
  const centerY = (window.innerHeight - rect.height) / 2;

  modal.style.left = `${centerX}px`;
  modal.style.top = `${centerY}px`;

  modal.style.display = 'flex';
  modal.offsetHeight;
  modal.classList.add('show');

  addDragEvents(modal);

  openWindows[title] = modal;
  updateDockIndicator(title, true);

  console.log(`Modal aberta para ${title}, openWindows:`, Object.keys(openWindows));

  return modal;
}

function addDragEvents(modal) {
  const header = modal.querySelector('.modal-header');
  let isDragging = false;
  let startX, startY;

  function dragStart(e) {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX - modal.offsetLeft;
    startY = e.clientY - modal.offsetTop;

    modal.style.transition = 'none';

    requestAnimationFrame(drag);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', dragEnd);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    requestAnimationFrame(() => drag(e));
  }

  function drag(e) {
    if (!isDragging) return;
    let newLeft = e.clientX - startX;
    let newTop = e.clientY - startY;

    const minLeft = 0;
    const minTop = 0;
    const maxLeft = window.innerWidth - modal.offsetWidth;
    const maxTop = window.innerHeight - modal.offsetHeight;

    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    modal.style.transition = '';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  header.addEventListener('mousedown', dragStart);
}

function addModalEvents(modal) {
  addDragEvents(modal);

  const closeButton = modal.querySelector('.modal-close');
  closeButton.addEventListener('click', () => closeModal(modal));

  const maximizeButton = modal.querySelector('.modal-maximize');
  maximizeButton.addEventListener('click', () => toggleMaximize(modal));

  const minimizeButton = modal.querySelector('.modal-minimize');
  minimizeButton.addEventListener('click', () => toggleMinimize(modal));
}

function toggleMaximize(modal) {
  if (modal.classList.contains('maximized')) {
    modal.classList.remove('maximized');
    modal.style.width = modal.getAttribute('data-original-width');
    modal.style.height = modal.getAttribute('data-original-height');
    modal.style.left = modal.getAttribute('data-original-left');
    modal.style.top = modal.getAttribute('data-original-top');
  } else {
    if (!modal.hasAttribute('data-original-width')) {
      modal.setAttribute('data-original-width', modal.style.width);
      modal.setAttribute('data-original-height', modal.style.height);
      modal.setAttribute('data-original-left', modal.style.left);
      modal.setAttribute('data-original-top', modal.style.top);
    }

    const maxSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;

    modal.classList.add('maximized');
    modal.style.width = `${maxSize}px`;
    modal.style.height = `${maxSize}px`;
    modal.style.left = `${(window.innerWidth - maxSize) / 2}px`;
    modal.style.top = `${(window.innerHeight - maxSize) / 2}px`;
  }
}

function toggleMinimize(modal) {
  if (modal.classList.contains('maximized')) {
    toggleMaximize(modal);
  } else if (modal.classList.contains('minimized')) {
    modal.classList.remove('minimized');
    modal.style.width = modal.getAttribute('data-original-width');
    modal.style.height = modal.getAttribute('data-original-height');
  } else {
    if (!modal.hasAttribute('data-original-width')) {
      modal.setAttribute('data-original-width', modal.style.width);
      modal.setAttribute('data-original-height', modal.style.height);
    }
    modal.classList.add('minimized');
    modal.style.width = '200px';
    modal.style.height = '40px';
  }
}

const dockItems = document.querySelectorAll('.dock-container li');
dockItems.forEach((item) => {
  item.addEventListener('click', () => {
    openModal(item.querySelector('.name').textContent);
  });
});

let isDaytime = true;
let manualOverrideTimer = null;

function getTimeBasedWallpaper() {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'assets/macos-wallpaper-day.jpg' : 'assets/macos-wallpaper-night.jpg';
}

function updateWallpaper(manual = false) {
  const wallpaperPath = manual ? (isDaytime ? 'assets/macos-wallpaper-night.jpg' : 'assets/macos-wallpaper-day.jpg') : getTimeBasedWallpaper();

  const backgroundContainer = document.querySelector('.background-container');

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

  backgroundContainer.appendChild(newBackground);

  newBackground.offsetHeight;

  newBackground.style.opacity = '1';

  setTimeout(() => {
    while (backgroundContainer.childNodes.length > 1) {
      backgroundContainer.removeChild(backgroundContainer.firstChild);
    }
  }, 1000);

  if (manual) {
    isDaytime = !isDaytime;

    if (manualOverrideTimer) {
      clearTimeout(manualOverrideTimer);
    }

    manualOverrideTimer = setTimeout(() => {
      updateWallpaper(false);
      manualOverrideTimer = null;
    }, 5000);
  }
}

function updateTimeBasedWallpaper() {
  if (!manualOverrideTimer) {
    updateWallpaper(false);
  }
}

document.getElementById('toggle-wallpaper').addEventListener('click', () => updateWallpaper(true));

updateTimeBasedWallpaper();

setInterval(updateTimeBasedWallpaper, 60000)

const openWindows = {};

function updateDockIndicator(appName, isOpen) {
  console.log(`Atualizando indicador para ${appName}: ${isOpen ? 'aberto' : 'fechado'}`);
  const dockItem = document.querySelector(`.dock .dock-container li[data-app="${appName}"]`);
  if (dockItem) {
    console.log(`Elemento encontrado para ${appName}:`, dockItem);
    if (isOpen) {
      dockItem.classList.add('app-open');
      console.log(`Classe app-open adicionada para ${appName}`);
    } else {
      dockItem.classList.remove('app-open');
      console.log(`Classe app-open removida para ${appName}`);
    }
    console.log(`Classes atuais para ${appName}:`, dockItem.classList.toString());
  } else {
    console.warn(`Dock item não encontrado para o app: ${appName}`);
  }
}
