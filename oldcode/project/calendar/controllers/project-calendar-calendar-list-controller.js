/*
 * $Id: project-calendar-calendar-list-controller.js 541617 2019-04-16 05:02:52Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'project.calendar';

	angular.module(moduleName).controller('projectCalendarCalendarListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, '359b6aa7d45d45688229a7d6444b1b4c');
		}]);
})();
