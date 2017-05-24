var musicapp = musicapp || {};
musicapp.network = (function() {
    var network = null;
    
    function draw() {
        var color = 'gray';
        var len = undefined;

        var minimumNodesCount = 20;
        var maximumNodesCount = 50;

        var nodesCount = musicapp.random.getRandomInt(minimumNodesCount, maximumNodesCount);
        var edgesCount = musicapp.random.getRandomInt(minimumNodesCount * (minimumNodesCount - 1) / 2 / 2, nodesCount * (nodesCount - 1) / 2);

        var nodes = [];
        var edges = [];

        for (var i = 0; i < nodesCount; ++i) {
            nodes.push({
                id: i,
                label: '' + i,
                group: musicapp.random.getRandomInt(0, nodesCount / 5)
            });
        }
        for (var i = 0; i < nodesCount; ++i) {
            edges.push({
                from: musicapp.random.getRandomInt(0, nodesCount),
                to: musicapp.random.getRandomInt(0, nodesCount)
            });
        }

        // create a network
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
                minVelocity: 0
            }
        };
        network = new vis.Network(container, data, options);
    }

    return {
        draw: draw
    };
})();