(function (angular) {

	'use strict';
	var moduleName = 'basics.company';


	/**
	 * @ngdoc controller
	 * @name CompanyDeferaltypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  Deferaltype.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyDeferaltypeDetailController', BasicsCompanyDeferaltypeDetailController);

	BasicsCompanyDeferaltypeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyDeferaltypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '29f12eb12f6f4f639569f812c24cc282', 'basicsCompanyTranslationService');
	}
})(angular);