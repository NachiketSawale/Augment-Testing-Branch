/**
 * Created by balkanci on 17.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainAddressDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main address entities.
	 **/
	angular.module(moduleName).controller('projectMainAddressDetailController', ProjectMainAddressDetailController);

	ProjectMainAddressDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainAddressDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'caa64e99b7d449bd981e798331c458f9', 'projectMainTranslationService');
	}

})(angular);