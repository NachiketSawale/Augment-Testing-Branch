(function (angular) {

	'use strict';
	var moduleName = 'basics.payment';
	/**
	 * @ngdoc controller
	 * @name basicsPaymentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Payment entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsPaymentDetailController', BasicsPaymentDetailController);

	BasicsPaymentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsPaymentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '997d0546dca4406dae95ab214aae9d0d', 'basicsPaymentTranslationService');
	}
})(angular);