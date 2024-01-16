//DOM
const palabra = document.getElementById('word-random');
const mistakes = document.getElementById('word-wrong');
const tries = document.getElementById('tries');
const triesRadio = document.querySelectorAll('.radio-input');
const btnRandom = document.getElementById('random');
const btnReset = document.getElementById('reset');
const containerBottomWord = document.querySelector('.container-bottom-word');

//variables de Tries
let currentTries = 0;
const maxTries = 6;
//Funcion para iniciar el juego.
//Tries como mistakes se reinicia y se muestra otra palabra
function initGame() {
  mistakes.textContent = '';
  currentTries = 0;
  updateTriesText();
  resetRadioColors();
  wordRandom();
}
// Función para actualizar el texto de los intentos
function updateTriesText() {
  tries.textContent = `Tries(${currentTries}/5):`;
}
// Función para reiniciar los colores de los radios
function resetRadioColors() {
  triesRadio.forEach(radio => {
    radio.style.backgroundColor = ''; // Reiniciar colores de los radio
     radio.checked = false; // Desmarcar los radio-input
  });
}
// Función para terminar el juego.
function gameOver() {
  alert('¡Perdiste!');
  initGame();
}

//arreglo de las palabras a buscar
const words = [
  "roses",
  "rain",
  "sunshine",
  "butterfly",
  "ocean",
  "mountain",
  "chocolate",
  "adventure",
  "happiness",
  "guitar",
  "freedom",
  "laughter"
];

// Funcion para cambiar el orden las letras
function shuffleLetters(word) {
  const lettersArray = word.split("");
  for (let i = lettersArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lettersArray[i], lettersArray[j]] = [lettersArray[j], lettersArray[i]];
  }
  return lettersArray.join("");
}

// Funcion para mostrar palabra random
function wordRandom() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWords = words[randomIndex];
  const shuffledWord = shuffleLetters(randomWords);
  //Almacenamos la palabra original para comparar luego letra por letra
  palabra.dataset.originalWord = randomWords;
  //Mostramos la palabra random mezclada
  palabra.textContent = shuffledWord;

  //Creamos tantas input para las letras igual al tamaño de la palbra random
  containerBottomWord.innerHTML = "";
  for (let i = 0; i < randomWords.length; i++) {
    containerBottomWord.innerHTML += `<input type='text' class='letter-space' maxlength='1' placeholder='' data-index='${i}'>`; //max 1 letra por cada input.
  }
  //Damos evento a cada input con funcion de verifcar letra x letra
  const inputElements = document.querySelectorAll('.letter-space');
  inputElements.forEach(input => {
    input.addEventListener('input', checkLetter);
  });
}
// Función para verificar la letra
function checkLetter(event) {
  const input = event.target;
  const guessedLetter = input.value.toLowerCase();
  
  // Verificar si el campo está vacío (borrado), evitamos que el borrar lo tome como intento y mistake
  if (guessedLetter === '') {
    return;
  }
  //Se compara la palabra original con las letras del input
  const inputElements = document.querySelectorAll('.letter-space');
  const originalWord = palabra.dataset.originalWord;

  // Verificar si todas las letras coinciden
  // Se convierte un array los inputs y compara letra x letra
  const isWordGuessed = Array.from(inputElements).every((input, index) => {
    const letter = input.value.toLowerCase();
    return letter === originalWord[index].toLowerCase();
  });

  if (isWordGuessed) {
    // Mostrar el mensaje de ganaste
    alert('¡Ganaste!');
    initGame();
    return;
  }
  //Estilos para resaltar si la letra es correcta o no es correcta
  //Segun la palabra original
  const index = input.getAttribute('data-index');
  const actualLetter = originalWord[index].toLowerCase();

  if (guessedLetter === actualLetter) {
    input.style.color = 'green';
  } else {
    //Tomamos en cuenta los tries y mistakes
    input.style.color = 'red';
    mistakes.textContent += guessedLetter + ",";
    currentTries++;
    //El juego acaba si los intentos o mistakes llegaron a su limite
    //Sino los inputs cambian de color
    if (currentTries > maxTries || mistakes.textContent.split(',').length > maxTries) {
      gameOver();
    } else {
    
      triesRadio[currentTries-1].checked = true
      updateTriesText();
    }
  }
  input.style.border = '2px solid #672171';
  //Para pasar al siguiente input
  const currentIndex = Array.from(inputElements).indexOf(input);

  if (currentIndex < inputElements.length - 1) {
    const nextInput = inputElements[currentIndex + 1];
    nextInput.focus();
  }
}

//Funcion para resetear intentos y limpiar espacios
function cleanWords() {
  const inputElements = document.querySelectorAll('.letter-space');
  inputElements.forEach(input => {
    input.value = '';
    input.style.color = ''; // Reiniciar el color del texto
  });
  mistakes.textContent = '';
  currentTries = 0; // Reiniciar el contador de intentos
  updateTriesText();
  resetRadioColors();
}

// Inicializar el juego
tries.textContent = `Tries(${currentTries}/5):`;
initGame();

btnReset.addEventListener('click', cleanWords);
btnRandom.addEventListener('click', initGame);