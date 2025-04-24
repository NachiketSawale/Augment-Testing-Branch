/*
 * Created by Jeffrey at 5/15/2015
 *
 */
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
	angular.module(moduleName).directive('basicsCommonChartDirective',
		['platformContextService', 'platformLanguageService', 'platformDomainService', 'bascisCommonChartColorProfileService', 'basicsCommonChartService',
			function (platformContextService, platformLanguageService, platformDomainService, colorProfileService, basicsCommonChartService) {
				return {
					restrict: 'E',
					template: '<canvas></canvas>',
					replace: true,
					scope: {
						chartDataSource: '=',
						chartType: '=',
						triggerUpdateEvent: '=',
						chartUuid: '=',
						legendColors: '=',
						chartOption: '='
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
								scope.triggerUpdateEvent.unregister(resizeChart);
							}
						});

						function recreateChart() {
							if (myChart) {
								myChart.destroy();
							}

							contextChangedHandler('culture');
							let viewData = colorProfileService.getCustomDataFromView(scope.chartUuid, 'chartColor');
							let options = {
								onAnimationProgress: function () {
									if (!basicsCommonChartService.hasValue(scope.chartDataSource)) {
										this.destroy();
									}
								}
							};
							if (scope.chartOption) {
								angular.extend(options, scope.chartOption);
							}
							myChart = basicsCommonChartService.createChart(scope.chartType, scope.chartDataSource, element, options, viewData, scope.legendColors);
						}

						function resizeChart() {
							if (myChart) {
								myChart.resize(myChart.render, true);
							}
						}
					}
				};
			}
		]);


})(angular);