/**
 * Created by jie on 24/03/2023.
 */
(function (angular){
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('procurementStructureInterCompanyValidationService',
		['$translate', 'validationService', 'platformDataValidationService', 'basicsProcurementInterCompanyDataService','platformRuntimeDataService',
			function ($translate, validationService, platformDataValidationService, dataService,platformRuntimeDataService) {
				var service = {};

				service.validatePrcStructureToFk = function (entity, value, model) {
					if (value === 0 || !value) {
						value=null;
						return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					}
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.apply) {
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
						if (!result.valid) {
							result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.basPrcStructureToFkUniqueError');
						}
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				return service;
			}
		]);
})(angular);
