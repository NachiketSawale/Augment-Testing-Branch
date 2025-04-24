(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module('basics.materialcatalog').factory('basicsMaterialCatalogDiscountGroupValidationService',
		['basicsMaterialCatalogDiscountGroupService', 'platformDataValidationService',

			function (dataService, platformDataValidationService) {
				var service = {};
				service.validateCode = function (entity, value, model) {
					return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
				};

				service.validateModel = function () {
					return true;
				};
				return service;
			}
		]);
})(angular);
