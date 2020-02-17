const mindiff_layout = function () {
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
        var a = 0;
        var b = 0;
        while (a < sp.a || b < sp.b) {
            if (b < sp.b) {
                yield sp.r + 1;
                b += 1;
            }
            if (a < sp.a) {
                yield sp.r;
                a += 1;
            }
        }
    }

    return {
        /**
         * @param N number of column
         * @param n number of cells
         * @return a generator of n values, each value beeing the size of the cell
         */
        cellSizeGenerator : function* (N, n) {
            var sp = computeRowSplits(N, n)
            var a = 0;
            var b = 0;
            while (a < sp.a || b < sp.b) {
                if (a < sp.a) {
                    for (var value of rowGenerator(N, sp.r)) {
                        yield value;
                    }
                    a += 1;
                }
                if (b < sp.b) {
                    for (var value of rowGenerator(N, sp.r + 1)) {
                        yield value;
                    }
                    b += 1;
                }
            }
        }
    }
}();