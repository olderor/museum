var museum = museum || {};
museum.playlists = (function() {
    
    var playlists = [];
    var playlistUrls = [];
    
    function init() {
        $('#add-playlist-button').click(function() {
            var url = $('#spotify-text-input').val();
            $('#spotify-text-input').val('');
            addPlaylistUrl(url);
        });
    }
    
    function addPlaylistData(playlistData, index) {
        playlists[index] = playlistData;
    }
    
    function addPlaylistUrl(playlistUrl) {
        playlistUrls.push({ 
            url: playlistUrl, 
            index: playlists.length
        });
        playlists.push(null);
        
        museum.spotify.getPlaylistInfoFromUrl(playlistUrls[playlists.length - 1], addPlaylistData);
        $('#loading-playlist-template').tmpl({playlistUrl: playlistUrl}).prependTo('#playlists-list');
    }
    
    return {
        init: init,
        addPlaylistUrl: addPlaylistUrl
    };
})();