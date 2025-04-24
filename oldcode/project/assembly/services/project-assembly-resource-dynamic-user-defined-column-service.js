/**
 * Created by myh on 08/16/2021.
 */


(function (angular) {
	'use strict';
	var moduleName = 'project.assembly';
	/**
     * @ngdoc service
     * @name projectAssemblyResourceDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * projectAssemblyResourceDynamicUserDefinedColumnService is the config service for project assembly resource dynamic user defined column
     */
	angular.module(moduleName).factory('projectAssemblyResourceDynamicUserDefinedColumnService', ['estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory) {
			let isPrjAssembly = true,
				options = {
					moduleName : 'ProjectAssemblyResoruce'
				};

			return estimateAssembliesResourceDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);
		}
	]);


})(angular);
