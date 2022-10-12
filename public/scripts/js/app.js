"use strict";
const form = document.getElementById("control-panel");
const boardLength = form.querySelector('[name="board-length"]');
const newGameBtn = form.querySelector("#new-game");
const board = document.getElementById("board");
const cells = [...board.querySelectorAll(".cell")];
form.onsubmit = function (e) {
    e.preventDefault();
    const dataArr = new FormData(form);
    const data = Object.fromEntries(dataArr);
    board.style.setProperty("--board-size", `${data["board-length"]}`);
    +data["board-length"] === 3 &&
        cells.forEach((el, i) => i > 8 && el.setAttribute("hidden", "true"));
    +data["board-length"] === 4 &&
        cells.forEach((el, i) => i > 8 && el.removeAttribute("hidden"));
};
