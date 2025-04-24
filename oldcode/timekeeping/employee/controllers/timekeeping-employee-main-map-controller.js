(function () {

	'use strict';
	let moduleName = 'timekeeping.employee';
	angular.module(moduleName).controller('timekeepingEmployeeMainMapController', TimekeepingEmployeeMapListController);

	TimekeepingEmployeeMapListController.$inject = ['$scope', 'platformMultiAddressControllerService', 'timekeepingEmployeeMainMapService'];
	function TimekeepingEmployeeMapListController($scope, addressControllerService, timekeepingEmployeeMainMapService) {
		addressControllerService.initController($scope, moduleName);
		timekeepingEmployeeMainMapService.setAddresses();
	}
})();