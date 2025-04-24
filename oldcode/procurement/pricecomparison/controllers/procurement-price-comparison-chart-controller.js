/**
 * Created by wui on 10/21/2015.
 */

// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonChartController', [
		'$scope', 'procurementPriceComparisonChartService', 'PlatformMessenger', '$translate', 'platformModalService', 'globals', 'bascisCommonChartColorProfileService',
		function ($scope, procurementPriceComparisonChartService, PlatformMessenger, $translate, platformModalService, globals, colorProfileService) {

			$scope.gridId = '6bcab11f26ff463ba79a2168a25274ca';
			// var chartTypes = ['Radar', 'Bar', 'Line', '3D_Columns'];

			// adding chart toolbar button left of the toolbar buttons
			var chartToolbarButton = [
				{
					id: 't-columnChart',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarColumnChart'),
					iconClass: 'tlb-icons ico-column-chart',
					fn: getChartTypeHandle('bar')
				},
				{
					id: 't-lineChart',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarLineChart'),
					iconClass: 'tlb-icons ico-line-chart',
					fn: getChartTypeHandle('line')
				},
				{
					id: 't-3dColumns',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbar3DColumns'),
					iconClass: 'tlb-icons ico-3d-column-chart',
					fn: getChartTypeHandle('3D_Columns')
				},
				{
					id: 't-chartConfig',
					type: 'item',
					caption: $translate.instant('basics.common.chartSetting'),
					iconClass: 'tlb-icons ico-template-config',
					fn: showChartConfigDialog
				}
			];

			$scope.data = [];

			$scope.chartDataSource = {
				legends: [],
				labels: [],
				datasets: []
			};

			$scope.chartType = 'bar';

			$scope.triggerUpdateEvent = new PlatformMessenger();

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: chartToolbarButton
			});

			$scope.refresh = function () {

				var chartData = procurementPriceComparisonChartService.getData();
				// clear the chart
				clearChart();

				if (!_.isEmpty(chartData.context.selected)) {
					// show the chart
					displayChart();
				}
			};

			$scope.$on('splitter.ResizeChanged', function () {
				$scope.triggerUpdateEvent.fire();
			});

			procurementPriceComparisonChartService.onDataLoaded.register($scope.refresh);

			$scope.$on('$destroy', function () {
				procurementPriceComparisonChartService.onDataLoaded.unregister($scope.refresh);
			});

			$scope.refresh();

			function displayChart() {
				$scope.data = procurementPriceComparisonChartService.getData();
				if ($scope.data.context.type === 'boq') {
					$scope.chartTitle = $translate.instant('procurement.pricecomparison.priceComparisonBoqTitleShort');
				} else {
					$scope.chartTitle = $translate.instant('procurement.pricecomparison.priceCompareTitleShort');
				}

				var entities = $scope.data.entities.filter(isSelected);
				var legends = entities.map(mapNameObject);
				var labels = $scope.data.quotes.filter(isSelected).map(mapName);
				var dataSets = [];

				entities.forEach(function (item) {
					dataSets.push({
						data: item.Items.filter(function (inner) {
							return labels.indexOf(inner.Name) !== -1;
						}).map(function (inner) {
							return angular.isNumber(inner.Value) ? Math.round(100 * inner.Value) / 100 : 0;
						})
					});
				});

				dataSets.yValueDomain = {name: 'money'};

				$scope.chartDataSource = {
					legends: legends,
					labels: labels,
					datasets: dataSets
				};

				if($scope.$root) {
					$scope.$root.safeApply(); // refresh the chart
				}
			}

			function clearChart() {
				// clear the chart
				$scope.data = [];
				$scope.chartTitle = '';
				$scope.chartDataSource = {
					legends: [],
					labels: [],
					datasets: []
				};
			}

			function getChartTypeHandle(type) {
				return function () {
					$scope.chartType = type;
				};
			}

			function isSelected(item) {
				return item.IsSelected;
			}

			function mapName(item) {
				return item.Name;
			}

			function mapNameObject(item) {
				return {name: item.Name};
			}

			function showChartConfigDialog(){
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'basics.common/partials/basics-common-chart-color-config-dialog.html',
					backdrop: false,
					width: '640px',
					resizeable: true,
					uuid: $scope.gridId
				}).then(function (result) {
					if (result.isOK) {
						$scope.refresh();
					}
				});
			}

			$scope.legendColors = [];
			$scope.chartOption = {
				legend: {
					labels: {
						generateLabels: function (chart) {
							let data = chart.data;
							let legends = angular.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
								let  legendStyle = {
									text: dataset.label,
									hidden: !chart.isDatasetVisible(i),
									fillStyle: $scope.legendColors[i],
									strokeStyle: $scope.legendColors[i]
								};
								return generateLegend(chart, dataset, legendStyle, i);
							}, this) : [];

							let viewData = colorProfileService.getCustomDataFromView($scope.gridId, 'chartColor');
							let legendLen = legends.length;
							if (viewData && viewData.Max){
								let  legendStyle = {
									text: 'Max',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Max + ',1)',
									strokeStyle: 'rgba(' + viewData.Max + ',1)'
								};
								legends.push(generateLegend(chart, data.datasets[0], legendStyle, legendLen));
							}
							legendLen = legends.length;
							if (viewData && viewData.Min){
								let  legendStyle = {
									text: 'Min',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Min + ',1)',
									strokeStyle: 'rgba(' + viewData.Min + ',1)'
								};
								legends.push(generateLegend(chart, data.datasets[0], legendStyle, legendLen));
							}
							return legends;
						}
					}
				}
			};

			function generateLegend(chart, dataset, style, index){
				return {
					text: style.text,
					fillStyle: style.fillStyle,
					hidden: style.hidden,
					lineCap: dataset.borderCapStyle,
					lineDash: dataset.borderDash,
					lineDashOffset: dataset.borderDashOffset,
					lineJoin: dataset.borderJoinStyle,
					lineWidth: dataset.borderWidth,
					strokeStyle: style.strokeStyle,
					pointStyle: dataset.pointStyle,

					// Below is extra data used for toggling the datasets
					datasetIndex: index
				};
			}
		}
	]);
})(angular);