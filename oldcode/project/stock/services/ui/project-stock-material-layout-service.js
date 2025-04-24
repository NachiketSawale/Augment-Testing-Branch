/**
 * Created by baf on 24.08.2016
 */
(function () {
	'use strict';
	var modName = 'project.stock';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name cloudTranslationResourceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	module.service('projectStockMaterialLayoutService', ProjectStockMaterialLayoutService);

	ProjectStockMaterialLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'projectStockContainerInformationService', 'projectStockTranslationService'];

	function ProjectStockMaterialLayoutService(platformSchemaService, platformUIConfigInitService, projectStockContainerInformationService, projectStockTranslationService) {
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
				typeName: 'ProjectStock2MaterialDto'
			}).properties;
		};

		this.createConfiguration = function createConfiguration() {
			var scheme = self.getDtoScheme();
			angular.extend(scheme,{Action: {domain: 'action'}});

			var configs = {};

			var layout = projectStockContainerInformationService.getProjectStockMaterialLayout();
			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, projectStockTranslationService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, projectStockTranslationService);

			return configs;
		};
	}
})();
