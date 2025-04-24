/**
 * @author: chd
 * @date: 6/29/2021 5:50 PM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	/**
	 * @ngdoc service
	 * @name mtwoAIConfigurationHeaderValidationService
	 * @description provides validation methods for a Model
	 */
	angular.module(moduleName).factory('mtwoAIConfigurationHeaderValidationService',
		['_', '$translate', '$q', '$http', 'mtwoAIConfigurationModelListDataService', 'platformDataValidationService', 'platformRuntimeDataService',
			function (_, $translate, $q, $http, mtwoAIConfigurationModelListDataService, platformDataValidationService, platformRuntimeDataService) {
				let service = {};
				let self = this;

				service.asyncValidateCode = asyncValidateCode;

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
					let defer = $q.defer();
					let fieldName = model === 'Code' ? $translate.instant('cloud.common.entityReferenceCode') : 'Reference Code';
					let result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true) {
						$http.get(globals.webApiBaseUrl + 'mtwo/aiconfiguration/model/isunique' + '?id=' + entity.Id + '&code=' + value).then(function (response) {
							let fieldName = $translate.instant('cloud.common.entityReferenceCode');
							if (!response.data) {
								result = createErrorObject('mtwo.aiconfiguration.uniqueValueErrorMessage', {object: fieldName});
							}
							platformDataValidationService.finishValidation(result, entity, value, model, service, mtwoAIConfigurationModelListDataService);
							defer.resolve(result);
						});

					} else {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
						platformDataValidationService.finishValidation(result, entity, value, model, service, mtwoAIConfigurationModelListDataService);
						defer.resolve(result);
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

				return service;
			}
		]);

})(angular);


