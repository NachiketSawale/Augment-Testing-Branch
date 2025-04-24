(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructure2EvaluationValidationService',
		['validationService', 'basicsProcurement2EvaluationService', 'platformDataValidationService', 'platformRuntimeDataService',
			function (validationService, dataService, platformDataValidationService, platformRuntimeDataService) {
				var service = validationService.create('structure2Evaluation', 'basics/procurementstructure/evaluation/schema');
				var self = this;

				self.handleError = function (result, entity) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'CompanyFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BpdEvaluationSchemaFk');
					} else {
						service.removeError(entity);
					}
				};

				var validateUnique = function (id, company, BpdEvaluationSchema) {
					return platformDataValidationService.isGroupUnique(
						dataService.getList(),
						{
							CompanyFk: company,
							BpdEvaluationSchemaFk: BpdEvaluationSchema
						},
						id,
						'basics.procurementstructure.towFiledUniqueValueErrorMessage',
						{field1: 'Company', field2: 'Evaluation Schema'}
					);
				};

				service.validateCompanyFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = validateUnique(entity.Id, value, entity.BpdEvaluationSchemaFk);
					}
					self.handleError(result, entity);
					return result;
				};

				service.validateBpdEvaluationSchemaFk = function (entity, value, model) {
					if (value === 0) {
						value = null;
					}
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = validateUnique(entity.Id, entity.CompanyFk, value);
					}
					self.handleError(result, entity);
					return result;
				};

				function onEntityCreated(e, entity) {
					var result = service.validateCompanyFk(entity, entity.CompanyFk, 'CompanyFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'CompanyFk');

					result = service.validateBpdEvaluationSchemaFk(entity, entity.BpdEvaluationSchemaFk, 'BpdEvaluationSchemaFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'BpdEvaluationSchemaFk');
					dataService.gridRefresh();
				}

				dataService.registerEntityCreated(onEntityCreated);
				return service;
			}
		]);
})(angular);
