/**
 * Created by wwa on 11/4/2015.
 */
(function (angular) {
	'use strict';

	angular.module('businesspartner.main').factory('businessPartnerRelationValidationService', ['$translate', '$injector', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService','platformDataValidationService',
		function ($translate, $injector, basicsLookupdataLookupDescriptorService,platformRuntimeDataService,platformDataValidationService) {
			var service = {};
			service.dataService = $injector.get('businessPartnerRelationDataService');

			service.validateBusinessPartner2Fk = function validateBusinessPartnerFk(entity, value, model) { // jshint ignore:line
				var validateResult = {apply: true, valid: true};
				if (validationFk(value)) {
					if (value === 0){
						basicsLookupdataLookupDescriptorService.loadItemByKey('BusinessPartner', value).then(function (bp) {
							if (!bp) {
								validateResult.valid = false;
								validateResult.apply = false;
								validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
								entity.AddressLine = null;
							}
							return handleValidateResult(validateResult,entity, value, model);
						});
					} else {
						validateResult.valid = false;
						validateResult.apply = false;
						validateResult.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						entity.AddressLine = null;
						return handleValidateResult(validateResult,entity, value, model);
					}
				} else {
					// BusinessPartner
					basicsLookupdataLookupDescriptorService.loadItemByKey('BusinessPartner', value).then(function (bp) {
						if (bp) {
							entity.AddressLine = bp.AddressLine;
						} else {
							entity.AddressLine = null;
						}
						service.dataService.gridRefresh();
					});
					return handleValidateResult(validateResult,entity, value, model);
				}
			};

			function validationFk(value) {
				return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
			}

			function handleValidateResult(validateResult,entity,value,model){
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, service.dataService);
				return validateResult;
			}

			return service;
		}]);
})(angular);
