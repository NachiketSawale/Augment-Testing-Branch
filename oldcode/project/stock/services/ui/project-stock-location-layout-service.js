/**
 * Created by baf on 22.08.2017
 */
(function () {
	'use strict';
	var modName = 'project.stock';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectStockLocationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid and form of project stock location entities
	 */
	module.service('projectStockLocationLayoutService', ProjectStockLocationLayoutService);

	ProjectStockLocationLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'projectStockContainerInformationService', 'projectStockTranslationService'];

	function ProjectStockLocationLayoutService(platformSchemaService, platformUIConfigInitService, projectStockContainerInformationService, projectStockTranslationService) {
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
				moduleSubModule: 'Project.Stock',
				typeName: 'ProjectStockLocationDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();

			var configs = {};

			var layout = projectStockContainerInformationService.getProjectStockLocationLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, projectStockTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, projectStockTranslationService);

			return configs;
		};
	}
})();
