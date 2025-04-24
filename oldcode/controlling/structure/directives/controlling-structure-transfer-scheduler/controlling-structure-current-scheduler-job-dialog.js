
(function () {

	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureCurrentSchedulerJobDialog', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/controlling.structure/templates/controlling-structure-transfer-scheduler/controlling-structure-current-scheduler-job-dialog.html',
			};
		}]);
})();
