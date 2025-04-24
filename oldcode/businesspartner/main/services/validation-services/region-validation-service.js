(function (angular) {

	'use strict';

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainRegionValidationService', ['$translate', 'platformDataValidationService', '$injector',
		function ($translate, platformDataValidationService, $injector) {

			let service = {};

			function requiredValidator(value, model) {
				let result = {apply: true, valid: true};
				if (angular.isUndefined(value) || value === null || value <= 0 || value === '') {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				}
				return result;
			}

			service.validateCode = function (entity, value, model) {
				let result = requiredValidator(value, model);
				const dataService = getDataService();
				return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}

			function getDataService() {
				return $injector.get('businessPartnerMainRegionDataService');
			}

			return service;

		}]);

})(angular);