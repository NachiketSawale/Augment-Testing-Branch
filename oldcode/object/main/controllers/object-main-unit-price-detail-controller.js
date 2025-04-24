(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainUnitPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainUnitPriceDetailController', ObjectMainUnitPriceDetailController);

	ObjectMainUnitPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainUnitPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f73af0eec7524ed7824884e67b003c7f', 'objectMainTranslationService');
	}

})(angular);