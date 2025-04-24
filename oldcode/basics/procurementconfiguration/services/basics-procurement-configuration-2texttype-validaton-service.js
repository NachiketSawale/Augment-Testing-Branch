/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).factory('basicsProcurementConfiguration2HeaderTextValidationService',
		['_', 'platformDataValidationService', 'basicsProcurementConfiguration2HeaderTextDataService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			'basicsProcurementConfigurationValidationHelperService',
			function (_, platformDataValidationService, dataService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService,
					  basicsProcurementConfigurationValidationHelperService) {
				let service = {};
				let status = {
					valid: 1,
					duplicate: 2,
					empty: 4
				};
				let fieldStatus = {};

				let isPrcrtextTypeFkAndTextModuleTypeFkUnique = basicsProcurementConfigurationValidationHelperService.createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(
					platformDataValidationService,
					'PrcTextTypeFk',
					'BasTextModuleTypeFk'
				);

				service.validatePrcTextTypeFk = function (entity, value, model) {
					let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

					let curStatus = getCurrentFieldStatus(entity.Id);
					curStatus.PrcTextTypeFk = result.valid ? status.valid : status.empty;
					if (!result.valid){
						return result;
					}

					curStatus.PrcTextTypeFk = status.valid;
					result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
						PrcTextTypeFk: value,
						BasTextModuleTypeFk: entity.BasTextModuleTypeFk
					});

					curStatus.PrcTextTypeFk = result.valid ? status.valid : status.duplicate;
					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformRuntimeDataService.applyValidationResult(result, entity, 'BasTextModuleTypeFk');
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					platformDataValidationService.finishValidation(angular.copy(result), entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk', service, dataService);

					return result;
				};

				service.validateBasTextModuleFk = function validateBasTextModuleFk(entity, value){
					var result = {valid: true, apply: true};
					if (!value) {
						entity.BasTextModuleTypeFk = null;
						service.validateBasTextModuleTypeFk(entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk');
						return result;
					}
					let textModule = _.find(basicsLookupdataLookupDescriptorService.getData('textModule'), {Id: value});
					if(textModule && textModule.TextModuleTypeFk !== null){
						entity.BasTextModuleTypeFk = textModule.TextModuleTypeFk;
					}
					else {
						entity.BasTextModuleTypeFk = null;
					}
					service.validateBasTextModuleTypeFk(entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk');
					return result;
				};

				service.validateBasTextModuleTypeFk = function validateBasTextModuleTypeFk(entity, value, model) {
					let curStatus = getCurrentFieldStatus(entity.Id);

					let result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
						PrcTextTypeFk: entity.PrcTextTypeFk,
						BasTextModuleTypeFk: value
					});

					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);

					if (curStatus.PrcTextTypeFk !== status.empty) {
						curStatus.PrcTextTypeFk = result.valid ? status.valid : status.duplicate;
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTextTypeFk');
						platformDataValidationService.finishValidation(angular.copy(result), entity, entity.PrcTextTypeFk, 'PrcTextTypeFk', service, dataService);
					}
					return result;
				};

				return service;

				function getCurrentFieldStatus(id) {
					if (!fieldStatus[id]) {
						fieldStatus[id] = {
							PrcTextTypeFk: status.valid,
							BasTextModuleTypeFk: status.valid
						};
					}
					return fieldStatus[id];
				}
			}]);

	angular.module(moduleName).factory('basicsProcurementConfiguration2ItemTextValidationService',
		['_', 'platformDataValidationService', 'basicsProcurementConfiguration2ItemTextDataService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			'basicsProcurementConfigurationValidationHelperService',
			function (_, platformDataValidationService, dataService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService,
					  basicsProcurementConfigurationValidationHelperService) {
				let service = {};
				let status = {
					valid: 1,
					duplicate: 2,
					empty: 4
				};
				let fieldStatus = {};

				let isPrcrtextTypeFkAndTextModuleTypeFkUnique = basicsProcurementConfigurationValidationHelperService.createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(
					platformDataValidationService,
					'PrcTextTypeFk',
					'BasTextModuleTypeFk'
				);

				service.validatePrcTextTypeFk = function (entity, value, model) {
					let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

					let curStatus = getCurrentFieldStatus(entity.Id);
					curStatus.PrcTextTypeFk = result.valid ? status.valid : status.empty;
					if (!result.valid){
						return result;
					}

					curStatus.PrcTextTypeFk = status.valid;
					result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
						PrcTextTypeFk: value,
						BasTextModuleTypeFk: entity.BasTextModuleTypeFk
					});

					curStatus.PrcTextTypeFk = result.valid ? status.valid : status.duplicate;
					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformRuntimeDataService.applyValidationResult(result, entity, 'BasTextModuleTypeFk');
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
					platformDataValidationService.finishValidation(angular.copy(result), entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk', service, dataService);
				};

				service.validateBasTextModuleFk = function (entity, value) {
					var result = {valid: true, apply: true};
					if (!value) {
						entity.BasTextModuleTypeFk = null;
						service.validateBasTextModuleTypeFk(entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk');
						return result;
					}
					let textModule = _.find(basicsLookupdataLookupDescriptorService.getData('textModule'), {Id: value});

					if(textModule && textModule.TextModuleTypeFk !== null){
						entity.BasTextModuleTypeFk = textModule.TextModuleTypeFk;
					}

					service.validateBasTextModuleTypeFk(entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk');
					return result;
				};

				service.validateBasTextModuleTypeFk = function validateBasTextModuleTypeFk(entity, value, model) {
					let curStatus = getCurrentFieldStatus(entity.Id);

					let result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
						PrcTextTypeFk: entity.PrcTextTypeFk,
						BasTextModuleTypeFk: value
					});

					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);

					if (curStatus.PrcTextTypeFk !== status.empty) {
						curStatus.PrcTextTypeFk = result.valid ? status.valid : status.duplicate;
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTextTypeFk');
						platformDataValidationService.finishValidation(angular.copy(result), entity, entity.PrcTextTypeFk, 'PrcTextTypeFk', service, dataService);
					}
					return result;
				};

				return service;

				function getCurrentFieldStatus(id) {
					if (!fieldStatus[id]) {
						fieldStatus[id] = {
							PrcTextTypeFk: status.valid,
							BasTextModuleTypeFk: status.valid
						};
					}
					return fieldStatus[id];
				}
			}]);
})(angular);