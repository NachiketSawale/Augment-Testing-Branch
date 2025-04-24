(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceReservationPlanningBoardDemandMappingService
	 * @function
	 *
	 * @description
	 * resourceReservationPlanningBoardDemandMappingService is the mapping service for all reservation to standard demands in planning boards
	 */
	var moduleName = 'productionplanning.mounting';

	var resourceModule = angular.module(moduleName);

	resourceModule.service('mountingRequisitionAssignmentPlanningBoardAssignmentMappingService', MountingRequisitionAssignmentPlanningBoardAssignmentMappingService);

	MountingRequisitionAssignmentPlanningBoardAssignmentMappingService.$inject = ['_', '$translate', 'resourceReservationTypeAndStatusService'];

	function MountingRequisitionAssignmentPlanningBoardAssignmentMappingService(_, $translate, resourceReservationTypeAndStatusService) {
		var _self = this;

		function implementMemberAccess(field, reservation, value) {
			// nullable values are accepted
			if(!_.isUndefined(value)){
				reservation[field] = value;
			}
			return reservation[field];
		}

		function implementNumberMemberAccess(field, reservation, value) {
			// nullable values are accepted
			if(_.isNumber(value) || value === null ){
				reservation[field] = value;
			}
			return reservation[field];
		}

		this.id = function idOfReservation (reservation) {
			return reservation.Id;
		};

		this.description = function descriptionOfReservation (reservation) {
			return reservation.ResourceDescription || reservation.Description;
		};

		this.from = function fromOfReservation (reservation, from) {
			return implementMemberAccess('ReservedFrom', reservation, from);
		};

		this.to = function toOfReservation (reservation, to) {
			return implementMemberAccess('ReservedTo', reservation, to);
		};

		this.infoField = function infoFieldOfReservation(reservation, field) {
			return _.has(reservation, field) ? _.get(reservation, field) : '';
		};

		this.quantity = function quantityOfReservation (reservation, quantity) {
			return implementNumberMemberAccess('Quantity', reservation, quantity);
		};

		this.unitOfMeasurement = function unitOfMeasurementOfReservation (reservation, unit) {
			return implementNumberMemberAccess('UomFk', reservation, unit);
		};

		this.assignmentType = function assignmentTypeOfReservation (reservation, type) {
			return implementNumberMemberAccess('ReservationTypeFk', reservation, type);
		};

		this.forMaintenance = function assignmentIsForMaintenance (/*reservation*/) {
			return false;
		};

		this.supplierType = function supplierTypeOfReservation (reservation, type) {
			return implementNumberMemberAccess('ResourceTypeFk', reservation, type);
		};

		this.supplier = function supplierOfReservation (reservation, supplier) {
			return implementNumberMemberAccess('MntRequisitionFk', reservation, supplier);
		};

		this.layer = (reservation) => {
			if(reservation.PlanningboardConfig) {
				return reservation.PlanningboardConfig.Layer;
			} else {
				return '';
			}
		};

		this.demand = function demandOfReservation (reservation, demand) {
			if(_.isObject(demand) && demand !== null) {
				reservation.Requisition = demand;

				return implementNumberMemberAccess('RequisitionFk', reservation, demand.Id);
			}
			return implementNumberMemberAccess('RequisitionFk', reservation, demand);
		};

		this.project = function project (reservation, project) {
			return implementNumberMemberAccess('ProjectFk', reservation, project);
		};

		this.entityTypeName = function entityTypeName() {
			return 'resreservationstatus';
		};

		this.headerColor = function assignmentHeaderColor (reservation) {
			return ((_self.project(reservation) % 100) / 100); // d3.interpolateRainbow
		};

		this.isDraggable = function isReservationDraggable (/*reservation*/) {
			return true;
		};

		this.dragOnSupplierOnly = function dragOnSupplierOnly () {
			return true;
		};

		this.dragInformation = function dragInformationOfReservation (reservation) {
			return reservation.ResourceDescription || reservation.Description;
		};

		this.status = function statusOfReservation (reservation) {
			return reservation.ReservationStatusFk;
		};

		this.statusKey = function statusKeyOfReservation () {
			return 'ReservationStatusFk';
		};

		this.areRelated = function areReservationsRelated (res1, res2) {
			return res1.ProjectFk !== null &&
				res2.ProjectFk !== null &&
				res1.ProjectFk === res2.ProjectFk;
		};

		this.statusPanelText = function statusPanelTextOfReservation (reservation) {
			return reservation.ResourceDescription || reservation.Description;
		};

		/* jshint -W098 */
		this.createAssignment = function createAssignment (assignment, newAssignment) {};

		this.validateAssignment = function validateAssignment (assignment, service) {};

		this.getTypeService = function getTypeService() {
			return resourceReservationTypeAndStatusService;
		};

		this.getStatusService = function getStatusService() {
			return resourceReservationTypeAndStatusService;
		};

		this.ppsHeaderColor = function ppsHeaderColor(productionSet) {
			var ppsHeaderColor = implementNumberMemberAccess('PPSHeaderColor', productionSet);
			return ppsHeaderColor ? ppsHeaderColor : null;
		};

		this.manipulateDefaultConfigValues = (defaultConfigValues) => {
			let tagConfig = Object.values(defaultConfigValues)[0].tagConfig;
			let currentMaxSort = Math.max(...tagConfig.map(i => i.sort));
			tagConfig.push({
				id: 'ppsHeader',
				name: $translate.instant('platform.planningboard.ppsHeader'),
				color: '#786735',
				customColor: false,
				icon: true,
				visible: true,
				sort: ++currentMaxSort
			});

			return defaultConfigValues;
		};
	}

})(angular);
