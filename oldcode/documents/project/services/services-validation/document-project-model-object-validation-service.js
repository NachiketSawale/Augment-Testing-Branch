/**
 * Created by alm on 07.10.2020.
 */

(function (angular) {

	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentsProjectModelObjectValidationService',
		['$translate', 'platformDataValidationService', 'platformRuntimeDataService','platformModuleStateService','documentsProjectDocumentModuleContext',
			function ($translate, platformDataValidationService, platformRuntimeDataService,platformModuleStateService,documentsProjectDocumentModuleContext) {

				function getService(dataService) {
					var service = {};

					dataService.registerEntityCreated(onEntityCreated);

					function onEntityCreated(e, item) {
						service.validateMdlModelFk(item, item.MdlModelFk, 'MdlModelFk');
						service.validateMdlObjectFk(item, item.MdlObjectFk, 'MdlObjectFk');
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

					function triggerLeadingServiceModifyItem(){
						var parentService = documentsProjectDocumentModuleContext.getConfig().parentService;
						if (parentService !== undefined) {
							var parentState = platformModuleStateService.state(parentService.getModule());
							if(parentState && parentState.modifications){
								parentState.modifications.EntitiesCount += 1;
							}
						}
					}

					service.validateMdlModelFk = function validateMdlModelFk(entity, value, model) {
						var result = platformDataValidationService.isMandatory(value, model, {fieldName: model});
						if (result.valid === true && value === 0) {
							result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('documents.project.entityModel')});
						} else {
							entity.MdlModelFk = value;
							entity.MdlObjectFk = null;
						}

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						dataService.fireItemModified(entity);
						triggerLeadingServiceModifyItem();
						return result;
					};

					service.validateMdlObjectFk = function validateMdlObjectFk(entity, value, model) {
						var result = platformDataValidationService.isMandatory(value, model, {fieldName: model});
						if (result.valid === true && value === 0) {
							result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('documents.project.entityModelObject')});
						}

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						triggerLeadingServiceModifyItem();
						return result;
					};
					return service;
				}

				return {
					getService: getService
				};
			}
		]);
})(angular);