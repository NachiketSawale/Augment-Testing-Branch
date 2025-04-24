(function (angular) {

	'use strict';
	var moduleName = 'object.main';
	/**
	 * @ngdoc controller
	 * @name objectMainProspectChangeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of ProspectChange entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('objectMainProspectChangeDetailController', ObjectMainProspectChangeDetailController);

	ObjectMainProspectChangeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ObjectMainProspectChangeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'de707626032f4bd3bc6e6edeee75dccc', 'objectMainTranslationService');
	}

})(angular);