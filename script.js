/*
We store our game status element here to allow us to more easily 
use it later on 
*/
const statusDisplay = document.querySelector('.game--status');
/*
Here we declare some variables that we will use to track the 
game state throught the game. 
*/
/*
We will use gameActive to pause the game in case of an end scenario
*/
let gameActive = true;
/*
We will store our current player here, so we know whos turn 
*/
let currentPlayer = "X";
/*
We will store our current game state here, the form of empty strings in an array
 will allow us to easily track played cells and validate the game state later on
*/
let gameState = ["", "", "", "", "", "", "", "", ""];
/*
Here we have declared some messages we will display to the user during the game.
Since we have some dynamic factors in those messages, namely the current player,
we have declared them as functions, so that the actual message gets created with 
current data every time we need it.
*/
let move = 0;

let dificulty = "";

const audioClick = new Audio("./click.mp3");
const audioEnd = new Audio("./end.mp3");
const audioWin = new Audio("./win.mp3");
const winningMessage = () => `Han guanyat la partida les ${currentPlayer}'s!`;
const drawMessage = () => `Heu empatat la partida!`;
const currentPlayerTurn = () => `És el torn de les ${currentPlayer}'s`;
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const winningPatterns = [
    [0, 5],
    [0, 7],
    [2, 3],
    [2, 7],
    [6, 1],
    [6, 5],
    [8, 1],
    [8, 3]
];
const lateralLines = [
    [0, 1, 2],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8]
];
/*
We set the inital message to let the players know whose turn it is
*/
statusDisplay.innerHTML = currentPlayerTurn();
function checkSpotsAvailable() {
    let count = 0;
    for (let i = 0; i <= 8; i++) {
        if (gameState[i] != "") {
            count = count + 1;
        }
    }
    if (count >= 8) {
        return false;
    }
    else {
        return true;
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    /*
    We update our internal game state to reflect the played move, 
    as well as update the user interface to reflect the played move
    */
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    handleResultValidation();
    
}
function handleComputerPlay() {
    let cell;
    if (gameActive == false) {
        return;
    }
    cell = computerPlayByLevel();
    if (checkSpotsAvailable() == false)  {
        return;
    }
    gameState[cell] = currentPlayer;
    document.querySelector(`[data-cell-index="${cell}"]`).innerHTML = currentPlayer;
    handleResultValidation();
}

function computerRandom() {
    let random = Math.floor(Math.random() * 8);
    while ((gameState[random] !== "") && (checkSpotsAvailable() == true)) {
        random = Math.floor(Math.random() * 8);
    }
    return random;
}

function computerMedium() {
    let number = 9;
    for (let i = 0; i <= 7; i++) {
        if (number === 9) {
            let Condition = winningConditions[i];
            let a = gameState[Condition[0]];
            let b = gameState[Condition[1]];
            let c = gameState[Condition[2]];
            if (a === b && b !== c && c === "") {
                number = Condition[2];
            } else if (a === c && a !== b && b === "") {
                number = Condition[1];
            } else if (b === c && c !== a && a === "") {
                number = Condition[0];
            } else {
                number = 9;
            }
        }
        else {
            return number;
        }
    }
    if (number === 9) {
        return computerRandom();
    }
    else return number;
}

function computerHard() {
    let number = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    let eval = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (gameState[4] === ""){
        if (Math.random() < 0.7) {
            return 4;
        }
        else {
            return computerMedium();
        }
    } else if (gameState[4] === "X" && move === 1) {
        if (Math.random() < 0.7) {
            let num = 9;
            while (num !== 0 && num !== 2 && num !== 6 && num !== 8){
                num = computerRandom();
            }
            return num;
        }
        else {
            return computerMedium();
        }
    }
    else { 
        /*
        for (let i = 0; i <= 7; i++) {
            let Condition = winningConditions[i];
            let a = gameState[Condition[0]];
            let b = gameState[Condition[1]];
            let c = gameState[Condition[2]];
            if (a === b && b !== c && c === "") {
                number[Condition[2]] = Condition[2];
                if (a === "O") {
                    eval[Condition[2]] = 2;
                } else if (a === "X") {
                    eval[Condition[2]] = 1;
                }
            } else if (a === c && a !== b && b === "") {
                number[Condition[1]] = Condition[1];
                if (a === "O") {
                    eval[Condition[1]] = 2;
                } else if (a === "X") {
                    eval[Condition[1]] = 1;
                }
            } else if (b === c && c !== a && a === "") {
                number[Condition[0]] = Condition[0];
                if (b === "O") {
                    eval[Condition[0]] = 2;
                } else if (b === "X") {
                    eval[Condition[0]] = 1;
                }
            }
        }
        for (let i = 0; i <= 8; i++) {
            if (number[i] !== 9 && eval[i] === 2) {
                return i;
            }
        }
        for (let i = 0; i <= 8; i++) {
            if (number[i] !== 9 && eval[i] === 1) {
                return i;
            }
        }
        return computerRandom();
        */
       return computerMedium();
    }
}

function computerSuperHard() {
    let number = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    let eval = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (gameState[4] === ""){
        return 4;
    } else if (gameState[4] === "X" && move === 1) {
        let num = 9;
        while (num !== 0 && num !== 2 && num !== 6 && num !== 8){
            num = computerRandom();
        }
        return num;
    } else if (move === 3) {
        for (let i = 0; i <= 7; i++) {
            let Pattern = winningPatterns[i];
            let lineIncludedVertex = [false, false, false, false];
            let lineIncludedAresta = [false, false, false, false];
            let goodLine = [0, 0, 0];
            let numberIs = [9, 9];
            let x = gameState[Pattern[0]];
            let y = gameState[Pattern[1]];
            if (x === y && x !== "") {
                if ([gameState[lateralLines[0][0]], gameState[lateralLines[0][2]]].includes(x)){
                    lineIncludedVertex[0] = true;
                }
                if ([gameState[lateralLines[1][0]], gameState[lateralLines[1][2]]].includes(x)){
                    lineIncludedVertex[1] = true;
                }
                if ([gameState[lateralLines[2][0]], gameState[lateralLines[2][2]]].includes(x)){
                    lineIncludedVertex[2] = true;
                }
                if ([gameState[lateralLines[3][0]], gameState[lateralLines[3][2]]].includes(x)){
                    lineIncludedVertex[3] = true;
                }
                if (gameState[lateralLines[0][1]].includes(y)){
                    lineIncludedAresta[0] = true;
                }
                if (gameState[lateralLines[1][1]].includes(y)){
                    lineIncludedAresta[1] = true;
                }
                if (gameState[lateralLines[2][1]].includes(y)){
                    lineIncludedAresta[2] = true;
                }
                if (gameState[lateralLines[3][1]].includes(y)){
                    lineIncludedAresta[3] = true;
                }

                for (let j = 0; j<=3; j++){
                    if (lineIncludedAresta[j] === true) {
                        for (let n = 0; n<=3; n++){
                            if (lineIncludedVertex[n] === true) {
                                if (haveNumberInCommon(lateralLines[j], lateralLines[n])){
                                    goodLine = lateralLines[n];
                                }
                            }
                        }
                    }
                }
                let m = 0;
                for (let k = 0; k<=2; k++){
                    if (gameState[Pattern[0]] !== gameState[goodLine[k]]) {
                        numberIs[m] = goodLine[k];
                        m = m + 1;
                    }
                }
                let random = Math.round(Math.random() * 1);
                return numberIs[random];
            }
        }
        return computerHard();
    } else { 
        for (let i = 0; i <= 7; i++) {
            let Condition = winningConditions[i];
            let a = gameState[Condition[0]];
            let b = gameState[Condition[1]];
            let c = gameState[Condition[2]];
            if (a === b && b !== c && c === "") {
                number[Condition[2]] = Condition[2];
                if (a === "O") {
                    eval[Condition[2]] = 2;
                } else if (a === "X") {
                    eval[Condition[2]] = 1;
                }
            } else if (a === c && a !== b && b === "") {
                number[Condition[1]] = Condition[1];
                if (a === "O") {
                    eval[Condition[1]] = 2;
                } else if (a === "X") {
                    eval[Condition[1]] = 1;
                }
            } else if (b === c && c !== a && a === "") {
                number[Condition[0]] = Condition[0];
                if (b === "O") {
                    eval[Condition[0]] = 2;
                } else if (b === "X") {
                    eval[Condition[0]] = 1;
                }
            }
        }
        for (let i = 0; i <= 8; i++) {
            if (number[i] !== 9 && eval[i] === 2) {
                return i;
            }
        }
        for (let i = 0; i <= 8; i++) {
            if (number[i] !== 9 && eval[i] === 1) {
                return i;
            }
        }
        return computerRandom();
    }
}

function haveNumberInCommon(line1, line2){
    if (line1[0] === line2[0] || line1[0] === line2[2] || line1[2] === line2[0] || line1[2] === line2[2]) {
        return true;
    }
}

function computerPlayByLevel() {
    let cell;
    if (dificulty === "easy") {
        cell = computerRandom();
    } else if (dificulty === "medium") {
        cell = computerMedium();
    } else if (dificulty === "hard"){
        cell = computerHard();
    } else {
        cell = computerSuperHard();
    }
    return cell;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}
function handleResultValidation() {
    let roundWon = false;
    move = move + 1;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            changeWinnerColor(winCondition);
            break
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        audioWin.play();
        return;
    }
    /* 
    We will check weather there are any values in our game state array 
    that are still not populated with a player sign
    */
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        audioEnd.play();
        return;
    }
    else {
        audioClick.play();
    }
    /*
    If we get to here we know that the no one won the game yet, 
    and that there are still moves to be played, so we continue by changing the current player.
    */
    handlePlayerChange();
}

