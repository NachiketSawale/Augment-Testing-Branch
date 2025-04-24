/*
 * $Id: timekeeping-paymentgroup-detail-controller.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'timekeeping.paymentgroup';

	angular.module(moduleName).controller('timekeepingPaymentGroupDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'c800ef2747434e7199b5b59c5f0a5057');
		}]);
})(angular);
