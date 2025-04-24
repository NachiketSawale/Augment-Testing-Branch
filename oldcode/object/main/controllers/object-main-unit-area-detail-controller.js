(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainUnitAreaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of UnitArea entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainUnitAreaDetailController', ObjectMainUnitAreaDetailController);

	ObjectMainUnitAreaDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitAreaDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1f1e8da2c5a54d4e83ba29cadf13fcd2', 'objectMainTranslationService');
	}

})(angular);