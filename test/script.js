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
            var div = document.createElement("div");
            div.classList.add("cell");
            div.classList.add("width-1");
            div.textContent = "width-1"
            div.innerHTML = "<div class=\"button-block\" style=\"" + common.getCellRandomColorStyle() + "\">" +
                "<button onclick=\"manual.expend(this.parentNode.parentNode);\">+</button>" +
                "<button onclick=\"manual.reduce(this.parentNode.parentNode);\">-</button>" +
                "</div>";
            element.appendChild(div);
        },
        rem: function (element) {
            if (element.lastElementChild)
                element.removeChild(element.lastElementChild);
        },
        expend: function (element) {
            common.operateWidth(element, x => x + 1);
        },
        reduce: function (element) {
            common.operateWidth(element, x => x - 1);
        }
    }
}();

const auto = function () {
    function computeRowSplits(N, n) {
        var C = Math.ceil(n / N);
        var r = Math.ceil(n / C) - 1;
        var a = (r + 1) * C - n;
        var b = n - r * C;
        return { a: a, b: b, r: r }
    }

    function computeColSplits(N, n) {
        var r = Math.ceil(N / n) - 1;
        var a = (r + 1) * n - N;
        var b = N - r * n;
        return { a: a, b: b, r: r }
    }

    function* rowGenerator(N, n) {
        var sp = computeColSplits(N, n)
        for (var i = 0; i < sp.b; i++) {
            yield sp.r + 1;
        }
        for (let i = 0; i < sp.a; i++) {
            yield sp.r;
        }
    }

    function* rowsGenerator(N, n) {
        var sp = computeRowSplits(N, n)
        for (var i = 0; i < sp.a; i++) {
            yield rowGenerator(N, sp.r);
        }
        for (var i = 0; i < sp.b; i++) {
            yield rowGenerator(N, sp.r + 1);
        }
    }

    function applyMinDiff(element) {
        var N = getComputedStyle(element).getPropertyValue("--grid_columns");
        var n = element.children.length;
        console.log(N, n);
        var index = 0;
        for (var row_gen of rowsGenerator(N, n)) {
            for (var cell_gen of row_gen) {
                console.log(cell_gen);
                common.operateWidth(element.children[index], x => cell_gen);
                index++;
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        for (var element of document.getElementsByClassName("mindiff_layout")) {
            applyMinDiff(element);
        }
    });

    return {
        add: function (element) {
            var div = document.createElement("div");
            div.classList.add("cell");
            div.classList.add("width-1");
            div.textContent = "width-1"
            div.innerHTML = "<div class=\"button-block\" style=\"" + common.getCellRandomColorStyle() + "\"><div class=\"placeholder\"></div></div>";
            element.appendChild(div);
            applyMinDiff(element);
        },
        rem: function (element) {
            if (element.lastElementChild)
                element.removeChild(element.lastElementChild);
            var N = getComputedStyle(element).getPropertyValue("--grid_columns");
            applyMinDiff(element);
        }
    }
}();