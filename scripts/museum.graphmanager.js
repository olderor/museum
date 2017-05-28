var museum = museum || {};
museum.graphmanager = museum.graphmanager || {};
museum.graphmanager = (function() {

    var loading = true;
    
    function showTracksGeneralGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.tracksGeneral);
        $('#tracks-general-graph-item').addClass('nav-item-selected');
    }
    
    function showTracksMultipartiteGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.tracksMultipartite);
        $('#tracks-multipartite-graph-item').addClass('nav-item-selected');
    }
    
    function showPlaylistsGeneralGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.playlistsGeneral);
        $('#playlists-general-graph-item').addClass('nav-item-selected');
    }
    
    function init() {
        $('#tracks-general-graph-item').click(showTracksGeneralGraph);
        $('#tracks-multipartite-graph-item').click(showTracksMultipartiteGraph);
        
        $('#playlists-general-graph-item').click(showPlaylistsGeneralGraph);
    }
    
    function loadingDone() {
        loading = false;
    }
    
    function startLoading() {
        loading = true;
    }
    
    return {
        init: init,
        loadingDone: loadingDone,
        startLoading: startLoading
    };
})();
