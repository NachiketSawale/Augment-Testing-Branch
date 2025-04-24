(function (angular) {

	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of company entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyDetailController', BasicsCompanyDetailController);

	BasicsCompanyDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '44c2c0adb0c9408fb873b8c395aa5e08', 'basicsCompanyTranslationService');
	}
})(angular);