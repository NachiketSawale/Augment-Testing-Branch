/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainRiskRegisterDialogGrid', [

		function () {
			return {
				restrict:'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/risk-calculator/wizard/estimate-main-risk-register-dialog.html'
			};
		}
	]);
})(angular);
