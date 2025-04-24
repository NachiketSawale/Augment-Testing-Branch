/**
 * Created by xsi on 2016-03-29.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceValidationService',
		['$translate', '$injector',
			'$q',
			'$http',
			'constructionSystemMainInstanceService',
			'platformRuntimeDataService',
			'constructionSystemMainValidationEnhanceService',
			'platformDataValidationService',
			'constructionSystemMainObjectTemplateDataService',
			function ($translate, $injector,$q,$http,dataService,platformRuntimeDataService,constructionSystemMainValidationEnhanceService,platformDataValidationService,constructionSystemMainObjectTemplateDataService) {
				var service = {},
					httpRoute = globals.webApiBaseUrl + 'constructionsystem/main/instance/validate';

				angular.extend(service,
					{
						validateCode: validateCode,
						asyncValidateCode: asyncValidateCode,
						validateCosTemplateFk: validateCosTemplateFk,
						validateIsChecked: validateIsChecked,
						validateIsUserModified: validateIsUserModified
					});

				constructionSystemMainValidationEnhanceService.extendValidate(service, {
					typeName: 'InstanceDto',
					moduleSubModule: 'ConstructionSystem.Main',
					ignoreValidateField: ['IsChecked', 'Status','IsUserModified']
				});

				return service;

				function validateIsChecked(entity, value) {
					entity.IsChecked = value;
					dataService.syncModelViewWithCheckedInstances();
				}
				function validateIsUserModified(entity, value) {
					entity.IsUserModified = value;
					$injector.get('constructionsystemMainLineItemService').canDelete();
				}

				function validateCode(entity, value, model) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						// check the list
						var items = _.filter(dataService.getList(), function (item) {
							return value === item.Code && item.Id !== entity.Id;
						});
						if (items.length && items.length > 0) {
							result.apply = false;
							result.valid = false;
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						}

						return result;
					}
				}

				function asyncValidateCode(entity, value, model) {
					var result = {apply: true, valid: true};
					var postData = {
						ValidateDto: entity,
						Value: value,
						Model: model
					};
					// We use standard async request validate,codeValidateHttpService execute after dataServer.update sometimes,it can't stop update request when validate failure.
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = $http.post(httpRoute, postData).then(function (response) {
						if (!response.data) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage');
						} else {
							result.valid = true;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				}

				// noinspection JSUnusedLocalSymbols
				function validateCosTemplateFk(entity, value) {
					var postData = {
						MasterTemplateId: -1,
						InstanceId: entity.Id,
						MasterId: entity.HeaderFk,
						InsHeaderId: entity.InstanceHeaderFk
					};
					if (value) {
						postData.MasterTemplateId = value;
					}
					constructionSystemMainObjectTemplateDataService.updateObjectTemplateByInsTemplateId(postData);
					dataService.templateChangedMessenger.fire(null, {entity: entity, templateId: value});
					return {apply: true, valid: true};
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}

			}]);

})(angular);
