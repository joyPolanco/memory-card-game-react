const ICONS = {
  frutas: ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍", "🥥", "🍑", "🍋", "🍐", "🥭", "🫐", "🍈", "🍏"],
  animales: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🦄", "🦓", "🦘", "🦛"],
  numeros: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
  formas: ["🔴", "🟢", "🔵", "🟡", "🟣", "🟠", "⬛", "⬜", "🔺", "🔻", "⭐", "🔶", "🔷"],
  transportes: ["🚗", "🚙", "🚌", "🚎", "🚓", "🚕", "🚚", "🚛", "🚜", "🚲", "🛴", "🛵", "🛶", "🚤", "✈️", "🚁", "🚂"],
  deportes: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🥏", "🏓", "🏸", "🥋", "🥇", "🥈", "🥉", "🏅", "🏆", "🎯"],
  comida: ["🍕", "🍔", "🍟", "🌮", "🌯", "🍣", "🍤", "🍱", "🍲", "🥗", "🥩", "🍪", "🍩", "🍫", "🍬", "🍪"],
  instrumentos: ["🎸", "🎻", "🎺", "🥁", "🎷", "🎼", "🎹", "🎤", "🎧", "🎶", "🎵"]
};

export const generateBoard = (pares, tematica) => {
  // Total de cartas = pares * 2 (cada par tiene 2 cartas)
  const totalCards = pares * 2;
  
  // Seleccionar íconos necesarios para los pares
  const iconsList = ICONS[tematica] || ICONS.frutas;
  const neededIcons = pares;
  
  // Seleccionar íconos únicos (uno por cada par)
  const selectedIcons = [];
  for (let i = 0; i < neededIcons && i < iconsList.length; i++) {
    // Tomar íconos en orden (puedes randomizar si quieres)
    selectedIcons.push(iconsList[i % iconsList.length]);
  }
  
  // Si no hay suficientes íconos, repetir los existentes
  while (selectedIcons.length < neededIcons) {
    selectedIcons.push(selectedIcons[selectedIcons.length % selectedIcons.length]);
  }
  
  // Crear pares (duplicar cada ícono)
  let cardsArray = [];
  selectedIcons.forEach((icon, idx) => {
    // Cada ícono aparece dos veces (el par)
    cardsArray.push({ value: icon, pairId: idx });
    cardsArray.push({ value: icon, pairId: idx });
  });
  
  // Barajar las cartas
  const shuffled = shuffle(cardsArray);
  
  return shuffled.map((card, index) => ({
    id: index,
    value: card.value,
    pairId: card.pairId,
    isFlipped: false,
    isMatched: false
  }));
};

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};