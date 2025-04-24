(function (angular) {

	'use strict';
	var moduleName = 'basics.country';
	/**
	 * @ngdoc controller
	 * @name basicsCountryStateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of CountryState entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCountryStateDetailController', BasicsCountryStateDetailController);

	BasicsCountryStateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCountryStateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5860289e7cd04a8ebddfadf892e11870', 'basicsCountryTranslationService');
	}

})(angular);