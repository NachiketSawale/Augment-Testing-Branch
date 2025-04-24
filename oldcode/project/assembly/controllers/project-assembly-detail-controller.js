
(function (angular) {

	'use strict';

	var moduleName = 'project.assembly';
	/**
	 * @ngdoc controller
	 * @name projectAssemblyDetailController
	 * @description controller for the project Assembly details form view
	 */

	angular.module(moduleName).controller('projectAssemblyDetailController', ProjectAssemblyDetailController);

	ProjectAssemblyDetailController.$inject = ['$scope', '$injector','platformContainerControllerService'];
	function ProjectAssemblyDetailController($scope, $injector, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ab88e60997e04f269d4042bbe410aab9','projectAssemblyTranslationService');

		$injector.get('projectAssemblyDynamicUserDefinedColumnService').loadUserDefinedColumnDetail($scope);
	}
})(angular);