var museum = museum || {};
museum.algorithms = museum.algorithms || {};
museum.algorithms.max_flow = museum.algorithms.max_flow || {};
museum.algorithms.max_flow = (function() {
    
    var allNodes = [];
    var allNodesData = [];
    var allEdges = [];
    var allEdgesData = [];
    
    var verticesCount;
    var graph = [];
    var edges = [];
    var height = [];
    var excess = [];
    var used = [];
    var heightsCount = [];
    
    var verticesQueue = [];
    
    function addEdge(from, to, cost) {
        var edge = {
            from: from,
            to: to,
            cost: cost,
            index: graph[to].length
        };
        graph[from].push(edge);
        edges.push(edge);
        
        edge = {
            from: to,
            to: from,
            index: graph[from].length - 1
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

        excess[edge.to] += dif;
        excess[edge.from] -= dif;

        edge.flow += dif;
        graph[edge.to][edge.index].flow -= dif;
        enqueue(edge.to);
    }

    function removeHeight(minHeigth) {
        for (var v = 0; v < verticesCount; ++v) {
            if (height[v] >= minHeigth) {
                --heightsCount[height[v]];
                if (height[v] < verticesCount + 1) {
                    height[v] = verticesCount + 1;
                }
                ++heightsCount[height[v]];
                enqueue(v);
            }
        }
    }

    function relabel(vertex) {
        --heightsCount[height[vertex]];
        height[vertex] = verticesCount + verticesCount;
        for (var i = 0; i < graph[vertex].length; ++i) {
            if (graph[vertex][i].cost - graph[vertex][i].flow <= 0) {
                continue;
            }
            height[vertex] = Math.min(height[vertex], height[graph[vertex][i].to] + 1);
        }
        ++heightsCount[height[vertex]];
        enqueue(vertex);
    }

    function discharge(vertex) {
        if (excess[vertex] > 0) {
            for (var i = 0; i < graph[vertex].length; ++i) {
                push(graph[vertex][i]);
            }
        }

        if (excess[vertex] <= 0) {
            return;
        }

        if (heightsCount[height[vertex]] != 1) {
            relabel(vertex);
            return;
        }
        removeHeight(height[vertex]);
    }

    function maxflow() {
        heightsCount[0] = verticesCount - 1;
        heightsCount[verticesCount] = 1;
        height[0] = verticesCount;
        used[0] = true;
        used[verticesCount - 1] = true;

        for (var i = 0; i < graph[0].length; ++i) {
            excess[0] += graph[0][i].cost;
            push(graph[0][i]);
        }

        while (!verticesQueue.empty()) {
            var vertex = verticesQueue.shift();
            used[vertex] = false;
            discharge(vertex);
        }

        var result = 0;
        for (var i = 0; i < graph[0].length; ++i) {
            result += graph[0][i].flow;
        }
        return result;
    }

    function clear(vs) {
        verticesCount = vs;
        graph.clear();
        graph.resize(vs);
        edges.clear();
        height.clear();
        height.resize(vs);
        excess.clear();
        excess.resize(vs);
        used.clear();
        used.resize(vs);
        heightsCount.clear();
        heightsCount.resize(vs);
        while (!verticesQueue.empty()) {
            verticesQueue.pop();
        }
    }
    
    function initGraph() {
        
    }
    
    function findMaxFlow(nodes, nodesData, edges, edgesData) {
        allNodes = nodes;
        allNodesData = nodesData;
        allEdges = edges;
        allEdgesData = edgesData;
        clear(allNodesData.length);
        initGraph();
        return maxflow();
    }

    return {
        findMaxFlow: findMaxFlow
    };
})();
