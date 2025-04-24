(function (angular) {
	'use strict';

	var module = 'project.main';

	angular.module(module).service('resourceEquipmentLocationMapService', ResourceEquipmentLocationMapService);

	ResourceEquipmentLocationMapService.$inject = ['_', 'platformMultiAddressService', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentLocationMapService(_, platformMultiAddressService, resourceEquipmentPlantDataService) {
		var lineSep = '</br>';

		function formatLineForLocationMap(plant, field) {
			var value = _.get(plant, field);
			return value ? (value + lineSep) : '';
		}

		function formatPlantForLocationMap(plant) {
			var formattedString = formatLineForLocationMap(plant, 'Code');
			formattedString += formatLineForLocationMap(plant, 'DescriptionInfo.Translated');
			formattedString += formatLineForLocationMap(plant, 'SerialNumber');
			formattedString += formatLineForLocationMap(plant, 'MeterNo');
			formattedString += formatLineForLocationMap(plant, 'MeterDate');

			return formattedString;
		}

		function createPlantLocationMapInfo(plants) {
			var mapInfoObjectlist = [];
			plants.forEach(function (plant) {
				var infoObject = {};
				infoObject = angular.extend(infoObject, plant);
				infoObject.formatter = formatPlantForLocationMap;
				infoObject.latitude = plant.Latitude;
				infoObject.longitude = plant.Longitude;
				mapInfoObjectlist.push(infoObject);
			});
			return mapInfoObjectlist;
		}

		function setEquipmentLocations() {
			platformMultiAddressService.setAddressEntities([], module);
			var plants = resourceEquipmentPlantDataService.getList();
			platformMultiAddressService.setAddressEntities(createPlantLocationMapInfo(plants), module);
		}

		this.setEquipmentLocations = setEquipmentLocations;

		resourceEquipmentPlantDataService.registerListLoaded(setEquipmentLocations);
	}
})(angular);
