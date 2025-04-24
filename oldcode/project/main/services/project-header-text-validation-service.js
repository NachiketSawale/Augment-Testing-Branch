/**
 * Created by shen on 10/21/2022
 */
(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectHeaderTextValidationService
	 * @description provides validation methods for project header text entities
	 */
	angular.module(moduleName).service('projectHeaderTextValidationService', ProjectHeaderTextValidationService);

	ProjectHeaderTextValidationService.$inject = ['platformValidationServiceFactory', 'projectHeaderTextDataService'];

	function ProjectHeaderTextValidationService(platformValidationServiceFactory, projectHeaderTextDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'ProjectHeaderblobDto', moduleSubModule: 'Project.Common'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'ProjectHeaderblobDto', moduleSubModule: 'Project.Common'})
		},
		self,
		projectHeaderTextDataService);
	}
})(angular);
