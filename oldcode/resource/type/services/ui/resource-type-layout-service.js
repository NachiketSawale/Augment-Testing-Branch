/**
 * Created by baf on 22.08.2017
 */
(function () {
	'use strict';
	var modName = 'resource.type';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of project stock entity
	 */
	module.service('resourceTypeLayoutService', ResourceTypeLayoutService);

	ResourceTypeLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'resourceTypeContainerInformationService', 'resourceTypeTranslationService'];

	function ResourceTypeLayoutService(platformSchemaService, platformUIConfigInitService, resourceTypeContainerInformationService, resourceTypeTranslationService) {
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
				moduleSubModule: 'Resource.Type',
				typeName: 'ResourceTypeDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = resourceTypeContainerInformationService.getResourceTypeLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, resourceTypeTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, resourceTypeTranslationService);

			return configs;
		};
	}
})();
