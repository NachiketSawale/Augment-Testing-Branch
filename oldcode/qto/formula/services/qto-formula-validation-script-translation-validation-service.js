(function (angular) {
	'use strict';

	angular.module('qto.formula').factory('qtoFormulaValidationScriptTranslationValidationService',
		['_', 'platformDataValidationService', '$translate', 'platformRuntimeDataService',
			'qtoFormulaValidationScriptTranslationDataService',
			function (_, platformDataValidationService, $translate, platformRuntimeDataService, dataService) {
				let service = {};

				service.validateCode = function (entity, value, model) {
					let result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);

					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				return service;
			}]);
})(angular);