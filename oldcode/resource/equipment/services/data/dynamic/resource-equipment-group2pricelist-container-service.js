(function (angular) {
	'use strict';
	var equipmentModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroup2pricelistContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	equipmentModule.service('resourceEquipmentGroup2pricelistContainerService', ResourceEquipmentGroup2pricelistContainerService);

	ResourceEquipmentGroup2pricelistContainerService.$inject = ['platformDynamicContainerServiceFactory', 'resourceEquipmentGroup2pricelistDataServiceFactory'];

	function ResourceEquipmentGroup2pricelistContainerService(platformDynamicContainerServiceFactory, resourceEquipmentGroup2pricelistDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Resource.Equipment', resourceEquipmentGroup2pricelistDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Resource.Equipment', resourceEquipmentGroup2pricelistDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);