/**
 * Created by lvi on 1/14/2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonPrcItemValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module('platform').factory('formConfigValidationService', ['basicsMaterialCatalogDiscountGroupService', 'platformDataValidationService',
		// TODO code review: platformValidationUtil should follow naming conventing.
		function (dataService, platformDataValidationService) {
			var service = {};
			service.codeValidator = function (entity, value, model) {
				// return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
			};
			return service;
		}
	]);
})(angular);
