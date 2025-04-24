/**
 * Created by wui on 10/17/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeItemTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService',
			function (platformDataValidationService, platformRuntimeDataService) {
				return function (dataService) {
					var service = {};

					//validators
					service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
						var result = platformDataValidationService.isUnique(dataService.getList(), 'PrcTexttypeFk', value, entity.Id);
						if (result.valid) {
							entity.PrcTexttypeFk = value;
						}

						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};

					service.validateEntity = function (entity) {
						var result = service.validatePrcTexttypeFk(entity, entity.PrcTexttypeFk, 'PrcTexttypeFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTexttypeFk');
						dataService.gridRefresh();
					};

					//noinspection JSUnusedLocalSymbols
					/*function onEntityCreated(e, item) {
                        service.validateEntity(item);
                    }*/

					// dataService.registerEntityCreated(onEntityCreated);

					return service;
				};
			}
		]);

})(angular);