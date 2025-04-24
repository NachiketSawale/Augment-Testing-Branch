/**
 * Created by leo on 15.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timesymbols';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeSymbolsAccountListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping time symbol account entities.
	 **/

	angular.module(moduleName).controller('timekeepingTimeSymbolsAccountListController', TimekeepingTimeSymbolsAccountListController);

	TimekeepingTimeSymbolsAccountListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeSymbolsAccountListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f1f173225e0040d8bfd114c90f359e09');
	}
})(angular);
