/**
 * Created by chi on 8/9/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainActivityValidationService
	 * @description provides validation methods for a activity.
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainAgreementValidationService', businesspartnerMainAgreementValidationService);
	businesspartnerMainAgreementValidationService.$inject = ['platformDataValidationService'];

	function businesspartnerMainAgreementValidationService(platformDataValidationService) {

		return function (dataService) {
			var service = {};
			service.validateValidFrom = validateValidFrom;
			service.validateValidTo = validateValidTo;
			return service;

			// ////////////////////
			function validateValidFrom(entity, value, model) {
				if (!entity.ValidTo) {
					return true;
				}
				var validForm = new Date(value);
				var validTo = new Date(entity.ValidTo);

				return platformDataValidationService.validatePeriod(validForm, validTo, entity, model, service, dataService, 'ValidTo');
			}

			function validateValidTo(entity, value, model) {
				if (!entity.ValidFrom) {
					return true;
				}
				var validForm = new Date(entity.ValidFrom);
				var validTo = new Date(value);

				return platformDataValidationService.validatePeriod(validForm, validTo, entity, model, service, dataService, 'ValidFrom');
			}
		};
	}
})(angular);