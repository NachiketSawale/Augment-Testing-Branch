(function (angular) {

	'use strict';
	var moduleName = 'basics.country';
	/**
	 * @ngdoc controller
	 * @name basicsCountryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Country entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCountryDetailController', BasicsCountryDetailController);

	BasicsCountryDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCountryDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cd1fc59aa30149c487bedcfc38704ab5', 'basicsCountryTranslationService');
	}
})(angular);