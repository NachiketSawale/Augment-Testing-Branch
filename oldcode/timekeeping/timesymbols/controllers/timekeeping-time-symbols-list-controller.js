/**
 * Created by nit on 07.05.2018.
 */
(function () {

	'use strict';
	let moduleName = 'timekeeping.timesymbols';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeSymbolsListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of shift model entities.
	 **/
	angModule.controller('timekeepingTimeSymbolsListController', ['$scope', 'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '4e5bc29fd0a3407b8f2e7c0c224b578c');
		}]);
})();
