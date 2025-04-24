/**
 * Created by nit on 07.05.2018.
 */
(function () {

	'use strict';
	let moduleName = 'timekeeping.timesymbols';
	let angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name timekeepingTimeSymbolsDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of shift model entities.
     **/
	angModule.controller('timekeepingTimeSymbolsDetailController',[ '$scope','platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '9d1103ff3dfb42ceae45f0991605761c');
		}]);
})();
