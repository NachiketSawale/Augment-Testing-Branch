(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name CompanySurchargeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanySurchargeDetailController', BasicsCompanySurchargeDetailController);

	BasicsCompanySurchargeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanySurchargeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fadeac1901cc49589626297a0ee5cd42', 'basicsCompanyTranslationService');
	}
})(angular);