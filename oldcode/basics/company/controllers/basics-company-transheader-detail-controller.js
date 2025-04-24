(function (angular) {

	'use strict';
	var moduleName = 'basics.company';


	/**
	 * @ngdoc controller
	 * @name CompanyTransheaderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  Transaction.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyTransheaderDetailController', BasicsCompanyTransheaderDetailController);

	BasicsCompanyTransheaderDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyTransheaderDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a7f63cb15a8e4820a0dd673e457360c6', 'basicsCompanyTranslationService');
	}
})(angular);