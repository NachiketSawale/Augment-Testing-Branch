/**
 * Created by chi on 1/28/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businessPartnerCertificateToSubsidiaryValidationServiceFactory', businessPartnerCertificateToSubsidiaryValidationServiceFactory);

	businessPartnerCertificateToSubsidiaryValidationServiceFactory.$inject = ['platformDataValidationService'];

	function businessPartnerCertificateToSubsidiaryValidationServiceFactory(platformDataValidationService) {
		let cache = {};

		return {
			create: function (execModuleName, dataService) {
				if (cache[execModuleName]) {
					return cache[execModuleName];
				}

				let service = {
					validateSubsidiaryFk: validateSubsidiaryFk
				};

				cache[execModuleName] = service;
				return service;

				function validateSubsidiaryFk(entity, value, model) {
					let tempValue = value || null;
					let result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), model, tempValue, entity.Id);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				}
			},
			remove: function (execModuleName) {
				if (cache[execModuleName]) {
					delete cache[execModuleName];
				}
			}
		};
	}
})(angular);