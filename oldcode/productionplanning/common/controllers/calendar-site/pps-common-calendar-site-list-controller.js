(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonCalendarSiteListController', CalendarSiteController);

	CalendarSiteController.$inject = ['$scope', 'platformContainerControllerService'];
	function CalendarSiteController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);
	}
})();