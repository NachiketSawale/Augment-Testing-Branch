/**
 * Created by xsi on 2015-12-23.
 */

(function(angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterWicValidationService',
		['$translate',
			'$http',
			'$q',
			'constructionSystemMasterWicService',
			'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService',
			'platformDataValidationService',
			function ($translate, $http, $q, constructionSystemMasterWicService, basicsLookupdataLookupDescriptorService,platformRuntimeDataService,platformDataValidationService) {
				var service = {};
				angular.extend(service,
					{
						validateCode: validateCode,
						validateBoqItemFk: validateBoqItemFk,
						validateBoqWicCatBoqFk:validateBoqWicCatBoqFk
					});

				return service;

				function validateCode(entity, value, model) {
					var result = { apply: true, valid: true };
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
					} else {
						var list = constructionSystemMasterWicService.getList();

						if (Array.isArray(list)) {
							result.valid = !list.some(function (item) {
								return (item.Code === value && item.Id !== entity.Id);
							});
						}

						if (!result.valid) {
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', { object: model });
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
					}
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}

				function validateBoqItemFk(entity, value,model) {
					var selectedBoqItem = basicsLookupdataLookupDescriptorService.getLookupItem('BoqItemFk', value);
					var result = { apply: true, valid: true };
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
					}
					constructionSystemMasterWicService.getBoqWicCatBoqFk(selectedBoqItem, function (boqItem) {
						validateBoqWicCatBoqFk(entity, boqItem.BoqWicCatBoqFk, 'BoqWicCatBoqFk');
						constructionSystemMasterWicService.fireItemModified(entity);
					});

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
				}

				function validateBoqWicCatBoqFk(entity, value, model) {
					var result = { apply: true, valid: true };
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterWicService);
				}
			}]);

})(angular);
