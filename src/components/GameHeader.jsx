
export const GameHeader =({score,moves})=>{
    return <div className="game-header">
<h1>🃏Juego memorización de cartas</h1>
<div className="stats">
    <div className="stat-item">
        <span className="stat-label" >PUNTUACIÓN</span><span className="stat-value" id="score">{score}</span>

    </div>
     <div className="stat-item">
        <span className="stat-label"  >JUGADAS</span><span className="stat-value" id="play">{moves}</span>

    </div>
</div>
    </div>
}

