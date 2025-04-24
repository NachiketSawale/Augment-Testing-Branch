/**
 * Created by baf on 22.08.2017
 */
(function () {
	'use strict';
	var modName = 'resource.equipmentgroup';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of project stock entity
	 */
	module.service('resourceEquipmentGroupLayoutService', ResourceEquipmentGroupLayoutService);

	ResourceEquipmentGroupLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupLayoutService(platformSchemaService, platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService) {
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
				moduleSubModule: 'Resource.EquipmentGroup',
				typeName: 'EquipmentGroupDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = resourceEquipmentgroupContainerInformationService.getResourceEquipmentGroupLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, resourceEquipmentGroupTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, resourceEquipmentGroupTranslationService);

			return configs;
		};
	}
})();
