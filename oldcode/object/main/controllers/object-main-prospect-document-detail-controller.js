(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainProspectDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of ProspectDocument entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainProspectDocumentDetailController', ObjectMainProspectDocumentDetailController);

	ObjectMainProspectDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7c50d259385e4567afad3544e9047df4', 'objectMainTranslationService');
	}

})(angular);