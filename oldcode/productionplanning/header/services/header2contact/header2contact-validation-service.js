/**
 * Created by zwz on 9/29/2019.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningHeader2ContactValidationService
	 * @description provides validation methods for Header2Contact
	 */
	var moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningHeader2ContactValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService',
		'productionplanningHeaderDataValidationServiceExtension',
		'productionplanningHeader2ContactDataService'];

	function ValidationService(platformDataValidationService,
							   dataValidationServiceExtension,
							   dataService) {
		var service = {};

		var uniqErrorTrs = {
			'ContactFk': 'productionplanning.header.errors.uniqContactFk',
			'ContactRoleTypeFk': 'productionplanning.header.errors.uniqContactRoleTypeFk'
		};
		var uniqErrors = {
			'ContactFk': 'The Contact should be unique under the same Contact Role Type',
			'ContactRoleTypeFk': 'The Contact Role Type should be unique under the same Contact'
		};

		function validateMandatoryAndUnique(entity, value, model, relModel) {
			var mandatoryResult = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if (mandatoryResult && mandatoryResult.valid === true) {
				// validate uniqueness
				var anotherEntity = _.find(dataService.getList(), function (item) {
					return item[model] === value && item[relModel] === entity[relModel] && item.Id !== entity.Id;
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
					dataValidationServiceExtension.ensureNoRelatedError(entity, model, [relModel], uniqErrorTrs, service, dataService);
					return {apply: true, valid: true, error: ''};
				}
			}
			else {
				return mandatoryResult;
			}
		}

		function validateContactFk(entity, value, model) {
			return validateMandatoryAndUnique(entity, value, model, 'ContactRoleTypeFk');
		}

		function validateContactRoleTypeFk(entity, value, model) {
			return validateMandatoryAndUnique(entity, value, model, 'ContactFk');
		}

		service.validateContactFk = validateContactFk;
		service.validateContactRoleTypeFk = validateContactRoleTypeFk;

		return service;
	}
})();