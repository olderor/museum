var museum = museum || {};
museum.graphmanager = museum.graphmanager || {};
museum.graphmanager.types = museum.graphmanager.types || {};
museum.graphmanager.types = (function() {
    let tracksGeneral = 'tracks-general';
    let tracksMultipartite = 'tracks-multipartite';
    let playlistsGeneral = 'playlists-general';
    let playlistsMultipartite = 'playlists-multipartite';
    
    return {
        tracksGeneral: tracksGeneral,
        tracksMultipartite: tracksMultipartite,
        playlistsGeneral: playlistsGeneral,
        playlistsMultipartite: playlistsMultipartite
    };
})();
