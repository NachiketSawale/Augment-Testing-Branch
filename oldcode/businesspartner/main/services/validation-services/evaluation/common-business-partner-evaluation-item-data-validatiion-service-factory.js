/**
 * Created by wed on 12/13/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationItemDataValidationServiceFactory', [
		'$translate',
		'platformRuntimeDataService',
		'commonBusinessPartnerEvaluationServiceCache',
		function ($translate,
			platformRuntimeDataService,
			serviceCache) {

			function createService(serviceDescriptor) {

				if (serviceCache.hasService(serviceCache.serviceTypes.ITEM_VALIDATION, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.ITEM_VALIDATION, serviceDescriptor);
				}

				var service = {};

				serviceCache.setService(serviceCache.serviceTypes.ITEM_VALIDATION, serviceDescriptor, service);

				return service;
			}

			return {
				createService: createService
			};
		}]);
})(angular);