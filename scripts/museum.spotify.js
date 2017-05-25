var museum = museum || {};
museum.spotify = museum.spotify || {};
museum.spotify = (function() {

    // TODO: hide
    var token = "BQAvbX9ga05vsQeexO6blDwYoz80fcoamlg1aD-BsC4ARZQao8qSk6xAIBlV3wnWovBJZRILBvdB5-F6fpCfDDFt_a-mTWIFG786fza8jE1pCIiOxVgoUUvQjCPISbXfOtl8eopknnBDy9CQopUxwXuFDZ0G3xH28fk";

    var apiGetPlaylistInfoUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}";

    /**
     * Takes playlist open url similar to https://open.spotify.com/user/{user_id}/playlist/{playlist_id}
     * Return playlist object with specified user_id and playlist_id that were retrieved from url.
     */
    function parsePlaylistUrl(playlist) {
        var refParts = museum.parser.getLinkLocation(playlist);
        if (!refParts) {
            return null;
        }
        var userId = null;
        var playlistId = null;
        var path = refParts.pathname.split('/');
        for (var i = 0; i < path.length; ++i) {
            if (path[i] === "user") {
                if (i + 1 == path.length) {
                    return null;
                }
                userId = path[++i];
                continue;
            }
            if (path[i] === "playlist") {
                if (i + 1 == path.length) {
                    return null;
                }
                playlistId = path[++i];
            }
        }
        return {
            userId: userId,
            playlistId: playlistId
        };
    }

    function getPlaylistInfo(playlistInfo, onDone, onError) {
        var url = apiGetPlaylistInfoUrl.formatUnicorn({
            user_id: playlistInfo.userId,
            playlist_id: playlistInfo.playlistId
        });

        $.ajax({
            url: url,
            type: 'get',
            headers: {
                "Authorization": "Bearer " + token
            }
        }).done(function(data) {
            onDone(data, playlistInfo.guid);
        }).fail(function(xhr, err) {
            var message = "Playlist error.";
            if (xhr && xhr.statusText) {
                message += " " + xhr.statusText + ".";
            }
            if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.message) {
                message += " " + xhr.responseJSON.error.message;
            }
            message += " Check your playlist link: " + url;
            onError(playlistInfo.guid, message);
        });
    }

    function getPlaylistInfoFromUrl(playlistData, onDone, onError) {
        var data = parsePlaylistUrl(playlistData.url);
        if (!data) {
            onError(playlistData.guid, "Playlist error. Check your playlist link: " + playlistData.url);
            return null;
        }
        data["guid"] = playlistData.guid;
        getPlaylistInfo(data, onDone, onError);
    }
    return {
        parsePlaylistUrl: parsePlaylistUrl,
        getPlaylistInfo: getPlaylistInfo,
        getPlaylistInfoFromUrl: getPlaylistInfoFromUrl
    };
})();