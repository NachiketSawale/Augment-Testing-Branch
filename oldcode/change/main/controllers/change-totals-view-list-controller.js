(function () {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeTotalsViewListController
	 * @function
	 *
	 * @description
	 * Controller for the list view
	 **/
	angular.module(moduleName).controller('changeTotalsViewListController', ChangeTotalsViewListController);

	ChangeTotalsViewListController.$inject = ['$scope','platformContainerControllerService'];
	function ChangeTotalsViewListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b7e6d6eec7714665afe46917814e50bd');
	}
})();