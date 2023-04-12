import React, {useEffect, useReducer} from "react"

const LEVELS = [ 
    [ //MAPA  
    [8,8,8,8,8,8,8,8,1,1,1,1,1,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],        // 0=pole po ktorym gracz moze chodzic   
    [8,8,8,8,8,8,8,8,1,0,0,0,0,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],        // 1=sciana
    [8,8,8,8,8,8,8,8,1,0,0,0,0,1,1,1,1,1,8,8,8,8,8,8,8,8,8,8,8,8,8],        // 2=skrzynka
    [8,8,8,8,8,8,8,8,1,0,0,2,0,0,0,0,0,1,1,8,8,8,8,8,8,8,8,8,8,8,8],        // 4=miejsce gdzie odkladamy skrzynki,
    [8,8,1,1,1,1,1,1,1,0,0,0,0,0,1,2,0,0,1,8,8,8,8,8,8,8,8,8,8,8,8],        // 5=gracz
    [8,8,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,8,8,8,8,8,8,8,8,8,8,8,8],        // 8=dopelnienie mapy
    [8,8,1,0,0,0,0,0,2,0,0,0,0,1,1,1,1,1,1,8,8,8,8,8,8,8,8,8,8,8,8],        
    [8,8,1,0,0,0,0,0,0,0,0,2,1,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,1,1,0,0,0,0,0,0,0,0,0,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,8,8,8,8,1,1,1,1,8,8,8,8,8,8,8],
    [1,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,8,8,8,8,8,8,8],
    [1,0,0,0,0,1,0,0,4,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,8,8,8,8,8,8,8],
    [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,4,0,0,0,4,0,1,8,8,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,8,1,0,0,5,1],
    [1,0,4,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,0,0,0,4,0,0,1,0,0,0,0,0,1,1,0,0,0,0,2,0,0,1,8,8],
    [8,8,8,8,8,8,1,0,0,0,0,0,0,0,0,4,0,0,2,0,0,0,0,0,0,0,0,0,1,8,8],
    [8,8,8,8,8,8,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,8,8],
    [8,8,8,8,8,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,8,8],
    [8,8,8,8,8,8,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,8,8],
    [8,8,8,8,8,8,8,1,0,0,0,2,0,0,0,0,0,0,1,8,8,8,1,0,0,0,1,8,8,8,8],
    [8,8,8,8,8,8,8,1,0,0,0,0,0,0,0,0,0,4,1,8,8,8,1,0,0,0,1,8,8,8,8],
    [8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,1,1,8,8,8,1,1,1,1,1,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],



    ],]
    //             0       1       2        3     4         5       6     7        8  
