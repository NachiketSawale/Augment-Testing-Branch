
(function () {


	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainBackwardCalculationCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateMainBackwardCalculationCheckbox', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/backward-calculation/estimate-main-backward-calculation-dialog-checkbox.html'
			};
		}]);
})();
