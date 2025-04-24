/**
 * Created by lvy on 6/7/2018.
 */
(function (angular) {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name constructionSystemMasterObjectTemplatePropertyValidationService
	 * @description provides validation methods for object template property
	 */
	var modulename = 'constructionsystem.master';

	angular.module(modulename).factory('constructionSystemMasterObjectTemplatePropertyValidationService',
		['$injector', 'platformDataValidationService', 'moment', 'platformRuntimeDataService', 'constructionSystemMasterObjectTemplatePropertyDataService','$translate', 'basicsLookupdataLookupDescriptorService',
			function ($injector, platformDataValidationService, moment, platformRuntimeDataService, dataService, $translate, basicsLookupdataLookupDescriptorService) {
				var service = {};

				service.validateMdlPropertyKeyFk = function (entity, value, model) {
					var result = { apply: true, valid: true };
					var keys = basicsLookupdataLookupDescriptorService.getData('modelAdministrationPropertyKeys');
					var item = keys ? _.find(keys, {Id: value}) : null;
					if (item) {
						entity.ValueType = item.ValueType;
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}
					else {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}
				};
				function resetValues(entity) {
					entity.PropertyValueLong = 0;
					entity.PropertyValueNumber = 0.0;
					entity.PropertyValueText = null;
					entity.PropertyValueDate = null;
					entity.PropertyValueBool = false;
				}
				service.validateValue = function (entity, value) {
					resetValues(entity);
					if (entity.ValueType === 4) {
						entity.PropertyValueBool = value;
					} else if (entity.ValueType === 3) {
						entity.PropertyValueLong = value;
					} else if (entity.ValueType === 2) {
						entity.PropertyValueNumber = value;
					} else if (entity.ValueType === 1) {
						entity.PropertyValueText = value;
					} else if (entity.ValueType === 5) {
						entity.PropertyValueDate = value;
					}
					return true;
				};
				return service;
			}
		]);
})(angular);