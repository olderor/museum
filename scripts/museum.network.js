var museum = museum || {};
museum.network = museum.network || {};
museum.network = (function() {
    var network = null;

    var nodes = [];
    var edges = [];

    var onDrawingDone = null;

    var playlists = {};

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

    function setTracksNodes() {
        nodes = [];
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

                var image = museum.parser.getImageWithMinimumSize(track["album"]);
                var imageUrl = "";
                if (image && image["url"]) {
                    imageUrl = image["url"];
                }

                nodes.push({
                    id: museum.random.guid(),
                    title: artistLabel + " - " + track["name"],
                    image: imageUrl,
                    group: guid,
                    shape: 'circularImage',
                    level: level,

                    trackId: track["id"]
                });
            }
        }
    }

    function setTracksEdges() {
        edges = [];
        for (var i = 0; i < nodes.length; ++i) {
            for (var j = i + 1; j < nodes.length; ++j) {
                if (nodes[i].trackId == nodes[j].trackId) {
                    edges.push({
                        from: nodes[i].id,
                        to: nodes[j].id
                    });
                }
            }
        }
    }

    function setPlaylistsData(playlistsData) {
        playlists = playlistsData;
    }



    function setPlaylistsNodes() {
        nodes = [];
        for (var guid in playlists) {
            var playlist = playlists[guid];
            if (!playlist) {
                continue;
            }

            var image = museum.parser.getImageWithMinimumSize(playlist);
            var imageUrl = "";
            if (image && image["url"]) {
                imageUrl = image["url"];
            }

            nodes.push({
                id: guid,
                title: playlist["name"] + " by " + playlist["owner"]["id"],
                image: imageUrl,
                group: playlist["id"],
                shape: 'circularImage'
            });
        }
    }

    function getSimilarTracksCount(first, second) {
        var trackIds = {};
        for (var i = 0; i < first.length; ++i) {
            if (!trackIds[first[i]["track"]["id"]]) {
                trackIds[first[i]["track"]["id"]] = 1;
                continue;
            }
            ++trackIds[first[i]["track"]["id"]];
        }
        var count = 0;
        for (var i = 0; i < second.length; ++i) {
            let res = trackIds[second[i]["track"]["id"]];
            if (res) {
                count += res;
            }
        }
        return count;
    }

    function setPlaylistsEdges() {
        for (var i = 0; i < nodes.length; ++i) {
            for (var j = i + 1; j < nodes.length; ++j) {
                var count = getSimilarTracksCount(
                    playlists[nodes[i].id]["tracks"]["items"],
                    playlists[nodes[j].id]["tracks"]["items"]);
                if (count == 0) {
                    continue;
                }
                edges.push({
                    from: nodes[i].id,
                    to: nodes[j].id,
                    label: '' + count
                });
            }
        }
    }

    function drawingDone() {
        onDrawingDone();
    }

    function onFinishStabilization() {
        museum.graphmanager.loadingDone();
        museum.waiting.setProcessDone();
    }

    function stabilize() {
        /*
        museum.graphmanager.startLoading();
        museum.waiting.init();
        network.once('afterDrawing', onFinishStabilization);

        setTimeout(function() {
            network.stabilize(100);
        }, 1000);
        */
        network.stabilize(500);
    }

    function draw(drawDone, type) {
        onDrawingDone = drawDone;
        if (!type) {
            type = museum.graphmanager.types.tracksGeneral;
        }
        var container = document.getElementById('mynetwork');
        var options = {
            nodes: {
                shape: 'dot',
                size: 30,
                font: {
                    size: 32,
                    color: '#ffffff'
                },
                borderWidth: 5
            },
            edges: {
                width: 2
            },
            physics: {
                stabilization: false,
                minVelocity: 0
            },
            layout: {
                improvedLayout: false
            }
        };
        switch (type) {
            case museum.graphmanager.types.tracksGeneral:
                setTracksNodes();
                setTracksEdges();
                break;
            case museum.graphmanager.types.tracksMultipartite:
                options.layout["hierarchical"] = {
                    enabled: true,
                    direction: 'LR',
                    treeSpacing: 50
                };
                setTracksNodes();
                setTracksEdges();
                break;
            case museum.graphmanager.types.playlistsGeneral:
                setPlaylistsNodes();
                setPlaylistsEdges();
                break;
        }

        var data = {
            nodes: nodes,
            edges: edges
        };

        network = new vis.Network(container, data, options);
        network.once('afterDrawing', drawingDone);
    }

    return {
        setRandomData: setRandomData,
        setPlaylistsData: setPlaylistsData,
        draw: draw,
        stabilize: stabilize
    };
})();
