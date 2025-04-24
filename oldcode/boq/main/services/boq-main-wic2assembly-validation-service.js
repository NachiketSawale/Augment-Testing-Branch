/**
 * Created by mov on 4/24/2017.
 */

(function () {
	/* global _ */ 
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqWicGroupValidationService
	 * @description provides validation methods for boq wic2 assembly entities
	 */
	angular.module(moduleName).factory('boqMainWic2AssemblyValidationService', [
		'platformDataValidationService', 'platformRuntimeDataService', 'boqMainWic2AssemblyService', 'platformModuleStateService',
		function (platformDataValidationService, platformRuntimeDataService, boqMainWic2AssemblyService, platformModuleStateService) {

			var service = {};

			angular.extend(service, {
				validateEstLineItemFk: validateEstLineItemFk,
				removeEstLineItemFkFromErrorList: removeEstLineItemFkFromErrorList,
				removeEstLineItemFkFromErrorsList: removeEstLineItemFkFromErrorsList
			});

			function validateEstLineItemFk(entity, value, model) {
				entity[model] = value;
				var result = platformDataValidationService.isMandatory(value, model);
				if (result.valid) {
					var list = boqMainWic2AssemblyService.getList();
					var items = _.filter(list, {BoqItemFk: entity.BoqItemFk, EstLineItemFk: value});
					result.valid = _.size(items) === 1;
					if (!result.valid) {
						result.apply = true;
						result.error$tr$ = moduleName + '.uniqCode';
					}
				}
				return platformDataValidationService.finishValidation(result, entity, value, model, service, boqMainWic2AssemblyService);
			}

			function removeEstLineItemFkFromErrorList(entity) {
				var model = 'EstLineItemFk';
				platformDataValidationService.removeFromErrorList(entity, model, service, boqMainWic2AssemblyService);
				platformRuntimeDataService.applyValidationResult(true, entity, model);
			}

			function removeEstLineItemFkFromErrorsList() {
				if (platformDataValidationService.hasErrors(boqMainWic2AssemblyService)) {
					var model = 'EstLineItemFk';
					var modState = platformModuleStateService.state(boqMainWic2AssemblyService.getModule());
					modState.validation.issues = _.filter(modState.validation.issues, function (item) {
						if (item.model === model) {
							var entitiesToSave = modState.modifications.BoqMainWic2AssemblyToSave;
							if (entitiesToSave && entitiesToSave.length > 0) {
								var index = _.findIndex(entitiesToSave, {Id: item.entity.Id});
								if (index > -1) {
									entitiesToSave.splice(index, 1);
									modState.modifications.EntitiesCount -= 1;
								}
							}
							return false;
						} else {
							return item;
						}
					});
				}
			}

			return service;
		}
	]);

})();