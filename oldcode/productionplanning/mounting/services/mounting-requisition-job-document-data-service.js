(function (angular) {
	'use strict';
	var module = 'productionplanning.mounting';

	angular.module(module).factory('productionPlanningMountingReqJobDocumentDataService', ProductionPlanningMountingReqJobDocumentDataService);
	ProductionPlanningMountingReqJobDocumentDataService.$inject = ['productionPlanningJobDocumentDataServiceFactory', 'productionplanningMountingRequisitionDataService'];

	function ProductionPlanningMountingReqJobDocumentDataService(serviceFactory, dataService) {
		return serviceFactory.createService(dataService, 'LgmJobFk');
	}
})(angular);