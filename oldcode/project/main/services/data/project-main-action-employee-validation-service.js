/**
 * Created by baf on 23.10.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainActionEmployeeValidationService
	 * @description provides validation methods for project main actionEmployee entities
	 */
	angular.module(moduleName).service('projectMainActionEmployeeValidationService', ProjectMainActionEmployeeValidationService);

	ProjectMainActionEmployeeValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainActionEmployeeDataService'];

	function ProjectMainActionEmployeeValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainActionEmployeeDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.actionEmployee, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.actionEmployee)
			},
			self,
			projectMainActionEmployeeDataService);
	}
})(angular);
