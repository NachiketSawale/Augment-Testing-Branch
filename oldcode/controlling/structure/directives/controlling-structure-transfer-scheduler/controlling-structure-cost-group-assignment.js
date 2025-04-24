
(function () {

	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureCostGroupAssignment', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/controlling.structure/templates/controlling-structure-transfer-scheduler/controlling-Structure-Cost-Group-Assignment.html',
			};
		}]);
})();
