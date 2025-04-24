/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCostRiskResultsController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of estimate main cost risk entities.
	 **/

	angular.module(moduleName).controller('estimateMainCostRiskResultsController', ['$scope', '$translate', '_',
		'platformDatavisService', 'platformDatavisOrthogonalChartService', 'modelSimulationMasterService',
		'estimateMainSimulationBasicService', 'moment',
		function (
			$scope, $translate, _, platformDatavisService, platformDatavisOrthogonalChartService,
			modelSimulationMasterService, estimateMainSimulationBasicService, moment) { // jshint ignore:line

			let sampledData = {
				costSum: []
			};

			function updateCostSamples() {
				if (modelSimulationMasterService.isTimelineReady()) {
					modelSimulationMasterService.collectSamples({
						sampleFn: function (time) {
							sampledData.costSum.push({
								key: time,
								value: estimateMainSimulationBasicService.getCurrentTotalCostSum()
							});
						},
						eventTypes: ['estimate.main.lineitem.basic']
					});
				} else {
					sampledData.costSum = [];
				}
			}

			updateCostSamples();

			function computeData() {
				let graph = {
					keyAxis: {
						orientation: 'x',
						scale: 'time',
						position: 'far'
					},
					valueAxis: {
						isReversed: true,
						scale: 'linear',
						position: 'near',
						roundBoundaries: false
					},
					series: [{
						id: 'costSum',
						line: true,
						pairs: sampledData.costSum
					}]
				};

				graph.keyAxis.highlights = [{
					id: 'today',
					anchor: moment(),
					cssClass: 'sim-element sim-todayline'
				}];
				if (modelSimulationMasterService.isTimelineReady()) {
					graph.keyAxis.highlights.push({
						id: 'simulatedNow',
						anchor: modelSimulationMasterService.getCurrentTime(),
						cssClass: 'sim-element sim-currentline'
					});
				}

				return graph;
			}

			let visLink = platformDatavisService.initDatavisContainerController($scope, platformDatavisOrthogonalChartService, computeData());

			function updateData() {
				visLink.setData(computeData());
			}

			modelSimulationMasterService.onCurrentTimeChanged.register(updateData);

			function timelineChanged() {
				updateCostSamples();
				updateData();
			}

			modelSimulationMasterService.registerTimelineReplaced(timelineChanged);
			estimateMainSimulationBasicService.useChartController({costs: true});

			$scope.$on('$destroy', function () {
				estimateMainSimulationBasicService.useChartController({costs: false});
				modelSimulationMasterService.onCurrentTimeChanged.unregister(updateData);
				modelSimulationMasterService.unregisterTimelineReplaced(timelineChanged);
			});
		}]);

})(angular);
