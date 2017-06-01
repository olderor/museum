var museum = museum || {};
museum.network = museum.network || {};
museum.network = (function() {
    var network = null;

    var nodes = null;
    var edges = null;

    var onDrawingDone = null;

    var playlists = {};

    var verticesWithoutEdges = [];

    var shouldShowVerticesWithoutEdges = false;

    var groupsSettings = {};
    var groupsByIds = {};

    var fakeNodes = [];
    var fakeEdges = [];

    var level = 0;
    
    var authors = {};

    function getGroupSettings(group) {
        return groupsSettings[group];
    }

    function getGroupSettingsById(id) {
        return groupsSettings[groupsByIds[id]];
    }

    function addGroupSettingsIfNeeded(group, id) {
        groupsByIds[id] = group;
        if (getGroupSettings(group)) {
            return;
        }
        var color = museum.random.getRandomColorRgba();
        groupsSettings[group] = {
            color: color,
            borderWidth: 10
        };
    }

    function getOptions() {
        return {
            nodes: {
                shape: 'dot',
                size: 30,
                font: {
                    size: 25,
                    color: '#ffffff'
                }
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
    }

    function getLabelOptions() {
        return {
            nodes: {
                shape: 'dot',
                size: 10,
                font: {
                    size: 12,
                    color: '#ffffff'
                },
                borderWidth: 2
            },
            physics: {
                stabilization: false,
                minVelocity: 0
            },
            layout: {
                improvedLayout: false
            },
            groups: groupsSettings
        };
    }

    function setDataToArray(data) {
        var dataIds = data.getIds();
        var allData = [];
        for (var i = 0; i < dataIds.length; ++i) {
            let current = data.get(dataIds[i]);
            if (current.isLabel) {
                continue;
            }
            allData.push(current);
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
        groupsSettings = {};
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
        groupsSettings = {};
        level = 0;
        var nodeIndex = 0;
        for (var guid in playlists) {
            var playlist = playlists[guid];
            if (!playlist) {
                continue;
            }
            ++level;
            var tracks = playlist["tracks"]["items"];
            for (var i = 0; i < tracks.length; ++i) {
                var track = tracks[i]["track"];
                var artists = track["artists"];
                var trackId = track["id"];
                
                var artistsNames = [];
                var artistLabel = artists[0]["name"];
                artistsNames.push(artists[0]["name"]);
                for (var j = 1; j < artists.length; ++j) {
                    artistsNames.push(artists[j]["name"]);
                    artistLabel += ", " + artists[j]["name"];
                }
                if (!authors[trackId]) {
                    authors[trackId] = artistsNames;
                }

                var image = museum.parser.getImageWithMinimumSize(track["album"]);
                var imageUrl = "";
                if (image && image["url"]) {
                    imageUrl = image["url"];
                }
                let id = museum.random.guid();
                addGroupSettingsIfNeeded(guid, id);
                nodes.add({
                    id: id,
                    title: artistLabel + " - " + track["name"],
                    image: imageUrl,
                    group: guid,
                    shape: 'circularImage',
                    level: level,
                    nodeIndex: nodeIndex++,
                    trackId: trackId
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

                        fromNodeIndex: allNodes[i].nodeIndex,
                        toNodeIndex: allNodes[j].nodeIndex,
                        edgeValue: 1
                    });
                }
            }
        }
    }
    
    function getSimilarAuthorsCount(first, second) {
        var firstAuthors = authors[first];
        var secondAuthors = authors[second];
        var count = 0;
        for (var i = 0; i < firstAuthors.length; ++i) {
            for (var j = 0; j < secondAuthors.length; ++j) {
                if (firstAuthors[i] == secondAuthors[j]) {
                    ++count;
                }
            }
        }
        return count;
    }
    
    function setSimilarTracksEdges() {
        edges = new vis.DataSet();
        var allNodes = setDataToArray(nodes);
        for (var i = 0; i < allNodes.length; ++i) {
            for (var j = i + 1; j < allNodes.length; ++j) {
                var count = getSimilarAuthorsCount(allNodes[i].trackId, allNodes[j].trackId);
                if (count != 0) {
                    edges.add({
                        from: allNodes[i].id,
                        to: allNodes[j].id,
                        label: '' + count,
                        fromNodeIndex: allNodes[i].nodeIndex,
                        toNodeIndex: allNodes[j].nodeIndex,
                        edgeValue: count
                    });
                }
            }
        }
    }

    function setPlaylistsData(playlistsData) {
        playlists = playlistsData;
    }

    function setPlaylistsNodes() {
        nodes = new vis.DataSet();
        groupsSettings = {};
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

            addGroupSettingsIfNeeded(playlist["id"], guid);
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
        var options = getOptions();
        switch (type) {
            case museum.graphmanager.types.tracksGeneral:
                setTracksNodes();
                setTracksEdges();
                addLegend("guid");
                break;
            case museum.graphmanager.types.tracksMultipartite:
                options.layout["hierarchical"] = {
                    enabled: true,
                    direction: 'LR',
                    treeSpacing: 50
                };
                options.physics.enabled = false;
                setTracksNodes();
                setSimilarTracksEdges();
                createStartAndFinish();
                groupsSettings["fake"] = {
                    color: "#FF8400",
                    borderWidth: 10
                };
                addLegend("guid");
                break;
            case museum.graphmanager.types.playlistsGeneral:
                setPlaylistsNodes();
                setPlaylistsEdges();
                addLegend("id");
                break;
        }
        options.groups = groupsSettings;
        var data = {
            nodes: nodes,
            edges: edges
        };

        if (!shouldShowVerticesWithoutEdges) {
            removeVerticesWithoutEdges();
        }

        network = new vis.Network(container, data, options);
        network.once('afterDrawing', drawingDone);
    }

    function split() {
        museum.animation_manager.clear();
        var allNodesData = setDataToArray(nodes);
        var allEdgesData = setDataToArray(edges);
        museum.algorithms.global_min_cut.setData(nodes, allNodesData, edges, allEdgesData);
        var edgesToRemove = museum.algorithms.global_min_cut.getEdgesToRemove();
        for (var i = 0; i < edgesToRemove.length; ++i) {
            (function(i) {
                museum.animation_manager.addForceAnimation({
                    block: function() {
                        edges.remove(edgesToRemove[i]);
                    },
                    delay: 0
                });
            })(i);
        }
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').addClass('hidden');
            },
            delay: 0
        });

        museum.animation_manager.processAnimation();
    }

    function removeVerticesWithoutEdges() {
        verticesWithoutEdges = [];
        var allNodes = setDataToArray(nodes);
        var allEdges = setDataToArray(edges);

        var verticesHaveEdges = [];
        verticesHaveEdges.resize(allNodes.length, false);
        for (var i = 0; i < allEdges.length; ++i) {
            verticesHaveEdges[allEdges[i].fromNodeIndex] = true;
            verticesHaveEdges[allEdges[i].toNodeIndex] = true;
        }

        for (var i = 0; i < allNodes.length; ++i) {
            if (verticesHaveEdges[i]) {
                continue;
            }
            var node = nodes.get(allNodes[i].id);
            verticesWithoutEdges.push(node);
            nodes.remove(node.id);
        }
    }

    function showVerticesWithoutEdges() {
        for (var i = 0; i < verticesWithoutEdges.length; ++i) {
            nodes.add(verticesWithoutEdges[i]);
        }
        verticesWithoutEdges = [];
    }

    function filterVertices(withEdgesState) {
        if (withEdgesState) {
            shouldShowVerticesWithoutEdges = true;
            showVerticesWithoutEdges();
        }
        else {
            shouldShowVerticesWithoutEdges = false;
            removeVerticesWithoutEdges();
        }
    }

    function addLegend(groupBy) {
        var mynetwork = document.getElementById('label-network');
        var x = -mynetwork.clientWidth / 2 + 50;
        var y = -mynetwork.clientHeight / 2 + 50;
        var step = 70;
        var used = {};
        var labelNodes = [];
        for (let guid in playlists) {
            let playlist = playlists[guid];
            let group = playlist[groupBy];
            if (used[group]) {
                continue;
            }
            used[group] = true;
            labelNodes.push({
                id: "label-" + group,
                x: 50,
                y: y,
                label: playlist["name"] + " by " + playlist["owner"]["id"],
                group: group,
                fixed: true,
                physics: false,
                isLabel: true,
                level: -1
            });
            y += step;
        }
        network = new vis.Network(mynetwork, {
            nodes: labelNodes
        }, getLabelOptions());
    }

    function createStartAndFinish() {
        var start = {
            id: museum.random.guid(),
            title: 'start',
            label: 'start',
            group: 'fake',
            shape: 'circularImage',
            image: 'img/start.png',
            level: 0,
            nodeIndex: 0
        };
        var finish = {
            id: museum.random.guid(),
            title: 'finish',
            label: 'finish',
            group: 'fake',
            shape: 'circularImage',
            image: 'img/finish.png',
            level: level + 1,
            nodeIndex: nodes.length + 1
        };
        groupsByIds[start.id] = "fake";
        groupsByIds[finish.id] = "fake";
        var allNodesData = setDataToArray(nodes);
        for (var i = 0; i < allNodesData.length; ++i) {
            ++allNodesData[i].nodeIndex;
            nodes.update([{
                id: allNodesData[i].id,
                nodeIndex: allNodesData[i].nodeIndex
            }]);
            if (allNodesData[i].level == 1) {
                var edge = {
                    from: start.id,
                    to: allNodesData[i].id,
                    fromNodeIndex: -1,
                    toNodeIndex: i,
                    edgeValue: 1000000
                }
                edges.add(edge);
                continue;
            }
            if (allNodesData[i].level == level) {
                var edge = {
                    from: allNodesData[i].id,
                    to: finish.id,
                    fromNodeIndex: i,
                    toNodeIndex: allNodesData.length,
                    edgeValue: 1000000
                }
                edges.add(edge);
                continue;
            }
        }

        nodes.add(start);
        nodes.add(finish);

        var allEdgesData = setDataToArray(edges);
        for (var i = 0; i < allEdgesData.length; ++i) {
            ++allEdgesData[i].fromNodeIndex;
            ++allEdgesData[i].toNodeIndex;
            edges.update([{
                id: allEdgesData[i].id,
                fromNodeIndex: allEdgesData[i].fromNodeIndex,
                toNodeIndex: allEdgesData[i].toNodeIndex,
            }]);
        }
    }

    function findMaxFlow() {
        museum.animation_manager.clear();
        var allNodesData = setDataToArray(nodes);
        var nodeIds = [];
        nodeIds.resize(allNodesData.length);
        for (var i = 0; i < allNodesData.length; ++i) {
            nodeIds[allNodesData[i].nodeIndex] = allNodesData[i].id;
        }
        var allEdgesData = setDataToArray(edges);
        museum.algorithms.max_flow.findMaxFlow(nodes, edges, nodeIds, allEdgesData);
        museum.animation_manager.processAnimation();
    }

    return {
        setRandomData: setRandomData,
        setPlaylistsData: setPlaylistsData,
        draw: draw,
        stabilize: stabilize,
        split: split,
        filterVertices: filterVertices,
        getGroupSettings: getGroupSettings,
        getGroupSettingsById: getGroupSettingsById,
        findMaxFlow: findMaxFlow
    };
})();
