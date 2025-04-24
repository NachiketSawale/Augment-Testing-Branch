/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/** global angular, globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc directive
     * @name estimateMainGroupAction
     * @requires
     * @description select a condition to group line item
     */

	angular.module(moduleName).directive('estimateMainGroupBudget', [function () {
		return {
			restrict: 'A',
			template: '<div data-ng-controller="estimateMainGroupBudgetController">' +
                '<div data-domain-control data-domain="select" data-ng-model="Entity.GroupType" data-options="selections" data-change="onSelectedChanged(GroupType)"></div>' +
                '</div></div>'
		};
	}
	]);


	angular.module(moduleName).directive('estimateMainGroupBudgetV1', [function () {
		return {
			restrict: 'A',
			template: '<div data-ng-controller="estimateMainGroupBudgetControllerV1"></div>'
		};
	}
	]);

})(angular);
