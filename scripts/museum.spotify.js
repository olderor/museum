var museum = museum || {};
museum.spotify = museum.spotify || {};
museum.spotify = (function() {
    var tokenTimer = null;
    var token = null;
    var tokenType = null;
    var expiresIn = null;
    var expirationTime = null;
    var refreshToken = null;

    var apiGetPlaylistInfoUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}";
    var apiGetAccessToken = "https://accounts.spotify.com/api/token";
    var apiCreatePlaylistUrl = "https://api.spotify.com/v1/users/{user_id}/playlists";
    var apiAddTracksToPlaylistUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks";
    var playlistUrl = "http://open.spotify.com/user/{user_id}/playlist/{playlist_id}";

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
            data["url"] = url;
            data["guid"] = playlistInfo.guid;
            loadNextSongsIfNeed(data, onDone, onError);
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
    
    function updateTokenTimeout() {
        if (tokenTimer) {
            clearTimeout(tokenTimer);
        }
        
        console.log(expirationTime - Date.now());
        
        tokenTimer = setTimeout(function () {
            $('.relogin-alert').slideDown();
        }, max(1, expirationTime - Date.now()));
    }

    function updateUserToken() {
        var url = window.location.href.replace('#', '?');
        
        token = museum.parser.getParameterByName('access_token', url);
        tokenType = museum.parser.getParameterByName('token_type', url);
        expiresIn = museum.parser.getParameterByName('expires_in', url);
        refreshToken = museum.parser.getParameterByName('refresh_token', url);
        
        updateTokenTimeout();
        
        saveToStorage();
    }
    
    function saveToStorage() {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('tokenType', tokenType);
        sessionStorage.setItem('expiresIn', expiresIn); // expiresIn
        sessionStorage.setItem('expirationTime', Date.now() + (expiresIn - 120) * 1000);
        sessionStorage.setItem('refreshToken', refreshToken);
    }

    function init() {
        var url = window.location.href.replace('#', '?');
        var error = museum.parser.getParameterByName('error', url);
        if (error) {
            window.location.href = "authorization.html";
            return;
        }
        
        token = sessionStorage.getItem('token');
        tokenType = sessionStorage.getItem('tokenType');
        expiresIn = sessionStorage.getItem('expiresIn');
        expirationTime = parseInt(sessionStorage.getItem('expirationTime'));
        refreshToken = sessionStorage.getItem('refreshToken');
        updateTokenTimeout();

        /*
        token = museum.parser.getParameterByName('access_token', url);
        tokenType = museum.parser.getParameterByName('token_type', url);
        expiresIn = museum.parser.getParameterByName('expires_in', url);
        refreshToken = museum.parser.getParameterByName('refresh_token', url);
        */
    }


    function loadNextSongsIfNeed(playlistData, onDone, onError) {
        var nextUrl = playlistData["tracks"]["next"];
        if (!nextUrl) {
            onDone(playlistData);
            return;
        }

        $.ajax({
            url: nextUrl,
            type: 'get',
            headers: {
                "Authorization": "Bearer " + token
            }
        }).done(function(data) {
            playlistData["tracks"]["items"] = playlistData["tracks"]["items"].concat(data["items"]);
            playlistData["tracks"]["next"] = data["next"];
            loadNextSongsIfNeed(playlistData, onDone, onError);
        }).fail(function(xhr, err) {
            var message = "Playlist error.";
            if (xhr && xhr.statusText) {
                message += " " + xhr.statusText + ".";
            }
            if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.message) {
                message += " " + xhr.responseJSON.error.message;
            }
            message += " Check your playlist link: " + playlistData.url;
            onError(playlistData.guid, message);
        });
    }

    function createEmptyPlaylist(userId, name, onDone) {
        var url = apiCreatePlaylistUrl.formatUnicorn({
            user_id: userId,
        });

        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify({
                name: name
            }),
            headers: {
                "Authorization": "Bearer " + token
            }
        }).done(function(data) {
            onDone(data);
        }).fail(function(xhr, err) {
            var message = "Playlist error.";
            if (xhr && xhr.statusText) {
                message += " " + xhr.statusText + ".";
            }
            if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.message) {
                message += " " + xhr.responseJSON.error.message;
            }
            message += " Check your playlist link: " + url;
            console.log(message);
        });
    }

    function addTracksToPlaylists(userId, playlistId, tracksIds, offset) {
        if (offset >= tracksIds.length) {
            var url = playlistUrl.formatUnicorn({
                user_id: userId,
                playlist_id: playlistId
            });
            openInNewTab(url);
            return;
        }

        var url = apiAddTracksToPlaylistUrl.formatUnicorn({
            user_id: userId,
            playlist_id: playlistId
        });
        var data = [];
        var newOffset = offset;
        for (var i = 0; i < 100 && newOffset < tracksIds.length; ++i, newOffset = offset + i) {
            data.push('spotify:track:' + tracksIds[i]);
        }
        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify({
                'uris': data
            }),
            headers: {
                "Authorization": "Bearer " + token
            }
        }).done(function(data) {
            addTracksToPlaylists(userId, playlistId, tracksIds, newOffset);
        }).fail(function(xhr, err) {
            var message = "Playlist error.";
            if (xhr && xhr.statusText) {
                message += " " + xhr.statusText + ".";
            }
            if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.message) {
                message += " " + xhr.responseJSON.error.message;
            }
            message += " Check your playlist link: " + url;
            console.log(message);
        });
    }

    function createPlaylist(userId, name, tracks) {
        createEmptyPlaylist(userId, name, function(data) {
            addTracksToPlaylists(userId, data["id"], tracks, 0, data['']);
        });
    }

    return {
        init: init,
        parsePlaylistUrl: parsePlaylistUrl,
        getPlaylistInfo: getPlaylistInfo,
        getPlaylistInfoFromUrl: getPlaylistInfoFromUrl,
        updateUserToken: updateUserToken,
        createEmptyPlaylist: createEmptyPlaylist,
        createPlaylist: createPlaylist
    };
})();
