/**
 * Created by Nikhil on 14.04.2023.
 */
(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCertificateValidationService
	 * @description provides validation methods for project certificate entities
	 */
	angular.module(moduleName).service('projectMainManagedPlantLocValidationService', ProjectMainManagedPlantLocValidationService);

	//ProjectMainCertificateValidationService.$inject = ['projectMainCertificateService', 'platformDataValidationService'];

	function ProjectMainManagedPlantLocValidationService() {//projectMainCertificateService, platformDataValidationService
	}
})(angular);