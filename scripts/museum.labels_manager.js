var museum = museum || {};
museum.labels_manager = (function() {
    
    var chart, datasets, labels;
    
    function initChart() {
        if (chart) {
            chart.destroy();
        }
        labels = [];
        datasets = [];
        var genres = museum.ml.model.getLabels();
        for (var i = 0; i < genres.length; ++i) {
            datasets.push({label: genres[i], data: [], backgroundColor: museum.random.getRandomColorRgba()});
        }
		var barChartData = {
			labels: labels,
			datasets: datasets
		};
		var ctx = document.getElementById('audio-labels-chart-container').getContext('2d');
		chart = new Chart(ctx, {
			type: 'bar',
			data: barChartData,
			options: {
				title: {
					display: true,
					text: 'Predicted genre'
				},
				tooltips: {
					mode: 'nearest'
				},
				responsive: true,
				scales: {
					xAxes: [{
					    barPercentage: 1.0,
						stacked: true
					}],
					yAxes: [{
					    barPercentage: 1.0,
						stacked: true
					}]
				}
			}
		});
		$('#audio-labels-chart-container').slideDown(1500);
    }
    
    function addItems(start, length, total, predicted) {
        for (var i = 0; i < predicted.length; ++i) {
            datasets[i].data.push(predicted[i]);
        }
        console.log(start, length, total);
        labels.push(museum.parser.timeToString(start) + '-' + museum.parser.timeToString(start + length - 1));
        chart.update();
    }
    
    function initChartIfNeeded() {
        if (!chart) {
            initChart();
        }
    }
    
    function updateChartData(start, length, total, predicted) {
        initChartIfNeeded();
        addItems(start, length, total, predicted);
    }
    
    return {
        initChart: initChart,
        updateChartData: updateChartData
    };
})();
