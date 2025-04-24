(function (angular) {

	'use strict';
	var moduleName = 'object.project';
	/**
	 * @ngdoc controller
	 * @name objectProjectHeaderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Header entities.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectProjectHeaderDetailController', ObjectProjectHeaderDetailController);

	ObjectProjectHeaderDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectProjectHeaderDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e542d3f1f9374fd8815de4aef382b6a1', 'objectProjectTranslationService');
	}

})(angular);