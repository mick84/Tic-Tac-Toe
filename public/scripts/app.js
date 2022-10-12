"use strict";
const form = document.getElementById("control-panel");
console.log(form);
form.onsubmit = function (e) {
    e.preventDefault();
};
