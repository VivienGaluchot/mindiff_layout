function addButton(element) {
    var div = document.createElement("div");
    div.classList.add("cell");
    div.classList.add("width-1");
    div.textContent = "width-1"
    div.innerHTML = "<div class=\"button-block\">" +
                    "<button class=\"cell width-1\" onclick=\"expendButton(this.parentNode.parentNode);\">+</button>" +
                    "<button class=\"cell width-1\" onclick=\"reduceButton(this.parentNode.parentNode);\">-</button>" +
                    "</div>";
    element.appendChild(div);
}

function remButton(element) {
    element.removeChild(element.lastChild);
}


function operateWidth(element, modify) {
    var grid_columns = getComputedStyle(element).getPropertyValue("--grid_columns");
    var existing = 1;
    console.log(grid_columns);
    for (var i = 1; i <= grid_columns; i++) {
        let classname = "width-" + i;
        if (element.classList.contains(classname)) {
            existing = i;
            element.classList.remove(classname);
        }
    }
    let expended = Math.min(Math.max(modify(existing), 1), grid_columns);
    element.classList.add("width-" + expended);
}

function expendButton(element) {
    operateWidth(element, x => x + 1);
}

function reduceButton(element) {
    operateWidth(element, x => x - 1);
}