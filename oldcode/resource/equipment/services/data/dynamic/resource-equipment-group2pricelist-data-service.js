(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	var equipmentModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroup2pricelistDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	equipmentModule.service('resourceEquipmentGroup2pricelistDataServiceFactory', ResourceEquipmentGroup2pricelistDataServiceFactory);

	ResourceEquipmentGroup2pricelistDataServiceFactory.$inject = ['platformDynamicDataServiceFactory', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentGroup2pricelistDataServiceFactory(platformDynamicDataServiceFactory, resourceEquipmentPlantDataService) {
		let instances = {};

		this.createDataService = function createDataService(templInfo) {
			var moduleInfo = {
				instance: equipmentModule,
				name: 'Resource.Equipment',
				postFix: 'Group2pricelistDataService',
				translationKey: 'resource.equipment.card',
				readEndPoint: 'getbyplantgroup',
				parentService: resourceEquipmentPlantDataService,
				filterName: 'PlantGroupFK',
				itemName: 'JobCardOfJob',
				parentSRelationProb : 'PlantGroupFk'
			};

			var dsName = platformDynamicDataServiceFactory.getDataServiceName(templInfo, moduleInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = platformDynamicDataServiceFactory.createDataService(templInfo, moduleInfo);
				instances[dsName] = srv;
			}

			return srv;
		};
	}
})(angular);