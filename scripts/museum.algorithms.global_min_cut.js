var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.global_min_cut = museum.algorithms.global_min_cut || {};
museum.algorithms.global_min_cut = (function() {

    var nodes;
    var edges;

    var graph;

    var bestCost;
    var bestCut;

    function initGraph() {
        graph = [];
        graph.resizeMatrix(nodes.length, nodes.length, 0);
        for (var i = 0; i < edges.length; ++i) {
            graph[edges[i].fromNodeIndex][edges[i].toNodeIndex] += edges[i].edgeValue;
            graph[edges[i].toNodeIndex][edges[i].fromNodeIndex] += edges[i].edgeValue;
        }
        bestCost = Number.MAX_SAFE_INTEGER;
        bestCut = [];
    }


    function mincut() {
        var vertices = [];
        var used = [];
        var verticesCount = nodes.length;
        
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

    function getMincutPartNodes() {
        initGraph();
        mincut();
        console.log(bestCost);
        return bestCut;
    }

    function setData(nodesData, edgesData) {
        nodes = nodesData;
        edges = edgesData;
    }

    return {
        setData: setData,
        getMincutPartNodes: getMincutPartNodes
    };
})();
