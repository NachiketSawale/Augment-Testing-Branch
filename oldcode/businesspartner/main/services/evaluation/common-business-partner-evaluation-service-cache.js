/**
 * Created by wed on 12/19/2018.
 */

(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationServiceCache', [function () {

		var serviceCache = new Map(),
			serviceTypes = {
				EVALUATION_DATA: 'EVALUATION_DATA',
				EVALUATION_DETAIL: 'EVALUATION_DETAIL',
				DOCUMENT_DATA: 'DOCUMENT_DATA',
				GROUP_DATA: 'GROUP_DATA',
				ITEM_DATA: 'ITEM_DATA',
				EVALUATION_VALIDATION: 'EVALUATION_VALIDATION',
				DOCUMENT_VALIDATION: 'DOCUMENT_VALIDATION',
				GROUP_VALIDATION: 'GROUP_VALIDATION',
				ITEM_VALIDATION: 'ITEM_VALIDATION',
				EVALUATION_LAYOUT: 'EVALUATION_LAYOUT',
				EVALUATION_DETAIL_LAYOUT: 'EVALUATION_DETAIL_LAYOUT',
				EVALUATION_UI_STANDARD: 'EVALUATION_UI_STANDARD',
				EVALUATION_DETAIL_UI_STANDARD: 'EVALUATION_DETAIL_UI_STANDARD',
				EVALUATION_CLERK_DATA: 'EVALUATION_CLERK_DATA',
				EVALUATION_CLERK_VALIDATION: 'EVALUATION_CLERK_VALIDATION',
				EVALUATION_CLERK_UI_STANDARD: 'EVALUATION_CLERK_UI_STANDARD',
				EVALUATION_GROUP_CLERK_DATA: 'EVALUATION_GROUP_CLERK_DATA',
				EVALUATION_GROUP_CLERK_VALIDATION: 'EVALUATION_GROUP_CLERK_VALIDATION',
				EVALUATION_GROUP_CLERK_UI_STANDARD: 'EVALUATION_GROUP_CLERK_UI_STANDARD',
				EVALUATION_SUBGROUP_CLERK_DATA: 'EVALUATION_SUBGROUP_CLERK_DATA',
				EVALUATION_SUBGROUP_CLERK_VALIDATION: 'EVALUATION_GROUP_CLERK_VALIDATION',
				EVALUATION_SUBGROUP_CLERK_UI_STANDARD: 'EVALUATION_SUBGROUP_CLERK_UI_STANDARD'
			};

		function getCacheKey(serviceType, serviceDescriptor) {
			var prefix = serviceTypes[serviceType] || 'SERVICE';
			return prefix + '_' + serviceDescriptor;
		}

		function hasService(serviceType, serviceDescriptor) {
			var cacheKey = getCacheKey(serviceType, serviceDescriptor);
			return serviceCache.has(cacheKey);
		}

		function getService(serviceType, serviceDescriptor) {
			var cacheKey = getCacheKey(serviceType, serviceDescriptor);
			return serviceCache.has(cacheKey) ? serviceCache.get(cacheKey) : null;
		}

		function setService(serviceType, serviceDescriptor, service) {
			var cacheKey = getCacheKey(serviceType, serviceDescriptor);
			service.serviceName = cacheKey;
			serviceCache.set(cacheKey, service);
		}

		return {
			serviceTypes: serviceTypes,
			getServiceName: getCacheKey,
			getService: getService,
			setService: setService,
			hasService: hasService
		};
	}]);
})(angular);