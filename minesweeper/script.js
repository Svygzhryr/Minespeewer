let app = document.createElement('section');
app.className = 'app';
document.body.appendChild(app);

let grid = document.createElement('div');
grid.className = 'grid'
app.appendChild(grid);

let generateCells = function() {
  for (let i = 0; i < 100; i++) {
      let cell = document.createElement('button');
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
    if (cell.classList.contains('bomb')) {
      bombs++;
    } else {
      cell.classList.add('bomb');
      cell.innerHTML = '*';
    }
  }
}

let handleCellDown = function(e) {
    if (e.target.className === 'grid') {
        return null
    }
    let a = e.target;
    if (a.classList.contains('grid__cell_active')) {
      a.classList.remove('grid__cell_active');
    } a.classList.add('grid__cell_active');
}

let handleCellUp = function(e) {
    let a = e.target;
    if (a.classList.contains('grid__cell_active')) {
      a.classList.remove('grid__cell_active');
      a.classList.add('grid__cell_disabled')
      if (a.classList.contains('bomb')) {
        console.log('boom')
        document.querySelectorAll('.bomb').forEach(e => {
          e.classList.add('exposed');
        })
        // все события происходящие после проигрыша
      }
    } 
}

let handleCellLeave = function(e) {
    e.target.classList.remove('grid__cell_active');
}

generateCells();
setBombs();

grid.addEventListener('contextmenu', (e) => {e.preventDefault()});
grid.addEventListener('mousedown', handleCellDown);
grid.addEventListener('mouseup', handleCellUp);
grid.addEventListener('mouseout', handleCellLeave);

