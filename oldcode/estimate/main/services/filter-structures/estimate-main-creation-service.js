/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCreationService
	 * @function
	 *
	 * @description
	 * An instance of estimateCommonCreationServiceProvider: used to set foreign keys
	 * (of selected filter structures) on creating new line items
	 */
	angular.module(moduleName).factory('estimateMainCreationService', ['estimateCommonCreationServiceProvider',
		function (estimateCommonCreationServiceProvider) {
			return estimateCommonCreationServiceProvider.getInstance();
		}]);
})();
