var museum = museum || {};
museum.ml = museum.ml || {};
museum.ml.feature_extractor = (function() {
    
    var features, filename, offset, duration;
    
    // todo: draw predicted label after feature retrieved not after all
    function retrieve_features_from_server() {
        if (offset == undefined || offset >= duration) {
            $('#progress-label').html('Predicting done');
            return;
        }
        $.ajax({
          type: "POST",
          url: "https://museum-api-olderor.c9users.io/api/extract_features",
          data: JSON.stringify({'filename': filename, 'offset': offset}),
          dataType: 'json',
          contentType:"application/json; charset=utf-8"
        }).done(function (res) {
            if (!res || !res.success || res.filename != filename) {
                return;
            }
            var partLength;
            if (res.next_offset) {
                partLength = res.next_offset - offset;
            } else {
                partLength = duration - offset;
            }
            finish_extracting_features(res.features, offset, partLength);
            offset = res.next_offset;
            retrieve_features_from_server();
        });
    }
    
    function finish_extracting_features(features, offset, partLength) {
        console.log('features for ' + filename + '\noffset ' + offset);
        var features_formatted = features.split(',');
        features_formatted = features_formatted.map(Number);
        
        var predicted = museum.ml.model.predict([features_formatted]);
        museum.labels_manager.updateChartData(offset, partLength, duration, predicted);
    }
    
    function extract_features(fname, fduration) {
        features = [];
        filename = fname;
        duration = fduration;
        offset = 0.0;
        museum.labels_manager.initChart();
        retrieve_features_from_server();
    }
    
    function clear() {
        filename = "";
    }

    return {
        extract_features: extract_features,
        clear: clear
    };
})();
