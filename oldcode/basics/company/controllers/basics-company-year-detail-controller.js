(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name categoryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyYearDetailController', BasicsCompanyYearDetailController);

	BasicsCompanyYearDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyYearDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '268efaf3c6a6485eb1bb03a6d989ef43', 'basicsCompanyTranslationService');
	}
})(angular);