(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsProcurementConfiguration2generalsValidationService
	 * @description provides validation methods for Configuration2generalsValidationService
	 */
	angular.module('basics.procurementstructure').factory('basicsProcurementConfiguration2GeneralsValidationService',
		['validationService', 'basicsProcurementConfiguration2GeneralsService', 'platformDataValidationService',
			'$translate', 'platformRuntimeDataService',
			function (validationService, dataService, platformDataValidationService, $translate, platformRuntimeDataService) {

				var service = validationService.create('basicsProcurementConfiguration2generals', 'basics/procurementstructure/general/schema');
				var error = $translate.instant('basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
					{field1: 'Configuration', field2: 'General'});
				var result;
				service.validatePrcConfigHeaderFk = function (entity, value, model) {
					result = platformDataValidationService.isMandatory(value, model);
					if (!result.valid) {
						return result;
					}
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcConfigHeaderFk: value,
							PrcGeneralsTypeFk: entity.PrcGeneralsTypeFk
						}, entity.Id, error);
					if (!result.valid) {
						if (_.isString(result.error)) {
							result.error = error;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						entity.PrcConfigHeaderFk = value;
						removeValidationResult(entity);
					}
					return result;
				};

				service.validatePrcGeneralsTypeFk = function (entity, value, model) {
					result = platformDataValidationService.isMandatory(value, model);
					if (!result.valid) {
						return result;
					}
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcConfigHeaderFk: entity.PrcConfigHeaderFk,
							PrcGeneralsTypeFk: value
						}, entity.Id, error);
					if (!result.valid) {
						if (_.isString(result.error)) {
							result.error = error;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						entity.PrcGeneralsTypeFk = value;
						removeValidationResult(entity);
					}
					return result;
				};

				service.validateMdcLedgerContextFk = function (entity, value) {
					let list = _.sortBy(_.filter(dataService.generalsTypeList, type => type.LedgerContextFk === value), ['isDefault', 'sorting']);
					entity.PrcGeneralsTypeFk = _.isEmpty(list) ? null : list[0].Id;
				};

				service.validateEntity = function (entity) {
					result = service.validatePrcConfigHeaderFk(entity, entity.PrcConfigHeaderFk, 'PrcConfigHeaderFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcConfigHeaderFk');
					result = service.validatePrcGeneralsTypeFk(entity, entity.PrcGeneralsTypeFk, 'PrcGeneralsTypeFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcGeneralsTypeFk');
					dataService.gridRefresh();
				};

				function onEntityCreated(e, item) {
					service.validateEntity(item);
				}

				function removeValidationResult(entity) {
					var result = {apply: true, valid: true};
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcConfigHeaderFk');
					platformDataValidationService.finishValidation(result, entity, entity.PrcConfigHeaderFk, 'PrcConfigHeaderFk', service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcGeneralsTypeFk');
					platformDataValidationService.finishValidation(result, entity, entity.PrcGeneralsTypeFk, 'PrcGeneralsTypeFk', service, dataService);
				}

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})(angular);
