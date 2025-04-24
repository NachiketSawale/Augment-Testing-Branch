/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimate.main.controller:estimateMainHoursChartController
	 * @requires $scope, $translate, _, basicsCommonDatavisService, platformDatavisOrthogonalChartService,
	 *           modelSimulationMasterService, estimateMainSimulationBasicService, moment
	 * @description The controller for the hours chart container.
	 */
	angular.module('estimate.main').controller('estimateMainHoursChartController', ['$scope', '$translate', '_',
		'platformDatavisService', 'platformDatavisOrthogonalChartService', 'modelSimulationMasterService',
		'estimateMainSimulationBasicService', 'moment',
		function ($scope, $translate, _, platformDatavisService, platformDatavisOrthogonalChartService,
			modelSimulationMasterService, estimateMainSimulationBasicService, moment) { // jshint ignore:line

			let sampledData = {
				hoursSum: []
			};

			function updateHoursSamples() {
				if (modelSimulationMasterService.isTimelineReady()) {
					modelSimulationMasterService.collectSamples({
						sampleFn: function (time) {
							sampledData.hoursSum.push({
								key: time,
								value: estimateMainSimulationBasicService.getCurrentTotalHoursSum()
							});
						},
						eventTypes: ['estimate.main.lineitem.basic']
					});
				} else {
					sampledData.hoursSum = [];
				}
			}
			updateHoursSamples();

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
						id: 'hoursSum',
						line: true,
						pairs: sampledData.hoursSum
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
				updateHoursSamples();
				updateData();
			}
			modelSimulationMasterService.registerTimelineReplaced(timelineChanged);

			estimateMainSimulationBasicService.useChartController({ hours: true });

			$scope.$on('$destroy', function () {
				estimateMainSimulationBasicService.useChartController({ hours: false });

				modelSimulationMasterService.onCurrentTimeChanged.unregister(updateData);
				modelSimulationMasterService.unregisterTimelineReplaced(timelineChanged);
			});
		}]);
})();
