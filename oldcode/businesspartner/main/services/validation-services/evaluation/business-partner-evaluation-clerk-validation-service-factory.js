/**
 * Created by chi on 5/10/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationClerkValidationServiceFactory', businessPartnerMainEvaluationClerkValidationServiceFactory);

	businessPartnerMainEvaluationClerkValidationServiceFactory.$inject = [
		'commonBusinessPartnerEvaluationServiceCache',
		'basicsCommonClerkValidationServiceFactory',
		'businessPartnerMainEvaluationClerkType'
	];

	function businessPartnerMainEvaluationClerkValidationServiceFactory(
		commonBusinessPartnerEvaluationServiceCache,
		basicsCommonClerkValidationServiceFactory,
		businessPartnerMainEvaluationClerkType
	) {
		return {
			createService: createService
		};

		// /////////////////////////
		function createService(serviceDescriptor, qualifier, clerkDataService, evalClerkType) {
			if (!evalClerkType) {
				throw new Error('evalClerkType is required.');
			}

			var serviceType = null;
			if (evalClerkType === businessPartnerMainEvaluationClerkType.EVAL) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_CLERK_VALIDATION;
			} else if (evalClerkType === businessPartnerMainEvaluationClerkType.GROUP) {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_GROUP_CLERK_VALIDATION;
			} else {
				serviceType = commonBusinessPartnerEvaluationServiceCache.serviceTypes.EVALUATION_SUBGROUP_CLERK_VALIDATION;
			}

			if (commonBusinessPartnerEvaluationServiceCache.hasService(serviceType, serviceDescriptor)) {
				return commonBusinessPartnerEvaluationServiceCache.getService(serviceType, serviceDescriptor);
			}

			var service = basicsCommonClerkValidationServiceFactory.getService(qualifier, clerkDataService);

			clerkDataService.registerEntityCreated(onEntityCreated);

			commonBusinessPartnerEvaluationServiceCache.setService(serviceType, serviceDescriptor, service);

			return service;

			// //////////////

			function onEntityCreated(e, entity) {
				var result = service.validateClerkRoleFk(entity, entity.ClerkRoleFk, 'ClerkRoleFk');

				if ((_.isBoolean(result) && result) || (_.isObject(entity) && result.valid)) {
					result = service.validateClerkFk(entity, entity.ClerkFk, 'ClerkFk');
				}
			}
		}
	}
})(angular);