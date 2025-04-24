/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseTimeSymbolListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping layout inputPhaseTimeSymbol entities.
	 **/

	angular.module(moduleName).controller('timekeepingLayoutInputPhaseTimeSymbolListController', TimekeepingLayoutInputPhaseTimeSymbolListController);

	TimekeepingLayoutInputPhaseTimeSymbolListController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseTimeSymbolListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '784c48ec472d4dd6bee47b2b6d5a83b6');
	}
})(angular);