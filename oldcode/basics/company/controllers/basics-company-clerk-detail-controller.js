(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name CompanyClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCompanyClerkDetailController', BasicsCompanyClerkDetailController);

	BasicsCompanyClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0a559d46ddd94140832c7e36e2adbf0f', 'basicsCompanyTranslationService');
	}
})(angular);