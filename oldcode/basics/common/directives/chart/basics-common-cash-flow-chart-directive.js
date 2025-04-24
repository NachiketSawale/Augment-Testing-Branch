/* global Chart:false */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/*
	 * chartDataSource = { legends: [],
	                       labels: [],
	                       datasets: [{ data: [] }, { data: [] },,, ],
	                       yValueDomain: ''//money,..
	                     };

	 * chartType= Bar Radar Line 3D_Columns

	 * triggerUpdateEvent = new PlatformMessenger();
	 */
	angular.module(moduleName).directive('basicsCommonCashFlowChartDirective',
		['platformContextService', 'platformLanguageService', 'platformDomainService',
			function (platformContextService, platformLanguageService, platformDomainService) {
				return {
					restrict: 'E',
					template: '<canvas></canvas>',
					replace: true,
					scope: {
						chartDataSource: '=',
						chartType: '=',
						triggerUpdateEvent: '='
					},
					link: function (scope, element) {
						let myChart = null;

						scope.$watch('chartDataSource', function () {
							recreateChart();
						});

						scope.$watch('chartType', function () {
							recreateChart();
						});

						scope.$watch('triggerUpdateEvent', function () {
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.register(recreateChart);
							}
						});

						platformContextService.contextChanged.register(contextChangedHandler);

						function contextChangedHandler(type) {
							if (type === 'culture' &&
								scope.chartDataSource &&
								scope.chartDataSource.datasets &&
								scope.chartDataSource.datasets.yValueDomain &&
								scope.chartDataSource.datasets.yValueDomain.name) {
								const domainInfo = platformDomainService.loadDomain(scope.chartDataSource.datasets.yValueDomain.name),
									culture = platformContextService.culture(),
									cultureInfo = platformLanguageService.getLanguageInfo(culture);

								angular.extend(scope.chartDataSource.datasets.yValueDomain, {
									decimal: cultureInfo[domainInfo.datatype].decimal,
									thousand: cultureInfo[domainInfo.datatype].thousand
								});
							}
						}

						scope.$on('$destroy', function () {
							platformContextService.contextChanged.unregister(contextChangedHandler);
							if (myChart) {
								myChart.destroy();
							}
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.unregister(recreateChart);
							}
						});

						function recreateChart() {
							if (myChart) {
								myChart.destroy();
							}

							contextChangedHandler('culture');
							myChart = createChart(scope.chartType, scope.chartDataSource, element, {
								onAnimationProgress: function () {
									if (!hasValue(scope.chartDataSource)) {
										this.destroy();
									}
								}
							});
						}
					}
				};
			}
		]);

	function initCanvasStyle(element) {

		let parentElement = element.parent(),
			siblingElements = parentElement.siblings() || [],
			totalHeight = 0;
		for (let i = 0; i < siblingElements.length; i++) {
			totalHeight += siblingElements[i].offsetHeight;
		}

		const width = parseInt(parentElement.css('width')) - parseInt(parentElement.css('padding-left')) - parseInt(parentElement.css('padding-right')),
			height = parseInt(parentElement.css('height')) - parseInt(parentElement.css('padding-top')) - parseInt(parentElement.css('padding-bottom')) - totalHeight;

		element.attr('width', width).attr('height', height).css('width', width).css('height', height);
	}

	function createChart(charType, chartDataSource, element, options) {

		if (!charType || !chartDataSource || !element || !Array.isArray(chartDataSource.datasets) || chartDataSource.datasets.length < 1) {
			return null;
		}

		initCanvasStyle(element);
		const ctx = element[0].getContext('2d'),
			chartData = chartDataSource;

		// Jeffrey
		let parseFun = function (value) {
			return value;
		};

		if (Chart.Domain[chartDataSource.datasets.yValueDomain.name]) {
			parseFun = Chart.Domain[chartDataSource.datasets.yValueDomain.name].parse;
		}

		angular.extend(options, {
			responsive: true,
			scales: {
				xAxes: [{
					beginAtZero: true,
					type: 'linear',
					position: 'bottom',
					scaleLabel: {
						labelString: 'Percent of time',// todo:lta configurable
						display: true
					}
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function (value) {
							return parseFun(value);
						}
					}
				}]
			},
			lineTension: 0
		});

		options.barStrokeWidth = 1;

		return new Chart(ctx, {
			type: charType,
			data: chartData,
			options: options
		});
	}

	function hasValue(data) {
		return (data && Array.isArray(data.datasets) && Array.isArray(data.labels) &&
			data.labels.length > 0 && data.datasets.length > 0);
	}

})(angular);