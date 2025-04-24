/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';
	/**
     * @ngdoc directive
     * @name estimateRemoveRuleWizardGenerateGrid
     * @description
     */
	angular.module(moduleName).directive('estimateRemoveRuleWizardGenerateGrid',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/estimate-main-rule-assign-remove-rulegrid-dialog.html',
			};
		});
})();
