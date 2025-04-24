(function (angular) {
	'use strict';
	var equipmentModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroup2controllingunitContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	equipmentModule.service('resourceEquipmentGroup2controllingunitContainerService', ResourceEquipmentGroup2controllingunitContainerService);

	ResourceEquipmentGroup2controllingunitContainerService.$inject = ['platformDynamicContainerServiceFactory', 'resourceEquipmentGroup2controllingunitDataServiceFactory'];

	function ResourceEquipmentGroup2controllingunitContainerService(platformDynamicContainerServiceFactory, resourceEquipmentGroup2controllingunitDataServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareGridConfig('Resource.Equipment', resourceEquipmentGroup2controllingunitDataServiceFactory, containerUid, scope, moduleCIS);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS) {
			platformDynamicContainerServiceFactory.prepareDetailConfig('Resource.Equipment', resourceEquipmentGroup2controllingunitDataServiceFactory, containerUid, scope, moduleCIS);
		};
	}
})(angular);