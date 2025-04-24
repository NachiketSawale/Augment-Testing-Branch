(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainUnitPhotoDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of UnitPhoto entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainUnitPhotoDetailController', ObjectMainUnitPhotoDetailController);

	ObjectMainUnitPhotoDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitPhotoDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '42e90f3cbc2f41afb9d46268d11a3bbe', 'objectMainTranslationService');
	}

})(angular);