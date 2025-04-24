/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListModelObjectValidationService
	 */
	angular.module(moduleName).factory('hsqeCheckListModelObjectValidationService', ['$translate', '_', '$injector',
		'hsqeCheckListModelObjectDataService', 'platformDataValidationService', 'platformRuntimeDataService',
		function ($translate, _, $injector, dataService, platformDataValidationService, platformRuntimeDataService) {
			var service = {};

			dataService.registerEntityCreated(onEntityCreated);

			function onEntityCreated(e, item) {
				service.validateModelFk(item, item.ModelFk, 'ModelFk');
				service.validateObjectFk(item, item.ObjectFk, 'ObjectFk');
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

			service.validateModelFk = function validateModelFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model, {fieldName: model});
				if (result.valid === true && value === 0) {
					result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage',
						{fieldName: $translate.instant('hsqe.checklist.modelobject.model')});
				} else {
					entity.ModelFk = value;
					entity.ObjectFk = null;
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				dataService.fireItemModified(entity);
				return result;
			};

			service.validateObjectFk = function validateObjectFk(entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, model, {fieldName: model});
				if (result.valid === true && value === 0) {
					result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage',
						{fieldName: $translate.instant('hsqe.checklist.modelobject.modelObject')});
				}
				var list = dataService.getList();
				var item = _.find(list, {ObjectFk: value});
				if (item) {
					result = createErrorObject('hsqe.checklist.modelobject.objectErrorMessage',
						{fieldName: $translate.instant('hsqe.checklist.modelobject.modelObject')});
				}
				var parentService = $injector.get('hsqeCheckListDataService');
				if (parentService.ModelObjects && parentService.ModelObjects.length > 0) {
					var modelObjectItem = _.find(parentService.ModelObjects, {Id: value});
					if (modelObjectItem) {
						entity.MeshId = modelObjectItem.MeshId;
						entity.CpiId = modelObjectItem.CpiId;
						entity.IsComposite = modelObjectItem.IsComposite;
						entity.CadIdInt = modelObjectItem.CadIdInt;
						entity.LocationFk = modelObjectItem.LocationFk;
					}
				} else {
					parentService.getModelObjects();
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};
			return service;
		}
	]);
})(angular);
