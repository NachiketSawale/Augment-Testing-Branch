(function () {
	'use strict';
	const modName = 'resource.equipmentgroup';
	const module = angular.module(modName);

	module.service('resourceEquipmentGroupPictureLayoutService', ResourceEquipmentGroupPictureLayoutService);

	ResourceEquipmentGroupPictureLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService',
		'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupPictureLayoutService(platformSchemaService, platformUIConfigInitService,
		resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService) {
		const self = this;
		let conf = null;

		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if (conf === null) {
				conf = self.createConfiguration();
			}

			return conf.detailLayout;
		};

		this.getStandardConfigForListView = function getStandardConfigForListView() {
			if (conf === null) {
				conf = self.createConfiguration();
			}

			return conf.listLayout;
		};

		this.getDtoScheme = function getDtoScheme() {
			return platformSchemaService.getSchemaFromCache({
				moduleSubModule: 'Resource.EquipmentGroup',
				typeName: 'PlantGroupPictureDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = resourceEquipmentgroupContainerInformationService.getEquipmentGroupPictureLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, resourceEquipmentGroupTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, resourceEquipmentGroupTranslationService);

			return configs;
		};
	}
})();