function changeWinnerColor(winCondition) {
    const color = "yellow";
    document.querySelector(`[data-cell-index="${winCondition[0]}"]`).style.color = color;
    document.querySelector(`[data-cell-index="${winCondition[1]}"]`).style.color = color;
    document.querySelector(`[data-cell-index="${winCondition[2]}"]`).style.color = color;
}

function setOriginalColor() {
    const originalColor = "white";
    document.querySelectorAll('.cell').forEach(cell => cell.style.color = originalColor);
    document.querySelectorAll('li').forEach(li => li.style.color = originalColor);
    document.querySelector(`#${dificulty}`).style.fontWeight = "normal";
}

function handleCellClick(clickedCellEvent) {
    /*
    We will save the clicked html element in a variable for easier further use
    */    
    const clickedCell = clickedCellEvent.target;
    /*
    Here we will grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid. 
    Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an 
    integer(number)
    */
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );
    /* 
    Next up we need to check whether the call has already been played, 
    or if the game is paused. If either of those is true we will simply ignore the click.
    */
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    /* 
    If everything is in order we will proceed with the game flow
    */    
        handleCellPlayed(clickedCell, clickedCellIndex);
        setTimeout(() => {handleComputerPlay()}, 1000);
    }
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    move = 0;
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
    setOriginalColor();
    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    document.querySelectorAll('li').forEach(li => li.removeEventListener('click', handleRestartByChangeOfLevel));
    document.querySelectorAll('li').forEach(li => li.addEventListener('click', prepareGame));
}

function prepareGame(clickedDificultyEvent) {
    const colorDificulty = "yellow";
    const clickedDificulty = clickedDificultyEvent.target;
    dificulty = clickedDificulty.getAttribute('id');
    document.querySelector(`#${dificulty}`).style.color = colorDificulty;
    document.querySelector(`#${dificulty}`).style.fontWeight = "bold";
    startGame();
}

function handleRestartByChangeOfLevel(clickedDificultyEvent) {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    move = 0;
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
    setOriginalColor();
    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    prepareGame(clickedDificultyEvent);
}

function startGame() {
    document.querySelectorAll('li').forEach(li => li.removeEventListener('click', prepareGame));
    document.querySelectorAll('li').forEach(li => li.addEventListener('click', handleRestartByChangeOfLevel));
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
}
/*
And finally we add our event listeners to the actual game cells, as well as our 
restart button
*/
document.querySelectorAll('li').forEach(li => li.addEventListener('click', prepareGame));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
