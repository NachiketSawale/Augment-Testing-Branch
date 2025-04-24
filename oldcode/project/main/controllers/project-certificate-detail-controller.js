/**
 * Created by leo on 11.04.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	/**
	 * @ngdoc controller
	 * @name projectMainCertificateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of the project certificates
	 **/
	angular.module(moduleName).controller('projectMainCertificateDetailController', ProjectMainCertificateDetailController);

	ProjectMainCertificateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainCertificateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f21fe8dbcc1d47d7baaa495bf9a9015a', 'projectMainTranslationService');
	}
})(angular);