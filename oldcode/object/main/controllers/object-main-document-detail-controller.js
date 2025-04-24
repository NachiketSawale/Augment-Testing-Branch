(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name ObjectMainDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainDocumentDetailController', ObjectMainDocumentDetailController);

	ObjectMainDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '916d6a951ca640808cfe0b80d634b20b', 'objectMainTranslationService');
	}

})(angular);