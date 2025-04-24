(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainUnit2ObjUnitDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainUnit2ObjUnitDetailController', ObjectMainUnit2ObjUnitDetailController);

	ObjectMainUnit2ObjUnitDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnit2ObjUnitDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c05eef6a46bf479391bd129480faf3de', 'objectMainTranslationService');
	}

})(angular);