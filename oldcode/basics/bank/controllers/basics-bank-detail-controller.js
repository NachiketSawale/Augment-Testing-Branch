(function (angular) {

	'use strict';
	var moduleName = 'basics.bank';
	/**
	 * @ngdoc controller
	 * @name basicsBankDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of bank entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsBankDetailController', BasicsBankDetailController);

	BasicsBankDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsBankDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '31d65ad2dc274a26ae91281b8d71a009', 'basicsBankTranslationService');
	}
})(angular);