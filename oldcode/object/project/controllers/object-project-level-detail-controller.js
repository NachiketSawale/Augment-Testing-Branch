(function (angular) {

	'use strict';
	var moduleName = 'object.project';
	/**
	 * @ngdoc controller
	 * @name objectProjectLevelDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Level entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectProjectLevelDetailController', ObjectProjectLevelDetailController);

	ObjectProjectLevelDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectProjectLevelDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cb60bceef3e243929c9e2b3d1a1292cb', 'objectProjectTranslationService');
	}

})(angular);