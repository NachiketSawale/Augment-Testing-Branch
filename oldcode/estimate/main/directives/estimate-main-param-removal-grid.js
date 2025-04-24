(function () {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainParamRemovalGrid',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/estimate-main-param-assign-remove-grid-dialog.html',
			};
		});
})();
