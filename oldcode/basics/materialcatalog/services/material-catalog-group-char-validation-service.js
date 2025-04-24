(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module('basics.materialcatalog').factory('basicsMaterialCatalogGroupCharValidationService',
		['basicsMaterialCatalogGroupCharService', 'platformDataValidationService',
			function (dataService, platformDataValidationService) {
				var service = {};

				service.validateProperty = function (entity, value, model) {
					return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, true);
				};

				return service;
			}
		]);
})(angular);
