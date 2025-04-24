(function () {
	'use strict';

	const moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).service('ppsProductionPlacePlanningBoardDemandMappingService', MappingService);

	MappingService.$inject = ['moment'];

	function MappingService(moment) {

		this.supplier = function supplierOfRequisition(phase) {
			return phase.Id;
		};
		this.supplierObj = function supplierObjOfRequisition(phase) {
			return { PpsProductionPlaceFk: phase.PpsProductionPlaceFk };
		};


		this.id = function (phase) {
			return phase.Id;
		};
		this.quantity = function quantityOfRequisition(phase) {
			return phase.Quantity;
		};

		this.unitOfMeasurement = function unitOfMeasurementOfRequisition(phase) {
			return phase.UomFk;
		};

		this.description = function (phase) {
			return phase.Id;
		};

		this.from = function (phase) {
			return moment(phase.ProductionStart);

		};

		this.to = function (phase) {
			return moment(phase.ProductionFinish);

		};

		this.duration = function (phase) {
			return moment(phase.ProductDuration);

		};

		this.isDraggable = function isRequisitionDraggable() {
			return true;
		};

		this.dragInformation = function dragInformationOfRequisition(phase) {
			return phase.Code;
		};

		this.filterDemands = function filterDemands(planningBoardDataService) {
			const demandConfig = planningBoardDataService.getDemandConfig();
			const demands = demandConfig.dataService.getList();
			return demands.filter(demand => demand.OpenQuantity && demand.OpenQuantity > 0);
		};

		this.updateDemandGrid = (itemIds, demandDataService) => {
			// Return the promise from updateDemandGridData
			return demandDataService.updateDemandGridData(itemIds);
	  };
	}
})();
