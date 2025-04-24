/**
 * Created by chi on 5/10/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationClerkUIStandardServiceFactory', businessPartnerMainEvaluationClerkUIStandardServiceFactory);

	businessPartnerMainEvaluationClerkUIStandardServiceFactory.$inject = [
		'commonBusinessPartnerEvaluationServiceCache',
		'basicsCommonClerkUIStandardServiceFactory',
		'businessPartnerMainEvaluationClerkType'
	];

	function businessPartnerMainEvaluationClerkUIStandardServiceFactory(
		commonBusinessPartnerEvaluationServiceCache,
		basicsCommonClerkUIStandardServiceFactory,
		businessPartnerMainEvaluationClerkType
	) {
		return {
			createService: createService
		};

		// /////////////////////////
		function createService(serviceDescriptor, qualifier, clerkUIStandardService, evalClerkType) {
			if (!evalClerkType) {
				throw new Error('evalClerkType is required.');
			}

			var serviceType = null;
			if (evalClerkType === businessPartnerMainEvaluationClerkType.EVAL) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_CLERK_UI_STANDARD;
			} else if (evalClerkType === businessPartnerMainEvaluationClerkType.GROUP) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_GROUP_CLERK_UI_STANDARD;
			} else {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_SUBGROUP_CLERK_UI_STANDARD;
			}

			if (commonBusinessPartnerEvaluationServiceCache.hasService(serviceType, serviceDescriptor)) {
				return commonBusinessPartnerEvaluationServiceCache.getService(serviceType, serviceDescriptor);
			}

			var service = basicsCommonClerkUIStandardServiceFactory.getService(qualifier, clerkUIStandardService);

			commonBusinessPartnerEvaluationServiceCache.setService(serviceType, serviceDescriptor, service);

			return service;
		}
	}
})(angular);