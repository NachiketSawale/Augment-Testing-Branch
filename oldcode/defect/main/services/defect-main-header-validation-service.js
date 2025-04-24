/**
 * Created by jim on 5/4/2017.
 */
/* global globals, _ */
(function (angular) {
	'use strict';

	var moduleName='defect.main';

	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('defectMainHeaderElementValidationService',
		['$translate', '$q','$http', 'defectMainHeaderDataService', '$injector',
			'platformDataValidationService', 'basicsLookupdataLookupDataService',
			'businessPartnerLogicalValidator', 'platformRuntimeDataService','defectMainHeaderReadonlyProcessor',
			'basicsLookupdataLookupDescriptorService','defectNumberGenerationSettingsService', 'platformModalService',
			function ($translate, $q,$http, defectMainHeaderDataService, $injector, platformDataValidationService,
				basicsLookupdataLookupDataService, businessPartnerLogicalValidator, platformRuntimeDataService,
				defectMainHeaderReadonlyProcessor, basicsLookupdataLookupDescriptorService, defectNumberGenerationSettingsService, platformModalService) {

				var service = {};
				var self = this;

				service.asyncValidateCode=asyncValidateCode;
				service.validateDfmStatusFk =validateDfmStatusFk;
				service.validateBasDefectTypeFk=validateBasDefectTypeFk;
				service.validatePrjProjectFk=validatePrjProjectFk;
				service.validateConHeaderFk=validateConHeaderFk;
				service.validateOrdHeaderFk=validateOrdHeaderFk;

				service.validatePsdScheduleFk=validatePsdScheduleFk;
				service.validateBasDefectPriorityFk=validateBasDefectPriorityFk;
				service.validateBasDefectSeverityFk=validateBasDefectSeverityFk;
				service.validateDateIssued=validateDateIssued;
				service.validateDfmRaisedbyFk=validateDfmRaisedbyFk;
				service.validateIsexternal=validateIsexternal;
				service.asyncValidatePrjProjectFk = asyncValidatePrjProjectFk;
				var validateBusinessPartnerFkService = businessPartnerLogicalValidator.getService({
					BusinessPartnerFk:'BpdBusinesspartnerFk',
					SubsidiaryFk:'BpdSubsidiaryFk',
					ContactFk:'BpdContactFk',
					dataService: defectMainHeaderDataService
				});
				service.validateBpdBusinesspartnerFk = validateBusinessPartnerFkService.businessPartnerValidator;
				service.validateBpdSubsidiaryFk = validateBusinessPartnerFkService.subsidiaryValidator;

				service.validateObjectSetKey=validateObjectSetKey;

				service.validateRubricCategoryFk = function (entity, newValue, model) {
					var oldRubricCategoryFk = entity.RubricCategoryFk;
					if (entity.RubricCategoryFk !== newValue && newValue !== null) {
						$http.get(globals.webApiBaseUrl + 'defect/main/header/getdefaultstatusbycategory?categoryId=' + newValue).then(function (respond) {
							if(respond.data !== 0){
								entity.DfmStatusFk = respond.data;
								defectMainHeaderDataService.fireItemModified(entity);
								platformRuntimeDataService.applyValidationResult(true, entity, model);
								return true;
							}else{
								platformModalService.showMsgBox('defect.main.rubricCategoryMissingDefautStatus', 'defect.main.NoDefaultStatus', 'warning');
								// if error, then set back to original rubricCategory
								entity.RubricCategoryFk = oldRubricCategoryFk;
							}
						});
					}
					if (!entity.Code || entity.Version===0) {
						platformRuntimeDataService.readonly(entity, [{
							field: 'Code',
							readonly: defectNumberGenerationSettingsService.hasToGenerateForRubricCategory(newValue)
						}]);
						entity.Code = defectNumberGenerationSettingsService.provideNumberDefaultText(newValue, entity.Code);
						validateEmptyCode(entity);
					}
					$http.get(globals.webApiBaseUrl + 'defect/main/header/getdefaultdefecttype' + '?rubricCategoryId=' + newValue).then(function (response) {
						entity.BasDefectTypeFk = response.data;
						defectMainHeaderDataService.gridRefresh();

					});
				};

				function validateEmptyCode(entity){
					if(entity.Code === null || entity.Code === ''){
						var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'} );
						platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
						platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, defectMainHeaderDataService);
						defectMainHeaderDataService.fireItemModified(entity);
					}else{
						platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
						platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, defectMainHeaderDataService);
						defectMainHeaderDataService.fireItemModified(entity);
					}
				}

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				function asyncValidateCode(entity, value, model){
					var defer = $q.defer();
					var fieldName = model === 'Code' ? $translate.instant('cloud.common.entityReferenceCode'):'Reference Code';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if(result.valid === true){
						if(_.isUndefined(entity.PrjProjectFk) || entity.PrjProjectFk === null){
							entity.PrjProjectFk = null;
						}
						if (entity.PrjProjectFk === 0) {
							defer.resolve(result);
						} else {
							$http.get(globals.webApiBaseUrl + 'defect/main/header/isunique' + '?id=' + entity.Id + '&code=' + value + '&projectfk=' + entity.PrjProjectFk).then(function (response) {
								var fieldName = $translate.instant('cloud.common.entityReferenceCode');
								if (!response.data) {
									result = createErrorObject('defect.main.uniqueValueErrorMessage', {object: fieldName});
								}
								else if(entity.Code !== value && value !== ''){
									entity.Code = value;
								}
								platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
								defer.resolve(result);
							});
						}
					}else{
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
						platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
						defer.resolve(result);
					}
					return defer.promise;
				}

				function validateDfmStatusFk(entity, value, model) {
					var fieldName = model === 'DfmStatusFk' ? $translate.instant('cloud.common.entityStatus'):'Status';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function validateBasDefectTypeFk(entity, value, model) {
					var fieldName = model === 'BasDefectTypeFk' ? $translate.instant('defect.main.entityBasDefectTypeFk'):'Type';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function validatePrjProjectFk(entity, value, model) {
					var fieldName = model === 'PrjProjectFk' ? $translate.instant('defect.main.entityPrjProjectFk'):'Project';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					if(result.valid === true && value !== 0){
						basicsLookupdataLookupDataService.getItemByKey('PrcProject', value).then(function (project) {
							entity.BasCurrencyFk=project.CurrencyFk;

							defectMainHeaderDataService.gridRefresh();
						});
					}
					if(!!entity.PrjProjectFk&&!value){
						entity.ConHeaderFk=null;
						entity.OrdHeaderFk=null;
						validateConHeaderFk(entity, null);
						validateOrdHeaderFk(entity, null);
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);

					entity.DfmDefectFk=null;
					// entity.PrjLocationFk=null;
					if(entity.PrjProjectFk !== value){
						entity.PsdScheduleFk=null;
						entity.MdcControllingunitFk=null;
					}

					if(result.valid === true && value !== 0){
						setNotReadonlyFromProjectFk(entity);
					}else{
						setReadonlyFromProjectFk(entity);
					}

					return result;
				}

				function setNotReadonlyFromProjectFk(entity){
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'DfmDefectFk',false);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PrjLocationFk',false);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PsdScheduleFk',false);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'MdcControllingunitFk',false);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PrjLocationFk',false);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'ObjectSetKey',false);
				}

				function setReadonlyFromProjectFk(entity){
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'DfmDefectFk',true);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PrjLocationFk',true);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PsdScheduleFk',true);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'MdcControllingunitFk',true);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PrjLocationFk',true);
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'ObjectSetKey',true);
				}

				function validateConHeaderFk(entity, value){
					if(!_.isNil(value)){
						entity.OrdHeaderFk=null;
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'OrdHeaderFk',true);

						basicsLookupdataLookupDataService.getItemByKey('ConHeader', value).then(function (contract) {
							entity.PrjProjectFk = contract.ProjectFk;
							validatePrjProjectFk(entity,entity.PrjProjectFk,'PrjProjectFk');

							entity.PrcStructureFk=contract.PrcHeaderEntity.StructureFk;
							entity.BpdBusinesspartnerFk=contract.BusinessPartnerFk;
							setNotReadonlyFromBpdBusinesspartnerFk(entity);
							entity.BpdSubsidiaryFk=contract.SubsidiaryFk;
							entity.BpdContactFk=contract.ContactFk;
							entity.MdcControllingunitFk=contract.ControllingUnitFk;
							entity.Isexternal=true;

							defectMainHeaderDataService.gridRefresh();
						});
					}else{
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'OrdHeaderFk',false);
						defectMainHeaderDataService.gridRefresh();
					}
					return true;
				}

				function validateOrdHeaderFk(entity, value){
					if(!_.isNil(value)){
						entity.ConHeaderFk=null;
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'ConHeaderFk',true);

						basicsLookupdataLookupDataService.getItemByKey('SalesContract', value).then(function (contract) {
							entity.PrjProjectFk = contract.ProjectFk;
							// setNotReadonlyFromProjectFk(entity);
							validatePrjProjectFk(entity,entity.PrjProjectFk,'PrjProjectFk');
							if(!_.isNil(entity.BpdBusinesspartnerFk)){
								setNotReadonlyFromBpdBusinesspartnerFk(entity);
							}
							service.validatePrjProjectFk(entity,contract.ProjectFk,'PrjProjectFk');
							defectMainHeaderDataService.gridRefresh();
						});
					}else{
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'ConHeaderFk',false);
						entity.PrcStructureFk=null;

						defectMainHeaderDataService.gridRefresh();
					}
					return true;
				}

				function validatePsdScheduleFk(entity,value) {
					entity.PsdActivityFk=null;
					if(!_.isNil(value)){
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PsdActivityFk',false);
					}else{
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'PsdActivityFk',true);
					}
					return true;
				}


				function validateIsexternal(entity,value){
					if(value===true){
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdBusinesspartnerFk',false);
						if(!_.isNil(entity.BpdBusinesspartnerFk)){
							defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdSubsidiaryFk',false);

						}else{
							defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdSubsidiaryFk',true);
						}
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdContactFk',false);
					}else{
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdBusinesspartnerFk',true);
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdSubsidiaryFk',true);
						defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdContactFk',true);
						// External defect is not checked, the BP should be cleared,#94115
						entity.BpdBusinesspartnerFk = null;
						entity.BpdSubsidiaryFk = null;
						entity.BpdContactFk = null;
					}
					return true;
				}

				function validateBasDefectPriorityFk(entity, value, model) {
					var fieldName = model === 'BasDefectPriorityFk' ? $translate.instant('defect.main.entityBasDefectPriorityFk'):'Priority';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function validateBasDefectSeverityFk(entity, value, model) {
					var fieldName = model === 'BasDefectSeverityFk' ? $translate.instant('defect.main.entityBasDefectSeverityFk'):'Severity';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function validateDateIssued(entity, value, model) {
					var fieldName = model === 'DateIssued' ? $translate.instant('defect.main.entityDateIssued'):'Date Issued';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === false){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function validateDfmRaisedbyFk(entity, value, model) {
					var fieldName = model === 'DfmRaisedbyFk' ? $translate.instant('defect.main.entityDfmRaisedbyFk'):'Raised By';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true && value === 0){
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				}

				function setNotReadonlyFromBpdBusinesspartnerFk(entity){
					defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity,'BpdSubsidiaryFk',false);
				}

				function validateObjectSetKey(entity, value){
					if(!_.isNil(value)) {
						entity.MdlObjectsetFk = value.split('_')[1];
					}
					else{
						entity.MdlObjectsetFk=null;
					}
					defectMainHeaderDataService.fireItemModified(entity);
					return true;
				}

				function asyncValidatePrjProjectFk(entity, value) {
					var defer = $q.defer();
					var result = {apply: true, valid: true};
					if (value && entity.Code) {
						$http.get(globals.webApiBaseUrl + 'defect/main/header/isunique' + '?id=' + entity.Id + '&code=' + entity.Code + '&projectfk=' + value).then(function (response) {
							var fieldName = $translate.instant('cloud.common.entityReferenceCode');
							if (!response.data) {
								result = createErrorObject('defect.main.uniqueValueErrorMessage', {object: fieldName});
							}
							defer.resolve(true);
							platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
							platformDataValidationService.finishValidation(result, entity, entity.Code, 'Code', service, defectMainHeaderDataService);

						});
					} else {
						defer.resolve(true);
					}
					return defer.promise;
				}

				self.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};
				self.handleError = function (result, entity, groups) {
					if (!result.valid) {
						_.forEach(groups, function (item) {
							platformRuntimeDataService.applyValidationResult(result, entity, item);
						});
					} else {
						self.removeError(entity);
					}
				};

				service.validatePesHeaderFk=function (entity, value, model) {
					if(!_.isNil(value)){
						var pesEntity=basicsLookupdataLookupDescriptorService.getLookupItem('invoicepes', value);
						if(!_.isNil(pesEntity)){
							if(!entity.ConHeaderFk||entity.ConHeaderFk===0){
								entity.ConHeaderFk=pesEntity.ConHeaderFk;
								validateConHeaderFk(entity,pesEntity.ConHeaderFk);
							}
						}
					}
					var result = {apply: true, valid: true};
					platformDataValidationService.finishValidation(result, entity, value, model, service, defectMainHeaderDataService);
					return result;
				};

				service.validateHsqChecklistFk = function(entity, value){
					entity.HsqChecklistFk = value;
					var checkListFormDataService = $injector.get('defectCheckListFormDataService');
					if(checkListFormDataService){
						checkListFormDataService.load();
					}
					return true;
				};
				return service;
			}
		]);

})(angular);

