/**
 * Created by leo on 03.05.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.shiftmodel';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of shift model entities.
	 **/
	angModule.controller('timekeepingShiftModelDetailController',[ '$scope','platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '3f8b36e4b22441e7a994dd85e610567f');
		}]);
})();