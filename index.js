let rows = 10;
let cols = 10;
let isStartGame = false;
const createTableButton = document.getElementById('createTableButton');
const getNeighboursButton = document.getElementById('getNeighbours');
const verticalSize = document.getElementById('verticalSize');
const stepButton = document.getElementById('stepButton');
let field = document.getElementById('field');
const applicantForm = document.getElementById('form');
const randomButton = document.getElementById('getRandomButton')

const horizontalSize = document.getElementById('horizontalSize');

function cellHandleClick() {
  const cellClass = this.getAttribute('class');
  (cellClass === 'dead') ? this.setAttribute("class", 'life') : this.setAttribute("class", 'dead');
}

function getRandomCell() {
  const items = field.getElementsByTagName("td");
  const cellArr = Array.prototype.slice.call(items);
  cellArr.map((item) => {
    Math.round(Math.random()) ? item.setAttribute('class', 'life') : item.setAttribute('class', 'dead');
  });
};

function createGreed(rows, cols) {
  field.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    const cellRow = document.createElement('tr');
    for (let j = 0; j < cols; j++) {
      const td = document.createElement('td');
      td.setAttribute("id", `${i}_${j}`);
      td.setAttribute("class", 'dead');
      td.onclick = cellHandleClick;
      cellRow.appendChild(td);
    }
    field.appendChild(cellRow);
  }
  verticalSize.innerHTML = cols;
  horizontalSize.innerHTML = rows;
}

function handleFormSubmit(event) {
  event.preventDefault();
  rows = event.target[0].value;
  cols = event.target[1].value;
  createGreed(event.target[0].value, event.target[1].value)
}

function getNeighbours(cellArr) {
  const test = []
  cellArr.map((item) => {
    const classitem = item.getAttribute('id');
    const classItemArr = classitem.split('_').map(Number);
    test.push(...createNeighbours(classItemArr));
  });
  return (test);
};

function createNeighbours(cell) {
  const rightSide = (cell[0] === rows - 1) ? 0 : cell[0] + 1;
  const leftSide = (cell[0] === 0) ? rows - 1 : cell[0] - 1;
  const topSide = (cell[1] === 0) ? cols - 1 : cell[1] - 1;
  const bottomSide = (cell[1] === cols - 1) ? 0 : cell[1] + 1;
  const neighbours = [
    document.getElementById(`${cell[0]}_${topSide}`),
    document.getElementById(`${cell[0]}_${bottomSide}`),
    document.getElementById(`${rightSide}_${cell[1]}`),
    document.getElementById(`${rightSide}_${topSide}`),
    document.getElementById(`${rightSide}_${bottomSide}`),
    document.getElementById(`${leftSide}_${cell[1]}`),
    document.getElementById(`${leftSide}_${topSide}`),
    document.getElementById(`${leftSide}_${bottomSide}`),
  ];
  return (neighbours);
};

function checkMustLife(neighbours) {
  const neighboursArr = getNeighbours(neighbours);
  console.log('neighboursArr', neighboursArr);
};

function createLifeArr(neighbours) {
  const evolCandCellArr = [];
  const evoleCellArr = [];
  neighbours.map((item) => {
    if (item.getAttribute('class') === 'life' || evolCandCellArr.findIndex()) {
      return;
    }
    evolCandCellArr.push(item);
  });
  evolCandCellArr.map((item) => {
    let countForEvole = 0;
    getNeighbours([item]).map((item) => {
      if (item.getAttribute('class') === 'life check') {
        countForEvole++;
      }
    });
    if (countForEvole === 3) {
      evoleCellArr.push(item);
    }
  });
  return (evoleCellArr);
};

function createDieArr(aliveCellArr) {
  const dieCellArr = [];
  aliveCellArr.map((item) => {
    let countForDie = 0;
    getNeighbours([item]).map((item) => {
      if (item.getAttribute('class') === 'life') {
        countForDie++;
      }
    });
    if (countForDie > 3 || countForDie < 2) {
      dieCellArr.push(item);
    }
  });
  return(dieCellArr);
};

function step() {
  const startTime = Date.now();
  const aliveCell = document.getElementsByClassName('life');
  const aliveCellArr = Array.prototype.slice.call(aliveCell);
  const neighbours = getNeighbours(aliveCellArr);
  const lifeCellArr = createLifeArr(neighbours);
  const dieCellArr = createDieArr([...aliveCellArr]);

  dieCellArr.map((item) => {
    item.setAttribute("class", 'dead');
  });
  
  lifeCellArr.map((item) => {
    item.setAttribute("class", 'life');
  });

  const endTime = Date.now();
  console.log(endTime - startTime);
};


console.log('applicantForm', applicantForm);
applicantForm.addEventListener('submit', handleFormSubmit);
randomButton.addEventListener('click', getRandomCell);
getNeighboursButton.addEventListener('click', getNeighbours);
stepButton.addEventListener('click', step);
createGreed(rows, cols);

