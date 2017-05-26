var museum = museum || {};
museum.playlists = museum.playlists || {};
museum.playlists = (function() {

    var playlists = {};
    var playlistUrls = [];

    var deletedPlaylists = [];
    
    function filterDeletedPlaylists() {
        for (var i = 0; i < deletedPlaylists.length; ++i) {
            playlists[deletedPlaylists[i]] = null;
        }
    }

    function init() {
        $('#add-playlist-button').click(function() {
            var url = $('#spotify-text-input').val();
            $('#spotify-text-input').val('');
            addPlaylistUrl(url);
        });
    }

    function addPlaylistError(guid, message) {
        $('#spinner-' + guid).hide();
        $('#label-' + guid).text(message);
        $('#label-' + guid).addClass('playlist-label-loaded');
    }

    function addPlaylistData(playlistData) {
        var guid = playlistData.guid;
        playlists[guid] = playlistData;
        $('#spinner-' + guid).hide();
        $('#label-' + guid).text(playlistData["name"] + " by " + playlistData["owner"]["id"]);
        var image = museum.parser.getImageWithMinimumSize(playlistData);
        if (!image) {
            $('#label-' + guid).addClass('playlist-label-loaded');
            return;
        }
        $('#image-' + guid).attr("src", image["url"]);
        $('#image-container-' + guid).show();
    }

    function addPlaylistUrl(playlistUrl) {
        var playlist = {
            url: playlistUrl,
            guid: museum.random.guid()
        };
        
        playlistUrls.push(playlist);

        $('#loading-playlist-template').tmpl(playlist).prependTo('#playlists-list');
        $('#container-' + playlist.guid).addClass('animated fadeIn');
        museum.spotify.getPlaylistInfoFromUrl(playlist, addPlaylistData, addPlaylistError);
    }

    function deletePlaylist(guid) {
        deletedPlaylists[guid] = true;
        $('#container-' + guid).slideUp(250, function() {
            $(this).remove();
        });
    }
    
    function showLoadingView() {
        $('#loading-playlists-container').hide();
        $('#network-container').show();
        museum.waiting.init(function() {
            $('#mynetwork').addClass('animated fadeIn');
            $('#mynetwork').show();
        });
        
        // Wait for fadeIn animation to avoid lags.
        setTimeout(function() {
            filterDeletedPlaylists();
            museum.network.setPlaylistsData(playlists);
            museum.network.draw(museum.waiting.setProcessDone);
        }, 1000);
    }
    
    function hidePlaylists() {
        $('#loading-playlists-container').addClass('animated fadeOut');
        $('#loading-playlists-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', showLoadingView);
    }

    function process() {
        hidePlaylists();
    }

    return {
        init: init,
        addPlaylistUrl: addPlaylistUrl,
        deletePlaylist: deletePlaylist,
        process: process
    };
})();