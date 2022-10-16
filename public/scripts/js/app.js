"use strict";
const form = document.getElementById("control-panel");
const board = document.getElementById("board");
const cells = [...board.children];
function makeMark(cell, mark) {
    cell.classList.add(mark, "marked");
}
function clearBoard() {
    cells.forEach((el) => el.classList.remove("marked", "x", "o"));
}
form.onsubmit = function (e) {
    e.preventDefault();
    const dataArr = new FormData(form);
    const data = Object.fromEntries(dataArr);
    state.boardSize = +`${data["board-size"]}`;
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
    state.boardSize === 4 && clearBoard();
};
board.onclick = function (event) {
    const cell = event.target;
    if (cell === this || cell.classList.contains("marked")) {
        return;
    }
    makeMark(cell, "o");
    console.log(cell);
};
const state = {
    boardSize: 3,
    continue: false,
    currentPlayerIndex: 0,
    players: [],
};
const turn = (state) => { };
const init = (state) => {
    //clearBoard();
    //show menu, ask for board size and for beginning sign
    state.continue = true;
    //get beginning sign from form and put it to player_0
    state.players = [
        { score: 0, symbol: "x" },
        { score: 0, symbol: "o" },
    ];
};
