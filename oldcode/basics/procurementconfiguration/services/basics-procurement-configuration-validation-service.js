/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).factory('basicsProcurementConfigurationValidationService',
		['$translate','basicsProcurementConfigurationDataService','platformDataValidationService','platformRuntimeDataService','$q','$http',
			'basicsProcurementConfigurationRubricCategoryService',
			function ($translate,dataService,platformDataValidationService,platformRuntimeDataService,$q,$http,rubricCategoryService) {
				var service = {};

				var self = this;

				self.handleDefaultItem = function (entity) {
					var defaultItem = _.find(dataService.getList(), function (item) {
						return item.Id !== entity.Id && item.IsDefault && item.RubricCategoryFk === entity.RubricCategoryFk;
					});


					if (defaultItem && defaultItem.IsDefault) {
						defaultItem.IsDefault = false;
						dataService.markItemAsModified(defaultItem);
					}
				};

				service.validateIsDefault = function (entity, value) {
					if (value) {
						var currentItem = dataService.getSelected();
						if (currentItem && currentItem.Id !== entity.Id) {
							dataService.setSelected(entity).then(function () {
								self.handleDefaultItem(entity);
							});
						} else {
							self.handleDefaultItem(entity);
						}
					}

					return true;
				};

				service.validateDescriptionInfo = function (entity, value, model) {
					var fieldName = model === 'DescriptionInfo' ? $translate.instant('basics.procurementconfiguration.entityDescriptionInfo'):'Description';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});

					if(result.valid === true){
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, true);
						if (!result.valid) {
							result.error = result.error$tr$ = $translate.instant('basics.procurementconfiguration.entityDescriptionUniqueError');
						}else{
							var item = _.find(dataService.getList(), function (item) {
								var propertyValue=_.get(item,model);
								if(typeof propertyValue==='object'){
									propertyValue=_.get(item,'DescriptionInfo.Translated');
								}
								return propertyValue === value && item.Id !== entity.Id;
							});
							if(item) {
								result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',{object: 'description'});
							}else {
								result = platformDataValidationService.createSuccessObject();
							}
						}
					}else{
						result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, 'DescriptionInfo');

					return result;
				};

				function validateBaselineIntegration(entity, value, model){
					entity[model] = value;
					var itemList = dataService.getList();

					var result = {
						apply: true,
						valid: true
					};

					var assignedBaselineIntegrationItems = _.filter(itemList,function(item){
						return item.BaselineIntegration === true;
					});

					if(assignedBaselineIntegrationItems && assignedBaselineIntegrationItems.length > 1){
						result.valid = false;
						result.error = model.toLowerCase() + ' can be assigned only once in one module.';
						result.error$tr$='basics.procurementconfiguration.BaselineIntegrationAssignErrorMessage';
						result.error$tr$param$={object: model.toLowerCase()};
					}

					return result;
				}

				function validateBaselineIntegrationAssignedInOnceInModule(entity, value, model){
				// get list by rubric id and configuration header Id.
				// validate list sync and async
					var result = validateBaselineIntegration(entity, value, model);

					if (!result.valid) {
						var defer = $q.defer();
						defer.resolve(result);
						return defer.promise;
					} else {
						return validateAsyncBaselineIntegration(entity, value, model);
					}
				}

				function validateAsyncBaselineIntegration(entity, value, model){
					var errorResult = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.uniqueValueErrorMessage',
						error$tr$param$: {object: model.toLowerCase()}
					};
					var defer = $q.defer();
					var id = entity.Id || 0;
					var httpRoute = globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/isAssignedBaselineIntegrationInOnce';
					var rubricCategory =rubricCategoryService.getSelected();
					var rubricCategoryId = rubricCategory.Id;
					var configHeader = dataService.parentService().getSelected();
					var prcConfigHeaderId = configHeader.Id;

					var baselineIntegration = value;
					var url = httpRoute + '?id=' + id + '&prcConfigHeaderId=' + prcConfigHeaderId + '&rubricCategoryId=' + rubricCategoryId + '&baselineIntegration=' + baselineIntegration;

					$http.get(url).then(function (result) {
						if (!result.data) {
							defer.resolve(errorResult);
						} else {
							var successResult = {apply: true, valid: true, error: ''};
							defer.resolve(successResult);
						}
					});

					return defer.promise;
				}

				service.asyncValidateBaselineIntegration = function asyncValidateBaselineIntegration(entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = validateBaselineIntegrationAssignedInOnceInModule(entity, value, model).then(function (result) {
						var finalResult = platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						dataService.markItemAsModified(entity);
						return finalResult;
					});
					return asyncMarker.myPromise;
				};

				return service;

			}]);
})(angular);