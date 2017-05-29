var museum = museum || {};
museum.network = museum.network || {};
museum.network = (function() {
    var network = null;

    var nodes = null;
    var edges = null;

    var onDrawingDone = null;

    var playlists = {};
    
    function setDataToArray(data) {
        var dataIds = data.getIds();
        var allData = [];
        for (var i = 0; i < dataIds.length; ++i) {
            allData.push(data.get(dataIds[i]));
        }
        return allData;
    }

    function setRandomData() {
        var minimumNodesCount = 20;
        var maximumNodesCount = 50;

        var nodesCount = museum.random.getRandomInt(minimumNodesCount, maximumNodesCount);
        var edgesCount = museum.random.getRandomInt(minimumNodesCount * (minimumNodesCount - 1) / 2 / 2, nodesCount * (nodesCount - 1) / 2);

        nodes = new vis.DataSet();
        edges = new vis.DataSet();

        for (var i = 0; i < nodesCount; ++i) {
            nodes.add({
                id: i,
                label: '' + i,
                group: museum.random.getRandomInt(0, nodesCount / 5)
            });
        }
        for (var i = 0; i < nodesCount; ++i) {
            edges.add({
                from: museum.random.getRandomInt(0, nodesCount),
                to: museum.random.getRandomInt(0, nodesCount)
            });
        }
    }

    function setTracksNodes() {
        nodes = new vis.DataSet();
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

                nodes.add({
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
        edges = new vis.DataSet();
        var allNodes = setDataToArray(nodes);
        for (var i = 0; i < allNodes.length; ++i) {
            for (var j = i + 1; j < allNodes.length; ++j) {
                if (allNodes[i].trackId == allNodes[j].trackId) {
                    edges.add({
                        from: allNodes[i].id,
                        to: allNodes[j].id,

                        fromNodeIndex: i,
                        toNodeIndex: j,
                        edgeValue: 1
                    });
                }
            }
        }
    }

    function setPlaylistsData(playlistsData) {
        playlists = playlistsData;
    }



    function setPlaylistsNodes() {
        nodes = new vis.DataSet();;
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

            nodes.add({
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
        edges = new vis.DataSet();
        var nodesIds = nodes.getIds();
        var allNodes = setDataToArray(nodes);
        for (var i = 0; i < allNodes.length; ++i) {
            for (var j = i + 1; j < allNodes.length; ++j) {
                var count = getSimilarTracksCount(
                    playlists[allNodes[i].id]["tracks"]["items"],
                    playlists[allNodes[j].id]["tracks"]["items"]);
                if (count == 0) {
                    continue;
                }
                edges.add({
                    from: allNodes[i].id,
                    to: allNodes[j].id,
                    label: '' + count,

                    fromNodeIndex: i,
                    toNodeIndex: j,
                    edgeValue: count
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
                    treeSpacing: 50,
                    nodeDistance: 50,
                    centralGravity: 50
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
    
    
    function split() {
        var allNodes = setDataToArray(nodes);
        var allEdges = setDataToArray(edges);
        museum.algorithms.global_min_cut.setData(allNodes, allEdges);
        var edgesToRemove = museum.algorithms.global_min_cut.getEdgesToRemove();
        for (var i = 0; i < edgesToRemove.length; ++i) {
            edges.remove(edgesToRemove[i]);
        }
    }
    
    return {
        setRandomData: setRandomData,
        setPlaylistsData: setPlaylistsData,
        draw: draw,
        stabilize: stabilize,
        split: split
    };
})();
