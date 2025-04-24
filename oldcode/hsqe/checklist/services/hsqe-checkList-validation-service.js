/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListValidationService
	 */
	angular.module(moduleName).factory('hsqeCheckListValidationService', ['$injector', '$q', '$http', '$translate', 'hsqeCheckListFormDataService',
		'platformDataValidationService', 'platformRuntimeDataService', 'hsqeCheckListDataService', 'checkListNumberGenerationSettingsService','businessPartnerLogicalValidator',
		function ($injector, $q, $http, $translate, formDataService, platformDataValidationService, platformRuntimeDataService, dataService, checkListNumberGenerationSettingsService,
			businessPartnerValidatorService) {
			var service = {};
			angular.extend(service,
				{
					asyncValidateCode: asyncValidateCode,
					validateHsqCheckListTemplateFk: validateHsqCheckListTemplateFk,
					validateBasRubricCategoryFk: validateBasRubricCategoryFk,
					validatePesHeaderFk: validatePesHeaderFk,
					validateHsqChkListTypeFk: validateHsqChkListTypeFk,
					validateBpdBusinesspartnerFk: validateBpdBusinesspartnerFk,
					validateConHeaderFk: validateConHeaderFk
				});
			var businessPartnerValidatorService = businessPartnerValidatorService.getService({
					BusinessPartnerFk:'BpdBusinesspartnerFk',
					SubsidiaryFk:'BpdSubsidiaryFk',
					ContactFk:'BpdContactFk',
					dataService: dataService,
				});
			service.validateBpdSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;
			function validationFk(value) {
				return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
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

			function asyncValidateCode(entity, value, model) {
				var defer = $q.defer();
				var fieldName = model === 'Code' ? $translate.instant('cloud.common.entityReferenceCode') : 'Reference Code';
				var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
				if (result.valid === true) {
					if (entity.PrjProjectFk === 0) {
						defer.resolve(result);
					} else {
						$http.get(globals.webApiBaseUrl + 'hsqe/checklist/header/isunique' + '?id=' + entity.Id + '&code=' + value + '&projectfk=' + entity.PrjProjectFk).then(function (response) {
							var fieldName = $translate.instant('cloud.common.entityReferenceCode');
							if (!response.data) {
								result = createErrorObject('defect.main.uniqueValueErrorMessage', {object: fieldName});
							}
							platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							defer.resolve(result);
						});
					}
				} else {
					result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					defer.resolve(result);
				}
				return defer.promise;
			}

			function validateEmptyCode(entity) {
				if (entity.Code === null || entity.Code === '') {
					var validdateResult = createErrorObject('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
					platformRuntimeDataService.applyValidationResult(validdateResult, entity, 'Code');
					platformDataValidationService.finishValidation(validdateResult, entity, entity.Code, 'Code', service, dataService);
					dataService.fireItemModified(entity);
				} else {
					platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
					platformDataValidationService.finishValidation(true, entity, entity.Code, 'Code', service, dataService);
					dataService.fireItemModified(entity);
				}
			}

			function validateHsqCheckListTemplateFk(entity, value) {
				if (!validationFk(value) && (entity.HsqCheckListTemplateFk !== value || entity.Version === 0)) {
					if (formDataService) {
						if (entity.Version === -1) {
							// bug in CreationInitialDialog, it will doUpdate when setList
							return;
						}
						$http.get(globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/gettemplate?mainId=' + value).then(function (result) {
							if (_.isObject(result) && _.isObject(result.data)) {
								var dto = result.data;
								entity.CheckListGroupFk = dto.HsqCheckListGroupFk;
								entity.HsqChkListTypeFk = dto.HsqCheckListTypeFk;
								entity.PrcStructureFk = dto.PrcStructureFk;
								entity.BasRubricCategoryFk = dto.BasRubricCategoryFk;
								entity.DescriptionInfo = dto.DescriptionInfo;
								if (dto.HsqChklisttemplate2formEntities.length > 0) {
									var formList = formDataService.getList();
									var forms = [];
									formDataService.deleteCheckListForm(angular.copy(formList));
									angular.forEach(dto.HsqChklisttemplate2formEntities, function (item) {
										var formData = formDataService.addCheckListForm(item, entity);
										forms.push(formData);
									});
									if (forms.length > 0) {
										formDataService.setList(forms);
									}
								}
							}
						});
					}
				}
			}

			function validateBasRubricCategoryFk(entity, value, model) {
				var result = {apply: true, valid: true};
				if (value <= 0) {
					result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('cloud.common.entityBasRubricCategoryFk')});
				}
				if (!entity.Code || entity.Version === 0) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'Code',
						readonly: checkListNumberGenerationSettingsService.hasToGenerateForRubricCategory(value)
					}]);
					entity.Code = checkListNumberGenerationSettingsService.provideNumberDefaultText(value, entity.Code);
					validateEmptyCode(entity);
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			}

			function validatePesHeaderFk(entity, value, model) {
				if (_.isNil(value) && _.isNil(entity.ConHeaderFk)) {
					setColumnReadonlyStatus(entity, ['BpdBusinesspartnerFk', 'BpdContactFk', 'BpdSubsidiaryFk'], false);
				}

				if (!_.isNil(value) && entity.PesHeaderFk !== value) {
					setColumnReadonlyStatus(entity, ['BpdBusinesspartnerFk', 'BpdContactFk', 'BpdSubsidiaryFk'], true);
					let pesEntity = getPesFromCache(value);

					if (!_.isNil(pesEntity)) {
						if (entity.PrjProjectFk === null || entity.PrjProjectFk === 0) {
							entity.PrjProjectFk = pesEntity.ProjectFk || null;
						}

						if (_.isNil(entity.ConHeaderFk)) {
							entity.BpdBusinesspartnerFk = pesEntity.BusinessPartnerFk;
						}

						setSubsidiaryFk(entity, model, pesEntity.SubsidiaryFk);
						//setContactFk(entity, model, null);
					}
				}

				let result = {apply: true, valid: true};
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			}

			function validateHsqChkListTypeFk(entity, value, model) {
				if (value) {
					var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
					var chlTypeEntity = _.find(lookupDescriptorService.getData('HsqeCheckListType'), {Id: value});
					var chlStatusEntity = _.find(lookupDescriptorService.getData('CheckListStatus'), {Id: entity.HsqChlStatusFk});
					if (chlTypeEntity && chlTypeEntity.BasRubricCategoryFk !== chlStatusEntity.BasRubricCategoryFk) {
						var basRubricCategoryFk = chlTypeEntity.BasRubricCategoryFk;
						var statusData = _.filter(lookupDescriptorService.getData('CheckListStatus'), {BasRubricCategoryFk: basRubricCategoryFk});
						if (statusData && statusData.length > 0) {
							var findDefault = _.find(statusData, {IsDefault: true});
							if (findDefault) {
								entity.HsqChlStatusFk = findDefault.Id;
								entity.HsqChlStatusEntity = findDefault;
							} else {
								var firstItem = _.orderBy(statusData, ['Sorting']).first();
								entity.HsqChlStatusFk = firstItem.Id;
								entity.HsqChlStatusEntity = firstItem;
							}
						}
					}
				}
				var result = {apply: true, valid: true};
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			}

			function validateConHeaderFk(entity, value, model) {
				if (_.isNil(value)) {
					if (_.isNil(entity.PesHeaderFk)) {
						setColumnReadonlyStatus(entity, ['BpdBusinesspartnerFk', 'BpdContactFk', 'BpdSubsidiaryFk'], false);
					} else {
						let pesEntity = getPesFromCache(entity.PesHeaderFk);
						if (!_.isNil(pesEntity)) {
							entity.BpdBusinesspartnerFk = pesEntity.BusinessPartnerFk || entity.BpdBusinesspartnerFk;
							setContactFk(entity, model, null);
							setSubsidiaryFk(entity, model, pesEntity.SubsidiaryFk);
						}
					}
				}

				if (!_.isNil(value) && entity.ConHeaderFk !== value) {
					setColumnReadonlyStatus(entity, ['BpdBusinesspartnerFk', 'BpdContactFk', 'BpdSubsidiaryFk'], true);

					let contractEntity = getContractFromCache(value);
					if (!_.isNil(contractEntity)) {
						entity.BpdBusinesspartnerFk = contractEntity.BusinessPartnerFk;
						setContactFk(entity, model, contractEntity.BpdContactFk);
						setSubsidiaryFk(entity, model, contractEntity.BpdSubsidiaryFk);
						if (entity.PrjProjectFk === null || entity.ProjectFk === 0) {
							entity.PrjProjectFk = contractEntity.ProjectFk;
						}
					}
				}

				let result = {apply: true, valid: true};
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}

			function validateBpdBusinesspartnerFk(entity, value, model) {
				setColumnReadonlyStatus(entity, ['BpdContactFk', 'BpdSubsidiaryFk'], false);

				if (_.isNil(value)) {
					setAdditionalColValueNull(entity);
				}

				if (!_.isNil(value) && entity.BpdBusinesspartnerFk !== value) {
					entity.BpdBusinesspartnerFk = value;
					setSubsidiaryFk(entity, model, null);
					setContactFk(entity, model, null);
				}

				let result = {apply: true, valid: true};
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}

			function setAdditionalColValueNull(entity) {
				if (entity) {
					entity.BpdBusinesspartnerFk = null;
					entity.BpdSubsidiaryFk = null;
					entity.BpdContactFk = null;
				}
			}

			function setColumnReadonlyStatus(entity, fields, isReadonly) {
				let columnStatus = [];
				for (let field of fields) {
					columnStatus.push({'field': field, 'readonly': isReadonly});
				}
				platformRuntimeDataService.readonly(entity, columnStatus);
			}

			function setContactFk(entity, model, contactFK) {
				if (model !== 'BpdBusinesspartnerFk') {
					entity.BpdContactFk = null;
				}

				if (model === 'ConHeaderFk') {
					entity.BpdContactFk = contactFK; // The contactFK comes from Contract entity.
				} else if (model === 'PesHeaderFk' && !_.isNil(entity.ConHeaderFk)) {
					let contractEntity = getContractFromCache(entity.ConHeaderFk);
					entity.BpdContactFk = contractEntity ? contractEntity.BpdContactFk : null;
				}

				if (_.isNil(entity.BpdContactFk)) {
					$injector.get('basicsLookupdataLookupDataService').getSearchList('Contact', `BusinessPartnerFk=${entity.BpdBusinesspartnerFk}`).then(function (data) {
						let defaultContact = _.find(data.items, {IsDefault: true});
						entity.BpdContactFk = defaultContact ? defaultContact.Id : null;
						dataService.fireItemModified(entity);
					});
				}
			}

			function setSubsidiaryFk(entity, model, subsidiaryFk) {
				if (model !== 'BpdBusinesspartnerFk') {
					entity.BpdSubsidiaryFk = null;
				}

				if (model === 'ConHeaderFk') {
					entity.BpdSubsidiaryFk = subsidiaryFk; // The subsidiaryFk comes from Contract entity.
					if (_.isNil(entity.BpdSubsidiaryFk) && !_.isNil(entity.PesHeaderFk)) {
						let pesEntity = getPesFromCache(entity.PesHeaderFk);
						entity.BpdSubsidiaryFk = pesEntity ? pesEntity.SubsidiaryFk : null;
					}
				} else if (model === 'PesHeaderFk') {
					if (!_.isNil(entity.ConHeaderFk)) {
						let contractEntity = getContractFromCache(entity.ConHeaderFk);
						entity.BpdSubsidiaryFk = contractEntity ? contractEntity.BpdSubsidiaryFk : null;
					}
					if (_.isNil(entity.BpdSubsidiaryFk)) {
						entity.BpdSubsidiaryFk = subsidiaryFk; // The subsidiaryFk comes from PES entity.
					}
				}

				if (_.isNil(entity.BpdSubsidiaryFk)) {
					$injector.get('basicsLookupdataLookupDataService').getSearchList('Subsidiary', `BusinessPartnerFk=${entity.BpdBusinesspartnerFk}`).then(function (data) {
						let mainSubsidiary = _.find(data.items, {IsMainAddress: true});
						entity.BpdSubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
						businessPartnerValidatorService.setDefaultContactByBranch(entity, entity.BpdBusinesspartnerFk, entity.BpdSubsidiaryFk).then(function () {
							dataService.fireItemModified(entity);
						});
					});
				}
			}

			function getContractFromCache(contractId) {
				return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('conheaderview', contractId);
			}

			function getPesFromCache(pesId) {
				return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('invoicepes', pesId);
			}

			return service;
		}
	]);
})(angular);
