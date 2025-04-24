/*
 * Created by alm on 18.11.2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).factory('controllingRevenueRecognitionItemE2cValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'controllingRevenueRecognitionE2cItemService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};

			service.validateTotalCost = function (entity, value /* , model */) {
				entity.TotalCost = value;
				dataService.calculateItem(entity);
				dataService.calcParentChain(entity);
				return true;
			};

			return service;
		}
	]);
})(angular);
