(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainCurrencyRateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainCurrencyRateListController', ProjectMainCurrencyRateListController);

	ProjectMainCurrencyRateListController.$inject = ['$scope','platformContainerControllerService','basicsCurrencyLookupService'];
	function ProjectMainCurrencyRateListController($scope, platformContainerControllerService, basicsCurrencyLookupService) {
		basicsCurrencyLookupService.reload();
		platformContainerControllerService.initController($scope, moduleName, '463C61DED9AE494AA02850DBA570234F');
	}

})();