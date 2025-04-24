/**
 * Created by leo on 03.05.2018.
 */
(function () {

	'use strict';
	var moduleName = 'timekeeping.shiftmodel';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of shift model entities.
	 **/
	angModule.controller('timekeepingShiftModelListController',[ '$scope','platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'c271fb74bb5c4e7dbfadc1222f1bb8ef');
		}]);
})();
