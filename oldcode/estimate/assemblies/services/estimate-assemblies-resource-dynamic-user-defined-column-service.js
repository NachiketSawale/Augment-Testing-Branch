/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'estimate.assemblies';
	/**
     * @ngdoc service
     * @name estimateAssembliesResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * estimateAssembliesResourceDynamicUserDefinedColumnService is the config service for assembly resource dynamic user defined column
     */
	angular.module(moduleName).factory('estimateAssembliesResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let isPrjAssembly = false,
				options = {
					moduleName : 'EstimateAssemblyResoruce'
				};

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);


})(angular);
