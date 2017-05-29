var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.global_min_cut = museum.algorithms.global_min_cut || {};
museum.algorithms.global_min_cut = (function() {

    var allNodes;
    var allEdges;

    var bestCost;
    var bestCut;
    
    var graphPartsIndexes;
    var graphParts;
    
    var linkedVertices;
    
    var nodesIndexes;
    
    function initGraph(nodes, edges) {
        var graph = [];
        if (nodes.length == 0) {
            return graph;
        }
        graph.resizeMatrix(nodes.length, nodes.length, 0);
        for (var i = 0; i < edges.length; ++i) {
            if (edges[i].part != graphPartsIndexes[nodes[0]]) {
                continue;
            }
            graph[nodesIndexes[edges[i].fromNodeIndex]][nodesIndexes[edges[i].toNodeIndex]] += edges[i].edgeValue;
            graph[nodesIndexes[edges[i].toNodeIndex]][nodesIndexes[edges[i].fromNodeIndex]] += edges[i].edgeValue;
        }
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
            }
            var previous;
            for (var phaseI = 0; phaseI <= verticesCount - phase; ++phaseI) {
                var newVertex = -1;
                for (var i = 0; i < verticesCount; ++i) {
                    if (!used[i] && !inSet[i] &&
                        (newVertex == -1 || setValues[i] > setValues[newVertex])) {
                        newVertex = i;
                    }
                }

                if (phaseI != verticesCount - phase) {
                    inSet[newVertex] = true;
                    for (var i = 0; i < verticesCount; ++i) {
                        setValues[i] += graph[newVertex][i];
                    }
                    previous = newVertex;
                    continue;
                }

                used[newVertex] = true;

                if (bestCost > setValues[newVertex]) {
                    bestCost = setValues[newVertex];
                    bestCut = vertices[newVertex];
                }

                for (var i = 0; i < vertices[newVertex].length; ++i) {
                    vertices[previous].push(vertices[newVertex][i]);
                }

                for (var i = 0; i < verticesCount; ++i) {
                    graph[previous][i] += graph[i][newVertex];
                    graph[i][previous] = graph[previous][i];
                }
            }
        }
    }
    
    function setLinkedEdges() {
        linkedVertices = [];
        linkedVertices.resizeMatrix(allNodes.length, 0, 0);
        for (var i = 0; i < allEdges.length; ++i) {
            linkedVertices[allEdges[i].fromNodeIndex].push(allEdges[i].toNodeIndex);
            linkedVertices[allEdges[i].toNodeIndex].push(allEdges[i].fromNodeIndex);
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
        for (var i = 0; i < allEdges.length; ++i) {
            allEdges[i].part = graphPartsIndexes[allEdges[i].fromNodeIndex];
        }
        var edgesToRemove = [];
        for (var i = 0; i < partIndex; ++i) {
            var graph = initGraph(graphParts[i], allEdges);
            mincut(graphParts[i], graph);
            bestCut = museum.algorithms.quick_sort.quickSort(bestCut);
            for (var j = 0; j < allEdges.length; ++j) {
                if (allEdges[j].part != i) {
                    continue;
                }
                var indexFrom = museum.algorithms.search.binarySearch(bestCut, nodesIndexes[allEdges[j].fromNodeIndex]);
                var indexTo = museum.algorithms.search.binarySearch(bestCut, nodesIndexes[allEdges[j].toNodeIndex]);
                if (indexFrom == -1 && indexTo != -1 || indexFrom != -1 && indexTo == -1) {
                    edgesToRemove.push(allEdges[j].id);
                }
            }
        }
        return edgesToRemove;
    }

    function setData(nodesData, edgesData) {
        allNodes = nodesData;
        allEdges = edgesData;
    }

    return {
        setData: setData,
        getEdgesToRemove: getEdgesToRemove
    };
})();
