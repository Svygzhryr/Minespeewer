let fieldBombs = 10;
let fieldColumns = 10;
let fieldRows = 10;
let cells = fieldColumns * fieldRows;

let clickCount = 0;
let cellsChecked = 1;
let isTimerStopped = false;
let isFirstMove = true;

let timer;

const app = document.createElement("section");
app.className = "app";
document.body.appendChild(app);

const controls = document.createElement("div");
controls.className = "controls";
app.appendChild(controls);

const clock = document.createElement("div");
clock.className = "clock";
clock.innerHTML = "00:00";
controls.appendChild(clock);

const grid = document.createElement("div");
grid.className = "grid";
app.appendChild(grid);

const newGame = document.createElement("button");
newGame.className = "restart restart_alt";
newGame.innerHTML = "Reset";
controls.appendChild(newGame);

const bottomControls = document.createElement("div");
bottomControls.className = "bottomControls";
app.appendChild(bottomControls);

// в общем надо сделать просто три сложности

const easyButton = document.createElement("button");
easyButton.className = "easyButton";
easyButton.innerHTML = "Easy";
bottomControls.appendChild(easyButton);

const mediumButton = document.createElement("button");
mediumButton.className = "mediumButton";
mediumButton.innerHTML = "Medium";
bottomControls.appendChild(mediumButton);

const hardButton = document.createElement("button");
hardButton.className = "hardButton";
hardButton.innerHTML = "Hard";
bottomControls.appendChild(hardButton);

const end = document.createElement("div");
const restart = document.createElement("button");
const endMessage = document.createElement("h2");
endMessage.className = "end__message";
endMessage.innerHTML = `Game over in ${clickCount} moves. Try again.`;
end.className = "end";
restart.className = "restart";
restart.innerHTML = "Restart";
app.appendChild(end);
end.appendChild(endMessage);
end.appendChild(restart);

const mask = document.createElement("div");
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

function generateCells(cols, rows) {
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  for (let i = 0; i < cells; i++) {
    let cell = document.createElement("button");
    cell.className = `grid__cell cell${i}`;
    let x = (i % cols) + 1;
    let y = Math.floor(i / cols) + 1;
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
  let sbombs = fieldBombs;
  for (sbombs; sbombs > 0; sbombs--) {
    let randomPos = Math.round(Math.random() * (cells - 1));
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
    e.innerHTML = "✴︎";

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
      (cell.classList.contains("grid__cell_active") || isRecursive) &&
      !cell.classList.contains("grid__cell_disabled")
    ) {
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

      if (cellsChecked == cells - fieldBombs) {
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

function handleDifficulty(diff) {
  const obj = {
    easy: {
      cols: 10,
      rows: 10,
      bombs: 10,
    },
    medium: {
      cols: 20,
      rows: 10,
      bombs: 30,
    },
    hard: {
      cols: 30,
      rows: 11,
      bombs: 70,
    },
  };

  const { cols, rows, bombs } = obj[diff];

  fieldColumns = cols;
  fieldRows = rows;
  fieldBombs = bombs;
  cells = cols * rows;
  handleRestart();
}

function startGame() {
  generateCells(fieldColumns, fieldRows);
}

grid.addEventListener("contextmenu", handleRMB, false);
grid.addEventListener("mousedown", handleMouseDown);
grid.addEventListener("mouseup", handleMouseUp);
grid.addEventListener("mouseout", handleMouseLeave);
restart.addEventListener("click", handleRestart);
newGame.addEventListener("click", handleRestart);
easyButton.addEventListener("click", () => {
  handleDifficulty("easy");
});
mediumButton.addEventListener("click", () => {
  handleDifficulty("medium");
});
hardButton.addEventListener("click", () => {
  handleDifficulty("hard");
});

startGame();
