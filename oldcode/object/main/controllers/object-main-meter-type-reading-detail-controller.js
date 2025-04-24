(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainMeterTypeReadingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainMeterTypeReadingDetailController', ObjectMainMeterTypeReadingDetailController);

	ObjectMainMeterTypeReadingDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainMeterTypeReadingDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fe7f54b726f442488eec07c925cf152f', 'objectMainTranslationService');
	}

})(angular);