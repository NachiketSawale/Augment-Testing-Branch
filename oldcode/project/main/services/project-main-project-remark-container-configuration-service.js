(function (angular) {
	'use strict';
	var projectModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainProjectRemarkContainerConfigurationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectModule.service('projectMainProjectRemarksContainerConfigurationService', ProjectMainProjectRemarksContainerConfigurationService);

	ProjectMainProjectRemarksContainerConfigurationService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'projectMainTranslationService'];

	function ProjectMainProjectRemarksContainerConfigurationService(platformSchemaService, platformUIConfigInitService, projectMainTranslationService) {
		var self = this;
		var scheme = platformSchemaService.getSchemaFromCache( { typeName: 'ProjectDto', moduleSubModule: 'Project.Main'} ).properties;

		this.getContainerInfoByGuid = function getContainerConfigByGUID(guid) {
			var conf = self.getContainerConfigByGUID(guid);

			conf.ContainerType = 'Detail';
			conf.standardConfigurationService = self.getContainerContainerConfigurationServiceByGUID(guid);
			conf.dataServiceName = 'projectMainService';
			conf.validationServiceName = 'projectMainProjectValidationService';

			return conf;
		};

		this.getContainerConfigByGUID = function getContainerConfigByGUID(guid) {
			return platformUIConfigInitService.provideConfigForDetailView(self.getContainerLayoutByGUID(guid), scheme, projectMainTranslationService);
		};

		this.getContainerLayoutByGUID = function getContainerLayoutByGUID(guid) {
			switch (guid) {
				case 'fd77a1ee53124d0ebbc1715996942dcc': //Remark
					return self.getContainerLayout('Remark');
				case '078ea761dbf74be19f8b29cb28705e5a': //TenderRemark
					return self.getContainerLayout('TenderRemark');
				case '8f8e4f4d4d3f4ccb9a4fb173f849d18d': //CallOffRemark
					return self.getContainerLayout('CallOffRemark');
				case '7e2299e11b01408290b7b3f49548a4a8': //WarrentyRemark
					return self.getContainerLayout('WarrentyRemark');
			}
		};

		this.getContainerContainerConfigurationServiceByGUID = function getContainerContainerConfigurationServiceByGUID(guid) {
			switch (guid) {
				case 'fd77a1ee53124d0ebbc1715996942dcc': return 'projectMainProjectRemarkContainerConfigurationService';
				case '078ea761dbf74be19f8b29cb28705e5a': return 'projectMainProjectTenderRemarkContainerConfigurationService';
				case '8f8e4f4d4d3f4ccb9a4fb173f849d18d': return 'projectMainProjectCallOffRemarkContainerConfigurationService';
				case '7e2299e11b01408290b7b3f49548a4a8': return 'projectMainProjectWarrentyRemarkContainerConfigurationService';
			}
		};

		this.getContainerLayout = function getContainerLayout(model) {
			return self.getBaseLayout(model, model.toLowerCase());
		};

		this.getBaseLayout = function getBaseLayout(model, field) {
			return {
				version: '1.0.0',
				fid: 'cloud.translation.' + field,
				addValidationAutomatically: true,
				remark: field,
				model: model
			};
		};
	}

	projectModule.service('projectMainProjectRemarkContainerConfigurationService', ProjectMainProjectRemarkContainerConfigurationService);
	ProjectMainProjectRemarkContainerConfigurationService.$inject = ['projectMainProjectRemarksContainerConfigurationService'];
	function ProjectMainProjectRemarkContainerConfigurationService(projectMainProjectRemarksContainerConfigurationService) {
		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			return projectMainProjectRemarksContainerConfigurationService.getContainerConfigByGUID('fd77a1ee53124d0ebbc1715996942dcc');
		};
	}

	projectModule.service('projectMainProjectTenderRemarkContainerConfigurationService', ProjectMainProjectTenderRemarkContainerConfigurationService);
	ProjectMainProjectTenderRemarkContainerConfigurationService.$inject = ['projectMainProjectRemarksContainerConfigurationService'];
	function ProjectMainProjectTenderRemarkContainerConfigurationService(projectMainProjectRemarksContainerConfigurationService) {
		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			return projectMainProjectRemarksContainerConfigurationService.getContainerConfigByGUID('078ea761dbf74be19f8b29cb28705e5a');
		};
	}

	projectModule.service('projectMainProjectCallOffRemarkContainerConfigurationService', ProjectMainProjectCallOffRemarkContainerConfigurationService);
	ProjectMainProjectCallOffRemarkContainerConfigurationService.$inject = ['projectMainProjectRemarksContainerConfigurationService'];
	function ProjectMainProjectCallOffRemarkContainerConfigurationService(projectMainProjectRemarksContainerConfigurationService) {
		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			return projectMainProjectRemarksContainerConfigurationService.getContainerConfigByGUID('8f8e4f4d4d3f4ccb9a4fb173f849d18d');
		};
	}

	projectModule.service('projectMainProjectWarrentyRemarkContainerConfigurationService', ProjectMainProjectWarrentyRemarkContainerConfigurationService);
	ProjectMainProjectWarrentyRemarkContainerConfigurationService.$inject = ['projectMainProjectRemarksContainerConfigurationService'];
	function ProjectMainProjectWarrentyRemarkContainerConfigurationService(projectMainProjectRemarksContainerConfigurationService) {
		this.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			return projectMainProjectRemarksContainerConfigurationService.getContainerConfigByGUID('7e2299e11b01408290b7b3f49548a4a8');
		};
	}

})(angular);