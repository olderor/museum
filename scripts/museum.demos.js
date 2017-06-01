var museum = museum || {};
museum.demo = museum.demo || {};
museum.demo = (function() {

    var list1 = [
        "https://open.spotify.com/user/olderor/playlist/3RafC9HqYfvMHTwbkOGe4W",
        "https://open.spotify.com/user/olderor/playlist/5U4XO9ATcEA7xHGiSIgZUH",
        "https://open.spotify.com/user/olderor/playlist/0RQdJYcB4iuKBZNIGJDwC9"
    ]

    var list2 = [
        "https://open.spotify.com/user/museum-test/playlist/66bEDZ7YvY4Q9hrnGB7tGD",
        "https://open.spotify.com/user/museum-test/playlist/1VPXpDfeaqcKxX1IvZidUH",
        "https://open.spotify.com/user/museum-test/playlist/3G9GTSdFQMP0qep2Z1xOot",
        "https://open.spotify.com/user/spotify/playlist/37i9dQZF1DWXRqgorJj26U",
        "https://open.spotify.com/user/spotify/playlist/37i9dQZF1DWZnzwzLBft6A",
        "https://open.spotify.com/user/museum-test/playlist/5Y94uhTQYOZv0mRb9BWtWk"
    ]

    var list3 = [
        "https://open.spotify.com/user/olderor/playlist/3RafC9HqYfvMHTwbkOGe4W",
        "https://open.spotify.com/user/olderor/playlist/5U4XO9ATcEA7xHGiSIgZUH",
        "https://open.spotify.com/user/olderor/playlist/0RQdJYcB4iuKBZNIGJDwC9",
        "https://open.spotify.com/user/olderor/playlist/6MTzYc8GsxNjnlqxHDz4OE",
        "https://open.spotify.com/user/bwalsh1832/playlist/4vym2bbVet1cCe8WyK7poW"
    ]

    var list4 = [
        "https://open.spotify.com/user/museum-test/playlist/3G9GTSdFQMP0qep2Z1xOot",
        "https://open.spotify.com/user/olderor/playlist/5U4XO9ATcEA7xHGiSIgZUH",
        "https://open.spotify.com/user/olderor/playlist/0RQdJYcB4iuKBZNIGJDwC9",
        "https://open.spotify.com/user/olderor/playlist/6MTzYc8GsxNjnlqxHDz4OE",
        "https://open.spotify.com/user/bwalsh1832/playlist/4vym2bbVet1cCe8WyK7poW",
        "https://open.spotify.com/user/museum-test/playlist/66bEDZ7YvY4Q9hrnGB7tGD",
        "https://open.spotify.com/user/museum-test/playlist/1VPXpDfeaqcKxX1IvZidUH",
        "https://open.spotify.com/user/spotify/playlist/37i9dQZF1DWXRqgorJj26U",
        "https://open.spotify.com/user/spotify/playlist/37i9dQZF1DWZnzwzLBft6A",
        "https://open.spotify.com/user/museum-test/playlist/5Y94uhTQYOZv0mRb9BWtWk",
        "https://open.spotify.com/user/olderor/playlist/3RafC9HqYfvMHTwbkOGe4W"
    ]

    function loadList(list) {
        museum.playlists.addPlaylistUrl(list[0]);
        setTimeout(function() {
            for (var i = 1; i < list.length - 1; ++i) {
                museum.playlists.addPlaylistUrl(list[i]);
            }
        }, 1000);
        setTimeout(function() {
            museum.playlists.addPlaylistUrl(list[list.length - 1]);
        }, 2000);
    }

    function loadList1() {
        loadList(list1);
    }

    function loadList2() {
        loadList(list2);
    }

    function loadList3() {
        loadList(list3);
    }

    function loadList4() {
        loadList(list4);
    }

    function init() {
        $('#demo1-item').click(loadList1);
        $('#demo2-item').click(loadList2);
        $('#demo3-item').click(loadList3);
        $('#demo4-item').click(loadList4);
    }

    return {
        init: init
    };
})();
