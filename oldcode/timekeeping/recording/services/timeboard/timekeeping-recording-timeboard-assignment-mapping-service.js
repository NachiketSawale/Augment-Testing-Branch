(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name timekeepingRecordingBoardAssignmentMappingService
	 * @function
	 *
	 * @description
	 * timekeepingRecordingBoardAssignmentMappingService is the mapping service for all (time-)report to standard demands in planning boards
	 */
	var moduleName = 'timekeeping.recording';

	var resourceModule = angular.module(moduleName);

	resourceModule.service('timekeepingRecordingBoardAssignmentMappingService', TimekeepingRecordingBoardAssignmentMappingService);

	TimekeepingRecordingBoardAssignmentMappingService.$inject = ['_', 'timekeepingRecordingTypeAndStatusService'];

	function TimekeepingRecordingBoardAssignmentMappingService(_, timekeepingRecordingTypeAndStatusService) {
		var _self = this;

		function implementMemberAccess(field, report, value) {
			// nullable values are accepted
			if (!_.isUndefined(value)) {
				_.set(report, field, value);

			}
			return _.get(report, field);
		}

		function implementNumberMemberAccess(field, report, value) {
			// nullable values are accepted
			if (_.isNumber(value) || value === null) {
				_.set(report, field, value);
			}
			return _.get(report, field);
		}

		this.id = function id(report) {
			return report.Id;
		};

		this.description = function description(report, description) {
			return implementMemberAccess('ReportHeader.Code', report, description);
		};

		this.from = function from(report, from) {
			var fromTime = implementMemberAccess('From', report, from);
			if (!fromTime && ! from) {
				fromTime = implementMemberAccess('FromCalculated', report, from);
			}
			return fromTime;
		};

		this.to = function toOfReservation(report, to) {
			var toTime = implementMemberAccess('To', report, to);
			if (!toTime && !to) {
				// try the calculated fallback
				toTime = implementMemberAccess('ToCalculated', report, to);
			}
			return toTime;
		};

		this.infoField = function infoField(report, field) {
			return implementMemberAccess(field, report);
		};

		this.quantity = function quantity(report, quantity) {
			return implementNumberMemberAccess('Duration', report, quantity);
		};

		this.unitOfMeasurement = function unitOfMeasurementOfReservation(report, unit) {
			return implementNumberMemberAccess('UomFk', report, unit);
		};

		this.assignmentType = function assignmentType(report, type) {
			return implementNumberMemberAccess('ReportStatusFk', report, type);
		};

		this.supplierType = function supplierType(report, type) {
			return implementNumberMemberAccess('ResourceTypeFk', report, type);
		};

		this.forMaintenance = function forMaintenance(report) {
			var isWhiteCollar = implementNumberMemberAccess('Employee.IsWhiteCollar', report);
			return isWhiteCollar;
		};

		this.supplier = function supplier(report, supplier) {
			return implementNumberMemberAccess('EmployeeFk', report, supplier);
		};

		this.demand = function demand(report, demand) {
			if (_.isObject(demand) && demand !== null) {
				report.ShiftWorkingTime = demand;

				return implementNumberMemberAccess('ShiftWorkingTimeFk', report, demand.Id);
			}
			return implementNumberMemberAccess('ShiftWorkingTimeFk', report, demand);
		};

		this.project = function project(report, project) {
			return implementNumberMemberAccess('ProjectFk', report, project);
		};

		this.entityTypeName = function entityTypeName() {
			return 'RecordingReportStatus';
		};

		this.headerColor = function assignmentHeaderColor(report) {
			return ((_self.project(report) % 100) / 100); // d3.interpolateRainbow
		};

		this.isDraggable = function isReservationDraggable(/* report */) {
			return true;
		};

		this.dragInformation = function dragInformation(report) {
			return report.Description;
		};

		this.status = function statusOfReservation(report) {
			return report.ReportStatusFk;
		};

		this.statusKey = function statusKeyOfReservation() {
			return 'ReportStatusFk';
		};

		this.areRelated = function areReservationsRelated(report1, report2) {
			return report1.RecordingFk === report2.RecordingFk;
		};

		this.statusPanelText = function statusPanelTextOfReservation(report) {
			var info = report.DueDate.format('L');
			var EmployeeCode = report.Employee.Code;
			var RecordCode = report.ReportHeader.Code;
			if (!_.isEmpty(EmployeeCode) && !_.isEmpty(RecordCode) && !_.isEmpty(info)) {
				info = info + ' (' + EmployeeCode + ', ' + RecordCode + ')';
			}
			return info;
		};

		this.createAssignment = function createAssignment(assignment, newAssignment) {
			newAssignment.ShiftModelWorkingTimeFk = _self.demand(assignment);
			newAssignment.EmployeeFk = _self.supplier(assignment);
			newAssignment.From = _self.from(assignment);
			newAssignment.To = _self.to(assignment);
			// newAssignment.Quantity = _self.quantity(assignment);
			// newAssignment.UomFk = _self.unitOfMeasurement(assignment);
			newAssignment.Description = _self.description(assignment);
			// newAssignment.ProjectFk = assignment.Requisition.ProjectFk;

			return newAssignment;
		};

		this.validateAssignment = function validateAssignment(assignment, service) {
			service.validateReservation(assignment);
		};

		this.getTypeService = function getTypeService() {
			return timekeepingRecordingTypeAndStatusService;
		};

		this.getStatusService = function getStatusService() {
			return timekeepingRecordingTypeAndStatusService;
		};
	}

})(angular);
