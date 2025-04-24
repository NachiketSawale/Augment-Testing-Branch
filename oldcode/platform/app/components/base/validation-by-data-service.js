/**
 * Created by balkanci on 02.09.2015.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc self
	 * @name PlatformValidationByDataService
	 * @function
	 *
	 * @description
	 * Maps the ValidationService to the depending DataService
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformValidationByDataService', PlatformValidationByDataService);

	PlatformValidationByDataService.$inject = ['$cacheFactory'];

	function PlatformValidationByDataService($cacheFactory) {
		var cache = $cacheFactory('platformValidationByDataServiceCache');

		this.registerValidationService = function registerValidationService(validationService, dataService) {
			if (dataService.getServiceName) {
				var serviceName = dataService.getServiceName();
				if (cache.get(serviceName) !== validationService) {
					cache.put(serviceName, validationService);
				}
			}
		};

		this.getValidationServiceByDataService = function getValidationServiceByDataService(dataService) {
			if (dataService.getServiceName) {
				var serviceName = dataService.getServiceName();
				return cache.get(serviceName);
			}
		};
	}
})(angular);
