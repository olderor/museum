var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.max_flow = museum.algorithms.max_flow || {};
museum.algorithms.max_flow = (function() {

    var allEdges;
    var allNodes;
    var allNodeIds;
    var allEdgesData;

    var verticesCount;
    var graph = [];
    var edges = [];
    var height = [];
    var excess = [];
    var used = [];
    var heightsCount = [];

    var verticesQueue = [];

    function addEdge(from, to, cost, id) {
        var edge = {
            from: from,
            to: to,
            cost: cost,
            index: graph[to].length,
            flow: 0,
            id: id
        };
        graph[from].push(edge);
        edges.push(edge);

        edge = {
            from: to,
            to: from,
            index: graph[from].length - 1,
            flow: 0,
            cost: 0,
            id: id
        };
        graph[to].push(edge);
    }

    function enqueue(vertex) {
        if (used[vertex]) {
            return;
        }
        if (excess[vertex] < 1) {
            return;
        }
        used[vertex] = true;
        verticesQueue.push(vertex);
        (function(vertexIndex, vertexId) {
            museum.animation_manager.addAnimation({
                block: function() {
                    $('#description').text('Adding vertex ' + vertexIndex + ' to queue');
                    allNodes.update([{
                        id: vertexId,
                        borderWidth: 20,
                        color: "blue"
                    }]);
                },
                delay: 2000
            });
        })(vertex, allNodeIds[vertex]);
    }

    function push(edge) {
        if (height[edge.from] <= height[edge.to]) {
            return;
        }
        var dif = edge.cost - edge.flow;
        if (dif > excess[edge.from]) {
            dif = excess[edge.from];
        }
        if (dif == 0) {
            return;
        }

        updateExcess(edge.to, excess[edge.to] + dif);
        updateExcess(edge.from, excess[edge.from] - dif);

        updateEdgeFlow(edge, graph[edge.to][edge.index], edge.flow + dif);
        updateEdgeFlow(graph[edge.to][edge.index], edge, graph[edge.to][edge.index].flow - dif);

        enqueue(edge.to);
    }

    function removeHeight(minHeigth) {
        for (var v = 0; v < verticesCount; ++v) {
            if (height[v] >= minHeigth) {
                --heightsCount[height[v]];
                if (height[v] < verticesCount + 1) {
                    updateHeight(v, verticesCount + 1);
                }
                ++heightsCount[height[v]];
                enqueue(v);
            }
        }
    }

    function relabel(vertex) {
        --heightsCount[height[vertex]];
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Setting height to infinity');
            },
            delay: 1000
        });
        updateHeight(vertex, verticesCount + verticesCount);
        for (var i = 0; i < graph[vertex].length; ++i) {
            if (graph[vertex][i].cost - graph[vertex][i].flow <= 0) {
                continue;
            }
            (function(prevValue, newValue) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Found edge with free space. Updating min-height from ' + prevValue + ' to ' + newValue);
                    },
                    delay: 3000
                });
            })(height[vertex], Math.min(height[vertex], height[graph[vertex][i].to] + 1));
            updateHeight(vertex, Math.min(height[vertex], height[graph[vertex][i].to] + 1));
        }
        ++heightsCount[height[vertex]];
        enqueue(vertex);
    }

    function discharge(vertex) {
        if (excess[vertex] > 0) {
            for (var i = 0; i < graph[vertex].length; ++i) {
                (function(edgeId) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            $('#description').text('Trying to push edge');
                            allEdges.update([{
                                id: edgeId,
                                width: 20
                            }]);
                        },
                        delay: 3000
                    });
                })(graph[vertex][i].id);
                push(graph[vertex][i]);
                (function(edgeId) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            $('#description').text('Done pushing edge');
                            allEdges.update([{
                                id: edgeId,
                                width: 2
                            }]);
                        },
                        delay: 1000
                    });
                })(graph[vertex][i].id);
            }
        }

        if (excess[vertex] <= 0) {
            return;
        }
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Excess left. Relabeling...');
            },
            delay: 1000
        });

        if (heightsCount[height[vertex]] != 1) {
            relabel(vertex);
            return;
        }
        removeHeight(height[vertex]);
    }

    function updateVertex(vertex, delay = 3000) {
        (function(vertexId, heightValue, excessValue) {
            museum.animation_manager.addAnimation({
                block: function() {
                    allNodes.update([{
                        id: vertexId,
                        label: 'h: ' + heightValue + ', e: ' + excessValue
                    }]);
                },
                delay: delay
            });
        })(allNodeIds[vertex], height[vertex], excess[vertex]);
    }

    function updateEdgeFlow(edge, back, value) {
        edge.flow = value;
        (function(edgeId, flow, cost, backFlow, backCost) {
            museum.animation_manager.addAnimation({
                block: function() {
                    $('#description').text('Updating edge flow');
                    allEdges.update([{
                        id: edgeId,
                        label: '' + backFlow + '/' + backCost + ', ' + flow + '/' + cost,
                    }]);
                },
                delay: 3000
            });
        })(edge.id, edge.flow, edge.cost, back.flow, back.cost);
    }

    function updateHeight(vertex, value) {
        height[vertex] = value;
        updateVertex(vertex);
    }

    function updateExcess(vertex, value) {
        excess[vertex] = value;
        updateVertex(vertex);
    }

    function maxflow() {
        museum.animation_manager.addForceAnimation({
            block: function() {
                $('#description').removeClass('hidden');
            },
            delay: 0
        });
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Initializing...');
            },
            delay: 0
        });
        for (var i = 0; i < verticesCount; ++i) {
            updateVertex(i, 0);
        }
        heightsCount[0] = verticesCount - 1;
        heightsCount[verticesCount] = 1;
        updateHeight(0, verticesCount);
        used[0] = true;
        used[verticesCount - 1] = true;
        museum.animation_manager.addAnimation({
            block: function() {
                $('#description').text('Done initializing');
            },
            delay: 1000
        });

        for (var i = 0; i < graph[0].length; ++i) {
            (function(edgeId, vertexIndex, vertexId, value, mark) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Excessing vertex ' + vertexIndex + ' by ' + value);
                        if (mark) {
                            allNodes.update([{
                                id: vertexId,
                                borderWidth: 20,
                                color: "yellow"
                            }]);
                        }
                        allEdges.update([{
                            id: edgeId,
                            width: 10
                        }]);
                    },
                    delay: 1000
                });
            })(graph[0][i].id, graph[0][i].to, allNodeIds[graph[0][i].to], graph[0][i].cost, !used[graph[0][i].to]);
            updateExcess(0, excess[0] + graph[0][i].cost);
            (function(edgeId) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Trying to push edge');
                        allEdges.update([{
                            id: edgeId,
                            width: 20
                        }]);
                    },
                    delay: 3000
                });
            })(graph[0][i].id);
            push(graph[0][i]);
            (function(edgeId) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Done pushing edge');
                        allEdges.update([{
                            id: edgeId,
                            width: 2
                        }]);
                    },
                    delay: 1000
                });
            })(graph[0][i].id);
            (function(vertexIndex, vertexId, mark) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Done excessing vertex ' + vertexIndex);
                        if (mark) {
                            var groupsSettings = museum.network.getGroupSettingsById(vertexId);
                            allNodes.update([{
                                id: vertexId,
                                borderWidth: groupsSettings.borderWidth,
                                color: groupsSettings.color
                            }]);
                        }
                    },
                    delay: 1000
                });
            })(i, allNodeIds[i], !used[graph[0][i].to]);
        }

        while (!verticesQueue.empty()) {
            var vertex = verticesQueue.shift();
            used[vertex] = false;
            (function(vertexIndex, vertexId) {
                museum.animation_manager.addAnimation({
                    block: function() {
                        $('#description').text('Discharging ' + vertexIndex);
                        allNodes.update([{
                            id: vertexId,
                            color: "green"
                        }]);
                    },
                    delay: 3000
                });
            })(vertex, allNodeIds[vertex]);
            discharge(vertex);
            if (!used[vertex]) {
                (function(vertexIndex, vertexId) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            var groupsSettings = museum.network.getGroupSettingsById(vertexId);
                            allNodes.update([{
                                id: vertexId,
                                borderWidth: groupsSettings.borderWidth,
                                color: groupsSettings.color
                            }]);
                        },
                        delay: 1000
                    });
                })(vertex, allNodeIds[vertex]);
            }
            else {
                (function(vertexIndex, vertexId) {
                    museum.animation_manager.addAnimation({
                        block: function() {
                            allNodes.update([{
                                id: vertexId,
                                color: "blue"
                            }]);
                        },
                        delay: 1000
                    });
                })(vertex, allNodeIds[vertex]);
            }
        }

        var result = 0;
        for (var i = 0; i < graph[0].length; ++i) {
            result += graph[0][i].flow;
        }

        (function(value) {
            museum.animation_manager.addForceAnimation({
                block: function() {
                    $('#description').text('Done. Max flow value ' + value);
                },
                delay: 0
            });
        })(result);
        
        if (result == 0) {
            return [];
        }

        museum.animation_manager.addAnimation({
            block: function() {},
            delay: 3000
        });
        
        return updateEdgesValues();
    }

    function updateEdgesValues() {
        var edgesFlows = {};

        for (var i = 0; i < graph.length; ++i) {
            for (var j = 0; j < graph[i].length; ++j) {
                if (graph[i][j].flow < 0) {
                    continue;
                }
                if (!edgesFlows[graph[i][j].id] || edgesFlows[graph[i][j].id] < graph[i][j].flow) {
                    edgesFlows[graph[i][j].id] = graph[i][j].flow;
                }
            }
        }
        var updates = [];
        var flowEdges = [];
        for (var i = 0; i < allEdgesData.length; ++i) {
            var value = edgesFlows[allEdgesData[i].id];
            if (value != 0) {
                updates.push({
                    id: allEdgesData[i].id,
                    label: '' + value,
                    width: 15
                });
                flowEdges.push(allEdgesData[i]);
            }
            else {
                updates.push({
                    id: allEdgesData[i].id,
                    label: '',
                    width: 1
                });
            }
        }

        (function(updates) {
            museum.animation_manager.addForceAnimation({
                block: function() {
                    allEdges.update(updates);
                },
                delay: 0
            });
        })(updates);
        return flowEdges;
    }

    function clear(vs) {
        verticesCount = vs;
        graph.clear();
        graph.resizeMatrix(vs, 0);
        edges.clear();
        height.clear();
        height.resize(vs);
        excess.clear();
        excess.resize(vs);
        used.clear();
        used.resize(vs);
        heightsCount.clear();
        heightsCount.resize(vs);
        verticesQueue.clear();
    }

    function initGraph() {
        for (var i = 0; i < allEdgesData.length; ++i) {
            addEdge(allEdgesData[i].fromNodeIndex, allEdgesData[i].toNodeIndex, allEdgesData[i].edgeValue, allEdgesData[i].id);
            addEdge(allEdgesData[i].toNodeIndex, allEdgesData[i].fromNodeIndex, allEdgesData[i].edgeValue, allEdgesData[i].id);
        }
    }

    function findMaxFlow(nodes, edges, nodeIds, edgesData) {
        allEdges = edges;
        allNodes = nodes;
        allNodeIds = nodeIds;
        allEdgesData = edgesData;
        clear(allNodeIds.length);
        initGraph();
        return maxflow();
    }

    return {
        findMaxFlow: findMaxFlow
    };
})();
