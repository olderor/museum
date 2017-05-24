var museum = museum || {};
museum.linkparser = (function() {
    /*
    getLocation("http://example.com:3000/pathname/?param=value#hash");
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
    function getLocation(href) {
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
    return {
        getLocation: getLocation
    };
})();