/**
 * Created by baf on 19.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseTimeSymbolDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping layout inputPhaseTimeSymbol entities.
	 **/
	angular.module(moduleName).controller('timekeepingLayoutInputPhaseTimeSymbolDetailController', TimekeepingLayoutInputPhaseTimeSymbolDetailController);

	TimekeepingLayoutInputPhaseTimeSymbolDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingLayoutInputPhaseTimeSymbolDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '160bc67764a443cea4bcbba1ff6b0cd8');
	}

})(angular);