/**
 * Created by sfi on 2/24/2016.
 */

(function (angular) {
	'use strict';

	angular.module('documents.project').factory('documentProjectHeaderValidationService',
		['globals','_','$q', '$http', 'documentsProjectDocumentModuleContext',
			'platformRuntimeDataService',
			'platformDataValidationService',
			'documentsProjectDocumentRelationReadonlyProcessorFactory', 'documentsProjectDocumentDataService',
			'$translate', 'platformModalService', 'basicsLookupdataLookupDescriptorService', '$injector', 'projectDocumentNumberGenerationSettingsService',
			'businessPartnerLogicalValidator', 'platformModuleStateService',
			function (globals,_,$q, $http, documentsProjectDocumentModuleContext,
				platformRuntimeDataService,
				platformDataValidationService,
				relationReadonlyProcessorFactory, documentsProjectDocumentDataService,
				$translate, platformModalService, basicsLookupdataLookupDescriptorService, $injector,
				projectDocumentNumberGenerationSettingsService,businessPartnerLogicalValidator,platformModuleStateService
			) {

				var service = {};
				var self = this;

				service.validatePrjDocumentTypeFk = validatePrjDocumentTypeFk;
				service.validateBarcode = validateBarcode;
				service.validateDescription = commonValidation;
				service.validateCommentText = commonValidation;
				service.validateDocumentTypeFk = isMandatoryValidation;
				service.validateInvHeaderFk = commonValidation;
				service.validatePrjProjectFk = validateProject;
				service.validateMdcControllingUnitFk = commonValidation;
				service.validateBpdBusinessPartnerFk = validateBpdBusinessPartnerFk;
				service.validatePrcStructureFk = commonValidation;
				service.validatePrcPackageFk = commonValidation;
				service.validateConHeaderFk = commonValidation;
				service.validatePesHeaderFk = commonValidation;
				service.validateBpdCertificateFk = commonValidation;
				service.validateEstHeaderFk = commonValidation;
				service.validateMdcMaterialCatalogFk = commonValidation;
				service.validatePrjLocationFk = commonValidation;
				service.validatePsdActivity = commonValidation;
				service.validatePsdScheduleFk = validatePsdScheduleFk;
				service.validateQtnHeaderFk = commonValidation;
				service.validateRfqHeaderFk = commonValidation;
				service.validateModelFk = commonValidation;
				service.validateObjectFk = commonValidation;
				service.validatePsdActivityFk = commonValidation;
				service.validateReqHeaderFk = commonValidation;
				service.validateBidHeaderFk = commonValidation;
				service.validateOrdHeaderFk = commonValidation;
				service.validateWipHeaderFk = commonValidation;
				service.validateProjectInfoRequestFk = commonValidation;
				service.validateObjUnitFk = commonValidation;
				service.validateUserDefined1 = commonValidation;
				service.validateUserDefined2 = commonValidation;
				service.validateUserDefined3 = commonValidation;
				service.validateUserDefined4 = commonValidation;
				service.validateUserDefined5 = commonValidation;
				service.validateDocumentDate = commonValidation;
				service.validateBilHeaderFk = commonValidation;
				service.validateLgmJobFk = commonValidation;
				service.validateLgmDispatchHeaderFk = commonValidation;
				service.validateLgmSettlementFk = commonValidation;
				service.validateQtoHeaderFk = commonValidation;
				service.validatePrjChangeFk = commonValidation;
				service.validatePpsHeaderFk = commonValidation;
				service.validateTrsRouteFk = commonValidation;
				service.validatePpsItemFk = commonValidation;
				service.validatePpsUpstreamItemFk = commonValidation;
				service.validateExpirationDate = commonValidation;
				service.validateBpdContactFk = commonValidation;
				service.validateBpdSubsidiaryFk = commonValidation;
				service.validateCode = commonValidation;
				service.validatePrjDocumentFk = validatePrjDocumentFk;
				service.validateRubricCategoryFk = validateRubricCategoryFk;
				var config = documentsProjectDocumentModuleContext.getConfig();
				documentsProjectDocumentDataService = documentsProjectDocumentDataService.getService(config);
				var validateBusinessPartnerFkService = businessPartnerLogicalValidator.getService({
					BusinessPartnerFk:'BpdBusinessPartnerFk',
					SubsidiaryFk:'BpdSubsidiaryFk',
					ContactFk:'BpdContactFk',
					dataService: documentsProjectDocumentDataService
				});

				service.validateBpdSubsidiaryFk= function validateBpdSubsidiaryFk(entity, value, model) {
					var result = {apply: true, valid: true};
					var isValid = validateBusinessPartnerFkService.subsidiaryValidator(entity, value);
					if(isValid){
						commonValidation();
						return result;
					}
					return {apply: true, valid: false};

				};
				service.validateUrl = function (entity, value, model) {
					var result = platformDataValidationService.validateUrl(entity, value, model, service, documentsProjectDocumentDataService);
					if (result.valid) {
						triggerLeadingServiceModifyItem();
					}
					return result;
				};

				function validatePrjDocumentFk(entity, value, model) {
					var fieldName = model === 'PrjDocumentFk' ? $translate.instant('documents.project.entityReferencedDocument') : 'Reference ID';
					var result = {apply: true, valid: true};
					if (value === 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}
					var checkResulet = documentsProjectDocumentDataService.needToLockOrUnlockDocumentRevisionGrid(entity.PrjDocumentFk, value);
					if (checkResulet.needToLockOrUnlock === true) {
						documentsProjectDocumentDataService.lockOrUnlockUploadBtnAndGrid.fire(null, {lockOrUnlock: checkResulet.lockOrUnlock});
					}
					if (result.valid) {
						triggerLeadingServiceModifyItem();
					}
					return result;
				}

				function validateBpdBusinessPartnerFk(entity, value, model) {
					var result = {apply: true, valid: true};

					if (result.valid) {
						triggerLeadingServiceModifyItem();
					}
					let validationSpec = {Field2Validate: 1, NewIntValue: value, Document: entity};
					$http.post(globals.webApiBaseUrl + 'documents/projectdocument/final/validate', validationSpec).then(function (result) {
						if (!result.data.ValidationResult) {
						} else {
							if (result.data.Document && result.data.Document.Id) {
								entity.BpdSubsidiaryFk = result.data.Document.BpdSubsidiaryFk;
								if(!_.isNil(value)){
									validateBusinessPartnerFkService.setDefaultContactByBranch(entity, value, entity.BpdSubsidiaryFk).then(function () {
										documentsProjectDocumentDataService.fireItemModified(entity);
									});
								}
							}
						}
					});
					return result;
				}

				function isMandatoryValidation(entity, value, model) {
					var result = isMandatory(entity, value, model);
					if (result.valid) {
						commonValidation();
					}
					return result;

				}

				function isMandatory(entity, value, model) {
					var fieldName = model === 'PrjDocumentCategoryFk' ? 'Document Category' : (model === 'PrjDocumentTypeFk' ? 'Project Document Type' : 'Type');

					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, documentsProjectDocumentDataService);
					return result;
				}



				service.asyncValidateBpdBusinessPartnerFk = function asyncValidateBusinessPartnerFk(entity, value, model) {
					return applyAsyncFieldTest({Field2Validate: 1, NewIntValue: value, Document: entity}, value, model);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
					entity.Code = value;
					var result = {
						apply: true,
						valid: true
					};
					var defer = $q.defer();
					var fieldName = 'Code';

					var requstionUrl = globals.webApiBaseUrl + 'documents/projectdocument/final/isunique' + '?id=' + entity.Id + '&version=' + entity.Version + '&code=' + value;
					if (entity.BasCompanyFk !== undefined && entity.BasCompanyFk !== null) {
						requstionUrl = requstionUrl + '&companyfk=' + entity.BasCompanyFk;
					}
					$http.get(requstionUrl).then(function (response) {
						if (!response.data) {
							if (entity.Version === 0 || (entity.BasCompanyFk !== undefined && entity.BasCompanyFk !== null)) {
								result = createErrorObject('documents.project.uniqueValueWithinCmpMsg', {object: fieldName});
							} else {
								result = createErrorObject('documents.project.uniqueValueWithinSysMsg', {object: fieldName});
							}

						} else if (entity.Code !== value && value !== '') {
							entity.Code = value;
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, documentsProjectDocumentDataService);
						defer.resolve(result);
					});
					return defer.promise;
				};

				/* function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				} */

				function applyAsyncFieldTest(validationSpec, value, model, errorCode, errorParam) {
					var serviceConfig = documentsProjectDocumentModuleContext.getConfig();
					var documentService = $injector.get('documentsProjectDocumentDataService').getService(serviceConfig);
					var entity = validationSpec.Document;
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, documentService);
					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'documents/projectdocument/final/validate', validationSpec).then(function (result) {
						if (!result.data.ValidationResult) {
							return platformDataValidationService.finishAsyncValidation({
								valid: false,
								apply: true,
								error: '...',
								error$tr$: errorCode,
								error$tr$param$: {object: errorParam.toLowerCase() || model.toLowerCase()}
							}, entity, value, model, asyncMarker, self, documentService);
						} else {
							if (result.data.Document && result.data.Document.Id) {
								documentService.takeOver(result.data.Document);
							}

							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, documentService);
						}
					});
					return asyncMarker.myPromise;
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

				function commonValidation() {
					triggerLeadingServiceModifyItem();
					return true;
				}

				function triggerLeadingServiceModifyItem() {
					var parentService = documentsProjectDocumentModuleContext.getConfig().parentService;
					if (parentService !== undefined) {
						// var parentItem = parentService.getSelected();
						//if only change the project document information then not need to save the header
						//when click the save button in header container just trigger to save the document action
						var parentState = platformModuleStateService.state(parentService.getModule());
						if(parentState && parentState.modifications){
							parentState.modifications.EntitiesCount += 1;
						}
					}

				}

				function validateBarcode(entity, value) {
					var result = false;
					if (value.length > 252) {
						result = platformDataValidationService.createErrorObject('documents.project.barcodeOverflow', {object: 'Barcode'});
					} else {
						result = platformDataValidationService.createSuccessObject();
					}
					self.handleError(result, entity, ['Barcode']);
					if (result.valid) {
						triggerLeadingServiceModifyItem();
					}
					return result;
				}

				function validateProject(item, value) {
					item.PrjProjectFk = value;
					relationReadonlyProcessorFactory.GetRelationReadonlyProcessor(
						{
							readOnlyFields: ['EstHeaderFk', 'MdcControllingUnitFk', 'PrjLocationFk', 'PsdScheduleFk'],
							dependField: 'PrjProjectFk'
						}).processItem(item);
					commonValidation();
				}

				function validatePsdScheduleFk(item, value) {
					item.PsdScheduleFk = value;
					item.PsdActivity = null;
					relationReadonlyProcessorFactory.GetRelationReadonlyProcessor(
						{
							readOnlyFields: ['PsdActivity'],
							dependField: 'PsdScheduleFk'
						}).processItem(item);
					commonValidation();
				}

				service.asyncValidateRubricCategoryFk = function (item, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(item, value, model, documentsProjectDocumentDataService);
					asyncMarker.myPromise = setRubricCategoryFk(item, value).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, item, value, model, asyncMarker, service, documentsProjectDocumentDataService);
					});
					return asyncMarker.myPromise;
				};

				service.validateRubricCategoryFkFromWizard = function (item, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(item, value, model, documentsProjectDocumentDataService);
					asyncMarker.myPromise = setRubricCategoryFk(item, value, true).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, item, value, model, asyncMarker, service, documentsProjectDocumentDataService);
					});
					return asyncMarker.myPromise;
				};

				function setRubricCategoryFk(entity, RubricCategoryFk, isFromWizard) {
					if (angular.isUndefined(RubricCategoryFk) || RubricCategoryFk === null || RubricCategoryFk === -1) {
						let result = {apply: true, valid: true};
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'RubricCategoryFk'});
						return $q.when(result);
					}
					return $q.when($http.get(globals.webApiBaseUrl + 'documents/centralquery/GetCategoryEntityByRubricCategoryList?category=' + RubricCategoryFk).then((response) => {
						if (response.data.length >= 1) {
							let isDft = 0;
							for (let i = 0; i < response.data.length; i++) {
								if (response.data[i].Isdefault && response.data[i].IsLive) {
									entity.PrjDocumentCategoryFk = response.data[i].Id;
									isDft = 1;
								}
							}
							if (isDft === 0) {
								entity.PrjDocumentCategoryFk = null;
								isMandatoryValidation(entity,entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk');
							}
						}else{
							entity.PrjDocumentCategoryFk = null;
							let result = {apply: true, valid: true};
							result.valid = false;
							isMandatoryValidation(entity,entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk');
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'RubricCategoryFk'});
							return $q.when(result);
						}
						// return {valid: true, apply: true};
						if(entity.PrjDocumentCategoryFk) {
							return $http.get(globals.webApiBaseUrl + 'documents/projectdocument/GetDocumentTypeByDocumentCategory?category=' + entity.PrjDocumentCategoryFk).then((response) => {
								if (response.data) {
									entity.PrjDocumentTypeFk = response.data.Id;
									isMandatory(entity,entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk');
									isMandatory(entity,entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk');
									let result = {apply: true, valid: true};
									return $q.when(result);
								}else{
									entity.PrjDocumentTypeFk = null;
									let result = {apply: true, valid: false};
									let documentTypeEntity =_.find(basicsLookupdataLookupDescriptorService.getData('projectdocumenttypelookup'),{IsDefault:true,IsLive:true});
									if(!_.isNil(documentTypeEntity)){
										entity.PrjDocumentTypeFk = documentTypeEntity.Id;
									}
									if(!_.isNil(entity.PrjDocumentTypeFk)) {
										result.valid = true;
									}else {
										return  $injector.get('basicsLookupdataLookupDataService').getList('projectdocumenttypelookup').then(function (data) {
											if (data.length>=1) {
												entity.PrjDocumentTypeFk = data[0].Id;
												result.valid = true;
												return $q.when(result);
											}
										});
									}
									return $q.when(result);
								}
							});
						}
						isMandatory(entity,entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk');
						let result = {apply: true, valid: true};
						return $q.when(result);
					}));
				}

				function validateRubricCategoryFk(item, value, model) {
					var docStatuses = basicsLookupdataLookupDescriptorService.getData('documentstatus');
					var result = {
						apply: true,
						valid: true
					};
					if (item.RubricCategoryFk !== value && value !== null) {
						var defaultStatus = _.find(docStatuses, function (o) {
							return o.RubricCategoryFk === value && o.IsDefault;
						});
						if (!_.isNil(defaultStatus)) {
							item.PrjDocumentStatusFk = defaultStatus.Id;
							documentsProjectDocumentDataService.markCurrentItemAsModified();
							documentsProjectDocumentDataService.fireItemModified(item);
							platformRuntimeDataService.applyValidationResult(true, item, model);
						} else {
							platformModalService.showMsgBox('documents.project.rubricCategoryMissingDefautStatus', 'documents.project.FileUpload.validation.NoDefaultStatus', 'warning');
							result.apply = false;
						}

						var hasToGenerateCode = projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
						platformRuntimeDataService.readonly(item, [{
							field: 'Code',
							readonly: hasToGenerateCode
						}]);
						if (hasToGenerateCode) {
							item.Code = projectDocumentNumberGenerationSettingsService.provideNumberDefaultText(value, item.Code);
						} else {
							if (item.Version === 0) {
								item.Code = '';
							}
						}
					}
					if (result.valid) {
						commonValidation();
					}

					return result;
				}

				service.asyncValidatePrjDocumentCategoryFk = function (item, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(item, value, model, documentsProjectDocumentDataService);
					asyncMarker.myPromise = setDocumentCategoryFk(item, value).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, item, value, model, asyncMarker, service, documentsProjectDocumentDataService);
					});
					return asyncMarker.myPromise;
				};

				function setDocumentCategoryFk(entity, DocumentCategoryFk) {
					if(entity.IsFromDialog){
						let result = {apply: true, valid: true};
						entity.IsFromDialog = false;
						return $q.when(result);
					}
					if (angular.isUndefined(DocumentCategoryFk) || DocumentCategoryFk === null || DocumentCategoryFk === -1) {
						let result = {apply: true, valid: true};
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'PrjDocumentCategoryFk'});
						return $q.when(result);
					}
					if(DocumentCategoryFk) {
						entity.PrjDocumentCategoryFk = DocumentCategoryFk;
						return $q.when($http.get(globals.webApiBaseUrl + 'documents/projectdocument/GetDocumentTypeByDocumentCategory?category=' + DocumentCategoryFk).then((response) => {
							let result = {apply: true, valid: true};
							if (response.data) {
								entity.PrjDocumentTypeFk = response.data.Id;
							} else {
								entity.PrjDocumentTypeFk = null;
								let documentTypeEntity =_.find(basicsLookupdataLookupDescriptorService.getData('projectdocumenttypelookup'),{IsDefault:true,IsLive:true});
								if(_.isNil(documentTypeEntity)){
									return  $injector.get('basicsLookupdataLookupDataService').getList('projectdocumenttypelookup').then(function (data) {
										if (data.length>=1) {
											data.sort((a, b) => a.Id - b.Id);
											entity.PrjDocumentTypeFk = data[0].Id;
											return $q.when(result);
										}
									});
								}
								if(!_.isNil(documentTypeEntity)){
									entity.PrjDocumentTypeFk = documentTypeEntity.Id;
								}
								if(!_.isNil(entity.PrjDocumentTypeFk)) {
									result.valid = true;
								}else {
									result.valid = false;
									isMandatoryValidation(entity, entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk');
								}
							}
							isMandatory(entity,entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk');
							isMandatory(entity,entity.RubricCategoryFk, 'RubricCategoryFk');
							return $q.when(result);
						}));

					}

				}

				function validatePrjDocumentTypeFk(entity,value) {
					if(value){
						var validateResult = {
							apply: true,
							valid: true
						};
						platformDataValidationService.finishValidation(validateResult, entity, value, 'PrjDocumentTypeFk', service, documentsProjectDocumentDataService);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, 'PrjDocumentTypeFk');
						commonValidation();
						return validateResult;
					}else{
						if(value===0 || _.isNil(value)){
							entity.PrjDocumentTypeFk = null;
							isMandatory(entity, entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk');
						}
					}
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
				service.validateDocumentCategoryFkFromWizard = function (item, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(item, value, model, documentsProjectDocumentDataService);
					asyncMarker.myPromise = setDocumentTypeFk(item, value).then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, item, value, model, asyncMarker, service, documentsProjectDocumentDataService);
					});
					return asyncMarker.myPromise;
				};

				function setDocumentTypeFk(entity, PrjDocumentTypeFk) {
					if (angular.isUndefined(PrjDocumentTypeFk) || PrjDocumentTypeFk === null || PrjDocumentTypeFk === -1) {
						let result = {apply: true, valid: true};
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'PrjDocumentTypeFk'});
						return $q.when(result);
					}
					return $q.when($http.get(globals.webApiBaseUrl + 'documents/projectdocument/GetDocumentTypeByDocumentCategory?category=' + PrjDocumentTypeFk).then((response) => {
						if (response.data) {
							entity.PrjDocumentTypeFk = response.data.Id;
							isMandatory(entity,entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk');
							let result = {apply: true, valid: true};
							return $q.when(result);
						}else{
							entity.PrjDocumentTypeFk = null;
							let result = {apply: true, valid: false};
							let documentTypeEntity =_.find(basicsLookupdataLookupDescriptorService.getData('projectdocumenttypelookup'),{IsDefault:true,IsLive:true});
							if(!_.isNil(documentTypeEntity)){
								entity.PrjDocumentTypeFk = documentTypeEntity.Id;
							}
							if(!_.isNil(entity.PrjDocumentTypeFk)) {
								result.valid = true;
							}else {
								isMandatoryValidation(entity, entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk');
							}
							return $q.when(result);
						}
					}));
				}

				service.cancelValidate=(entity)=>{
					let result = {apply: true, valid: true};
					platformDataValidationService.finishValidation(result, entity, entity.PrjDocumentTypeFk, 'PrjDocumentTypeFk', service, documentsProjectDocumentDataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrjDocumentTypeFk');

					platformDataValidationService.finishValidation(result, entity, entity.PrjDocumentCategoryFk, 'PrjDocumentCategoryFk', service, documentsProjectDocumentDataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrjDocumentCategoryFk');

					platformDataValidationService.finishValidation(result, entity, entity.RubricCategoryFk, 'RubricCategoryFk', service, documentsProjectDocumentDataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'RubricCategoryFk');

					let modState = platformModuleStateService.state(documentsProjectDocumentDataService.getModule());
					modState.validation.issues = [];
				};
				return service;
			}
		]);

})(angular);
