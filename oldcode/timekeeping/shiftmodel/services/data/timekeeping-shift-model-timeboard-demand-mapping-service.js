(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelTimeboardDemandMappingService
	 * @function
	 *
	 * @description
	 * timekeepingShiftModelTimeboardDemandMappingService is the mapping service for all shift to standard demands in time boards
	 */
	var moduleName = 'timekeeping.shiftmodel';

	var shiftModule = angular.module(moduleName);

	shiftModule.service('timekeepingShiftModelTimeboardDemandMappingService', TimekeepingShiftModelTimeboardDemandMappingService);

	TimekeepingShiftModelTimeboardDemandMappingService.$inject = ['moment'];

	function TimekeepingShiftModelTimeboardDemandMappingService(moment) {

		this.id = function idOfShift (shiftWorkingTime) {
			return shiftWorkingTime.Id;
		};

		this.description = function descriptionOfShift (shiftWorkingTime) {
			return shiftWorkingTime.Acronym;
		};

		this.from = function fromOfShift (shiftWorkingTime) {
			var timeStr = shiftWorkingTime.FromTime,
				date    = moment(),
				time    = moment(timeStr, 'HH:mm');

			date.set({
				hour:   time.get('hour'),
				minute: time.get('minute'),
				second: time.get('second')
			});
			return date;
		};

		this.to = function toOfShift (shiftWorkingTime) {
			var timeStr = shiftWorkingTime.ToTime,
				date    = moment(),
				time    = moment(timeStr, 'HH:mm');

			date.set({
				hour:   time.get('hour'),
				minute: time.get('minute'),
				second: time.get('second')
			});
			// lessOperator works on momentObjects 
			if(shiftWorkingTime.ToTime  < shiftWorkingTime.FromTime){
				date.add(1, 'days');
			}
			return date;
		};

		this.quantity = function quantityOfshift (shiftWorkingTime) {
			return shiftWorkingTime.Quantity;
		};

		this.unitOfMeasurement = function unitOfMeasurementOfshift (shiftWorkingTime) {
			return shiftWorkingTime.UomFk;
		};

		this.supplierType = function supplierTypeOfshift (shiftWorkingTime) {
			return shiftWorkingTime.ResourceTypeFk;
		};

		this.supplier = function supplierOfshift (shiftWorkingTime) {
			return shiftWorkingTime.ShiftFk;
		};

		this.supplierObj = function supplierObjOfshift (shiftWorkingTime) {
			return {ShiftFk: shiftWorkingTime.ShiftFk};
		};

		this.isDraggable = function isShiftDraggable (/* shift */) {
			return true;
		};

		this.dragInformation = function dragInformationOfshift (shiftWorkingTime) {
			return shiftWorkingTime.Description;
		};

		this.status = function statusOfshift (shiftWorkingTime) {
			return shiftWorkingTime.ShiftStatusFk;
		};
	}

})(angular);
