/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainBusinessPartnerSiteValidationService
	 * @description provides validation methods for project main businessPartnerSite entities
	 */
	angular.module(moduleName).service('projectMainBusinessPartnerSiteValidationService', ProjectMainBusinessPartnerSiteValidationService);

	ProjectMainBusinessPartnerSiteValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainBusinessPartnerSiteDataService'];

	function ProjectMainBusinessPartnerSiteValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainBusinessPartnerSiteDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.bizPartnerSite, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.bizPartnerSite)
		},
		self,
		projectMainBusinessPartnerSiteDataService);
	}
})(angular);
