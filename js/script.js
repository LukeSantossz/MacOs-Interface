// =============================================================================
// Global Variables & Constants
// =============================================================================

const icons = document.querySelectorAll(".ico"); // All dock icons
const length = icons.length; // Total number of dock icons
const modalsContainer = document.getElementById('modals-container'); // Container for modals
const backgroundContainer = document.querySelector('.background-container'); // Background container element
const menuTime = document.querySelector('.menu-time'); // Element to display time in menu bar

let modalCounter = 0; // Counter for generating unique modal IDs
const openWindows = {}; // Object to track open modals/windows { appName: modalElement }
let isDaytime = true; // Tracks if the current wallpaper theme is daytime
let manualOverrideTimer = null; // Timer for manual wallpaper override duration

// =============================================================================
// Dock Interaction Logic
// =============================================================================

/**
 * Applies focus styling (scaling) to dock icons on hover.
 * @param {HTMLElement} elem - The icon element being hovered over.
 * @param {number} index - The index of the hovered icon in the 'icons' NodeList.
 */
const focus = (elem, index) => {
  const previous = index - 1; // Previous icon index
  const previous1 = index - 2; // Icon two positions before
  const next = index + 1; // Next icon index
  const next2 = index + 2; // Icon two positions after

  // Apply transformations for focus and adjacent icons
  elem.style.transform = "scale(1.5) translateY(-10px)"; // Focused icon

  if (previous >= 0) {
    icons[previous].style.transform = "scale(1.2) translateY(-6px)"; // Adjacent icon
  }
  if (previous1 >= 0) {
    icons[previous1].style.transform = "scale(1.1)"; // Icon two positions away
  }
  if (next < icons.length) {
    icons[next].style.transform = "scale(1.2) translateY(-6px)"; // Adjacent icon
  }
  if (next2 < icons.length) {
    icons[next2].style.transform = "scale(1.1)"; // Icon two positions away
  }
};

/**
 * Updates the visual indicator (dot) under a dock icon.
 * @param {string} appName - The name of the application associated with the dock icon.
 * @param {boolean} isOpen - True if the application window is open, false otherwise.
 */
