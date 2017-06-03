var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.quick_sort = museum.algorithms.quick_sort || {};
museum.algorithms.quick_sort = (function() {
    function quickSort(data, cmp = function(first, second) {return first <= second; }) {
        if (data.length === 0) {
            return data;
        }
        
        var pivot = data.splice(0, 1)[0];
        var less = []
        var greater = []

        data.forEach(function(el) {
            if (cmp(el, pivot)) {
                less.push(el)
            } else {
                greater.push(el)
            }
        })

        return quickSort(less, cmp).concat(pivot, quickSort(greater, cmp))
    }

    return {
        quickSort: quickSort
    };
})();
