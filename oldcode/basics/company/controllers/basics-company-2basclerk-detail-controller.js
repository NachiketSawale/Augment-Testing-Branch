(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompany2BasClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompany2BasClerkDetailController', BasicsCompany2BasClerkDetailController);
	BasicsCompany2BasClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompany2BasClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd6f4fc0fb41f43e48bcb8976961f5339', 'basicsCompanyTranslationService');
	}
})(angular);