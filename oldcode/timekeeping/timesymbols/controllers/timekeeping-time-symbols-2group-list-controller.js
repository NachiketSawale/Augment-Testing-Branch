
/**
	 * Created by mohit on 16.06.2022
	 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timesymbols';

	/**
		 * @ngdoc controller
		 * @name timekeepingTimeSymbolsGroupListController
		 * @function
		 *
		 * @description
		 * Controller for the list view of timekeeping time symbol account entities.
		 **/

	angular.module(moduleName).controller('timekeepingTimeSymbols2GroupListController', TimekeepingTimeSymbols2GroupListController);

	TimekeepingTimeSymbols2GroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingTimeSymbols2GroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '535fb8d5c72e47d0b34bc50cf3d03798');
	}
})(angular);
