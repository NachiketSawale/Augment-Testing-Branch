
(function () {

	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureProjectDialog', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/controlling.structure/templates/controlling-structure-transfer-scheduler/controlling-structure-project-dialog.html',
			};
		}]);
})();
