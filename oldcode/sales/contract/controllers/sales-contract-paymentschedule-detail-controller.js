(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractPaymentScheduleDetailController
	 * @function
	 *
	 * @description
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractPaymentScheduleDetailController',
		['$scope', '$injector', 'platformDetailControllerService', 'salesContractPaymentScheduleDataService', 'salesContractPaymentScheduleUIStandardService', 'salesContractPaymentScheduleValidationService',
			function ($scope, $injector, platformDetailControllerService, dataService, gridColumns, validationService) {

				platformDetailControllerService.initDetailController( $scope, dataService, validationService, gridColumns);
			}]);
})(angular);