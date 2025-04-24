/**
 * Created by leo on 11.04.2018.
 */
(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCertificateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project certificates
	 **/
	angular.module(moduleName).controller('projectMainCertificateListController', ProjectMainCertificateListController);

	ProjectMainCertificateListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainCertificateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '54a408657d304e7f8bbb51dba5d184c2');
	}
})();