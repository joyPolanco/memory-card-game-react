import React, { useState, useEffect } from "react";
import { Card } from "../components/card";
import { GameHeader } from "../components/GameHeader";
import { generateBoard } from "../../util/IconsGenerator.js";
import useAppStore from "../store/useAppStore.js";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";

function Game() {
  const [cards, setCards] = useState([]);
  const [played, setPlayed] = useState(0);
  const [matched, setMatched] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isGameRestored, setIsGameRestored] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const { 
    configuration, 
    isPlaying, 
    isRunning, 
    setConfiguration,
    setIsPlaying,
    setIsRunning,
    startPlaying 
  } = useAppStore();
  const navigate = useNavigate();

  // Función para guardar configuración en localStorage
  const saveConfigToLocalStorage = (config) => {
    if (config) {
      localStorage.setItem("game_configuration", JSON.stringify(config));
      localStorage.setItem("game_timestamp", Date.now().toString());
    }
  };

  // Función para cargar configuración desde localStorage
  const loadConfigFromLocalStorage = () => {
    const savedConfig = localStorage.getItem("game_configuration");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return config;
      } catch (error) {
        console.error("Error al cargar configuración:", error);
        return null;
      }
    }
    return null;
  };

  // Función para guardar estado del juego en localStorage
  const saveGameState = (gameCards, moves, matches, gameIsPlaying, gameIsRunning) => {
    if (configuration && gameCards) {
      const gameState = {
        cards: gameCards,
        played: moves,
        matched: matches,
        isPlaying: gameIsPlaying,
        isRunning: gameIsRunning,
        timestamp: Date.now(),
        configId: configuration.id || Date.now()
      };
      localStorage.setItem("game_state", JSON.stringify(gameState));
    }
  };

  // Función para cargar estado del juego desde localStorage
  const loadGameState = () => {
    const savedState = localStorage.getItem("game_state");
    const savedConfig = loadConfigFromLocalStorage();
    
    if (savedState && savedConfig) {
      try {
        const gameState = JSON.parse(savedState);
        const isRecent = (Date.now() - gameState.timestamp) < 3600000;
        
        if (isRecent && gameState.configId === (savedConfig.id || Date.now())) {
          return gameState;
        }
      } catch (error) {
        console.error("Error al cargar estado del juego:", error);
      }
    }
    return null;
  };

  // Efecto para redirigir o cargar configuración
  useEffect(() => {
    const localConfig = loadConfigFromLocalStorage();
    
    if (!configuration && localConfig) {
      setConfiguration(localConfig);
    } else if (!configuration && !localConfig) {
      navigate("/lobby");
    } else if (configuration) {
      saveConfigToLocalStorage(configuration);
    }
  }, [configuration, navigate, setConfiguration]);

  // Efecto para generar o restaurar el tablero
  useEffect(() => {
    if (!configuration) return;

    const savedGameState = loadGameState();
    
    if (savedGameState && savedGameState.cards && savedGameState.cards.length > 0) {
      setCards(savedGameState.cards);
      setPlayed(savedGameState.played);
      setMatched(savedGameState.matched);
      
      if (savedGameState.isPlaying !== undefined) {
        setIsPlaying(savedGameState.isPlaying);
      } else {
        setIsPlaying(true);
      }
      
      if (savedGameState.isRunning !== undefined) {
        setIsRunning(savedGameState.isRunning);
      } else {
        setIsRunning(true);
      }
      
      setIsGameRestored(true);
      console.log("Juego restaurado:", { 
        isPlaying: savedGameState.isPlaying, 
        isRunning: savedGameState.isRunning,
        matched: savedGameState.matched
      });
    } else {
      const board = generateBoard(configuration.pares, configuration.tematica);
      setCards(board);
      setPlayed(0);
      setMatched(0);
      setIsPlaying(true);
      setIsRunning(true);
      setIsGameRestored(false);
      console.log("Nuevo juego generado con", configuration.pares, "pares");
    }
  }, [configuration, setIsPlaying, setIsRunning]);

  // Guardar estado del juego automáticamente
  useEffect(() => {
    if (cards.length > 0 && configuration) {
      saveGameState(cards, played, matched, isPlaying, isRunning);
    }
  }, [cards, played, matched, configuration, isPlaying, isRunning]);

  // Verificar si el juego está completo
  useEffect(() => {
    const totalPairs = configuration?.pares || 0;
    if (matched === totalPairs && totalPairs > 0 && !isBusy && !showWinMessage) {
      console.log("🎉 Juego completado! Total de pares:", totalPairs);
      setShowWinMessage(true);
      setIsPlaying(false);
      setIsRunning(false);
      localStorage.removeItem("game_state");
      
      // Ocultar mensaje después de 3 segundos y redirigir
      setTimeout(() => {
        setShowWinMessage(false);
        navigate("/lobby");
      }, 3000);
    }
  }, [matched, configuration, isBusy, setIsPlaying, setIsRunning, navigate, showWinMessage]);

  const handleCardClick = (card) => {
    if (card.isMatched || card.isFlipped || isBusy || !isPlaying || !isRunning) {
      console.log("Carta no válida para voltear:", {
        isMatched: card.isMatched,
        isFlipped: card.isFlipped,
        isBusy,
        isPlaying,
        isRunning
      });
      return;
    }

    console.log("Volteando carta:", card.value, "ID:", card.id);

    setPlayed((prev) => prev + 1);

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const flipped = newCards.filter((c) => c.isFlipped && !c.isMatched);
    console.log("Cartas volteadas:", flipped.length);

    if (flipped.length === 2) {
      setIsBusy(true);
      
      const card1 = flipped[0];
      const card2 = flipped[1];
      
      const isMatch = card1.pairId === card2.pairId;
      
      console.log("Comparando cartas:", {
        card1: card1.value,
        card2: card2.value,
        pairId1: card1.pairId,
        pairId2: card2.pairId,
        isMatch
      });

      if (isMatch) {
        console.log("✅ ¡MATCH encontrado!");
        const updated = newCards.map((c) =>
          c.id === card1.id || c.id === card2.id
            ? { ...c, isMatched: true, isFlipped: true }
            : c
        );
        
        setCards(updated);
        setMatched((prev) => {
          const newMatched = prev + 1;
          console.log("Pares encontrados:", newMatched);
          return newMatched;
        });
        setIsBusy(false);
      } else {
        console.log("❌ No hay match, volteando...");
        setTimeout(() => {
          const reset = newCards.map((c) =>
            c.isMatched ? c : { ...c, isFlipped: false }
          );
          setCards(reset);
          setIsBusy(false);
        }, 800);
      }
    }
  };

  const handleCleanup = () => {
    if (window.confirm("¿Limpiar partida guardada?")) {
      localStorage.removeItem("game_state");
      localStorage.removeItem("game_configuration");
      localStorage.removeItem("game_timestamp");
      navigate("/lobby");
    }
  };

  if (!configuration) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        color: "white",
        fontSize: "20px"
      }}>
        Cargando configuración...
      </div>
    );
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${configuration.col || 4}, minmax(60px, 1fr))`,
    gridTemplateRows: `repeat(${configuration.row || 4}, auto)`,
    gap: "10px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%"
  };

  return (
    <div className="app" style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Mensaje flotante de victoria */}
      {showWinMessage && (
        <div className="win-message-overlay">
          <div className="win-message">
            <div className="win-emoji">🏆</div>
            <h2 className="win-title">¡FELICIDADES!</h2>
            <p className="win-text">Completaste el juego</p>
            <div className="win-stats">
              <span>🎯 {matched} pares</span>
              <span>🔄 {played} movimientos</span>
            </div>
            <div className="win-redirect">Redirigiendo al lobby...</div>
          </div>
        </div>
      )}

      <Timer 
        className="timer" 
        initialTime={configuration?.tiempoLimite || 1} 
        onTimeUp={() => {
          localStorage.removeItem("game_state");
          setIsPlaying(false);
        }}
      />

      <div style={{ flex: 1 }}>
        <GameHeader score={matched} moves={played} />
        
        {/* Indicador de pausa */}
        {!isRunning && isPlaying && (
          <div style={{
            textAlign: "center",
            padding: "8px",
            backgroundColor: "#f39c12",
            color: "white",
            borderRadius: "8px",
            marginBottom: "10px",
            fontSize: "14px",
            fontWeight: "bold"
          }}>
            ⏸ JUEGO PAUSADO - Presiona ▶ para continuar
          </div>
        )}
        
        {isGameRestored && (
          <div style={{
            textAlign: "center",
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "8px",
            marginBottom: "10px",
            fontSize: "12px"
          }}>
            ✅ Partida restaurada correctamente
          </div>
        )}
        
        <button 
          onClick={handleCleanup}
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 999
          }}
        >
          Limpiar partida
        </button>

        <div className="cards-grid" style={gridStyle}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => {
                if (isPlaying && isRunning && !isBusy) {
                  handleCardClick(card);
                }
              }}
            />
          ))}
        </div>
        
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "12px",
          color: "#666"
        }}>
          Pares encontrados: {matched} / {configuration.pares}
        </div>
      </div>
    </div>
  );
}

export default Game;