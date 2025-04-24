/**
 * Created by leo on 25.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodValidationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping validation  entities.
	 **/
	angular.module(moduleName).controller('timekeepingPeriodValidationDetailController', TimekeepingValidationDetailController);

	TimekeepingValidationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function TimekeepingValidationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6ac2eb988f484ca4aa848f27064929c5');
	}

})(angular);
