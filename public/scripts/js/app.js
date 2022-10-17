"use strict";
const form = document.getElementById("control-panel");
const board = document.getElementById("board");
const cells = [...board.children];
const announce = document.getElementById("announce");
const playerTables = document.querySelectorAll(".player-table");
function makeMark(cell, mark) {
    cell.classList.add(mark, "marked");
}
function clearBoard() {
    cells.forEach((el) => el.classList.remove("marked", "x", "o"));
}
async function delay(seconds) {
    return new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));
}
async function showCountdown(el, steps) {
    for (let i = 0; i <= steps; i++) {
        await delay(1);
        el.textContent = `${steps - i}`;
    }
}
showCountdown(playerTables[1].querySelector(".timer"), 5);
form.onreset = function (e) {
    e.preventDefault();
    //state.continue = false;
    state.players.forEach((p) => (p.score = 0));
    playerTables.forEach((t, i) => (t.querySelector(".scores").textContent = `${state.players[i].score}`));
};
form.onsubmit = async function (e) {
    e.preventDefault();
    const dataArr = new FormData(form);
    const data = Object.fromEntries(dataArr);
    const { beginnerSymbol } = data;
    const otherSymbol = beginnerSymbol === "x" ? "o" : "x";
    state.continue = true;
    state.currentPlayerIndex = 0;
    state.players[0].symbol = `${beginnerSymbol}`;
    state.players[1].symbol = otherSymbol;
    state.boardSize = +`${data["board-size"]}`;
    state.strickLength = +`${data["strick-length"]}`;
    state.maxTimePerTurn = +`${data.countdown}`;
    state.boardMap = Array.from({ length: state.boardSize }, () => new Array(state.boardSize).fill(""));
    announce.innerText = "";
    board.style.setProperty("--board-size", `${state.boardSize}`);
    switch (state.boardSize) {
        case 3:
            cells.forEach((el, i) => i > 8 ? el.setAttribute("hidden", "true") : el.removeAttribute("hidden"));
            break;
        case 4:
            cells.forEach((el, i) => {
                i < 16
                    ? el.removeAttribute("hidden")
                    : el.setAttribute("hidden", "true");
            });
            break;
        case 5:
            cells.forEach((el) => el.removeAttribute("hidden"));
            break;
    }
    clearBoard();
    playerTables.forEach((table, i) => {
        table.querySelector(".scores").textContent = `${state.players[i].score}`;
        table.querySelector(".symbol").textContent = `${state.players[i].symbol}`;
    });
};
const state = {
    boardSize: 3,
    strickLength: 3,
    continue: false,
    currentPlayerIndex: 0,
    maxTimePerTurn: 0,
    boardMap: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ],
    players: [
        { score: 0, symbol: "x" },
        { score: 0, symbol: "o" },
    ],
};
board.onclick = async function (event) {
    const cell = event.target;
    if (cell === this || cell.classList.contains("marked") || !state.continue) {
        return;
    }
    const { symbol } = state.players[state.currentPlayerIndex];
    makeMark(cell, symbol);
    const number = +cell.dataset.number;
    const [row, col] = [
        Math.floor(number / state.boardSize),
        number % state.boardSize,
    ];
    state.boardMap[row][col] = symbol;
    //check  row:
    const victorySeq = symbol.repeat(state.strickLength);
    if (state.boardMap[row].join("").includes(victorySeq)) {
        console.log("row!");
        state.continue = false;
        state.players[state.currentPlayerIndex].score++;
        announce.innerText = `player ${state.currentPlayerIndex + 1} won!`;
        return;
    }
    //check  column:
    const column = state.boardMap.map((row) => row[col]);
    if (column.join("").includes(victorySeq)) {
        console.log("column!");
        state.continue = false;
        state.players[state.currentPlayerIndex].score++;
        announce.innerText = `player ${state.currentPlayerIndex + 1} won!`;
        return;
    }
    //check  first-diagonal:\
    const firstDiag = [[row, col]];
    for (let i = 1, j = 1; row - i >= 0 && col - j >= 0; i++, j++) {
        firstDiag.push([row - i, col - j]);
    }
    for (let i = 1, j = 1; row + i < state.boardSize && col + j < state.boardSize; i++, j++) {
        firstDiag.push([row + i, col + j]);
    }
    const firstDiagSeq = firstDiag
        .map((el) => state.boardMap[el[0]][el[1]])
        .join("");
    if (firstDiagSeq.includes(victorySeq)) {
        console.log("1diag!");
        state.continue = false;
        state.players[state.currentPlayerIndex].score++;
        announce.innerText = `player ${state.currentPlayerIndex + 1} won!`;
        return;
    }
    //check second diagonal:/
    const secondDiag = [[row, col]];
    for (let i = 1, j = 1; row + i < state.boardSize && col - j >= 0; i++, j++) {
        secondDiag.push([row + i, col - j]);
    }
    for (let i = 1, j = 1; row - i >= 0 && col + j < state.boardSize; i++, j++) {
        secondDiag.push([row - i, col + j]);
    }
    const secondDiagSeq = secondDiag
        .map((el) => state.boardMap[el[0]][el[1]])
        .join("");
    if (secondDiagSeq.includes(victorySeq)) {
        console.log("2diag!");
        state.continue = false;
        state.players[state.currentPlayerIndex].score++;
        announce.innerText = `player ${state.currentPlayerIndex + 1} won!`;
        return;
    }
    //check if there are free cells on board:
    state.continue = !!cells.filter((cell) => !cell.hasAttribute("hidden") && !cell.classList.contains("marked")).length;
    if (!state.continue) {
        //draw case:
        announce.innerText = `TIE!`;
    }
    //if not won, next turn:
    state.currentPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
    //check if strick of given length is reached:
};
const turn = (state) => { };
const init = (state) => {
    //clearBoard();
    //show menu, ask for board size and for beginning sign
    //get beginning sign from form and put it to player_0
};
//init(state);
