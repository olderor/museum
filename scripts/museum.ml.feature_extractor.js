var museum = museum || {};
museum.ml = museum.ml || {};
museum.ml.feature_extractor = (function() {
    
    var features, filename, offset, duration;
    
    // todo: draw predicted label after feature retrieved not after all
    function retrieve_features_from_server() {
        if (offset == undefined || offset > duration) {
            return;
        }
        $.ajax({
          type: "POST",
          url: "https://museum-api-olderor.c9users.io/api/extract_features",
          data: JSON.stringify({'filename': filename, 'offset': offset}),
          dataType: 'json',
          contentType:"application/json; charset=utf-8"
        }).done(function (res) {
            if (!res || !res.success) {
                return;
            }
            finish_extracting_features(res.features, offset);
            offset = res.next_offset;
            retrieve_features_from_server();
        });
    }
    
    function finish_extracting_features(features, offset) {
        console.log('features for ' + filename + '\noffset ' + offset);
        var features_formatted = features.split(',');/*
        features_formatted.splice(0, 1); // filename
        features_formatted.splice(33, 1); // mels
        features_formatted.splice(42, 118); // mels*/
        features_formatted = features_formatted.map(Number);
        museum.ml.model.predict([features_formatted]);
    }
    
    function extract_features(fname, fduration) {
        features = [];
        filename = fname;
        duration = fduration;
        offset = 0.0;
        retrieve_features_from_server();
    }

    return {
        extract_features: extract_features
    };
})();
