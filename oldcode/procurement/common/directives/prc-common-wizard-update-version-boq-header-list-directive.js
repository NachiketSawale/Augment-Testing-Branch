/*
 *created by miu 11/23/2021
 *
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonWizardUpdateVersionBoqHeaderListDirective', ['globals',
		function (globals) {
			return {
				templateUrl: globals.appBaseUrl + 'procurement.common/templates/prc-common-wizard-update-version-boq-header-list-grid.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: 'procurementCommonUpdateVersionBoqHeaderListWizardGridController'
			};
		}
	]);
})(angular);