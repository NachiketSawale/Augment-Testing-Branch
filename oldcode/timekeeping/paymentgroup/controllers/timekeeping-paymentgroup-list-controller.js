/*
 * $Id: timekeeping-paymentgroup-list-controller.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'timekeeping.paymentgroup';

	angular.module(moduleName).controller('timekeepingPaymentGroupListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, 'efae4d9755834726b31ad7cbdf09d41f');
		}]);
})();
