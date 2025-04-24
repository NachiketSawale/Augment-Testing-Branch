/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCostGroupValidationService
	 * @description provides validation methods for project main costGroup entities
	 */
	angular.module(moduleName).service('projectMainCostGroupValidationService', ProjectMainCostGroupValidationService);

	ProjectMainCostGroupValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainCostGroupDataService'];

	function ProjectMainCostGroupValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainCostGroupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.costGroup, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.costGroup),
			uniques: ['Code']
		},
		self,
		projectMainCostGroupDataService);
	}
})(angular);
