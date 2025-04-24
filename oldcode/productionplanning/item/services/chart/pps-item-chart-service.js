/**
 * Created by anl on 8/28/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemChartDataService', ItemChartDataService);

	ItemChartDataService.$inject = ['_', '$q'];

	function ItemChartDataService(_, $q) {

		var legends = [],
			labels = [],
			dataSets = [];

		return {
			getChartData: getChartData,
			buildChartData: buildChartData
		};

		function getChartData(data) {
			var deferred = $q.defer();

			if (data) {
				deferred.resolve(
					buildChartData(data)
				);
			} else {
				deferred.resolve({
					legends: [],
					labels: [],
					datasets: []
				});
			}
			return deferred.promise;
		}

		function clear() {
			legends = [];
			labels = [];
			dataSets = [];
		}

		//status	legends: data.displayItemDescription,
		//week-site	labels: data.labels,
		//array of status block	datasets: data.datasets
		function buildChartData(data) {
			clear();
			legends = getLegends(data.Legends);

			labels = data.Labels;

			dataSets = getDataSets(data.DataSets, labels);

			return $q.when(true).then(function () {
				setMaxSiteCapacity(data.MaxCapacity);
				return {
					legends: legends,
					labels: labels,
					datasets: dataSets
				};
			});
		}

		function getLegends(legends) {
			var statusDescriptions = [];
			_.forEach(legends, function (legend) {
				statusDescriptions.push({
					name: legend
				});
			});
			return statusDescriptions;
		}

		function getDataSets(dataSet) {
			var chartDataSet = [];
			for (var i = 0; i < dataSet.length; i++) {
				chartDataSet[i] = [];
				chartDataSet[i].type = 'bar';
				chartDataSet[i].data = dataSet[i].Item3;
				chartDataSet[i].intColor = dataSet[i].Item2;
			}
			return chartDataSet;
		}

		function setMaxSiteCapacity(data) {
			var lineConfig =
				{
					type: 'line',
					borderWidth: '2',
					steppedLine: 'middle',
					fill: false,
					lineTension: 0
				};
			lineConfig.data = data;
			dataSets.push(lineConfig);
			legends.push({
				name: 'MaxCapacity'
			});
		}
	}

})(angular);