function updateDockIndicator(appName, isOpen) {
  console.log(`Atualizando indicador para ${appName}: ${isOpen ? 'aberto' : 'fechado'}`);
  // Find the dock item using the data-app attribute
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

// =============================================================================
// Menu Bar Time Logic
// =============================================================================

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalize(str) {
  if (!str) return str; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Updates the time displayed in the menu bar.
 */
function updateTime() {
  const now = new Date();

  // Formatting options for date and time (Portuguese - Brazil)
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };

  // Format and assemble the date/time string
  const formattedParts = now.toLocaleDateString('pt-BR', options).split(' ');
  // Ensure proper capitalization and spacing (adjust indices if locale format changes)
  const formattedTime = `${capitalize(formattedParts[0].replace('.', ''))} ${formattedParts[1]} ${capitalize(formattedParts[2])} ${formattedParts[4]}`; // Example: Ter 27 Abr 15:30

  // Update the menu bar time element
  menuTime.textContent = formattedTime;
}

// =============================================================================
// Modal Window Management
// =============================================================================

/**
 * Creates a new modal window element but doesn't display it yet.
 * @param {string} title - The title of the modal window (usually the app name).
 * @returns {HTMLElement} The newly created modal element.
 */
function createModal(title) {
  console.log(`Criando modal com título: ${title}`);
  const modalId = `modal-${modalCounter++}`; // Generate unique ID

  // HTML structure for the modal
  const modalHTML = `
    <div id="${modalId}" class="modal" data-app="${title}">
      <div class="modal-header">
        <div class="modal-controls">
          <span class="modal-close" title="Fechar"></span>
          <span class="modal-minimize" title="Minimizar"></span>
          <span class="modal-maximize" title="Maximizar"></span>
        </div>
        <div class="modal-title">${title}</div>
      </div>
      <div class="modal-content">
        <!-- Content specific to the app would go here -->
        <p>Conteúdo para ${title}</p> 
      </div>
    </div>
  `;

  // Add the modal HTML to the container
  modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById(modalId);
  addModalEvents(modal); // Attach necessary event listeners
  return modal;
}

/**
 * Opens and displays a modal window for a given application title.
 * If a modal for the app is already open, it brings it to the front (optional, not implemented here).
 * @param {string} title - The title of the application/modal to open.
 * @returns {HTMLElement | null} The opened modal element or null if already open.
 */
function openModal(title) {
  // Check if a window for this app is already open
  if (openWindows[title]) {
    console.log(`Modal para ${title} já está aberta.`);
    // Optional: Bring the existing window to the front
    // openWindows[title].style.zIndex = getHighestZIndex() + 1;
    return openWindows[title]; // Return existing modal
  }

  console.log(`Abrindo modal para: ${title}`);
  const modal = createModal(title);

  // Calculate initial centered position
  // Use default dimensions from CSS or set initial ones
  const initialWidth = 800; // Example width, adjust as needed or get from CSS
  const initialHeight = 400; // Example height
  modal.style.width = `${initialWidth}px`;
  modal.style.height = `${initialHeight}px`;

  const centerX = Math.max(0, (window.innerWidth - initialWidth) / 2);
  const centerY = Math.max(30, (window.innerHeight - initialHeight) / 2); // Avoid placing under menu bar

  modal.style.left = `${centerX}px`;
  modal.style.top = `${centerY}px`;

  // Display the modal with animation
  modal.style.display = 'flex';
  modal.offsetHeight; // Force reflow to apply initial styles before transition
  modal.classList.add('show');

  // Track the open window and update dock indicator
  openWindows[title] = modal;
  updateDockIndicator(title, true);

  console.log(`Modal aberta para ${title}, openWindows:`, Object.keys(openWindows));
  return modal;
}

/**
 * Closes a modal window with animation.
 * @param {HTMLElement} modal - The modal element to close.
 */
function closeModal(modal) {
  const appName = modal.dataset.app; // Get app name from data attribute
  console.log(`Iniciando fechamento da modal para ${appName}`);

  modal.classList.add('closing'); // Add class for closing animation
  modal.classList.remove('show'); // Remove show class

  // Remove the modal from the DOM after the animation completes
  modal.addEventListener('transitionend', function handler(e) {
    // Ensure we only react to the opacity transition ending
    if (e.propertyName === 'opacity' && modal.classList.contains('closing')) {
      modal.removeEventListener('transitionend', handler); // Clean up listener
      if (modal.parentNode) {
        modal.remove(); // Remove from DOM
        console.log(`Modal removida do DOM para ${appName}`);
      } else {
         console.log(`Modal para ${appName} já havia sido removida.`);
      }

      // Update tracking and dock indicator only if the appName was found
      if (appName && openWindows[appName] === modal) {
         console.log(`Atualizando estado para ${appName} como fechado.`);
        delete openWindows[appName];
        updateDockIndicator(appName, false);
        console.log(`Estado após fechar ${appName}, openWindows:`, Object.keys(openWindows));
      } else {
        console.warn(`Não foi possível encontrar ${appName} em openWindows ou a modal não corresponde.`);
      }
    }
  }, { once: false }); // Use {once: false} in case transitionend fires multiple times
}


/**
 * Toggles a modal window between its normal and maximized state.
 * @param {HTMLElement} modal - The modal element.
 */
function toggleMaximize(modal) {
  const headerHeight = modal.querySelector('.modal-header').offsetHeight;
  const dockHeight = document.querySelector('.dock')?.offsetHeight || 70; // Estimate dock height

  if (modal.classList.contains('maximized')) {
    // Restore from maximized
    modal.classList.remove('maximized');
    modal.style.width = modal.getAttribute('data-original-width') || '80%'; // Restore original or default
    modal.style.height = modal.getAttribute('data-original-height') || '400px';
    modal.style.left = modal.getAttribute('data-original-left') || `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    modal.style.top = modal.getAttribute('data-original-top') || `${(window.innerHeight - modal.offsetHeight) / 2}px`;
    // Remove stored attributes after restoring
    modal.removeAttribute('data-original-width');
    modal.removeAttribute('data-original-height');
    modal.removeAttribute('data-original-left');
    modal.removeAttribute('data-original-top');
  } else {
    // Maximize
    // Store current size/position if not already stored (e.g., if minimized directly)
    if (!modal.hasAttribute('data-original-width')) {
      modal.setAttribute('data-original-width', modal.style.width || `${modal.offsetWidth}px`);
      modal.setAttribute('data-original-height', modal.style.height || `${modal.offsetHeight}px`);
      modal.setAttribute('data-original-left', modal.style.left || `${modal.offsetLeft}px`);
      modal.setAttribute('data-original-top', modal.style.top || `${modal.offsetTop}px`);
    }

    // Calculate maximized size and position (fill screen minus menu/dock)
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight - headerHeight - dockHeight; // Adjust available height

    modal.classList.add('maximized');
    modal.style.width = `${maxWidth}px`;
    modal.style.height = `${maxHeight}px`;
    modal.style.left = `0px`;
    modal.style.top = `${headerHeight}px`; // Position below menu bar
  }
}

/**
 * Toggles a modal window between its normal/maximized and minimized state.
 * (Note: Actual minimization to dock is complex; this simplifies it to a small state).
 * @param {HTMLElement} modal - The modal element.
 */
function toggleMinimize(modal) {
  // If maximized, restore first before minimizing
  if (modal.classList.contains('maximized')) {
    toggleMaximize(modal); // Restore to normal size first
    // Optionally add a small delay before minimizing if needed
    // setTimeout(() => minimizeAction(modal), 10);
    // return; // Or proceed to minimize immediately after restore
  }

  if (modal.classList.contains('minimized')) {
    // Restore from minimized
    modal.classList.remove('minimized');
    modal.style.display = 'flex'; // Make visible again
    // Restore size (might need adjustment based on previous state)
    modal.style.width = modal.getAttribute('data-original-width') || '80%';
    modal.style.height = modal.getAttribute('data-original-height') || '400px';
    // Optional: Restore position as well
    modal.style.left = modal.getAttribute('data-original-left') || `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    modal.style.top = modal.getAttribute('data-original-top') || `${(window.innerHeight - modal.offsetHeight) / 2}px`;
    // Consider removing attributes if restoring fully
     modal.removeAttribute('data-original-width');
     modal.removeAttribute('data-original-height');
     modal.removeAttribute('data-original-left');
     modal.removeAttribute('data-original-top');
  } else {
    // Minimize
    // Store current size/position if not already stored
     if (!modal.hasAttribute('data-original-width')) {
       modal.setAttribute('data-original-width', modal.style.width || `${modal.offsetWidth}px`);
       modal.setAttribute('data-original-height', modal.style.height || `${modal.offsetHeight}px`);
       modal.setAttribute('data-original-left', modal.style.left || `${modal.offsetLeft}px`);
       modal.setAttribute('data-original-top', modal.style.top || `${modal.offsetTop}px`);
     }
    modal.classList.add('minimized');
    // Hide the modal (simple approach)
    modal.style.display = 'none';
    // Or shrink it significantly (visual cue)
    // modal.style.width = '200px';
    // modal.style.height = '40px'; // Just the header height maybe
    // modal.style.opacity = '0'; // Fade out
    // modal.style.pointerEvents = 'none'; // Disable interaction
  }
}


/**
 * Adds drag functionality to a modal window header.
 * @param {HTMLElement} modal - The modal element.
 */
function addDragEvents(modal) {
  const header = modal.querySelector('.modal-header');
  if (!header) return; // Safety check

  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  function dragStart(e) {
    // Allow dragging only with the left mouse button and directly on the header
    if (e.button !== 0 || e.target !== header) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = modal.offsetLeft;
    initialTop = modal.offsetTop;

    modal.classList.add('dragging'); // Add class to disable transitions during drag
    modal.style.zIndex = Date.now(); // Bring to front (simple approach)
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', dragEnd);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    // Use requestAnimationFrame for smoother dragging
    requestAnimationFrame(() => drag(e));
  }

  function drag(e) {
    if (!isDragging) return;

    let newLeft = initialLeft + (e.clientX - startX);
    let newTop = initialTop + (e.clientY - startY);

    // Prevent dragging outside viewport boundaries (considering menu bar height)
    const menuBarHeight = 30; // Height of the menu bar
    const minLeft = 0;
    const minTop = menuBarHeight; // Cannot drag under the menu bar
    const maxLeft = window.innerWidth - modal.offsetWidth;
    const maxTop = window.innerHeight - modal.offsetHeight;

    // Clamp position within bounds
    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    modal.classList.remove('dragging'); // Remove dragging class, re-enabling transitions

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  header.addEventListener('mousedown', dragStart);
}

/**
 * Adds all necessary event listeners (close, minimize, maximize, drag) to a modal.
 * @param {HTMLElement} modal - The modal element.
 */
function addModalEvents(modal) {
  const closeButton = modal.querySelector('.modal-close');
  const minimizeButton = modal.querySelector('.modal-minimize');
  const maximizeButton = modal.querySelector('.modal-maximize');

  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(modal));
  }
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => toggleMinimize(modal));
  }
  if (maximizeButton) {
    maximizeButton.addEventListener('click', () => toggleMaximize(modal));
  }

  addDragEvents(modal); // Add dragging capability
}

