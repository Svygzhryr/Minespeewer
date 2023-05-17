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

let updateClock = async function() {
  let digit = 0;
  let timer = await setInterval(() => {
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
    console.log(randomPos);
    if (cell.classList.contains("bomb") || cell == e.target) {
      sbombs++;
    } else {
      cell.classList.add("bomb");
    }
  }
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

let checkNeighbors = function(a) {
  let xcord = +a.dataset.x;
  let ycord = +a.dataset.y;
  let bn = 0;
  let l = 1;
  
  // проверка всех клеток по часовой начиная от верхней левой
  // NorthWest, North, NorthEast, East, SouthEast, South, SouthWest, West
  let nw = document.querySelector(`[data-x="${xcord-l}"][data-y="${ycord-l}"]`);
  let n = document.querySelector(`[data-x="${xcord}"][data-y="${ycord-l}"]`);
  let ne = document.querySelector(`[data-x="${xcord+l}"][data-y="${ycord-l}"]`);
  let e = document.querySelector(`[data-x="${xcord+l}"][data-y="${ycord}"]`);
  let se = document.querySelector(`[data-x="${xcord+l}"][data-y="${ycord+l}"]`);
  let s = document.querySelector(`[data-x="${xcord}"][data-y="${ycord+l}"]`);
  let sw = document.querySelector(`[data-x="${xcord-l}"][data-y="${ycord+l}"]`);
  let w = document.querySelector(`[data-x="${xcord-l}"][data-y="${ycord}"]`);

  if (nw) {
    nw.classList.contains('bomb') ? bn++ : null;
  }
  if (n) {
    n.classList.contains('bomb') ? bn++ : null;
  }
  if (ne) {
    ne.classList.contains('bomb') ? bn++ : null;
  }
  if (e) {
    e.classList.contains('bomb') ? bn++ : null;
  }
  if (se) {
    se.classList.contains('bomb') ? bn++ : null;
  }
  if (s) {
    s.classList.contains('bomb') ? bn++ : null;
  }
  if (sw) {
    sw.classList.contains('bomb') ? bn++ : null;
  }
  if (w) {
    w.classList.contains('bomb') ? bn++ : null;
  }
  
  if (bn) {
    // конвертация количества бомб рядом в интенсивность оттенков, сам придумал
    a.style.color = `rgb(${bn*31}, 60, ${255 - bn*31})`
    a.innerHTML = bn;
  } else {
    // два способа автооткрытия: 
    // 1: непосредственно при нажатии будут определяться соседние бомбы их количество
    // 2: при генерации бомб все соседние от них клетки будут прибавлять к себе их количество

  }
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
    let a = e.target;
    if (a.classList.contains("grid__cell_active")) {
      if (!a.classList.contains("grid__cell_disabled")) {
        if (firstMove) {
          firstMove = false;
          setBombs(e);
        }
        clicks++;
        if (a.classList.contains("bomb")) {
          console.log("boom")
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
        } else {
          checkNeighbors(a);
        }
        checked = 1;
        document.querySelectorAll('.grid__cell_disabled').forEach(e => {
          checked++;
        })
        console.log(cells - bombs)
        if (checked == cells - bombs) {
          document.querySelectorAll(".bomb").forEach(e => {
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
  firstMove = true;
  resetCells();
  end.classList.remove('end_active');
}

let handleCellLeave = function(e) {
    e.target.classList.remove("grid__cell_active");
}

let startGame = function() {
  generateCells();
  updateClock();
}

startGame();

grid.addEventListener("contextmenu", (e) => {e.preventDefault()});
grid.addEventListener("mousedown", handleCellDown);
grid.addEventListener("mouseup", handleCellUp);
grid.addEventListener("mouseout", handleCellLeave);
restart.addEventListener("click", handleRestart)

