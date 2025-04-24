/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'estimate.assemblies';
	/**
     * @ngdoc service
     * @name estimateAssembliesDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * estimateAssembliesDynamicUserDefinedColumnService is the config service for costcode dynamic user defined column
     */
	angular.module(moduleName).factory('estimateAssembliesDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory) {
			let isPrjAssembly = false,
				options = {
					moduleName : 'EstimateAssembly'
				};
			return estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);
})(angular);
