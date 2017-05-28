String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

Array.prototype.resize = Array.prototype.resize || function(newSize, defaultValue) {
    while(newSize > this.length) {
        this.push(defaultValue);
    }
    this.length = newSize;
};

Array.prototype.resizeMatrix = Array.prototype.resizeMatrix || function(rowsSize, columnsSize, defaultValue) {
    while(rowsSize > this.length) {
        var row = [];
        row.resize(columnsSize, defaultValue);
        this.push(row);
    }
    this.length = rowsSize;
};
