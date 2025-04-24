/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEuroListValidationService
	 * @description provides validation methods for resource equipmentGroup euroList entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupEuroListValidationService', ResourceEquipmentGroupEuroListValidationService);

	ResourceEquipmentGroupEuroListValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentGroupEuroListDataService'];

	function ResourceEquipmentGroupEuroListValidationService(platformValidationServiceFactory, resourceEquipmentGroupEuroListDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'EquipmentGroupEurolistDto',
				moduleSubModule: 'Resource.EquipmentGroup'
			}, {
				mandatory: ['Code', 'CatalogFk'],
				uniques: ['Code']
			},
			self,
			resourceEquipmentGroupEuroListDataService);
	}

})(angular);
