(function (angular) {

	'use strict';
	var moduleName = 'object.project';
	/**
	 * @ngdoc controller
	 * @name objectProjectHeaderDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectProjectHeaderDocumentDetailController', ObjectProjectHeaderDocumentDetailController);

	ObjectProjectHeaderDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectProjectHeaderDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '909b0d66111643bf92a6e8d6e810c7f0', 'objectProjectTranslationService');
	}

})(angular);