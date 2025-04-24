(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).directive('ppsMntModelSimulationEventSourceSelector', [
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
				templateUrl: globals.appBaseUrl + 'productionplanning.mounting/partials/pps-mnt-simulation-event-source-selector-template.html',
				controller: 'ppsMntModelSimulationEventSourceSelectorController'
			};
		}]);
})();
