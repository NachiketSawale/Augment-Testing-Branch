(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainUnitDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainUnitDetailController', ObjectMainUnitDetailController);

	ObjectMainUnitDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3d333462cfc848cb95e79b82e718101a', 'objectMainTranslationService');
	}

})(angular);