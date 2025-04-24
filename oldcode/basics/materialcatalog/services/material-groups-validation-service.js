(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsMaterialCatalogMaterialGroupValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module('basics.materialcatalog').factory('basicsMaterialCatalogMaterialGroupValidationService', ['validationService',
		'basicsMaterialCatalogMaterialGroupService', 'platformDataValidationService',
		function (validationService, dataService, platformDataValidationService) {
			var service = validationService.create('materialGroupsItem', 'basics/materialcatalog/group/schema');

			service.validateCode = function (entity, value, model) {
				var result =  platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};
			
			service.validateEntity = function (entity) {
				service.validateCode(entity, entity.Code, 'Code');
			};

			function onEntityCreated(e, item) {
				service.validateEntity(item);
			}

			dataService.registerEntityCreated(onEntityCreated);
			return service;
		}
	]);
})(angular);
