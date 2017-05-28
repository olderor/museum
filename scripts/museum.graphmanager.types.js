var museum = museum || {};
museum.graphmanager = museum.graphmanager || {};
museum.graphmanager.types = museum.graphmanager.types || {};
museum.graphmanager.types = (function() {
    let tracksGeneral = 'tracks-general';
    let tracksMultipartite = 'tracks-multipartite';
    let playlistsGeneral = 'playlists-general';
    
    return {
        tracksGeneral: tracksGeneral,
        tracksMultipartite: tracksMultipartite,
        playlistsGeneral: playlistsGeneral
    };
})();
