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
    return {
        formatErrorMessage: formatErrorMessage,
        getLinkLocation: getLinkLocation
    };
})();