(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterActivityTemplateValidationService',
		['$translate',
			'$http',
			'$q',
			'constructionSystemMasterActivityTemplateService',
			'basicsLookupdataLookupDescriptorService', 'platformDataValidationService',
			function (
				$translate,
				$http,
				$q,
				constructionSystemMasterActivityTemplateService,
				basicsLookupdataLookupDescriptorService, platformDataValidationService) {

				var service = {},
					httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/activitytemplate/validate';

				angular.extend(service,
					{
						validateCode: validateCode,
						codeValidateHttpService: codeValidateHttpService,
						validateActivityTemplateFk: validateActivityTemplateFk
					});

				var onEntityCreated = function onEntityCreated(e, item) {
					service.validateCode(item, item.Code, 'Code');
					service.validateActivityTemplateFk(item, item.ActivityTemplateFk, 'ActivityTemplateFk');
				};

				constructionSystemMasterActivityTemplateService.registerEntityCreated(onEntityCreated);

				return service;

				function validateActivityTemplateFk(entity, value, model) {
					var result = {apply: true, valid: true};
					var activityTemplate = _.find(basicsLookupdataLookupDescriptorService.getData('activitytemplatefk'), {Id: value});
					entity.ActivityTemplateFk = value;
					entity.ActivityTemplate = activityTemplate;
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterActivityTemplateService);
					return result;
				}

				function validateCode(entity, value, model) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					} else {
						var list = constructionSystemMasterActivityTemplateService.getList();

						if (Array.isArray(list)) {
							result.valid = !list.some(function (item) {
								return (item.Code === value && item.Id !== entity.Id);
							});
						}

						if (!result.valid) {
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
						}
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterActivityTemplateService);
					return result;
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}


				function codeValidateHttpService(postData) {
					var validateResult = {apply: true, valid: true};
					return $http.post(httpRoute, postData).then(
						function (result) {
							if (!result.data) {
								validateResult.valid = false;
								validateResult.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: postData.Model});
							} else {
								validateResult.valid = true;
							}

							return validateResult;
						});
				}
			}]);

})(angular);