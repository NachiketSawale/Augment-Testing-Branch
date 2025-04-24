(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsRecordingBoardDemandMappingService
	 * @function
	 *
	 * @description
	 * timekeepingTimeSymbolsRecordingBoardDemandMappingService is the mapping service for all time symbols to standard demands in planning boards
	 */
	const moduleName = 'timekeeping.timesymbols';

	const resourceModule = angular.module(moduleName);

	resourceModule.service('timekeepingTimeSymbolsRecordingBoardDemandMappingService', TimekeepingTimeSymbolsRecordingBoardDemandMappingService);

	function TimekeepingTimeSymbolsRecordingBoardDemandMappingService() {
		let self = this;
		let data = {
			periodService: null
		};

		this.id = function idOfRequisition (timesymbol) {
			return timesymbol.Id;
		};

		this.description = function descriptionOfRequisition (timesymbol) {
			return timesymbol.DescriptionInfo.Description;
		};

		this.from = function fromOfRequisition (/* timesymbol */) {
			return data.periodService.periodBegin();
		};

		this.to = function toOfRequisition (/* timesymbol */) {
			return data.periodService.periodend();
		};

		this.quantity = function quantityOfRequisition (/* timesymbol */) {
			return 1.0;
		};

		this.unitOfMeasurement = function unitOfMeasurementOfRequisition (/* timesymbol */) {
			return 0;
		};

		this.supplierType = function supplierTypeOfRequisition (/* timesymbol */) {
			return null;
		};

		this.supplier = function supplierOfRequisition (/* timesymbol */) {
			return null;
		};

		this.supplierObj = function supplierObjOfRequisition (/* timesymbol */) {
			return {ResourceFk: null};
		};

		this.isDraggable = function isRequisitionDraggable (/* timesymbol */) {
			return true;
		};

		this.dragInformation = function dragInformationOfRequisition (timesymbol) {
			return self.description(timesymbol);
		};

		this.status = function statusOfRequisition (/* timesymbol */) {
			return null;
		};
	}

})(angular);
