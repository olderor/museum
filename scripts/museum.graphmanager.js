var museum = museum || {};
museum.graphmanager = museum.graphmanager || {};
museum.graphmanager = (function() {

    var loading = true;
    
    function showGeneralGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(loadingDone, 'general');
        $('#general-graph-item').addClass('nav-item-selected');
    }
    
    function showMultipartiteGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess('multipartite');
        $('#multipartite-graph-item').addClass('nav-item-selected');
    }
    
    function init() {
        $('#general-graph-item').click(showGeneralGraph);
        $('#multipartite-graph-item').click(showMultipartiteGraph);
    }
    
    function loadingDone() {
        loading = false;
    }

    return {
        init: init,
        loadingDone: loadingDone
    };
})();