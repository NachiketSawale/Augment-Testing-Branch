/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular, globals) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainCreatePackageWizardSelectionMode', estimateMainCreatePackageWizardSelectionMode);

	estimateMainCreatePackageWizardSelectionMode.$inject = [];

	function estimateMainCreatePackageWizardSelectionMode() {
		return {
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/create-package-from-estimate-wizard/create-package-wizard-selection-mode.html',
			link: linker
		};

		function linker(scope, element, attrs) {
			scope.titleLabel = scope.titleLabel || attrs.titleLabel;
			scope.isInclusiveModeReadonly = false;
			if (angular.isDefined(attrs.isInclusiveModeReadonly)) {
				scope.isInclusiveModeReadonly = !!attrs.isInclusiveModeReadonly;
			}
		}
	}
})(angular, globals);