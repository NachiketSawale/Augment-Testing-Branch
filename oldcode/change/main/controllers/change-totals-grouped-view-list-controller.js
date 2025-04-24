(function () {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeTotalsGroupedViewListController
	 * @function
	 *
	 * @description
	 * Controller for the list view
	 **/
	angular.module(moduleName).controller('changeTotalsGroupedViewListController', ChangeTotalsGroupedViewListController);

	ChangeTotalsGroupedViewListController.$inject = ['$scope','platformContainerControllerService'];
	function ChangeTotalsGroupedViewListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8e0288e96e5d4ad2853dc784842b5813');
	}
})();