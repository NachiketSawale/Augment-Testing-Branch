(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.shiftmodel';
	let shiftModule = angular.module(moduleName);
	let serviceName = 'timekeepingShiftModelTimeboardDemandDataService';
	shiftModule.factory(serviceName, TimekeepingShiftModelTimeboardDemandDataService);
	TimekeepingShiftModelTimeboardDemandDataService.$inject = ['timekeepingShiftModelTimeboardDemandDataServiceFactory'];

	function TimekeepingShiftModelTimeboardDemandDataService(timekeepingShiftModelTimeboardDemandDataServiceFactory) {

		let container = timekeepingShiftModelTimeboardDemandDataServiceFactory.createDemandService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				// readData.ResourceIdList = resourceReservationPlanningBoardResourceService.getIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			serviceName: serviceName
		});

		return container.service;

	}

})(angular);
