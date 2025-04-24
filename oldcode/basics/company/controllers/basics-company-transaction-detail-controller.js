(function (angular) {

	'use strict';
	var moduleName = 'basics.company';


	/**
	 * @ngdoc controller
	 * @name CompanyTransactionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  Transaction.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyTransactionDetailController', BasicsCompanyTransactionDetailController);

	BasicsCompanyTransactionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyTransactionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd8758247b1a1461b8bf7d801bf019863', 'basicsCompanyTranslationService');
	}
})(angular);