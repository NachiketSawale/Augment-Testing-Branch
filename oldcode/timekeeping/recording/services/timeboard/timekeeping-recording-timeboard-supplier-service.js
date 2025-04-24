(function (angular) {
	'use strict';

	var moduleName = 'timekeeping.recording';
	var recordingModule = angular.module(moduleName);
	var serviceName = 'timekeepingRecordingBoardSupplierService';
	recordingModule.factory(serviceName, TimekeepingRecordingBoardSupplierService);
	TimekeepingRecordingBoardSupplierService.$inject = ['timekeepingEmployeeTimeboardServiceFactory', 'timekeepingEmployeeDataService'];

	function TimekeepingRecordingBoardSupplierService(timekeepingEmployeeTimeboardServiceFactory, timekeepingEmployeeDataService) {

		var service = timekeepingEmployeeTimeboardServiceFactory.createSupplierService({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			serviceName: serviceName,
			parentService: timekeepingEmployeeDataService
		});

		return service;
	}

})(angular);

