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
     * @name estimateMainCxProjectLookup
     * @requires
     * @description select a project to translate
     */

	angular.module(moduleName).directive('estimateMainCxProjectLookup', [function () {
		return {
			restrict: 'A',
			template: '<div data-ng-controller="estimateMainCxProjectLookupController">' +
                '<div data-domain-control data-domain="select" data-ng-model="Entity.CxProject" data-options="selections" data-change="onSelectedChanged(cxProject)"></div>' +
                '</div>'
		};
	}
	]);

})(angular);
