import { useState } from "react";
import "./App.css";
import { Card } from "./components/card";
import { GameHeader } from "./components/GameHeader";

function shuffle(array) {
  const newArray = [...array]; // Copia para no modificar el original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice aleatorio
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // intercambia
  }
  return newArray;
}
const cardValues = [
  "🥝",
  "🍋",
  "🍇",
  "🍉",
  "🍐",
  "🍌",
  "🍑",
  "🥥",
  "🥝",
  "🍋",
  "🍇",
  "🍉",
  "🍐",
  "🍌",
  "🍑",
  "🥥",
];
function App() {
  


  const [cards, setCards] = useState(
    shuffle(cardValues).map((value, index) => ({
      id: index,
      value: value,
      isFlipped: false,
      isMatched: false,
    })),
  );

  const [played, setPlayed] = useState(0);
  const [matched, setMatched] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const handleCardClick = (card) => {
    if (card.isMatched || card.isFlipped || isBusy) return;

    setPlayed((prev) => prev + 1);

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c,
    );
    setCards(newCards);

    const flipped = newCards.filter((c) => c.isFlipped && !c.isMatched);
    if (flipped.length == 2) {
      setIsBusy(true);
      if (flipped[0].value == flipped[1].value) {
        
        const matchedCards = newCards.map((c) =>
          c.id === flipped[0].id || c.id === flipped[1].id
            ? { ...c, isMatched: true }
            : c,
        );

        setCards(matchedCards);
        setMatched((prev) => prev + 1);
        setIsBusy(false);
      
    }
    else {
    

      setTimeout(() => {
       const resetCards = newCards.map(c =>
          c.isMatched ? c : { ...c, isFlipped: false }
        );
        setCards(resetCards);
        setIsBusy(false);
      },1500);
    
    
  }}};
  return (
    <div className="app">
      <GameHeader score={matched} moves={played}></GameHeader>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card key={index} card={card} onClick={() => handleCardClick(card)} />
        ))}
      </div>
    </div>
  );
}

export default App;
