/**
 * Created by joshi on 26.11.2015.
 */
(function (angular) {

	'use strict';

	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleService
	 * @function
	 * @description
	 * estimateRuleService is the data service for project estimate rule item related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('estimateRuleService', ['estimateRuleMasterServiceFactory',
		function (estimateRuleMasterServiceFactory) {
			let option = {};

			let service =  estimateRuleMasterServiceFactory.createNewMasterRuleService(option);

			return service;

		}]);

})(angular);
