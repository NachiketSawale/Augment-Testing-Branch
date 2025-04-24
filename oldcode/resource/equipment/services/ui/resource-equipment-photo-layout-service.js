(function () {
	'use strict';
	var modName = 'resource.equipment';
	var module = angular.module(modName);

	module.service('resourceEquipmentPhotoLayoutService', ResourceEquipmentPhotoLayoutService);

	ResourceEquipmentPhotoLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentPhotoLayoutService(platformSchemaService, platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService) {
		var self = this;
		var conf = null;

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
				moduleSubModule: 'Resource.Equipment',
				typeName: 'PlantPictureDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = resourceEquipmentContainerInformationService.getResourceEquipmentPhotoLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, resourceEquipmentTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, resourceEquipmentTranslationService);

			return configs;
		};
	}
})();
