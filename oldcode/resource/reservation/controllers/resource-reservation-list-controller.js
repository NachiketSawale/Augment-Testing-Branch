(function () {

	'use strict';
	var moduleName = 'resource.reservation';
	var angModule = angular.module(moduleName);

	angModule.controller('resourceReservationListController', ResourceReservationListController);

	ResourceReservationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceReservationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6540965b6c84450aa1da41fd1c870a47');
	}
})();
