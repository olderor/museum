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
        console.log(labels[prediction.argMax()]);
        return prediction;
    }
    
    function getLabels() {
        return labels;
    }
    
    return {
        loadModel: loadModel,
        predict: predict,
        getLabels: getLabels
    };
})();
