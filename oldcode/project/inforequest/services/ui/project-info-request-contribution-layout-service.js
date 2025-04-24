/**
 * Created by baf on 24.08.2016
 */
(function () {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestContributionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for contribution to information requests
	 */
	module.service('projectInfoRequestContributionLayoutService', ProjectInfoRequestContributionLayoutService);

	ProjectInfoRequestContributionLayoutService.$inject = ['platformContainerConfigurationService', 'projectInfoRequestContainerInformationService', 'projectInfoRequestTranslationService'];

	function ProjectInfoRequestContributionLayoutService(platformContainerConfigurationService, projectInfoRequestContainerInformationService, projectInfoRequestTranslationService) {
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
				'Project.InfoRequest', 'RequestContributionDto', projectInfoRequestContainerInformationService.getContributionLayout(),
				projectInfoRequestTranslationService);
		};
	}
})();
