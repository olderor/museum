var museum = museum || {};
museum.parser = museum.parser || {};
museum.parser = (function() {
    /*
    getLinkLocation("http://example.com:3000/pathname/?param=value#hash");
    {
        "protocol": "http:",
        "host": "example.com:3000",
        "hostname": "example.com",
        "port": "3000",
        "pathname": "/pathname/",
        "search": "?search=test",
        "hash": "#hash"
    }
    */
    function getLinkLocation(href) {
        var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && {
            href: href,
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            parameters: match[6],
            hash: match[7]
        }
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function formatErrorMessage(jqXHR, exception) {
        if (jqXHR.status === 0) {
            return ('Not connected.\nPlease verify your network connection.');
        }
        else if (jqXHR.status == 404) {
            return ('The requested page not found. [404]');
        }
        else if (jqXHR.status == 500) {
            return ('Internal Server Error [500].');
        }
        else if (exception === 'parsererror') {
            return ('Requested JSON parse failed.');
        }
        else if (exception === 'timeout') {
            return ('Time out error.');
        }
        else if (exception === 'abort') {
            return ('Ajax request aborted.');
        }
        else {
            return ('Uncaught Error.\n' + jqXHR.responseText);
        }
    }

    function getImageWithMinimumSize(data) {
        var images = data["images"];
        if (!images || images.length == 0) {
            return null;
        }
        var image = images[0];
        for (var i = 1; i < images.length; ++i) {
            if (images[i]["height"] < image["height"]) {
                image = images[i];
            }
        }
        return image;
    }
    
    function timeToString(seconds) {
        var hrs = ~~(seconds / 3600);
        var mins = ~~((seconds % 3600) / 60);
        var secs = ~~seconds % 60;
    
        var res = "";
    
        if (hrs > 0) {
            res += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
    
        res += "" + mins + ":" + (secs < 10 ? "0" : "");
        res += "" + secs;
        return res;
    }
    
    return {
        formatErrorMessage: formatErrorMessage,
        getLinkLocation: getLinkLocation,
        getParameterByName: getParameterByName,
        getImageWithMinimumSize: getImageWithMinimumSize,
        timeToString: timeToString
    };
})();