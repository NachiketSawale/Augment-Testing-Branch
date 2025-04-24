/**
 * Created by jie 2023.03.15
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyICPartnerCardValidationServiceProcessor', basicsCompanyICPartnerCardValidationServiceProcessor);

	basicsCompanyICPartnerCardValidationServiceProcessor.$inject = ['_', 'platformDataValidationService', 'basicsCompanyICPartnerCardDataService', 'platformRuntimeDataService', 'basicsCompanyICPartnerAccDataService',
		'$translate','basicsLookupdataLookupDescriptorService','$http','$q','globals'];

	function basicsCompanyICPartnerCardValidationServiceProcessor(_, platformDataValidationService, basicsCompanyICPartnerCardDataService, platformRuntimeDataService, basicsCompanyICPartnerAccDataService,
		$translate,basicsLookupdataLookupDescriptorService,$http,$q,globals) {
		var service = {};

		service.validateBasCompanyPartnerFk = function (entity, value, model) {
			if (value === 0 || !value) {
				value=null;
				platformRuntimeDataService.readonly(entity, [{field: 'PrcConfigurationInvFk', readonly: true}]);
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsCompanyICPartnerCardDataService);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'PrcConfigurationInvFk', readonly: false}]);
				if(value === entity.BasCompanyFk){
					var validateResult = {
						apply: true,
						valid: false
					};
					validateResult.error = validateResult.error$tr$ = $translate.instant('basics.company.differentFiled');
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, basicsCompanyICPartnerCardDataService);
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					return validateResult;
				}
				var result = platformDataValidationService.isMandatory(value, model);
				if (result.apply) {
					result = platformDataValidationService.isUnique(basicsCompanyICPartnerCardDataService.getList(), model, value, entity.Id, false);
					if (!result.valid) {
						result.error = result.error$tr$ = $translate.instant('basics.company.basCompanyPartnerFkUniqueError');
					}
				}
				if(entity.BasCompanyPartnerFk !== value && entity.BasCompanyPartnerFk !== 0){
					entity.BpdCustomerFk = null;
					entity.BpdSupplierFk = null;
					var validateResult1 = {
						apply: true,
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						valid: false
					};
					platformDataValidationService.finishValidation(validateResult1, entity, entity.BpdCustomerFk, 'BpdCustomerFk', service, basicsCompanyICPartnerCardDataService);
					platformRuntimeDataService.applyValidationResult(validateResult1, entity, 'BpdCustomerFk');
					var validateResult2 = {
						apply: true,
						valid: false,
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'
					};
					platformDataValidationService.finishValidation(validateResult2, entity, entity.BpdSupplierFk, 'BpdSupplierFk', service, basicsCompanyICPartnerCardDataService);
					platformRuntimeDataService.applyValidationResult(validateResult2, entity, 'BpdSupplierFk');
				}
				platformDataValidationService.finishValidation(result, entity, value, model, service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return result;
			}
		};

		service.validateBpdCustomerFk = function validateBpdCustomerFk(entity, value, model) {
			if (!value && !entity.BpdSupplierFk) {
				var validateResult2 = {
					apply: true,
					valid: false,
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'
				};
				platformDataValidationService.finishValidation(validateResult2, entity, entity.BpdSupplierFk, 'BpdSupplierFk', service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult2, entity, 'BpdSupplierFk');
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsCompanyICPartnerCardDataService);
			} else {
				var validateResult = {
					apply: true,
					valid: true
				};
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, entity.BpdSupplierFk, 'BpdSupplierFk', service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BpdSupplierFk');
				return validateResult;
			}
		};

		service.validateBpdSupplierFk = function (entity, value, model) {
			if (!value && !entity.BpdCustomerFk) {
				var validateResult1 = {
					apply: true,
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
					valid: false
				};
				platformDataValidationService.finishValidation(validateResult1, entity, entity.BpdCustomerFk, 'BpdCustomerFk', service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult1, entity, 'BpdCustomerFk');
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsCompanyICPartnerCardDataService);
			} else {
				var validateResult = {
					apply: true,
					valid: true
				};
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, entity.BpdCustomerFk, 'BpdCustomerFk', service, basicsCompanyICPartnerCardDataService);
				platformRuntimeDataService.applyValidationResult(validateResult, entity, 'BpdCustomerFk');
				return validateResult;
			}
		};

		service.validatePrcStructureFk = function (entity, value, model) {
			if (value === 0 || !value) {
				value=null;
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsCompanyICPartnerAccDataService);
			}
			var result = platformDataValidationService.isMandatory(value, model);
			if (result.apply) {
				result = platformDataValidationService.isUnique(basicsCompanyICPartnerAccDataService.getList(), model, value, entity.Id, false);
				if (!result.valid) {
					result.error = result.error$tr$ = $translate.instant('basics.company.basPrcStructureFkUniqueError');
				}
			}
			platformDataValidationService.finishValidation(result, entity, value, model, service, basicsCompanyICPartnerAccDataService);
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return result;
		};

		service.asyncValidatePrcConfigurationBilFk = (entity,value)=>{
			var defer = $q.defer();
			var result = {apply: true, valid: true};
			if(value && value !== 0) {
				platformRuntimeDataService.readonly(entity, [
					{field: 'MdcBillSchemaBilFk', readonly: false}
				]);
				var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
				if (entity && value) {
					return $http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2bschema/getBSchemaByConfigHeader?configHeaderFk=' + config.PrcConfigHeaderFk + '&companyFk=' + entity.BasCompanyFk).then(function (billSchema) {
						if (billSchema.data.length >= 1) {
							entity.MdcBillSchemaBilFk = billSchema.data[0].Id;
						} else {
							entity.MdcBillSchemaBilFk = null;
						}
					});
				}
			}else{
				entity.MdcBillSchemaBilFk = null;
				platformRuntimeDataService.readonly(entity, [
					{field: 'MdcBillSchemaBilFk', readonly: true}
				]);
			}
			platformDataValidationService.finishValidation(result, entity, value, 'PrcConfigurationBilFk', service, basicsCompanyICPartnerAccDataService);
			defer.resolve(result);
			return defer.promise;
		};

		service.asyncValidatePrcConfigurationInvFk = (entity,value)=>{
			var defer = $q.defer();
			var result = {apply: true, valid: true};
			if(value && value !== 0) {
				platformRuntimeDataService.readonly(entity, [
					{field: 'MdcBillSchemaInvFk', readonly: false}
				]);
				var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: value});
				if (entity && value) {
					return $http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2bschema/getBSchemaByConfigHeader?configHeaderFk=' + config.PrcConfigHeaderFk + '&companyFk=' + entity.BasCompanyFk).then(function (billSchema) {
						if (billSchema.data.length >= 1) {
							entity.MdcBillSchemaInvFk = billSchema.data[0].Id;
						} else {
							entity.MdcBillSchemaInvFk = null;
						}
					});
				}
			}else{
				entity.MdcBillSchemaInvFk = null;
				platformRuntimeDataService.readonly(entity, [
					{field: 'MdcBillSchemaInvFk', readonly: true}
				]);
			}
			platformDataValidationService.finishValidation(result, entity, value, 'PrcConfigurationInvFk', service, basicsCompanyICPartnerAccDataService);
			defer.resolve(result);
			return defer.promise;
		};

		return service;
	}
})(angular);