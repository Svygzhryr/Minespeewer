let clicks = 0;
let stopTimer = false;
let bombs = 10;
let cells = 100;
let checked = 1;
let firstMove = true;

let app = document.createElement("section");
app.className = "app";
document.body.appendChild(app);

let controls = document.createElement('div');
controls.className = 'controls';
app.appendChild(controls);

let clock = document.createElement("div");
clock.className = "clock";
clock.innerHTML = "00:00";
controls.appendChild(clock);

let grid = document.createElement("div");
grid.className = "grid";
app.appendChild(grid);

let newGame = document.createElement('button');
newGame.className = "restart restart_alt";
newGame.innerHTML = "Reset"
controls.appendChild(newGame)

let end = document.createElement('div');
let restart = document.createElement('button');
let endMessage = document.createElement('h2');
endMessage.className = 'end__message';
endMessage.innerHTML = `Game over in ${clicks} moves. Try again.`;
end.className = 'end';
restart.className = 'restart';
restart.innerHTML = 'Restart'
app.appendChild(end);
end.appendChild(endMessage);
end.appendChild(restart);

let mask = document.createElement('div');
mask.className = "mask";
end.appendChild(mask);

let timer;
let updateClock = async function() {
  let digit = 0;
  timer = await setInterval(() => {
    if (stopTimer) {
      clearInterval(timer);
      return
    }
    digit++;
    let minutes = Math.floor(digit / 60);
    let seconds = Math.round(digit % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = `${minutes}:${seconds}`
  }, 1000)
}

let generateCells = function() {
  for (let i = 0; i < cells; i++) {
      let cell = document.createElement("button");
      cell.className = `grid__cell cell${i}`;
      let x = (i % 10) + 1;
      let y = Math.floor(i / 10) + 1;
      cell.setAttribute(`data-x`, x);
      cell.setAttribute(`data-y`, y);
    //   cell.innerHTML = `${x} </br> ${y}`;
      grid.appendChild(cell);
  }

}

let setBombs = function(e) {
  let sbombs = bombs;
  for (sbombs; sbombs > 0; sbombs--) {
    let randomPos = Math.round(Math.random() * 99);
    let cell = document.querySelector(`.cell${randomPos}`)
    if (cell.classList.contains("bomb") || cell == e.target) {
      sbombs++;
    } else {
      cell.classList.add("bomb");
    }
  }

  let bombCells = document.querySelectorAll(".bomb");
  bombCells.forEach(cell => {
    xcord = +cell.dataset.x;
    ycord = +cell.dataset.y;
    
    // проверка всех клеток по часовой начиная от верхней левой
    // NorthWest, North, NorthEast, East, SouthEast, South, SouthWest, West
    let nw = document.querySelector(`[data-x="${xcord-1}"][data-y="${ycord-1}"]`);
    let n = document.querySelector(`[data-x="${xcord}"][data-y="${ycord-1}"]`);
    let ne = document.querySelector(`[data-x="${xcord+1}"][data-y="${ycord-1}"]`);
    let e = document.querySelector(`[data-x="${xcord+1}"][data-y="${ycord}"]`);
    let se = document.querySelector(`[data-x="${xcord+1}"][data-y="${ycord+1}"]`);
    let s = document.querySelector(`[data-x="${xcord}"][data-y="${ycord+1}"]`);
    let sw = document.querySelector(`[data-x="${xcord-1}"][data-y="${ycord+1}"]`);
    let w = document.querySelector(`[data-x="${xcord-1}"][data-y="${ycord}"]`);
  
    if (nw && !nw.classList.contains("bomb")) {
      nw.innerHTML = +nw.innerHTML + 1;

    }
    if (n && !n.classList.contains("bomb")) {
      n.innerHTML = +n.innerHTML + 1;

    }
    if (ne && !ne.classList.contains("bomb")) {
      ne.innerHTML = +ne.innerHTML + 1;

    }
    if (e && !e.classList.contains("bomb")) {
      e.innerHTML = +e.innerHTML + 1;

    }
    if (se && !se.classList.contains("bomb")) {
      se.innerHTML= +se.innerHTML + 1;

    }
    if (s && !s.classList.contains("bomb")) {
      s.innerHTML = +s.innerHTML + 1;

    }
    if (sw && !sw.classList.contains("bomb")) {
      sw.innerHTML = +sw.innerHTML + 1;

    }
    if (w && !w.classList.contains("bomb")) {
      w.innerHTML = +w.innerHTML + 1;

    }
    
  })
}

let resetCells = function() {
  document.querySelectorAll('.grid__cell').forEach(e => {
    e.remove();
  });
  clock.innerHTML = "00:00";
  stopTimer = false;
  clicks = 0;
  startGame();
}

let checkNeighbors = function(el) {
  // console.log(el);

  // let xcord = +el.target.dataset.x;
  // let ycord = +el.target.dataset.y;

  // let n = document.querySelector(`[data-x="${xcord}"][data-y="${ycord-1}"]`);
  // let e = document.querySelector(`[data-x="${xcord+1}"][data-y="${ycord}"]`);
  // let s = document.querySelector(`[data-x="${xcord}"][data-y="${ycord+1}"]`);
  // let w = document.querySelector(`[data-x="${xcord-1}"][data-y="${ycord}"]`);

  // if (n.innerHTML == 0 && el.target.innerHTML == 0) {
  //   console.log(n)
  //   n.classList.add("grid__cell_disabled");
  //   checkNeighbors(n);
  // }
}

let handleCellDown = function(e) {
    if (e.target.className === "grid") {
        return null
    }
    let a = e.target;
    if (a.classList.contains("grid__cell_active")) {
      a.classList.remove("grid__cell_active");
    } a.classList.add("grid__cell_active");
}

let handleCellUp = function(e) {
    // проверка пкм ли это
    if (e.button == 2) {return}
    let a = e.target;
    // проверка на флажок
    if (a.classList.contains("flagged")) {return}
    if (a.classList.contains("grid__cell_active")) {
      if (!a.classList.contains("grid__cell_disabled")) {
        // первый ли это ход
        if (firstMove) {
          firstMove = false;
          setBombs(e);
          updateClock();

        }

        // окрашивание и появление текста в нажатой клетке в зависимости от количества ближайших бомб
        if (!e.target.classList.contains("bomb")) {
          let bn = e.target.innerHTML;
          e.target.style.color = `rgb(${bn*31}, 60, ${255 - bn*31})`;
          checkNeighbors(e);
        }

        clicks++;
        // проверка на бомбу нажатой клетки
        if (a.classList.contains("bomb")) {
          document.querySelectorAll(".bomb").forEach(e => {
            e.innerHTML = "*";

            e.classList.add("exposed");
          })

          // все события происходящие после проигрыша
          let moveString = clicks % 10 == 1 && clicks !== 11 ? 'move' : 'moves';
          endMessage.innerHTML = `Game over in ${clicks} ${moveString}. Try again.`;
          stopTimer = true;
          setTimeout(() => {
            end.classList.add('end_active');
          }, 1500)
        }
        checked = 1;
        document.querySelectorAll('.grid__cell_disabled').forEach(e => {
          checked++;
        })
        if (checked == cells - bombs) {
          document.querySelectorAll(".bomb").forEach(e => {
            e.innerHTML = "*";
            e.classList.add("exposed");
          })
          // события после выигрыша
          let moveString = clicks % 10 == 1 && clicks !== 11 ? 'move' : 'moves';
          endMessage.innerHTML = `Congrats! You won in ${clicks} ${moveString}.`;
          stopTimer = true;
          setTimeout(() => {
            end.classList.add('end_active');
          }, 1500)
        }
      }
      a.classList.remove("grid__cell_active");
      a.classList.add("grid__cell_disabled");
    } 
}

let handleRestart = function() {
  clearInterval(timer);
  firstMove = true;
  resetCells();
  end.classList.remove('end_active');
}

let handleCellLeave = function(e) {
  e.target.classList.remove("grid__cell_active");
}

let handleRMB = function(e) {
  let a = e.target;
  e.preventDefault();
  if (!a.classList.contains("grid__cell_disabled") && a.classList.contains("grid__cell")) {
    a.classList.toggle("flagged");
  }
  return false
}

let startGame = function() {
  generateCells();
}

startGame();

grid.addEventListener("contextmenu", handleRMB, false);
grid.addEventListener("mousedown", handleCellDown);
grid.addEventListener("mouseup", handleCellUp);
grid.addEventListener("mouseout", handleCellLeave);
restart.addEventListener("click", handleRestart);
newGame.addEventListener("click", handleRestart);

