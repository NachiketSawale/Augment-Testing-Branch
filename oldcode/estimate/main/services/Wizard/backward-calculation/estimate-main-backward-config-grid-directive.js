
(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainBackwardCalculationCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateMainBackwardConfigGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/backward-calculation/estimate-main-backward-calculation-dialog-grid.html'
			};
		}]);
})();