// =============================================================================
// Wallpaper Management Logic
// =============================================================================

/**
 * Determines the appropriate wallpaper path based on the time of day.
 * @returns {string} The path to the day or night wallpaper image.
 */
function getTimeBasedWallpaper() {
  const hour = new Date().getHours();
  // Day time between 6 AM (inclusive) and 6 PM (exclusive)
  return (hour >= 6 && hour < 18) ? '../assets/MacOsWallpaperDay.jpg' : '../assets/MacOswallpaper.jpg';
}

/**
 * Updates the background wallpaper with a fade transition.
 * @param {boolean} manual - Indicates if the change was triggered manually (e.g., by clicking).
 */
function updateWallpaper(manual = false) {
  let wallpaperPath;

  if (manual) {
    // Toggle between day/night on manual click
    wallpaperPath = isDaytime ? '../assets/MacOswallpaper.jpg' : '../assets/MacOsWallpaperDay.jpg';
    isDaytime = !isDaytime; // Update the state after determining the path
    console.log(`Manual wallpaper change. New state isDaytime: ${isDaytime}`);

    // Clear any existing override timer
    if (manualOverrideTimer) {
      clearTimeout(manualOverrideTimer);
      console.log("Cleared previous manual override timer.");
    }

    // Set a timer to revert to the time-based wallpaper after 5 seconds
    manualOverrideTimer = setTimeout(() => {
      console.log("Manual override timer expired. Reverting to time-based wallpaper.");
      updateTimeBasedWallpaper(); // Revert based on current time
      manualOverrideTimer = null; // Clear the timer ID
    }, 5000); // 5 seconds
     console.log(`Set manual override timer: ${manualOverrideTimer}`);

  } else {
    // Automatic update based on time
    wallpaperPath = getTimeBasedWallpaper();
    // Update isDaytime state based on the time-based wallpaper chosen
    const currentHour = new Date().getHours();
    isDaytime = (currentHour >= 6 && currentHour < 18);
     console.log(`Automatic wallpaper update. isDaytime set to: ${isDaytime}`);
  }


  // --- Wallpaper transition logic ---
  // Create a new div for the new background
  const newBackground = document.createElement('div');
  newBackground.style.backgroundImage = `url('${wallpaperPath}')`;
  // Copy essential styles from the CSS for the background
  newBackground.style.position = 'absolute';
  newBackground.style.top = '0';
  newBackground.style.left = '0';
  newBackground.style.width = '100%';
  newBackground.style.height = '100%';
  newBackground.style.backgroundSize = 'cover';
  newBackground.style.backgroundPosition = 'center';
  newBackground.style.backgroundRepeat = 'no-repeat';
  newBackground.style.zIndex = '-2'; // Place behind the current background initially
  newBackground.style.opacity = '0'; // Start transparent
  newBackground.style.transition = 'opacity 1s ease-in-out'; // Fade transition

  // Add the new background div to the container
  backgroundContainer.appendChild(newBackground);

  // Force reflow to ensure the initial state (opacity 0) is rendered
  newBackground.offsetHeight;

  // Start the fade-in animation for the new background
  newBackground.style.opacity = '1';
  newBackground.style.zIndex = '-1'; // Bring it visually in front of the old one

  // Remove the older background(s) after the transition completes
  setTimeout(() => {
    const backgrounds = backgroundContainer.querySelectorAll('div');
    // Remove all but the newest background div
    backgrounds.forEach((bg, index) => {
      if (index < backgrounds.length - 1) {
        backgroundContainer.removeChild(bg);
      }
    });
     // Ensure the final background has the correct z-index if needed
     const currentBg = backgroundContainer.querySelector('div');
     if(currentBg) currentBg.style.zIndex = '-1';

  }, 1000); // Match transition duration
}

