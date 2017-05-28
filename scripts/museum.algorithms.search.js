var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.search = museum.algorithms.search || {};
museum.algorithms.search = (function() {
    function binarySearch(data, element) {
        var left = 0;
        var right = data.length - 1;
        while (left <= right) {
            var mid = Math.floor((left + right) / 2);
            if (data[mid] == element) {
                return mid;
            }
            if (data[mid] > element) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return -1;
    }

    return {
        binarySearch: binarySearch
    };
})();
