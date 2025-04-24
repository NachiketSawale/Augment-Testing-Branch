(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterHeaderValidationService',
		['$translate',
			'$q',
			'$http',
			'constructionSystemMasterHeaderService',
			'platformRuntimeDataService',
			'platformDataValidationService',
			'constructionSystemMasterGroupService',
			function ($translate,
				$q,
				$http,
				dataService,
				platformRuntimeDataService,
				platformDataValidationService,
				masterGroupService) {
				var service = {},
					httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/header/validate';

				angular.extend(service,
					{
						validateCode: validateCode,
						asyncValidateCode: asyncValidateCode,
						asyncValidateCosGroupFk:asyncValidateCosGroupFk,
						validateDescriptionInfoForBulkConfig:validateDescriptionInfoForBulkConfig
					});

				service.validateBasFormFk = function (entity, value) {
					entity.BasFormFk = value;
					dataService.headerValidateComplete.fire();
					return true;
				};

				return service;

				function findRootGroupId(groupEntity, groupList) {
					if (!groupEntity.CosGroupFk) {
						return groupEntity.Id;
					}
					var parentEntity = _.find(groupList, {Id: groupEntity.CosGroupFk});
					return findRootGroupId(parentEntity, groupList);
				}

				function validateCode(entity, value, model) {
					var result = { apply: true, valid: true };
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					} else {
						// check the selected list, mainly for the Multi selected,can not set same code for Multi entity
						var selectedEntities = dataService.getSelectedEntities();
						if (selectedEntities !== null && selectedEntities.length > 1) {
							var groupList = masterGroupService.getList();
							// get root group id
							_.forEach(selectedEntities, function(item) {
								if (!item.rootGroupId) {
									var groupEntity = _.find(groupList, {Id: item.CosGroupFk});
									item.rootGroupId =  findRootGroupId(groupEntity, groupList);
								}
							});
							var items = _.filter(selectedEntities, function (item) {
								return value === item.Code && item.Id !== entity.Id && item.rootGroupId === entity.rootGroupId;
							});
							if (items.length && items.length > 0) {
								result.apply = true;
								result.valid = false;
								result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							}
						}
						return result;
					}
				}

				function asyncValidateCode (entity, value, model) {
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
							result.error = $translate.instant('constructionsystem.master.uniqueInSameGroupRoot');
						} else {
							result.valid = true;
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformRuntimeDataService.applyValidationResult(result, entity, 'CosGroupFk');
						platformDataValidationService.finishValidation(result, entity, entity.CosGroupFk, 'CosGroupFk', service, dataService);
						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				}

				function asyncValidateCosGroupFk (entity, value) {
					entity.CosGroupFk = value;
					var asyncPromise = asyncValidateCode(entity, entity.Code, 'Code');
					return asyncPromise;
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}

				function validateDescriptionInfoForBulkConfig(entity, value, model) {
					let result = {apply: true, valid: true};
					if (value && typeof value === 'object' && value.length > 255) {
						result.apply = true;
						result.valid = false;
						result.error = $translate.instant('cloud.common.lengthShouldBeLessThen', {length: 255});
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}
					return result;
				}

				/**
				 * @ngdoc service
				 * @name codeValidateHttpService
				 * @description
				 * postData = {Id: Id,
				 * HeaderDto: HeaderDto,
					Value: value,
					Model: model };
				 */
				// eslint-disable-next-line no-unused-vars
				function codeValidateHttpService(postData) {
					var validateResult = { apply: true, valid: true };
					return $http.post(httpRoute, postData).then(
						function (result) {
							if (!result.data) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('constructionsystem.master.uniqueInSameGroupRoot');
							} else {
								validateResult.valid = true;
							}

							return validateResult;
						});
				}


			}]);

})(angular);