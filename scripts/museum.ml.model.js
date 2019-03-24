var museum = museum || {};
museum.ml = museum.ml || {};
museum.ml.model = (function() {
    
    var model = undefined;
    
    var labels = ['Classical', 'Electronic', 'Folk', 'Hip-Hop', 'Instrumental',
       'International', 'Jazz', 'Metal', 'Reggae', 'Rock'];
    
    async function loadModel() {
        model = await tf.loadLayersModel('scripts/ml_model/model.json');
    }
    
    function predict(features) {
        var prediction = Array.from(model.predict(tf.tensor2d(features)).dataSync());
        var prediction_results = {}
        for (var i = 0; i < labels.length; ++i) {
            prediction_results[labels[i]] = prediction[i];
        }
        console.log(prediction_results);
        console.log(labels[prediction.argMax()]);
        return prediction_results;
    }
    
    return {
        loadModel: loadModel,
        predict: predict
    };
})();
