/**
 * Created by lnt on 21.01.2022.
 */
(function (angular) {

	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateRuleService
	 * @function
	 * @description
	 * estimateRuleService is the data service for project estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('estimateAssembliesRuleService', ['estimateRuleMasterServiceFactory',
		function (estimateRuleMasterServiceFactory) {
			let option = {
				isAssemblyRule: true,
			};

			let service =  estimateRuleMasterServiceFactory.createNewMasterRuleService(option);

			return service;

		}]);

})(angular);
