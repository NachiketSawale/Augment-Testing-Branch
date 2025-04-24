/**
 * Created by anl on 9/11/2019.
 */

(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemChartController', ItemChartController);

	ItemChartController.$inject = ['$scope', '$http', '$translate', 'PlatformMessenger',
		'productionplanningItemDataService',
		'productionplanningItemChartDataService'];

	function ItemChartController($scope, $http, $translate, PlatformMessenger,
		itemDataService,
		chartDataService) {

		// Stack Bar Chart
		var chartToolbarButton = [
			{
				id: 't-printChart',
				type: 'item',
				caption: $translate.instant('productionplanning.item.printChart'),
				iconClass: 'tlb-icons ico-print-preview',
				disabled: false,
				fn: function () {
					printChart();
				}
			},
			{
				id: 'd1',
				prio: 50,
				type: 'divider',
				isSet: true
			},
			{
				id: 't-columnChart',
				type: 'item',
				caption: $translate.instant('businesspartner.main.toolbarColumnChart'),
				iconClass: 'tlb-icons ico-column-chart',
				disabled: false,
				fn: function () {
					updateChartData();
				}
			},
			{
				id: 'd2',
				prio: 50,
				type: 'divider',
				isSet: true
			}
		];

		function initContainer() {

			$scope.setTools({cssClass: 'tools', items: chartToolbarButton});

			$scope.triggerUpdateEvent = new PlatformMessenger();
			$scope.printChart = new PlatformMessenger();
			$scope.chartTitle = '';
			$scope.chartType = 'bar';

			$scope.chartDataSource = {
				legends: [],
				labels: [],
				datasets: []
			};

			itemDataService.registerListLoaded(dataChanged);

			updateChartData();

			$scope.$on('splitter.ResizeChanged', function () {
				$scope.triggerUpdateEvent.fire();
			});

			$scope.$on('$destroy', function () {
				itemDataService.unregisterListLoaded(dataChanged);
			});
		}

		function printChart() {
			$scope.printChart.fire();
		}

		function dataChanged() {
			$scope.chartDataSource = {
				labels: [],
				datasets: []
			};
			$scope.chartTitle = '';
			updateChartData();
		}

		function updateChartData() {

			var leafItems = itemDataService.getList().filter(function (item) {
				return item.IsLeaf;
			});

			if (leafItems.length > 0) {
				var ids = itemDataService.getList().map(function (item) {
					return {Id: item.Id};
				});
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/getchartdata', ids)
					.then(function (what) {
						updateChartDataGeneral(what.data);
					});
			} else {
				updateChartDataGeneral(null);
			}
		}

		function updateChartDataGeneral(data) {
			if (data) {
				chartDataService.getChartData(data).then(function (data) {
					if (data.legends.length !== 0 && data.legends.length !== 0 && data.datasets.length !== 0) {
						$scope.chartTitle = $translate.instant('productionplanning.item.barChartTitle'); //;'Weeks - Sites - Status';;
						$scope.chartDataSource = {
							legends: data.legends, //status
							labels: data.labels, //week-site
							datasets: data.datasets //array of status block
						};
					} else {
						$scope.chartTitle = 'No Data';
						$scope.chartDataSource = {
							labels: [],
							datasets: []
						};
					}
				});
			} else {
				$scope.chartTitle = 'No Data';
				$scope.chartDataSource = {
					labels: [],
					datasets: []
				};
			}
		}

		initContainer();

	}
})(angular);