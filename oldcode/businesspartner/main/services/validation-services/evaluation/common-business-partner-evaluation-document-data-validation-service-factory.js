/**
 * Created by wed on 12/13/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDocumentDataValidationServiceFactory', [
		'commonBusinessPartnerEvaluationServiceCache',
		function (serviceCache) {

			function createService(serviceDescriptor) {

				if (serviceCache.hasService(serviceCache.serviceTypes.DOCUMENT_VALIDATION, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.DOCUMENT_VALIDATION, serviceDescriptor);
				}

				var service = {};

				angular.extend(service, {
					validateDocumentDate: validateDocumentDate
				});

				function validateDocumentDate(entity, value) {
					entity.DocumentDate = value;
					return {apply: true, valid: true};
				}

				serviceCache.setService(serviceCache.serviceTypes.DOCUMENT_VALIDATION, serviceDescriptor, service);

				return service;

			}

			return {
				createService: createService
			};
		}]);
})(angular);
