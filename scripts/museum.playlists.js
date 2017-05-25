var museum = museum || {};
museum.playlists = (function() {
    
    var playlists = {};
    var playlistUrls = [];
    
    var deletedPlaylists = [];
    
    function init() {
        $('#add-playlist-button').click(function() {
            var url = $('#spotify-text-input').val();
            $('#spotify-text-input').val('');
            addPlaylistUrl(url);
        });
    }
    
    function getPlaylistImageUrl(playlistData) {
        var images = playlistData["images"];
        if (!images || images.length == 0) {
            return null;
        }
        var image = images[0];
        for (var i = 1; i < images.length; ++i) {
            if (images[i]["height"] < image["height"]) {
                image = images[i];
            }
        }
        return image;
    }
    
    function addPlaylistData(playlistData, guid) {
        playlists[guid] = playlistData;
        $('#spinner-' + guid).hide();
        $('#label-' + guid).text(playlistData["name"] + " by " + playlistData["owner"]["id"]);
        var image = getPlaylistImageUrl(playlistData);
        if (!image) {
            $('#label-' + guid).addClass('playlist-label-loaded');
            return;
        }
        $('#image-' + guid).attr("src", image["url"]);
        $('#image-container-' + guid).show();
    }
    
    function addPlaylistUrl(playlistUrl) {
        playlistUrls.push({ 
            url: playlistUrl, 
            guid: museum.random.guid()
        });
        
        museum.spotify.getPlaylistInfoFromUrl(playlistUrls[playlistUrls.length - 1], addPlaylistData);
        $('#loading-playlist-template').tmpl(playlistUrls[playlistUrls.length - 1]).prependTo('#playlists-list');
    }
    
    function deletePlaylist(guid) {
        deletedPlaylists[guid] = true;
        $('#container-' + guid).hide();
    }
    
    return {
        init: init,
        addPlaylistUrl: addPlaylistUrl,
        deletePlaylist: deletePlaylist
    };
})();