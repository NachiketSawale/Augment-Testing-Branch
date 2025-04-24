/**
 * Created by zwz on 9/29/2019.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningHeader2BpValidationService
	 * @description provides validation methods for Header2Bp
	 */
	var moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningHeader2BpValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService',
		'productionplanningHeaderDataValidationServiceExtension',
		'productionplanningHeader2BpDataService'];

	function ValidationService(platformDataValidationService,
							   dataValidationServiceExtension,
							   dataService) {
		var service = {};

		var uniqErrorTrs = {
			'BusinessPartnerFk': 'productionplanning.header.errors.uniqBusinessPartnerFk',
			'RoleFk': 'productionplanning.header.errors.uniqRoleFk',
			'ubsidiaryFk': 'productionplanning.header.errors.uniqSubsidiaryFk'
		};
		var uniqErrors = {
			'BusinessPartnerFk': 'The Business Partner should be unique under the same Role and Subsidiary',
			'RoleFk': 'The Role should be unique under the same Business Partner and Subsidiary',
			'SubsidiaryFk': 'The Subsidiary should be unique under the same Business Partner and Role'
		};

		function validateUnique(entity, value, model, relModel1, relModel2) {
				var anotherEntity = _.find(dataService.getList(), function (item) {
					return item[model] === value && item[relModel1] === entity[relModel1] && item[relModel2] === entity[relModel2] && item.Id !== entity.Id;
				});
				if (anotherEntity) {
					var result = {
						valid: false,
						apply: true,
						error: uniqErrors[model],
						error$tr$: uniqErrorTrs[model]
					};
					return platformDataValidationService.finishWithError(result, entity, value, model, service, dataService);
				}
				else {
					dataValidationServiceExtension.ensureNoRelatedError(entity, model, [relModel1,relModel2], uniqErrorTrs, service, dataService);
					return {apply: true, valid: true, error: ''};
				}

		}

		function validateMandatoryAndUnique(entity, value, model, relModel1, relModel2) {
			var mandatoryResult = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if (mandatoryResult && mandatoryResult.valid === true) {
				return validateUnique(entity, value, model, relModel1, relModel2);
			}
			else {
				return mandatoryResult;
			}
		}

		service.validateBusinessPartnerFk = function (entity, value, model) {
			if(value === null && entity.BusinessPartnerFk === 0){
				value = 0;
			}
			return validateMandatoryAndUnique(entity, value, model, 'BusinessPartnerFk', 'SubsidiaryFk');
		};

		service.validateRoleFk = function (entity, value, model) {
			return validateMandatoryAndUnique(entity, value, model, 'BusinessPartnerFk', 'SubsidiaryFk');
		};

		service.validateSubsidiaryFk = function (entity, value, model) {
			return validateMandatoryAndUnique(entity, value, model, 'BusinessPartnerFk', 'RoleFk');
		};

		return service;
	}
})();