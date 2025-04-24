/**
 * Created by leo on 11.04.2018.
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
	angular.module(moduleName).service('projectMainCertificateValidationService', ProjectMainCertificateValidationService);

	//ProjectMainCertificateValidationService.$inject = ['projectMainCertificateService', 'platformDataValidationService'];

	function ProjectMainCertificateValidationService() {//projectMainCertificateService, platformDataValidationService
	}
})(angular);