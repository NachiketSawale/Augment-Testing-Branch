/**
 * Created by baf on 24.08.2016
 */
(function () {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestRelevantToLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	module.service('projectInfoRequestRelevantToLayoutService', ProjectInfoRequestRelevantToLayoutService);

	ProjectInfoRequestRelevantToLayoutService.$inject = ['platformContainerConfigurationService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService'];

	function ProjectInfoRequestRelevantToLayoutService(platformContainerConfigurationService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService) {
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

		self.createConfiguration = function createConfiguration() {
			return platformContainerConfigurationService.createConfiguration(
				'Project.InfoRequest', 'RequestRelevantToDto', projectInfoRequestContainerInformationService.getRelevantToLayout(),
				projectInfoRequestTranslationService);
		};
	}
})();
