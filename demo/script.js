const common = function () {
    return {
        getRandomArbitrary: function (min, max) {
            return Math.random() * (max - min) + min;
        },
        operateWidth: function (element, modify) {
            var grid_columns = getComputedStyle(element).getPropertyValue("--grid_columns");
            var existing = 1;
            for (var i = 1; i <= grid_columns; i++) {
                var classname = "width-" + i;
                if (element.classList.contains(classname)) {
                    existing = i;
                    element.classList.remove(classname);
                }
            }
            var expended = Math.min(Math.max(modify(existing), 1), grid_columns);
            element.classList.add("width-" + expended);
        },
        getCellRandomColorStyle: function() {
            var red = 150 + common.getRandomArbitrary(-20, 20);
            var green = 107 + common.getRandomArbitrary(-20, 20);
            var blue = 107 + common.getRandomArbitrary(-20, 20);
            return "background-color:rgb(" + red + "," + green + "," + blue + ");";
        }
    };
}();

const manual = function () {
    return {
        add: function (element) {
            var grid = element.parentNode.parentNode.nextElementSibling;

            var div = document.createElement("div");
            div.classList.add("cell");
            div.classList.add("width-1");
            div.textContent = "width-1"
            div.innerHTML = "<div class=\"button-block\" style=\"" + common.getCellRandomColorStyle() + "\">" +
                "<button onclick=\"manual.expend(this.parentNode.parentNode);\">+</button>" +
                "<button onclick=\"manual.reduce(this.parentNode.parentNode);\">-</button>" +
                "</div>";
                grid.appendChild(div);
        },
        rem: function (element) {
            var grid = element.parentNode.parentNode.nextElementSibling;
            if (grid.lastElementChild)
                grid.removeChild(grid.lastElementChild);
        },
        expend: function (element) {
            var cell = element.parentNode.parentNode;
            common.operateWidth(cell, x => x + 1);
        },
        reduce: function (element) {
            var cell = element.parentNode.parentNode;
            common.operateWidth(cell, x => x - 1);
        }
    }
}();

const auto = function () {
    function applyMinDiff(element) {
        var N = getComputedStyle(element).getPropertyValue("--grid_columns");
        var n = element.children.length;
        var index = 0;
        for (var cell of mindiff_layout.cellSizeGenerator(N, n)) {
            common.operateWidth(element.children[index], x => cell);
            index++;
        }
    }

    function addToGrid(grid) {
        var div = document.createElement("div");
        div.classList.add("cell");
        div.classList.add("width-1");
        div.textContent = "width-1"
        div.innerHTML = "<div class=\"button-block\" style=\"" + common.getCellRandomColorStyle() + "\"><div class=\"placeholder\"></div></div>";
        grid.appendChild(div);
        applyMinDiff(grid);
    }

    function removeFromGrid(grid) {
        if (grid.lastElementChild)
            grid.removeChild(grid.lastElementChild);
        var N = getComputedStyle(grid).getPropertyValue("--grid_columns");
        applyMinDiff(grid);
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        for (let element of document.getElementsByClassName("mindiff_layout")) {
            applyMinDiff(element);
        }
        for (let element of document.getElementsByClassName("time_animate")) {
            for (var i = 0; i < 7; i++) {
                addToGrid(element);
            }
            function addCallback(n, ascend) {
                if (ascend) {
                    n += 1;
                    addToGrid(element);
                    ascend = n != 12;
                } else {
                    n -= 1;
                    removeFromGrid(element);
                    ascend = n == 7;
                }
                setTimeout(addCallback, 1500, n, ascend);
            }
            setTimeout(addCallback, 1500, 7, true);
        }
    });

    return {
        add: function (element) {
            var grid = element.parentNode.parentNode.nextElementSibling;
            addToGrid(grid);
        },
        rem: function (element) {
            var grid = element.parentNode.parentNode.nextElementSibling;
            removeFromGrid(grid);
        }
    }
}();