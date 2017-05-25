var museum = museum || {};
museum.spotify = (function() {

    // TODO: hide
    var token = "BQD4r6kTNa6rpEfuMJ2IPXK6S71KyiMDVHMTU5VhKRVdk15tDzzISS3XJ0J8CPW7HMnbUSSBi6xEua-orN_k8F4RoT_ke59ZzqhDJ6Xs-unZUV-PJHCSz7rRvVsI9JaCDiFEPaYL66tpTgACKzlJCQru5H3KIEN6aUE";

    var apiGetPlaylistInfoUrl = "https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}";

    /**
     * Takes playlist open url similar to https://open.spotify.com/user/{user_id}/playlist/{playlist_id}
     * Return playlist object with specified user_id and playlist_id that were retrieved from url.
     */
    function parsePlaylistUrl(playlist) {
        var refParts = museum.linkparser.getLocation(playlist);
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

    function getPlaylistInfo(playlistInfo, onDone) {
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
        }).fail(function(exception) {
            alert("Fail. " + exception);
        });
    }

    function getPlaylistInfoFromUrl(playlistData, onDone) {
        var data = parsePlaylistUrl(playlistData.url);
        if (!data) {
            return null;
        }
        data["guid"] = playlistData.guid;
        getPlaylistInfo(data, onDone);
    }
    return {
        parsePlaylistUrl: parsePlaylistUrl,
        getPlaylistInfo: getPlaylistInfo,
        getPlaylistInfoFromUrl: getPlaylistInfoFromUrl
    };
})();