/**
 * Created by Naim on 4/19/2017.
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeResourceService
	 * @function
	 *
	 * @description
	 * estimateMainCostCodeResourceService is the data service for simulation cost code based filtered data
	 */
	angular.module(moduleName).factory('estimateMainCostCodeResourceService',
		['_', '$q', '$http', 'estimateChartDialog2SimulationCurveDto',
			function (_, $q, $http, estimateChartDialog2SimulationCurveDto) {

				let service = {};

				service.state = {
					defaultTimelineRequest: {},
					curvesConfig: [],
					curveDtos: [],
					needCurveDtosUpdate: true
				};

				service.setCurvesConfig = function (item) {
					service.state.curvesConfig = item;
					service.state.needCurveDtosUpdate = true;
				};

				service.getCurvesConfig = function () {
					return service.state.curvesConfig;
				};

				service.setDefaultTimelineRequest = function (timeLine) {
					service.state.defaultTimelineRequest = timeLine;
					service.state.needCurveDtosUpdate = true;
				};

				service.getDefaultTimelineRequest = function () {
					return service.state.defaultTimelineRequest;
				};

				service.getCurveDtos = function () {
					if (service.state.needCurveDtosUpdate){
						service.state.curveDtos = estimateChartDialog2SimulationCurveDto.getSimulationCurveDtos(service.state.curvesConfig, service.state.defaultTimelineRequest);
						service.state.needCurveDtosUpdate = false;
					}
					return service.state.curveDtos;
				};

				// modelSimulationMasterService.getContextOptions();
				service.getTimeSeriesDataByCostCode = function () {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/bycostcode', service.getCurveDtos()).then(function successCallback(response) {
						return response.data;

					}, function errorCallback() {
					});
				};

				return service;
			}
		]
	);
})();
