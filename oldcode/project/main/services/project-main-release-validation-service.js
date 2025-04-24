/**
 * Created by baf on 20.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainReleaseValidationService
	 * @description provides validation methods for project main release entities
	 */
	angular.module(moduleName).service('projectMainReleaseValidationService', ProjectMainReleaseValidationService);

	ProjectMainReleaseValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainReleaseDataService'];

	function ProjectMainReleaseValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainReleaseDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.release, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.release)
		},
		self,
		projectMainReleaseDataService);
	}
})(angular);
