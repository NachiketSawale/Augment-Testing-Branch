/**
 * Created by reimer on 04.06.2019.
 */

(function (angular) {

	/* global globals, angular */
	'use strict';
	var moduleName = 'basics.dependentdata';

	angular.module(moduleName).factory('basicsDependentDataValidationService', ['platformDataValidationService',
		'platformRuntimeDataService',
		'basicsDependentDataMainService',
		'basicsDependentDataColumnService',
		'$translate',
		'_',
		function (platformDataValidationService, platformRuntimeDataService, dataService, basicsDependentDataColumnService, $translate, _) {

			var service = {};

			service.validateIsCompanyContext = function (entity, value, model) {
				var colName = 'BAS_COMPANY_FK';
				return validateContext(entity, value, model, colName);
			};

			service.validateIsUserContext = function (entity, value, model) {
				var colName = 'FRM_USER_FK';
				return validateContext(entity, value, model, colName);
			};

			service.validateIsProjectContext = function (entity, value, model) {
				var colName = 'PRJ_PROJECT_FK';
				return validateContext(entity, value, model, colName);
			};

			service.validateIsEstimateContext = function (entity, value, model) {
				var colName = 'EST_HEADER_FK';
				return validateContext(entity, value, model, colName);
			};

			service.validateIsModelContext = function (entity, value, model) {
				var colName = 'MDL_MODEL_FK';
				return validateContext(entity, value, model, colName);
			};

			service.validateBoundContainerUuid=function(entity, value, model){
				platformRuntimeDataService.readonly(entity, [{field: 'BoundContainerUuid', readonly: !entity.ModuleFk}]);
			};

			service.validateModuleFk=function(entity, value, model){
				platformRuntimeDataService.readonly(entity, [{field: 'BoundContainerUuid', readonly: !value}]);
			};

			function validateContext(entity, value, model, colName) {

				var valid;
				if (value === false)
				{
					valid = true;
				}
				else
				{
					var found = _.find(basicsDependentDataColumnService.getList(), { DatabaseColumn: colName });
					valid = angular.isDefined(found);
				}

				var result = {
					apply: true,   // angular.isDefined(found),
					valid: valid,
					error: $translate.instant('basics.dependentdata.viewMustContainColumn', {fieldName: colName})
				};

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				// dataService.fireItemModified(entity);
				return result;
			}

			return service;
		}
	]);

})(angular);

