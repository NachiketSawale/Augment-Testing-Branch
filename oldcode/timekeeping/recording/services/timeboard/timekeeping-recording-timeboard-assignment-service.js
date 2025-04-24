(function (angular) {
	'use strict';

	var moduleName = 'timekeeping.recording';
	var module = angular.module(moduleName);
	var serviceName = 'timekeepingRecordingTimeboardAssignmentService';
	module.factory(serviceName, TimekeepingRecordingTimeboardAssignmentService);
	TimekeepingRecordingTimeboardAssignmentService.$inject = ['timekeepingRecordingBoardAssignmentServiceFactory', 'timekeepingRecordingBoardSupplierService', 'timekeepingRecordingDataService'];

	function TimekeepingRecordingTimeboardAssignmentService(timekeepingRecordingBoardAssignmentServiceFactory, timekeepingRecordingBoardSupplierService, timekeepingRecordingDataService) {

		var container = timekeepingRecordingBoardAssignmentServiceFactory.createAssignmentService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.EmployeeIdList = timekeepingRecordingBoardSupplierService.getIdList();
			},
			moduleName: moduleName,
			serviceName: serviceName,
			itemName: 'Reports',
			parentService: timekeepingRecordingDataService
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		return container.service;
	}
})(angular);

