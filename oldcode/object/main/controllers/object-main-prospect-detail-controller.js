(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainProspectDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Prospect entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainProspectDetailController', ObjectMainProspectDetailController);

	ObjectMainProspectDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3ed83dc6e18f4565855eff19902418fb', 'objectMainTranslationService');
	}

})(angular);