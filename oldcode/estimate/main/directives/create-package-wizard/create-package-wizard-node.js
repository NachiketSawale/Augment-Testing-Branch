/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular, globals) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainCreatePackageWizardNode', estimateMainCreatePackageWizardNode);

	function estimateMainCreatePackageWizardNode() {
		return {
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/create-package-from-estimate-wizard/create-package-wizard-node.html',
			link: linker
		};

		function linker(scope, element, attrs) {
			scope.node2 = scope.note2 || attrs.node2 ;
		}
	}
})(angular, globals);