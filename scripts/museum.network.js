var museum = museum || {};
museum.network = museum.network || {};
museum.network = (function() {
    var network = null;

    var nodes = [];
    var edges = [];


    function setRandomData() {
        var minimumNodesCount = 20;
        var maximumNodesCount = 50;

        var nodesCount = museum.random.getRandomInt(minimumNodesCount, maximumNodesCount);
        var edgesCount = museum.random.getRandomInt(minimumNodesCount * (minimumNodesCount - 1) / 2 / 2, nodesCount * (nodesCount - 1) / 2);

        nodes = [];
        edges = [];

        for (var i = 0; i < nodesCount; ++i) {
            nodes.push({
                id: i,
                label: '' + i,
                group: museum.random.getRandomInt(0, nodesCount / 5)
            });
        }
        for (var i = 0; i < nodesCount; ++i) {
            edges.push({
                from: museum.random.getRandomInt(0, nodesCount),
                to: museum.random.getRandomInt(0, nodesCount)
            });
        }
    }

    function setPlaylistsData(playlists) {
        var level = 0;
        for (var guid in playlists) {
            ++level;
            var playlist = playlists[guid];
            if (!playlist) {
                continue;
            }
            var tracks = playlist["tracks"]["items"];
            for (var i = 0; i < tracks.length; ++i) {
                var track = tracks[i]["track"];
                var artists = track["artists"];
                var artistLabel = artists[0]["name"];
                for (var j = 1; j < artists.length; ++j) {
                    artistLabel += ", " + artists[j]["name"];
                }

                nodes.push({
                    id: guid + "-" + track["id"],
                    title: artistLabel + " - " + track["name"],
                    image: museum.parser.getImageWithMinimumSize(track["album"])["url"],
                    group: guid,
                    shape: 'circularImage',
                    level: level
                });
            }
        }
    }

    function draw(onDrawingDone) {
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            nodes: {
                shape: 'dot',
                size: 30,
                font: {
                    size: 32,
                    color: '#ffffff'
                },
                borderWidth: 2
            },
            edges: {
                width: 2
            },
            physics: {
                enabled: true,
                minVelocity: 0
            },
            layout: {
                improvedLayout: false,
                hierarchical: {
                    enabled: true,
                    direction: 'LR'
                }
            }
        };
        network = new vis.Network(container, data, options);
        network.on('afterDrawing', onDrawingDone);
        network.stabilize(1000);
    }

    return {
        setRandomData: setRandomData,
        setPlaylistsData: setPlaylistsData,
        draw: draw
    };
})();