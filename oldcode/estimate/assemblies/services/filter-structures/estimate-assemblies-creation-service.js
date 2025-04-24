/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesCreationService
	 * @function
	 *
	 * @description
	 * An instance of estimateCommonCreationServiceProvider: used to set foreign keys
	 * (of selected filter structures) on creating new assemblies
	 */
	angular.module('estimate.assemblies').factory('estimateAssembliesCreationService', ['estimateCommonCreationServiceProvider',
		function (estimateCommonCreationServiceProvider) {
			return estimateCommonCreationServiceProvider.getInstance();
		}]);
})();