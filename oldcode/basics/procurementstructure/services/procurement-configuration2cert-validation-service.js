(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementConfiguration2CertValidationService',
		['validationService', 'basicsProcurementConfiguration2CertService', 'platformDataValidationService', '$translate', 'platformRuntimeDataService',
			function (validationService, dataService, platformDataValidationService, $translate, platformRuntimeDataService) {
				var service = validationService.create('basicsProcurementConfiguration2Cert', 'basics/procurementstructure/certificate/schema');
				var error = $translate.instant('basics.procurementstructure.eachConfigurationUniqueValueErrorMessage',
					{field1: 'Configuration', field2: 'Certificate'});
				var result;

				service.validatePrcConfigHeaderFk = function (entity, value, model) {
					result = platformDataValidationService.isMandatory(value, model);
					if (!result.valid) {
						return result;
					}

					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcConfigHeaderFk: value,
							BpdCertificateTypeFk: entity.BpdCertificateTypeFk
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

				service.validateBpdCertificateTypeFk = function (entity, value, model) {
					result = platformDataValidationService.isMandatory(value, model);
					if (!result.valid) {
						return result;
					}
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcConfigHeaderFk: entity.PrcConfigHeaderFk,
							BpdCertificateTypeFk: value
						}, entity.Id, error);
					if (!result.valid) {
						if (_.isString(result.error)) {
							result.error = error;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						entity.BpdCertificateTypeFk = value;
						removeValidationResult(entity);
					}
					return result;
				};

				service.validateEntity = function (entity) {
					result = service.validatePrcConfigHeaderFk(entity, entity.PrcConfigHeaderFk, 'PrcConfigHeaderFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcConfigHeaderFk');
					result = service.validateBpdCertificateTypeFk(entity, entity.BpdCertificateTypeFk, 'BpdCertificateTypeFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'BpdCertificateTypeFk');
					dataService.gridRefresh();
				};

				function onEntityCreated(e, item) {
					service.validateEntity(item);
				}

				function removeValidationResult(entity) {
					var result = {apply: true, valid: true};
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcConfigHeaderFk');
					platformDataValidationService.finishValidation(result, entity, entity.PrcConfigHeaderFk, 'PrcConfigHeaderFk', service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'BpdCertificateTypeFk');
					platformDataValidationService.finishValidation(result, entity, entity.BpdCertificateTypeFk, 'BpdCertificateTypeFk', service, dataService);
				}

				service.validateValidFrom = function validateValidFrom(entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
				};

				service.validateValidTo = function validateValidTo(entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
				};

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}]);
})(angular);