const COLOR = ["#ddd", "	#00008b", "brown", null, "orange", "#000", null, "green", "transparent"]
const COLOR_IN_PLACE = 7 
const ITEM = {
  Playground:       0,
  Wall:             1,
  Box:              2,
  Storage:          4,
  Player:           5,
  World:            8 
}
const GAME_STATE = { 
    Running:          "RUNNING", 
    Done:             "DONE" 
  } 
  const ACTION = {
    Move:             "MOVE", 
    RestartLevel:     "resetuj poziom",
    PlayNextLevel:    "PLAY_NEXT_LEVEL"
  
  }
  const DIRECTION = { 
    Left:             37, 
    Right:            39, 
    Up:               38, 
    Down:             40 
  }
  function getInitialState(levelNo) {
    const LEVEL = LEVELS[levelNo]
    let level = [], player = {x: null, y: null}, box = []
  
    for (let y=0; y<LEVEL.length; y++) {
      level[y] = []
      for (let x=0; x<LEVEL[y].length; x++) {
        if ( [ITEM.Box, ITEM.Player].includes(LEVEL[y][x])) 
         
          level[y][x] = ITEM.Playground 
        else 
          level[y][x] = LEVEL[y][x] 
        if (LEVEL[y][x] === ITEM.Box)     box.push({x:x, y:y})    // Ustawianie skrzynek
        if (LEVEL[y][x] === ITEM.Player)  player = {x:x, y:y}     // Ustawianie pozycji gracza
      }
    }
    return {
      levelNo:  levelNo,
      status:   GAME_STATE.Running,
      level, player, box
    }
  }
  function GameReducer(state, action) {
    switch (action.type) {
      case ACTION.RestartLevel:
        return {...getInitialState(state.levelNo), status: GAME_STATE.Running}
      case ACTION.PlayNextLevel:
        return {...getInitialState(state.levelNo+1), status: GAME_STATE.Running}
      case ACTION.Move:
        let d = {x: 0, y: 0} 
        console.log(action.keyCode)
        if (DIRECTION.Left === action.keyCode)  d.x-- 
        if (DIRECTION.Right === action.keyCode) d.x++
        if (DIRECTION.Up === action.keyCode)    d.y--
        if (DIRECTION.Down === action.keyCode)  d.y++
        // sprawdzanie czy sciana wystepuje w miejscu do ktorego chcemy sie przeniesc
        if ( state.level[state.player.y+d.y][state.player.x+d.x] === ITEM.Wall) return {...state}
        // sprawdzanie czy gracz proboje przepchnac sprzynke
        if ( [...state.box].find(b => b.x===state.player.x+d.x && b.y===state.player.y+d.y) ) {
          // sprwadzanie czy jest mozliwe przepchniecie skrzynki
          if ( 
            [ITEM.Playground, ITEM.Storage].includes(state.level[state.player.y+2*d.y][state.player.x+2*d.x])  // sprawdzanie czy jest miejsce puste za skrzynka
            && ![...state.box].find(b => b.x === state.player.x+2*d.x && b.y === state.player.y+2*d.y)         // sprawdzanie czy za skrzynka nie stoi kolejna skyrzynka
          ) { // przemieszczenie sie do nowej pozycji z skrzynka
            let newState = {...state, player: {x: state.player.x+d.x, y: state.player.y+d.y}, box: [...state.box].map(b => {
              // sprawdzanie czy gracz chce sie przeniesc w miejsce gdzie jest skrzynka
              if ( (b.x === state.player.x+d.x) && (b.y === state.player.y+d.y) ) 
                return {x: b.x+d.x, y: b.y+d.y}
              else
                return b
            } ) }
            // sprawdzanie czy gracz przeszedl poziom lub gra sie konczyla
            let boxesInPlace = 0
            newState.box.forEach(b=>{ if (newState.level[b.y][b.x] === ITEM.Storage) boxesInPlace++ })
            if (boxesInPlace === newState.box.length) return {...newState, status:GAME_STATE.Done}
            return newState
          } else // nie mozna przeniesc poniewaz gracz musi stac w dobrym miejscu
            return {...state}
        }
        // chodzenie bez przemieszczenia sie skrzynki
        return {...state, player: {x: state.player.x+d.x, y: state.player.y+d.y}}
      default:  
    }
    return state
}
function getColor(y,x, color, player, box, isStorage) {
    if (player.y === y && player.x === x)                   return ITEM.Player
    if (box.find( b => (b.y===y && b.x===x)) && isStorage ) return COLOR_IN_PLACE
    if (box.find( b => (b.y===y && b.x===x)))               return ITEM.Box  
    return color
  }
  
  export default function Sokoban() {
    let [state, dispatch] = useReducer(GameReducer, getInitialState(0) )
    console.log(state)
  
    function handleMove(e) {
      if ( [DIRECTION.Left, DIRECTION.Right, DIRECTION.Up, DIRECTION.Down].includes(e.keyCode) ) {
        e.preventDefault(); 
        dispatch({type: ACTION.Move, keyCode: e.keyCode}) 
      }
    }
  
    useEffect(() => {
      document.addEventListener('keydown', handleMove); 
      return () => { document.removeEventListener('keydown', handleMove); }              // destroy
    });  
}