/**
 * Created by leo on 05.06.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	angular.module(moduleName).controller('timekeepingEmployeeRemarkController', TimekeepingEmployeeRemarkController);

	TimekeepingEmployeeRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'timekeepingEmployeeDataService', 'timekeepingEmployeeValidationService'];

	function TimekeepingEmployeeRemarkController($scope, platformSingleRemarkControllerService, timekeepingEmployeeDataService, timekeepingEmployeeValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'cloud.translation.remark',
			addValidationAutomatically: true,
			remark: 'remark',
			model: 'Remark'
		};
		platformSingleRemarkControllerService.initController($scope, timekeepingEmployeeDataService, timekeepingEmployeeValidationService, layout);
	}
})(angular);