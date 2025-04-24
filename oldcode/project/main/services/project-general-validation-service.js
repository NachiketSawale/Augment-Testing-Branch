
(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainGeneralValidationService
	 * @description provides validation methods for project generals entities
	 */
	angular.module(moduleName).service('projectMainGeneralValidationService', ProjectMainGeneralValidationService);

	//ProjectMainClerkValidationService.$inject = ['projectMainGeneralService', 'platformDataValidationService'];

	function ProjectMainGeneralValidationService() {//projectMainGeneralService, platformDataValidationService
	}
})(angular);
