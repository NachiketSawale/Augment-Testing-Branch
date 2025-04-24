/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.simulation.directive:modelSimulationEventSourceSelector
	 * @element div
	 * @restrict A
	 * @description Represents a checklist for objects that contain simulatable events.
	 */
	angular.module('model.simulation').directive('modelSimulationEventSourceSelector', [
		function () {
			return {
				restrict: 'A',
				scope: {
					divWidth: '=',
					divHeight: '=',
					entity: '=',
					gridId: '@',
					options: '&'
				},
				templateUrl: globals.appBaseUrl + 'model.simulation/partials/model-simulation-event-source-selector-template.html',
				controller: 'modelSimulationEventSourceSelectorController'
			};
		}]);
})(angular);
