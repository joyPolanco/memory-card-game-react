import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  Palette, 
  Zap, 
  Clock, 
  Target, 
  Trophy, 
  Timer,
  Apple,
  Dog,
  Flag,
  Eye,
  Hash,
  Square,
  Play,
  Star,
  CarIcon,
  HamburgerIcon,
  GuitarIcon
} from 'lucide-react';
import { pause, play } from '../../util/MusicPlayer';
import useAppStore from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const [complejidad, setComplejidad] = useState("medium");
  const [tematicas, setTematicas] = useState("frutas");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tiempoEstimado, setTiempoEstimado] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { setConfiguration, startPlaying } = useAppStore();
  const navigate = useNavigate();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const complejidadOpciones = [
    {
      nivel: "Fácil",
      valor: "easy",
      tiempo: "1 minuto",
      minutos: 1,
      pares: 12,
      icon: Star,
      // Para desktop
      rowDesktop: 3,
      colDesktop: 4,
      // Para móvil (más compacto)
      rowMobile: 3,
      colMobile: 4
    },
    {
      nivel: "Media",
      valor: "medium",
      tiempo: "51 segundos",
      minutos: 0.85,
      pares: 18,
      icon: Target,
      rowDesktop: 4,
      colDesktop: 9,
      rowMobile: 6,
      colMobile: 4
    },
    {
      nivel: "Alta",
      valor: "hard",
      tiempo: "42 segundos",
      minutos: 0.7,
      pares: 24,
      icon: Zap,
      rowDesktop: 6,
      colDesktop: 8,
      rowMobile: 6,
      colMobile: 4
    },
    {
      nivel: "Experto",
      valor: "expert",
      tiempo: "2 minutos",
      minutos: 2,
      pares: 30,
      icon: Trophy,
      rowDesktop: 6,
      colDesktop: 10,
      rowMobile: 6,
      colMobile: 5
    }
  ];

  const tematicasOpciones = [
    { id: "frutas", nombre: "Frutas", icon: Apple },
    { id: "animales", nombre: "Animales", icon: Dog },
    { id: "colores", nombre: "Colores", icon: Eye },
    { id: "numeros", nombre: "Números", icon: Hash },
    { id: "formas", nombre: "Formas", icon: Square },
    { id: "transportes", nombre: "Transportes", icon: CarIcon },
    { id: "comida", nombre: "Comida", icon: HamburgerIcon },
    { id: "instrumentos", nombre: "instrumentos", icon: GuitarIcon },
  ];

  const handleComplejidadChange = (valor) => {
    setComplejidad(valor);
    const opcion = complejidadOpciones.find(opt => opt.valor === valor);
    if (opcion) {
      setTiempoEstimado(opcion.tiempo);
    }
  };

  const handleStartGame = () => {
    const selectedComplexity = complejidadOpciones.find(opt => opt.valor === complejidad);
    
    const configuracion = {
      complejidad,
      tematica: tematicas,
      soundEnabled,
      tiempoLimite: selectedComplexity?.minutos || 1,
      pares: selectedComplexity?.pares || 8,
      // Usar valores responsive según el dispositivo
      col: isMobile ? (selectedComplexity?.colMobile || 4) : (selectedComplexity?.colDesktop || 4),
      row: isMobile ? (selectedComplexity?.rowMobile || 4) : (selectedComplexity?.rowDesktop || 4),
      id: Date.now()
    };

    setConfiguration(configuracion);
    startPlaying();
    navigate("/game");
  };

  const SoundIcon = soundEnabled ? Volume2 : VolumeX;

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <div className="lobby-header">
          <div className="game-icon">
            <Gamepad2 size={64} strokeWidth={1.5} />
          </div>
          <h1 className="game-title">Memory Game</h1>
          <p className="game-subtitle">¡Pon a prueba tu memoria!</p>
        </div>
        <div className="config-section">
          <h2 className="section-title">Configuración del Juego</h2>
          
          {/* Configuración de Sonido */}
          <div className="config-item">
            <div className="config-label">
              <SoundIcon size={22} className="config-icon" />
              <span className="config-text">Sonido</span>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="soundToggle"
                checked={soundEnabled}
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  soundEnabled ? play() : pause();
                }}
              />
              <label htmlFor="soundToggle" className="toggle-label">
                <span className="toggle-on">ON</span>
                <span className="toggle-off">OFF</span>
              </label>
            </div>
          </div>
          
          <div className='grid-section'>
            {/* Configuración de Temática */}
            <div className="config-item">
              <div className="config-label">
                <Palette size={22} className="config-icon" />
                <span className="config-text">Temática</span>
              </div>
              <div className="thematic-buttons">
                {tematicasOpciones.map((tema) => {
                  const Icon = tema.icon;
                  return (
                    <button
                      key={tema.id}
                      className={`thematic-btn ${tematicas === tema.id ? "active" : ""}`}
                      onClick={() => setTematicas(tema.id)}
                    >
                      <Icon size={28} className="thematic-icon" />
                      <span className="thematic-name">{tema.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuración de Complejidad */}
            <div className="config-item">
              <div className="config-label">
                <Zap size={22} className="config-icon" />
                <span className="config-text">Complejidad</span>
              </div>
              <div className="complexity-buttons">
                {complejidadOpciones.map((opcion) => {
                  const Icon = opcion.icon;
                  return (
                    <button
                      key={opcion.valor}
                      className={`complexity-btn ${complejidad === opcion.valor ? "active" : ""}`}
                      onClick={() => handleComplejidadChange(opcion.valor)}
                    >
                      <Icon size={24} className="complexity-icon" />
                      <div className="complexity-content">
                        <span className="complexity-level">{opcion.nivel}</span>
                        <span className="complexity-time">{opcion.tiempo}</span>
                        <span className="complexity-pairs">{opcion.pares} pares</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tiempo Estimado */}
          {tiempoEstimado && (
            <div className="time-estimate">
              <Timer size={28} className="time-icon" />
              <div className="time-info">
                <span className="time-label">Tiempo estimado:</span>
                <span className="time-value">{tiempoEstimado}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botón Iniciar Partida */}
        <button className="start-button" onClick={handleStartGame}>
          <span className="button-text">Iniciar Partida</span>
          <Play size={20} className="button-icon" />
        </button>

        {/* Información adicional */}
        <div className="game-info">
          <div className="info-item">
            <Target size={18} className="info-icon" />
            <span className="info-text">Encuentra todas las parejas</span>
          </div>
          <div className="info-item">
            <Trophy size={18} className="info-icon" />
            <span className="info-text">Menos movimientos = Mejor puntuación</span>
          </div>
          <div className="info-item">
            <Timer size={18} className="info-icon" />
            <span className="info-text">Completa antes de que termine el tiempo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;