/**
 * Updates the wallpaper based on the current time, but only if not manually overridden.
 */
function updateTimeBasedWallpaper() {
  if (!manualOverrideTimer) { // Only update if no manual override is active
    console.log("Updating time-based wallpaper (no manual override active).");
    updateWallpaper(false); // Call with manual = false
  } else {
     console.log("Skipping time-based wallpaper update due to active manual override.");
  }
}


// =============================================================================
// Initialization and Event Listeners
// =============================================================================

/**
 * Initializes the application by setting up event listeners and initial states.
 */
function initialize() {
  console.log("Initializing MacOS Interface Clone...");

  // --- Dock Icon Event Listeners ---
  icons.forEach((item, index) => {
    const listItem = item.closest('li'); // Get the parent <li> element
    const nameLabel = listItem?.querySelector('.name'); // Find the name label within the <li>

    if (!listItem || !nameLabel) {
      console.warn("Could not find parent li or name label for icon:", item);
      return; // Skip this icon if structure is unexpected
    }

    // Mouseover: Apply focus effect and show name label
    item.addEventListener("mouseover", (e) => {
      focus(e.target, index);
      nameLabel.style.visibility = 'visible';
    });

    // Mouseleave: Reset all icon styles and hide name label
    item.addEventListener("mouseleave", () => {
      icons.forEach((icon) => {
        icon.style.transform = "scale(1) translateY(0px)"; // Reset scale and translation
      });
      nameLabel.style.visibility = 'hidden';
    });

    // Click: Open the corresponding modal
    listItem.addEventListener('click', () => {
      const appName = listItem.dataset.app; // Get app name from <li>'s data attribute
      if (appName) {
        openModal(appName);
      } else {
        console.warn("Dock item clicked, but data-app attribute is missing:", listItem);
      }
    });
  });

  // --- Wallpaper Toggle Listener ---
  const wallpaperToggleButton = document.getElementById('toggle-wallpaper');
  if (wallpaperToggleButton) {
    wallpaperToggleButton.addEventListener('click', () => updateWallpaper(true));
  } else {
    console.warn("Wallpaper toggle button (#toggle-wallpaper) not found.");
  }

  // --- Initial Time and Wallpaper Update ---
  updateTime(); // Set initial time
  setInterval(updateTime, 1000); // Update time every second

  updateTimeBasedWallpaper(); // Set initial wallpaper based on time
  setInterval(updateTimeBasedWallpaper, 60000); // Check and update wallpaper every minute

  console.log("Initialization complete.");
}

// --- Start the application ---
document.addEventListener('DOMContentLoaded', initialize);
