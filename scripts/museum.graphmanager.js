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
        $('#find-flow-button').addClass('hidden');
        $('#get-top-button').removeClass('hidden');
        // $('#split-button').addClass('hidden');
    }
    
    function showTracksMultipartiteGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.tracksMultipartite);
        $('#tracks-multipartite-graph-item').addClass('nav-item-selected');
        $('#find-flow-button').removeClass('hidden');
        $('#get-top-button').addClass('hidden');
        // $('#split-button').addClass('hidden');
    }
    
    function showPlaylistsGeneralGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.playlistsGeneral);
        $('#playlists-general-graph-item').addClass('nav-item-selected');
        $('#find-flow-button').addClass('hidden');
        $('#get-top-button').addClass('hidden');
        // $('#split-button').removeClass('hidden');
    }
    
    function showPlaylistsMultipartiteGraph() {
        if (loading) {
            return;
        }
        loading = true;
        $('.nav-item-selected').removeClass('nav-item-selected');
        museum.playlists.reprocess(museum.graphmanager.types.playlistsMultipartite);
        $('#playlists-multipartite-graph-item').addClass('nav-item-selected');
        $('#find-flow-button').removeClass('hidden');
        $('#get-top-button').addClass('hidden');
        // $('#split-button').addClass('hidden');
    }
    
    function init() {
        $('#tracks-general-graph-item').click(showTracksGeneralGraph);
        $('#tracks-multipartite-graph-item').click(showTracksMultipartiteGraph);
        
        $('#playlists-general-graph-item').click(showPlaylistsGeneralGraph);
        $('#playlists-multipartite-graph-item').click(showPlaylistsMultipartiteGraph);
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
