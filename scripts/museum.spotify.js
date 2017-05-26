var museum = museum || {};
museum.spotify = museum.spotify || {};
museum.spotify = (function() {

    var token = null;
    var tokenType = null;
    var expiresIn = null;
    var refreshToken = null;

    var apiGetPlaylistInfoUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}";
    var apiGetAccessToken = "https://accounts.spotify.com/api/token";


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

    function updateUserToken(dataToken, dataTokenType, dataExpiresIn, dataRefreshToken) {
        token = dataToken;
        tokenType = dataTokenType;
        expiresIn = dataExpiresIn;
        refreshToken = dataRefreshToken;
    }

    function init() {
        var url = window.location.href.replace('#', '?');
        var error = museum.parser.getParameterByName('error', url);
        if (error) {
            window.location.href = "authorization.html";
            return;
        }

        token = museum.parser.getParameterByName('access_token', url);
        tokenType = museum.parser.getParameterByName('token_type', url);
        expiresIn = museum.parser.getParameterByName('expires_in', url);
        refreshToken = museum.parser.getParameterByName('refresh_token', url);
    }

    return {
        init: init,
        parsePlaylistUrl: parsePlaylistUrl,
        getPlaylistInfo: getPlaylistInfo,
        getPlaylistInfoFromUrl: getPlaylistInfoFromUrl,
        updateUserToken: updateUserToken
    };
})();