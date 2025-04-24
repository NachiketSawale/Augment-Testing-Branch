/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';
	/* global _ */

	angular.module('procurement.package').factory('procurementPackagePackage2HeaderValidationService',
		['$translate', 'procurementPackagePackage2HeaderService', 'procurementCommonGeneralsDataService','procurementCommonCertificateNewDataService','basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'platformDataValidationService',
			function ($translate, dataService, procurementCommonGeneralsDataService,procurementCommonCertificateDataService,basicsLookupdataLookupDescriptorService, platformRuntimeDataService, platformDataValidationService) {

				var service = {};
				procurementCommonGeneralsDataService = procurementCommonGeneralsDataService.getService(dataService);
				procurementCommonCertificateDataService = procurementCommonCertificateDataService.getService(dataService);
				// region reload certificates and generals when configuration or structure changed in prc header
				var reloadGeneralsAndCertificates = function reloadGeneralsAndCertificates(entity, originalEntity) {
					procurementCommonCertificateDataService.clearConfiguration2certCache();
					if(originalEntity && originalEntity.originalConfigurationFk && originalEntity.originalStructureFk){
						procurementCommonGeneralsDataService.reloadData(originalEntity);
						procurementCommonCertificateDataService.reloadData(originalEntity);
					}else if(entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
						procurementCommonGeneralsDataService.reloadData();
						procurementCommonCertificateDataService.reloadData();
					}
				};

				service.validatePrcHeaderEntity$ConfigurationFk = function validateConfigurationFk(entity, value) {
					if (entity && entity.PrcHeaderEntity.ConfigurationFk !== value && entity.PrcHeaderEntity.StructureFk) {
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						entity.PrcHeaderEntity.ConfigurationFk = value;
						reloadGeneralsAndCertificates(entity, originalEntity);
					}
					return true;
				};

				service.validatePrcHeaderEntity$StructureFk = function validateStructureFk(entity, value) {
					if(entity === undefined || entity === null){
						return true;
					}
					if(entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk !== value){
						var originalEntity = {};
						originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
						originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;
						entity.PrcHeaderEntity.StructureFk = value;
						var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: value});
						/** change default taxcode when change structure *****/
						if(angular.isDefined(structure)){
							var TaxCodeFk=structure.TaxCodeFk;
							if(TaxCodeFk){
								entity.PrcHeaderEntity.TaxCodeFk=TaxCodeFk;
							}
						}
						reloadGeneralsAndCertificates(entity, originalEntity);
					}
					return true;
				};

				service.validatePrcHeaderEntity$StrategyFk = function validateStrategyFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if(entity === undefined || entity === null){
						return result;
					}
					if ((_.isNil(value) || value < 1) &&
						(_.isNil(entity.PrcHeaderEntity.StrategyFk) || entity.PrcHeaderEntity.StrategyFk < 1)
					) {
						result.valid = false;
						result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
						result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.EntityStrategy')};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				return service;
			}
		]);
})(angular);
