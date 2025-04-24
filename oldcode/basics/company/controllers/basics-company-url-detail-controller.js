(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name BasicsCompanyUrlDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyUrlDetailController', BasicsCompanyUrlDetailController);

	BasicsCompanyUrlDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyUrlDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '94bdf16eaa544517805a0c02a9d584b4', 'basicsCompanyTranslationService');
	}
})(angular);