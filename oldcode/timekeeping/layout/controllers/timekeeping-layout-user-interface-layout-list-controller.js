/*
 * $Id: timekeeping-layout-user-interface-layout-list-controller.js 548171 2019-06-18 15:01:11Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'timekeeping.layout';

	angular.module(moduleName).controller('timekeepingLayoutUserInterfaceLayoutListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, 'af8a45a50e3f467ab563336623d14c3c');
		}]);
})();
