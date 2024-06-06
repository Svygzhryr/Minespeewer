const bombs = 10;
const cells = 100;

let clickCount = 0;
let cellsChecked = 1;
let isTimerStopped = false;
let isFirstMove = true;

let timer;

let app = document.createElement("section");
app.className = "app";
document.body.appendChild(app);

let controls = document.createElement("div");
controls.className = "controls";
app.appendChild(controls);

let clock = document.createElement("div");
clock.className = "clock";
clock.innerHTML = "00:00";
controls.appendChild(clock);

let grid = document.createElement("div");
grid.className = "grid";
app.appendChild(grid);

let newGame = document.createElement("button");
newGame.className = "restart restart_alt";
newGame.innerHTML = "Reset";
controls.appendChild(newGame);

let end = document.createElement("div");
let restart = document.createElement("button");
let endMessage = document.createElement("h2");
endMessage.className = "end__message";
endMessage.innerHTML = `Game over in ${clickCount} moves. Try again.`;
end.className = "end";
restart.className = "restart";
restart.innerHTML = "Restart";
app.appendChild(end);
end.appendChild(endMessage);
end.appendChild(restart);

let mask = document.createElement("div");
mask.className = "mask";
end.appendChild(mask);

async function updateClock() {
  let digit = 0;
  timer = setInterval(() => {
    if (isTimerStopped) {
      clearInterval(timer);
      return;
    }
    digit++;
    let minutes = Math.floor(digit / 60);
    let seconds = Math.round(digit % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    clock.innerHTML = `${minutes}:${seconds}`;
  }, 1000);
}

function generateCells() {
  for (let i = 0; i < cells; i++) {
    let cell = document.createElement("button");
    cell.className = `grid__cell cell${i}`;
    let x = (i % 10) + 1;
    let y = Math.floor(i / 10) + 1;
    cell.setAttribute(`data-x`, x);
    cell.setAttribute(`data-y`, y);
    grid.appendChild(cell);
  }
}

function getNeighbors(x, y) {
  // проверка всех клеток по часовой начиная от верхней левой
  // NorthWest, North, NorthEast, East, SouthEast, South, SouthWest, West
  let nw = document.querySelector(`[data-x="${x - 1}"][data-y="${y - 1}"]`);
  let n = document.querySelector(`[data-x="${x}"][data-y="${y - 1}"]`);
  let ne = document.querySelector(`[data-x="${x + 1}"][data-y="${y - 1}"]`);
  let e = document.querySelector(`[data-x="${x + 1}"][data-y="${y}"]`);
  let se = document.querySelector(`[data-x="${x + 1}"][data-y="${y + 1}"]`);
  let s = document.querySelector(`[data-x="${x}"][data-y="${y + 1}"]`);
  let sw = document.querySelector(`[data-x="${x - 1}"][data-y="${y + 1}"]`);
  let w = document.querySelector(`[data-x="${x - 1}"][data-y="${y}"]`);
  return [nw, n, ne, e, se, s, sw, w];
}

function setBombs(firstClickedCell) {
  let sbombs = bombs;
  for (sbombs; sbombs > 0; sbombs--) {
    let randomPos = Math.round(Math.random() * 99);
    let cell = document.querySelector(`.cell${randomPos}`);
    if (cell.classList.contains("bomb") || cell == firstClickedCell) {
      sbombs++;
    } else {
      cell.classList.add("bomb");
    }
  }

  let bombCells = document.querySelectorAll(".bomb");
  bombCells.forEach((cell) => {
    xcord = +cell.dataset.x;
    ycord = +cell.dataset.y;

    const neighbors = getNeighbors(xcord, ycord);

    neighbors.map((cell) => {
      if (cell && !cell.classList.contains("bomb")) ++cell.innerHTML;
    });
  });
}

function resetCells() {
  document.querySelectorAll(".grid__cell").forEach((e) => {
    e.remove();
  });
  clock.innerHTML = "00:00";
  isTimerStopped = false;
  clickCount = 0;
  startGame();
}

function handleMouseDown(e) {
  if (e.target.className === "grid") {
    return null;
  }
  let a = e.target;
  if (a.classList.contains("grid__cell_active")) {
    a.classList.remove("grid__cell_active");
  }
  a.classList.add("grid__cell_active");
}

function endTheGame(isWon = false) {
  document.querySelectorAll(".bomb").forEach((e) => {
    e.innerHTML = "*";

    e.classList.add("exposed");
  });

  let moveString = clickCount % 10 == 1 && clickCount !== 11 ? "move" : "moves";
  endMessage.innerHTML = isWon
    ? `Congrats! You won in ${clickCount} ${moveString}.`
    : `Game over in ${clickCount} ${moveString}. Try again.`;
  isTimerStopped = true;
  setTimeout(() => {
    end.classList.add("end_active");
  }, 1500);
}

function handleMouseUp(event) {
  let target = event.target;

  // проверка пкм ли это
  if (event.button == 2) {
    return;
  }

  clickCount++;

  function cellClickHandler(cell, isRecursive = false) {
    // проверка на флажок
    if (cell.classList.contains("flagged")) {
      return;
    }

    if (
      (cell.classList.contains("grid__cell_active") &&
        !cell.classList.contains("grid__cell_disabled")) ||
      (isRecursive && !cell.classList.contains("grid__cell_disabled"))
    ) {
      console.log("called");

      // первый ли это ход
      if (isFirstMove) {
        isFirstMove = false;
        setBombs(cell);
        updateClock();
      }

      // окрашивание и появление текста в нажатой клетке в зависимости от количества ближайших бомб
      if (!cell.classList.contains("bomb")) {
        let bn = cell.innerHTML;
        cell.style.color = `rgb(${bn * 31}, 60, ${255 - bn * 31})`;
      }

      // проверка на бомбу нажатой клетки
      if (cell.classList.contains("bomb")) {
        endTheGame(false);
      }

      cellsChecked = 1;
      document.querySelectorAll(".grid__cell_disabled").forEach((e) => {
        cellsChecked++;
      });

      if (cellsChecked == cells - bombs) {
        endTheGame(true);
      }

      cell.classList.remove("grid__cell_active");
      cell.classList.add("grid__cell_disabled");

      if (cell.innerHTML) return;

      const neighbors = getNeighbors(+cell.dataset.x, +cell.dataset.y);
      neighbors.forEach((cell) => {
        if (cell) cellClickHandler(cell, (isRecursive = true));
      });
    }
  }

  cellClickHandler(target);
}

function handleRestart() {
  clearInterval(timer);
  isFirstMove = true;
  resetCells();
  end.classList.remove("end_active");
}

function handleMouseLeave(e) {
  e.target.classList.remove("grid__cell_active");
}

function handleRMB(e) {
  let a = e.target;
  e.preventDefault();
  if (
    !a.classList.contains("grid__cell_disabled") &&
    a.classList.contains("grid__cell")
  ) {
    a.classList.toggle("flagged");
  }
  return false;
}

function startGame() {
  generateCells();
}

grid.addEventListener("contextmenu", handleRMB, false);
grid.addEventListener("mousedown", handleMouseDown);
grid.addEventListener("mouseup", handleMouseUp);
grid.addEventListener("mouseout", handleMouseLeave);
restart.addEventListener("click", handleRestart);
newGame.addEventListener("click", handleRestart);

startGame();
