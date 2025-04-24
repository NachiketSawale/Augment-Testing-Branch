/**
 * Created by pel on 3/22/2019.
 */

(function (angular) {
	'use strict';
	/* global angular */
	/* global _ */
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfigurationRfqDocumentsValidationService',
		['platformDataValidationService', 'basicsProcurementConfigurationRfqDocumentsService', 'platformRuntimeDataService', '$translate', 'basicsLookupdataLookupDescriptorService',
			function (platformDataValidationService, rfqDocumentService, platformRuntimeDataService, $translate, basicsLookupdataLookupDescriptorService) {
				var service = {};
				var self = this;

				var procurement_rubricCategoryList = [23, 24, 25, 26, 27, 28, 31,106];//
				var sales_rubricCategoryList = [4, 5, 7, 17];//
				var project_rubricCategoryList = [3];//
				var clerk_rubricCategoryList = [80];//

				service.validateBasRubricFk = function validateBasRubricFk(entity, value) {
					if (value <= 0) {
						var result1 = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'BasRubricFk'});
						return platformDataValidationService.finishValidation(result1, entity, value, 'BasRubricFk', self, rfqDocumentService);
					}

					if (procurement_rubricCategoryList.indexOf(value) > -1) { //procurement
						entity.PrcDocumenttypeFk = setReadonlyAndReturnDefault(entity, true, false, true, true);
						if (entity.PrcDocumenttypeFk === null || entity.PrcDocumenttypeFk === 0) {
							var result2 = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'PrcDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result2, entity, 'PrcDocumenttypeFk');
							platformDataValidationService.finishValidation(result2, entity, value, 'PrcDocumenttypeFk', self, rfqDocumentService);
						}
					} else if (project_rubricCategoryList.indexOf(value) > -1) { //project
						entity.PrjDocumenttypeFk = setReadonlyAndReturnDefault(entity, true, true, false, true);
						if (entity.PrjDocumenttypeFk === null || entity.PrjDocumenttypeFk === 0) {
							var result3 = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'PrjDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result3, entity, 'PrjDocumenttypeFk');
							platformDataValidationService.finishValidation(result3, entity, value, 'PrjDocumenttypeFk', self, rfqDocumentService);
						}
					} else if (clerk_rubricCategoryList.indexOf(value) > -1) //clerk
					{
						entity.BasClerkdocumenttypeFk = setReadonlyAndReturnDefault(entity, false, true, true, true);
						if (entity.BasClerkdocumenttypeFk === null || entity.BasClerkdocumenttypeFk === 0) {
							var result4 = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'BasClerkdocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result4, entity, 'BasClerkdocumenttypeFk');
							platformDataValidationService.finishValidation(result4, entity, value, 'BasClerkdocumenttypeFk', self, rfqDocumentService);
						}
					} else if (sales_rubricCategoryList.indexOf(value) > -1) //sales
					{
						entity.SlsDocumenttypeFk = setReadonlyAndReturnDefault(entity, true, true, true, false);
						if (entity.SlsDocumenttypeFk === null || entity.SlsDocumenttypeFk === 0) {
							var result5 = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'SlsDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result5, entity, 'SlsDocumenttypeFk');
							platformDataValidationService.finishValidation(result5, entity, value, 'SlsDocumenttypeFk', self, rfqDocumentService);
						}
					}

					rfqDocumentService.fireItemModified(entity);
					if (value > 0) {
						platformRuntimeDataService.applyValidationResult(true, entity, 'BasRubricFk');
						return platformDataValidationService.finishValidation(true, entity, value, 'BasRubricFk', self, rfqDocumentService);
					}
					return true;
				};

				function setReadonlyAndReturnDefault(entity, clerk_Readonly, prc_Readonly, prj_Readonly, sales_Readonly) {
					var docTypes = [];
					if (clerk_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'BasClerkdocumenttypeFk', readonly: true}]);
						entity.BasClerkdocumenttypeFk = null;
						platformRuntimeDataService.applyValidationResult(true, entity, 'BasClerkdocumenttypeFk');
					}
					if (prc_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrcDocumenttypeFk', readonly: true}]);
						entity.PrcDocumenttypeFk = null;
						platformRuntimeDataService.applyValidationResult(true, entity, 'PrcDocumenttypeFk');
					}
					if (prj_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrjDocumenttypeFk', readonly: true}]);
						entity.PrjDocumenttypeFk = null;
						platformRuntimeDataService.applyValidationResult(true, entity, 'PrjDocumenttypeFk');
					}
					if (sales_Readonly) {
						platformRuntimeDataService.readonly(entity, [{field: 'SlsDocumenttypeFk', readonly: true}]);
						entity.SlsDocumenttypeFk = null;
						platformRuntimeDataService.applyValidationResult(true, entity, 'SlsDocumenttypeFk');
					}


					if (!clerk_Readonly) {
						docTypes = basicsLookupdataLookupDescriptorService.getData('clerkdocumenttype');
						platformRuntimeDataService.readonly(entity, [{field: 'BasClerkdocumenttypeFk', readonly: false}]);
					}
					if (!prc_Readonly) {
						docTypes = basicsLookupdataLookupDescriptorService.getData('prcdocumenttype');
						platformRuntimeDataService.readonly(entity, [{field: 'PrcDocumenttypeFk', readonly: false}]);
					}
					if (!prj_Readonly) {
						docTypes = basicsLookupdataLookupDescriptorService.getData('prjdocumenttype');
						platformRuntimeDataService.readonly(entity, [{field: 'PrjDocumenttypeFk', readonly: false}]);
					}
					if (!sales_Readonly) {
						docTypes = basicsLookupdataLookupDescriptorService.getData('slsdocumenttype');
						platformRuntimeDataService.readonly(entity, [{field: 'SlsDocumenttypeFk', readonly: false}]);
					}

					if (docTypes !== null && docTypes !== undefined) {
						var defaultType = docTypes[1];
						_.forEach(docTypes, function (item) {
							if (item.IsDefault === true) {
								defaultType = item;
							}
						});
						if (defaultType !== null && defaultType !== undefined) {
							return defaultType.Id;
						}
					}
				}


				service.validatePrjDocumenttypeFk = function validatePrjDocumenttypeFk(entity, value) {
					if (value > 0) {
						return platformDataValidationService.validateMandatory(entity, value, 'PrjDocumenttypeFk', self, rfqDocumentService);
					} else {
						if (project_rubricCategoryList.indexOf(value) > -1) { //project
							var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'PrjDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result, entity, 'PrjDocumenttypeFk');
							return platformDataValidationService.finishValidation(result, entity, value, 'PrjDocumenttypeFk', self, rfqDocumentService);
						}
					}
					rfqDocumentService.fireItemModified(entity);
					return true;
				};

				service.validateBasClerkdocumenttypeFk = function validateBasClerkdocumenttypeFk(entity, value) {
					if (value > 0) {
						return platformDataValidationService.validateMandatory(entity, value, 'BasClerkdocumenttypeFk', self, rfqDocumentService);
					} else {
						if (clerk_rubricCategoryList.indexOf(value) > -1) {//clerk
							var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'BasClerkdocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result, entity, 'BasClerkdocumenttypeFk');
							return platformDataValidationService.finishValidation(result, entity, value, 'BasClerkdocumenttypeFk', self, rfqDocumentService);
						}
					}
					rfqDocumentService.fireItemModified(entity);
					return true;
				};

				service.validatePrcDocumenttypeFk = function validatePrcDocumenttypeFk(entity, value) {
					if (value > 0) {
						return platformDataValidationService.validateMandatory(entity, value, 'PrcDocumenttypeFk', self, rfqDocumentService);
					} else {
						if (procurement_rubricCategoryList.indexOf(value) > -1) { //procurement
							var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'PrcDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result, entity, 'PrcDocumenttypeFk');
							return platformDataValidationService.finishValidation(result, entity, value, 'PrcDocumenttypeFk', self, rfqDocumentService);
						}
					}
					rfqDocumentService.fireItemModified(entity);
					return true;
				};

				service.validateSlsDocumenttypeFk = function validateSlsDocumenttypeFk(entity, value) {
					if (value > 0) {
						return platformDataValidationService.validateMandatory(entity, value, 'SlsDocumenttypeFk', self, rfqDocumentService);
					} else {
						if (sales_rubricCategoryList.indexOf(value) > -1) {//sales
							var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'SlsDocumenttypeFk'});
							platformRuntimeDataService.applyValidationResult(result, entity, 'SlsDocumenttypeFk');
							return platformDataValidationService.finishValidation(result, entity, value, 'SlsDocumenttypeFk', self, rfqDocumentService);
						}
					}
					rfqDocumentService.fireItemModified(entity);
					return true;
				};

				service.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
					rfqDocumentService.fireItemModified(entity);
				};
				return service;

			}]);
})(angular);