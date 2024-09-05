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
