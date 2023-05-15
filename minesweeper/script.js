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
endMessage.innerHTML = `Game over in ${0} moves. Try again.`;
end.className = 'end';
restart.className = 'restart';
restart.innerHTML = 'Restart'
app.appendChild(end);
end.appendChild(endMessage);
end.appendChild(restart);

let stopTimer = false;

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
  for (let i = 0; i < 100; i++) {
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

let setBombs = function() {
  let bombs = 10;

  for (bombs; bombs > 0; bombs--) {
    let randomPos = Math.round(Math.random() * 99);
    let cell = document.querySelector(`.cell${randomPos}`)
    console.log(randomPos);
    if (cell.classList.contains("bomb")) {
      bombs++;
    } else {
      cell.classList.add("bomb");
      cell.innerHTML = "*";
    }
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
      a.classList.remove("grid__cell_active");
      a.classList.add("grid__cell_disabled")
      if (a.classList.contains("bomb")) {
        console.log("boom")
        document.querySelectorAll(".bomb").forEach(e => {
          e.classList.add("exposed");
        })

        // все события происходящие после проигрыша
        stopTimer = true;
        setTimeout(() => {
          end.classList.add('end_active');
        }, 1500)
      }
    } 
}

let handleCellLeave = function(e) {
    e.target.classList.remove("grid__cell_active");
}

generateCells();
// эту функцию можно вызывать после первого клика
setBombs();
updateClock();

grid.addEventListener("contextmenu", (e) => {e.preventDefault()});
grid.addEventListener("mousedown", handleCellDown);
grid.addEventListener("mouseup", handleCellUp);
grid.addEventListener("mouseout", handleCellLeave);

