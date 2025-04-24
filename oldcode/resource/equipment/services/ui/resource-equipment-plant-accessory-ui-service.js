/**
 * Created by leo on 19.09.2017.
 */
(function () {
	'use strict';
	var modName = 'resource.equipment';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAccessoryUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of plant accessory entity
	 */
	module.service('resourceEquipmentPlantAccessoryUIService', ResourceEquipmentPlantAccessoryUIService);

	ResourceEquipmentPlantAccessoryUIService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentPlantAccessoryUIService(platformSchemaService, platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService) {
		var self = this;
		var conf = null;

		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(conf === null) {
				conf =  self.createConfiguration();
			}

			return conf.detailLayout;
		};

		this.getStandardConfigForListView = function getStandardConfigForListView() {
			if(conf === null) {
				conf =  self.createConfiguration();
			}

			return conf.listLayout;
		};

		this.getDtoScheme = function getDtoScheme() {
			return platformSchemaService.getSchemaFromCache({
				moduleSubModule: 'Resource.Equipment',
				typeName: 'PlantAccessoryDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = resourceEquipmentContainerInformationService.getResourceEquipmentPlantAccessoryLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, resourceEquipmentTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, resourceEquipmentTranslationService);

			return configs;
		};
	}
})();
