(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module('basics.materialcatalog').factory('basicsMaterialCatalogGroupCharValValidationService',
		['basicsMaterialCatalogGroupCharValService', 'platformDataValidationService',
			function (dataService, platformDataValidationService) {
				var service = {};

				service.validateCharacteristic = function (entity, value, model) {
					return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, true);
				};

				return service;
			}
		]);
})(angular);
