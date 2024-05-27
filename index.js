let rows = 10;
let cols = 10;
let isStartGame = false;
const lastTimeInfo = document.getElementById('lastTimeInfo');
const longestTimeInfo = document.getElementById('longestTimeInfo');
const clearTableButton = document.getElementById('clearTableButton');
const clearButton = document.getElementById('clearButton');
const stopButton = document.getElementById('stopButton');
const verticalSize = document.getElementById('verticalSize');
const stepButton = document.getElementById('stepButton');
const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitButton');
const field = document.getElementById('field');
const applicantForm = document.getElementById('form');
const randomButton = document.getElementById('getRandomButton');
const horizontalSize = document.getElementById('horizontalSize');

function cellHandleClick() {
    const cellClass = this.getAttribute('class');
    (cellClass === 'dead') ? this.setAttribute("class", 'life') : this.setAttribute("class", 'dead');
};

function getRandomCell() {
    const items = field.getElementsByTagName("td");
    const cellArr = Array.prototype.slice.call(items);
    cellArr.forEach((item) => {
        Math.round(Math.random()) ? item.setAttribute('class', 'life') : item.setAttribute('class', 'dead');
    });
};

const clearGreed = () => {
    const items = Array.prototype.slice.call(field.getElementsByTagName("td"));
    items.forEach((item) => {
        item.setAttribute('class', 'dead');
    });
};

const disableToggleButtons = () => {
    clearButton.disabled = !clearButton.disabled;
    stepButton.disabled = !stepButton.disabled;
    randomButton.disabled = !randomButton.disabled;
    startButton.disabled = !startButton.disabled;
    submitButton.disabled = !submitButton.disabled;
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
        };
        field.appendChild(cellRow);
    };
    verticalSize.innerHTML = cols;
    horizontalSize.innerHTML = rows;
};

function handleFormSubmit(event) {
    event.preventDefault();
    rows = event.target[0].value;
    cols = event.target[1].value;
    createGreed(event.target[0].value, event.target[1].value);
};

function getNeighbours(cellArr) {
    const neighboursArr = [];
    cellArr.map((item) => {
        const classitem = item.getAttribute('id');
        const classItemArr = classitem.split('_').map(Number);
        neighboursArr.push(...createNeighbours(classItemArr));
    });
    return (neighboursArr);
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

function createLifeArr(neighbours) {
    const evolCandCellArr = [];
    const evoleCellArr = [];
    neighbours.forEach((item) => {
        if (item.getAttribute('class') === 'life') {
            return;
        }
        evolCandCellArr.push(item);
    });
    evolCandCellArr.forEach((item) => {
        let countForEvole = 0;
        getNeighbours([item]).forEach((item) => {
            if (item.getAttribute('class') === 'life') {
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
        getNeighbours([item]).forEach((item) => {
            if (item.getAttribute('class') === 'life') {
                countForDie++;
            }
        });
        if (countForDie > 3 || countForDie < 2) {
            dieCellArr.push(item);
        }
    });
    return (dieCellArr);
};

function step() {
    const startTime = performance.now();
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
    const endTime = performance.now();
    updateInfo(endTime - startTime, false);
    return ({lifeCell: lifeCellArr, dieCell: dieCellArr});
};

const startGame = () => {
    stopButton.disabled = false;
    isStartGame = true;
    if (isStartGame) {
        disableToggleButtons();
    }
    const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    (async () => {
        while (isStartGame) {
            const nextStep = step();
            if (nextStep.lifeCell.length === 0 && nextStep.dieCell.length === 0) {
                isStartGame = false;
                disableToggleButtons();
                stepCount=0;
                stopButton.disabled = true;
                return;
            }
            await timeout(100);
        }
    })();
};

function updateInfo(time, isClear) {
    lastTimeInfo.innerHTML  = time.toFixed(2);
    if((time.toFixed(2) > Number(longestTimeInfo.innerHTML) || isClear)){
        longestTimeInfo.innerHTML = time.toFixed(2);
    }
};

function stopGame() {
    if (isStartGame) {
        stopButton.disabled = true;
        isStartGame = false;
        disableToggleButtons();
    }
};

applicantForm.addEventListener('submit', handleFormSubmit);
randomButton.addEventListener('click', getRandomCell);
stepButton.addEventListener('click', step);
clearButton.addEventListener('click', clearGreed)
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
clearTableButton.addEventListener('click', () => {updateInfo(0, true)});

createGreed(rows, cols);
