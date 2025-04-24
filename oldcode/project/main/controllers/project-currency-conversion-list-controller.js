(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectLocationReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainCurrencyConversionListController', ProjectMainCurrencyConversionListController);

	ProjectMainCurrencyConversionListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainCurrencyConversionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '');
	}
})();