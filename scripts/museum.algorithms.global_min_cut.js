var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.global_min_cut = museum.algorithms.global_min_cut || {};
museum.algorithms.global_min_cut = (function() {

    var allNodes;
    var allEdges;

    var allNodesData;
    var allEdgesData;

    var bestCost;
    var bestCut;

    var graphPartsIndexes;
    var graphParts;

    var linkedVertices;

    var nodesIndexes;

    var graphEdges = [];

    function initGraph(nodes, edges) {
        graphEdges = [];
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Initializing data...');
            },
            delay: 0
        });
        var graph = [];
        if (nodes.length == 0) {
            return graph;
        }
        graph.resizeMatrix(nodes.length, nodes.length, 0);
        graphEdges.resizeMatrix(nodes.length, nodes.length, null);
        for (var i = 0; i < edges.length; ++i) {
            if (edges[i].part != graphPartsIndexes[nodes[0]]) {
                continue;
            }
            graph[nodesIndexes[edges[i].fromNodeIndex]][nodesIndexes[edges[i].toNodeIndex]] += edges[i].edgeValue;
            graph[nodesIndexes[edges[i].toNodeIndex]][nodesIndexes[edges[i].fromNodeIndex]] += edges[i].edgeValue;
            (function(edgeId) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        allEdges.update([{
                            id: edgeId,
                            hidden: true
                        }]);
                    },
                    delay: 0
                });
            })(edges[i].id);
        }

        for (var i = 0; i < nodes.length; ++i) {
            for (var j = i + 1; j < nodes.length; ++j) {
                var edge = {
                    id: museum.random.guid(),
                    from: allNodesData[nodes[i]].id,
                    to: allNodesData[nodes[j]].id,
                    fake: true,
                    label: '' + graph[i][j]
                };
                graphEdges[i][j] = edge;
                graphEdges[j][i] = edge;
                (function(edge) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allEdges.add([edge]);
                        },
                        delay: 0
                    });
                })(edge);
            }
        }

        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Initializing data...');
            },
            delay: 4000
        });
        return graph;
    }

    function mincut(nodes, graph) {
        var vertices = [];
        var used = [];
        var verticesCount = nodes.length;

        bestCost = Number.MAX_SAFE_INTEGER;
        bestCut = [];

        vertices.resizeMatrix(verticesCount, 0, 0);
        for (var i = 0; i < verticesCount; ++i) {
            vertices[i].push(i);
            used.push(false);
        }
        for (var phase = 1; phase < verticesCount; ++phase) {
            var inSet = [];
            var setValues = [];
            for (var i = 0; i < verticesCount; ++i) {
                inSet.push(false);
                setValues.push(0);
                var node = allNodesData[nodes[i]].id;
                (function(node) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allNodes.update([{
                                id: node,
                                label: "0"
                            }]);
                        },
                        delay: 0
                    });
                })(node);
            }

            museum.animation_manager.addAnimation({
                block: function() {},
                delay: 1000
            });

            var previous = -1;
            for (var phaseI = 0; phaseI <= verticesCount - phase; ++phaseI) {
                var newVertex = -1;
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Finding best vertex...');
                    },
                    delay: 0
                });
                for (var i = 0; i < verticesCount; ++i) {
                    if (!used[i] && !inSet[i] &&
                        (newVertex == -1 || setValues[i] > setValues[newVertex])) {
                        newVertex = i;
                    }
                }

                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Vertex found (red)');
                    },
                    delay: 0
                });
                var node = allNodesData[nodes[newVertex]].id;
                (function(node) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allNodes.update([{
                                id: node,
                                borderWidth: 20,
                                color: "red"
                            }]);
                        },
                        delay: 4000
                    });
                })(node);

                if (phaseI != verticesCount - phase) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            $('#description').text('Updating vertices value...');
                        },
                        delay: 0
                    });
                    inSet[newVertex] = true;
                    for (var i = 0; i < verticesCount; ++i) {
                        setValues[i] += graph[newVertex][i];
                        var node = allNodesData[nodes[i]].id;
                        (function(node, value) {
                            museum.animation_manager.addAnimation({
                                block: function() {
                                    allNodes.update([{
                                        id: node,
                                        label: '' + value
                                    }]);
                                },
                                delay: 2000
                            });
                        })(node, setValues[i]);
                    }
                    previous = newVertex;


                    museum.animation_manager.addAnimation({
                        block: function() {
                            $('#description').text('Remember used vertex');
                        },
                        delay: 0
                    });
                    var node = allNodesData[nodes[newVertex]].id;
                    (function(node) {
                        museum.animation_manager.addAnimation({
                            block: function() {
                                allNodes.update([{
                                    id: node,
                                    borderWidth: 20,
                                    color: "yellow"
                                }]);
                            },
                            delay: 2000
                        });
                    })(node);

                    continue;
                }

                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Vertex found');
                    },
                    delay: 0
                });

                used[newVertex] = true;

                var node = allNodesData[nodes[newVertex]].id;
                (function(node) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allNodes.update([{
                                id: node,
                                borderWidth: 20,
                                color: "green"
                            }]);
                        },
                        delay: 4000
                    });
                })(node);

                if (bestCost > setValues[newVertex]) {
                    for (var i = 0; i < bestCut.length; ++i) {
                        var node = allNodesData[nodes[newVertex]].id;
                        (function(node) {
                            museum.animation_manager.addAnimation({
                                block: function() {
                                    allNodes.update([{
                                        id: node,
                                        borderWidth: 20,
                                        color: "green"
                                    }]);
                                },
                                delay: 0
                            });
                        })(node);
                    }
                    bestCost = setValues[newVertex];
                    bestCut = vertices[newVertex];
                    for (var i = 0; i < bestCut.length; ++i) {
                        var node = allNodesData[nodes[newVertex]].id;
                        (function(node) {
                            museum.animation_manager.addAnimation({
                                block: function() {
                                    allNodes.update([{
                                        id: node,
                                        borderWidth: 20,
                                        color: "blue"
                                    }]);
                                },
                                delay: 0
                            });
                        })(node);
                    }
                    museum.animation_manager.addAnimation({
                        block: function() {},
                        delay: 4000
                    });
                }


                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Get previous used vertex (red)');
                    },
                    delay: 0
                });
                var node = allNodesData[nodes[previous]].id;
                (function(node) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allNodes.update([{
                                id: node,
                                borderWidth: 20,
                                color: "red"
                            }]);
                        },
                        delay: 2000
                    });
                })(node);

                for (var i = 0; i < vertices[newVertex].length; ++i) {
                    vertices[previous].push(vertices[newVertex][i]);
                }

                for (var i = 0; i < verticesCount; ++i) {
                    graph[previous][i] += graph[i][newVertex];
                    graph[i][previous] = graph[previous][i];
                    if (i == previous) {
                        continue;
                    }
                    (function(edgeId, value) {
                        museum.animation_manager.addAnimation({
                            block: function() {
                                allEdges.update([{
                                    id: edgeId,
                                    label: '' + value
                                }]);
                            },
                            delay: 3000
                        });
                    })(graphEdges[i][previous].id, graph[i][previous]);
                }
            }
        }
    }

    function setLinkedEdges() {
        linkedVertices = [];
        linkedVertices.resizeMatrix(allNodes.length, 0, 0);
        for (var i = 0; i < allEdgesData.length; ++i) {
            linkedVertices[allEdgesData[i].fromNodeIndex].push(allEdgesData[i].toNodeIndex);
            linkedVertices[allEdgesData[i].toNodeIndex].push(allEdgesData[i].fromNodeIndex);
        }
    }

    function isFree(vertex) {
        return graphPartsIndexes[vertex] == -1;
    }


    var vertexIndex;

    function dfs(vertex, partIndex) {
        if (!isFree(vertex)) {
            return;
        }
        nodesIndexes[vertex] = vertexIndex++;
        graphParts[partIndex].push(vertex);
        graphPartsIndexes[vertex] = partIndex;
        for (var i = 0; i < linkedVertices[vertex].length; ++i) {
            dfs(linkedVertices[vertex][i], partIndex);
        }
    }

    function getEdgesToRemove() {
        $('#description').removeClass('hidden');
        setLinkedEdges();
        graphPartsIndexes = []
        graphPartsIndexes.resize(allNodes.length, -1);
        nodesIndexes = [];
        nodesIndexes.resize(allNodes.length, -1);
        graphParts = [];
        var partIndex = 0;
        for (var i = 0; i < allNodes.length; ++i) {
            if (isFree(i)) {
                vertexIndex = 0;
                graphParts.push([]);
                dfs(i, partIndex);
                ++partIndex;
            }
        }
        for (var i = 0; i < allEdgesData.length; ++i) {
            allEdgesData[i].part = graphPartsIndexes[allEdgesData[i].fromNodeIndex];
        }
        var edgesToRemove = [];
        for (var i = 0; i < partIndex; ++i) {
            var graph = initGraph(graphParts[i], allEdgesData);
            mincut(graphParts[i], graph);
            bestCut = museum.algorithms.quick_sort.quickSort(bestCut);
            for (var j = 0; j < allEdgesData.length; ++j) {
                if (allEdgesData[j].part != i) {
                    continue;
                }
                var indexFrom = museum.algorithms.search.binarySearch(bestCut, nodesIndexes[allEdgesData[j].fromNodeIndex]);
                var indexTo = museum.algorithms.search.binarySearch(bestCut, nodesIndexes[allEdgesData[j].toNodeIndex]);
                if (indexFrom == -1 && indexTo != -1 || indexFrom != -1 && indexTo == -1) {
                    edgesToRemove.push(allEdgesData[j].id);
                }
            }


            museum.animation_manager.addAnimation({
                block: function() {},
                delay: 3000
            });
            for (var w = 0; w < allEdgesData.length; ++w) {
                (function(edgeId) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allEdges.update([{
                                id: edgeId,
                                hidden: false
                            }]);
                        },
                        delay: 0
                    });
                })(allEdgesData[w].id);
            }
            for (var w = 0; w < graphParts[i].length; ++w) {
                for (var j = w + 1; j < graphParts[i].length; ++j) {
                    (function(edge) {
                        museum.animation_manager.addAnimation({
                            block: function() {
                                allEdges.remove(edge);
                            },
                            delay: 0
                        });
                    })(graphEdges[w][j].id);
                }
            }
        }
        museum.animation_manager.addAnimation({
            block: function() {},
            delay: 6000
        });
        for (var i = 0; i < allNodesData.length; ++i) {
            (function(nodeId) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        var settings = museum.network.getGroupSettingsById(nodeId);
                        allNodes.update([{
                            id: nodeId,
                            color: settings.color,
                            borderWidth: settings.borderWidth,
                            label: ''
                        }]);
                    },
                    delay: 0
                });
            })(allNodesData[i].id);
        }

        return edgesToRemove;
    }

    function setData(nodes, nodesData, edges, edgesData) {
        allNodes = nodes;
        allEdges = edges;
        allNodesData = nodesData;
        allEdgesData = edgesData;
    }

    return {
        setData: setData,
        getEdgesToRemove: getEdgesToRemove
    };
})();
