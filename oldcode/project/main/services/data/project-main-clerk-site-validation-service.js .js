/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainClerkSiteValidationService
	 * @description provides validation methods for project main clerkSite entities
	 */
	angular.module(moduleName).service('projectMainClerkSiteValidationService', ProjectMainClerkSiteValidationService);

	ProjectMainClerkSiteValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainClerkSiteDataService'];

	function ProjectMainClerkSiteValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainClerkSiteDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.clerkSite, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.clerkSite)
		},
		self,
		projectMainClerkSiteDataService);
	}
})(angular);
