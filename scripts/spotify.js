var musicapp = musicapp || {};
musicapp.spotify = (function() {
    
    // TODO: hide
    var token = "BQCm16sEepHFWFkqcpdGaCISdu4NJU2QW9UCVa_-XtBUH470pCqPFA3ZCOEHgZ_rp_vBCgMnaL5v4TI0WFUIse5KM32UGV-dyVqmp0Cc0H6PcZzEDOmFiXAAZq41w4-xlW49nytc6WkosdWVxQHZojEvqvL_ytaiPCE";
    
    var apiGetPlaylistInfoUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}";
    
    /**
     * Takes playlist open url similar to https://open.spotify.com/user/{user_id}/playlist/{playlist_id}
     * Return playlist object with specified user_id and playlist_id that were retrieved from url.
    */
    function parsePlaylistUrl(playlist) {
        var refParts = musicapp.linkparser.getLocation(playlist);
        if (!refParts) {
            return null;
        }
        var userId = null;
        var playlistId = null;
        var path = refParts.pathname.split('/');
        for (var i = 0; i < path.len; ++i) {
            if (path[i] === "user") {
                if (i + 1 == path.len) {
                    return null;
                }
                userId = path[++i];
                continue;
            }
            if (path[i] === "playlist") {
                if (i + 1 == path.len) {
                    return null;
                }
                playlistId = path[++i];
            }
        }
        return { userId: userId, playlistId: playlistId };
    }
    
    function getPlaylistInfo(data) {
        var url = apiGetPlaylistInfoUrl.formatUnicorn({ user_id: data.userId, playlist_id: data.playlistId });
        $.ajax({
                url: url,
                type: 'get',
                headers: {"Authorization": "Bearer " + token}
        }).done(function (data) {
            console.log(data);
        }).fail(function (exception) {
            alert("Fail. " + exception); 
        });
    }
    
    function getPlaylistInfoFromUrl(url) {
        var data = parsePlaylistUrl(url);
        getPlaylistInfo(data);
    }
    return {
        parsePlaylistUrl: parsePlaylistUrl,
        getPlaylistInfo: getPlaylistInfo,
        getPlaylistInfoFromUrl: getPlaylistInfoFromUrl
    };
})();