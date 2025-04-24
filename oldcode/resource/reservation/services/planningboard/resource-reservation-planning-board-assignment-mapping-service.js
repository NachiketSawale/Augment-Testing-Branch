(function (angular) {
	'use strict';
	/* global _,globals */
	/**
	 * @ngdoc service
	 * @name resourceReservationPlanningBoardDemandMappingService
	 * @function
	 *
	 * @description
	 * resourceReservationPlanningBoardDemandMappingService is the mapping service for all reservation to standard demands in planning boards
	 */
	var moduleName = 'resource.reservation';

	var resourceModule = angular.module(moduleName);

	resourceModule.service('resourceReservationPlanningBoardAssignmentMappingService', ResourceReservationPlanningBoardAssignmentMappingService);

	ResourceReservationPlanningBoardAssignmentMappingService.$inject = ['_','$injector','$http','$q', 'platformPlanningBoardDataService', 'resourceReservationTypeAndStatusService',
		'platformDateshiftPlanningboardHelperService', 'resourceReservationUIStandardService'];

	function ResourceReservationPlanningBoardAssignmentMappingService(_,$injector, $http, $q, platformPlanningBoardDataService, resourceReservationTypeAndStatusService,
		platformDateshiftPlanningboardHelperService, resourceReservationUIStandardService) {
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

		this.description = function descriptionOfReservation (reservation, description) {
			return implementMemberAccess('Description', reservation, description);
		};

		this.from = function fromOfReservation (reservation, from) {
			return implementMemberAccess('ReservedFrom', reservation, from);
		};

		this.isFromFixed = function isFromFixedOfReservation (reservation) {
			return !reservation.AllocatedFrom;
		};

		this.to = function toOfReservation (reservation, to) {
			return implementMemberAccess('ReservedTo', reservation, to);
		};

		this.isToFixed = function isToFixedOfReservation (reservation) {
			return !reservation.AllocatedTo;
		};

		this.infoField = function infoFieldOfReservation(reservation, field) {
			var infoLabel = _.has(reservation, field) ? _.get(reservation, field) : '';
			return infoLabel;
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

		this.supplierType = function supplierTypeOfReservation (reservation, type) {
			return implementNumberMemberAccess('ResourceTypeFk', reservation, type);
		};

		this.forMaintenance = function assignmentIsForMaintenance (reservation) {
			return implementNumberMemberAccess('IsForMaintenance', reservation);
		};

		this.supplier = function supplierOfReservation (reservation, supplier) {
			return implementNumberMemberAccess('ResourceFk', reservation, supplier);
		};

		this.demand = function demandOfReservation (reservation, demand) {
			if(_.isObject(demand) && demand !== null) {
				reservation.Requisition = demand;

				return implementNumberMemberAccess('RequisitionFk', reservation, demand.Id);
			}
			return implementNumberMemberAccess('RequisitionFk', reservation, demand);
		};

		this.project = function supplierOfReservation (reservation, project) {
			return implementNumberMemberAccess('ProjectFk', reservation, project);
		};

		this.projectName = function supplierOfReservation (reservation) {
			return reservation.Requisition.Project.ProjectName;
		};

		this.entityTypeName = function entityTypeName() {
			return 'resreservationstatus';
		};

		this.headerColor = function assignmentHeaderColor (reservation) {
			return ((_self.project(reservation) % 100) / 100); // d3.interpolateRainbow
		};

		this.isDraggable = function isReservationDraggable (/* reservation */) {
			return true;
		};

		this.dragInformation = function dragInformationOfReservation (reservation) {
			return reservation.Description;
		};

		this.status = function statusOfReservation (reservation) {
			return reservation.ReservationStatusFk;
		};

		this.statusKey = function statusKeyOfReservation () {
			return 'ReservationStatusFk';
		};

		this.areRelated = function areReservationsRelated (res1, res2) {
			return res1.Requisition.Project !== null &&
				res2.Requisition.Project !== null &&
				res1.Requisition.Project.Id === res2.Requisition.Project.Id;
		};

		this.statusPanelText = function statusPanelTextOfReservation (reservation) {
			var info = reservation.Description;
			if (!_.isNull(reservation.Requisition.Project)) {
				var prName = reservation.Requisition.Project.ProjectName;
				var prNumber = reservation.Requisition.Project.ProjectNo;
				if (!_.isEmpty(prNumber)) {
					info = info + ' (' + prName + ', ' + prNumber + ')';
				}
			}

			return info;
		};

		this.createAssignment = function createAssignment (assignment, newAssignment) {
			newAssignment.RequisitionFk = _self.demand(assignment);
			newAssignment.ResourceFk = _self.supplier(assignment);
			newAssignment.ReservedFrom = _self.from(assignment);
			newAssignment.ReservedTo = _self.to(assignment);
			newAssignment.Quantity = _self.quantity(assignment);
			newAssignment.UomFk = _self.unitOfMeasurement(assignment);
			newAssignment.Description = _self.description(assignment);
			newAssignment.Requisition = assignment.Requisition;
			newAssignment.ProjectFk = assignment.Requisition.ProjectFk;

			return newAssignment;
		};

		this.validateAgainst = function validateAgainst (assignment) {
			return assignment.Requisition.RequiredSkillList;
		};

		this.validateAssignment = function validateAssignment (assignment, service) {
			service.validateReservation(assignment);
		};

		this.getTypeService = function getTypeService() {
			return resourceReservationTypeAndStatusService;
		};

		this.getStatusService = function getStatusService() {
			return resourceReservationTypeAndStatusService;
		};

		this.dateShift = (dateshiftData) => {
			dateshiftData.mappingService = _self;
			platformDateshiftPlanningboardHelperService.shiftDate(dateshiftData, true);
		};

		this.isReadOnly = function isReadOnly(assignment) {
			return assignment.IsReadOnly;
		};

		this.getLabelLookupServiceName = () => {
			return 'resourceReservationPlanningBoardLabelLookupService';
		};

		this.getAssignmentModalFormConfig = () => {
			return resourceReservationUIStandardService.getStandardConfigForDetailView();
		};

		this.getCustomTools = (assignmentDataService) => {
			return [{
				id: 'isDemandStatusFullyCovered',
				sort: 54,
				caption: 'Change Status to Fully Covered',
				type: 'item',
				iconClass: 'tlb-icons ico-reservation-complete',
				fn: () => {
					const planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('b1436d024b4b4ca592e58c8ea34384a7');
					const reloadChangeOnFullyCovered = planningBoardDataService.reloadOnChangeFullyCovered();

					let modalOptions = {
						showGrouping: true,
						bodyText: '',
						iconClass: ''
					};

					if (assignmentDataService.getSelectedEntities().length > 0) {
						let reservationItems = assignmentDataService.getSelectedEntities();
						let resItemIds = reservationItems.map(function (e) {
							return e.Id;
						});
						if (resItemIds.length > 0) {
							$http.post(globals.webApiBaseUrl + 'resource/requisition/changestatustoisfullycovered', resItemIds).then(function (response) {
								if (response) {
									if (response.data) {
										modalOptions.bodyText = response.data;
										modalOptions.iconClass =  'ico-error';

									} else {
										modalOptions.bodyText =  $injector.get('$translate').instant('resource.reservation.infoFullyCoveredSucceeded');
										modalOptions.iconClass =  'ico-info';

										_.forEach(reservationItems, function (item) {
											item.IsFullyCovered = true;
											if(reloadChangeOnFullyCovered){
												planningBoardDataService.updateAssignment(item);
											}
										});
									}
									$injector.get('platformModalService').showDialog(modalOptions);
								}
							});
						}}
				},
				disabled: function () {
					let reservationItem = assignmentDataService.getSelected();
					if(reservationItem){
						return reservationItem && reservationItem.IsFullyCovered ? true : false;
					}else{
						return  true;
					}
				}
			}];
		};

		this.grouping = function (reservations) {
			if (!arguments.length) {
				return 'status';
			}
			let _this = this;

			let sortedReservations = _.sortBy(reservations, function (reservation) {
				return _this.status(reservation);
			});

			let groups = _.groupBy(sortedReservations, function (reservation) {
				return 'status-' + _this.status(reservation);
			});
			return groups;
		};

		this.getSupplierCapacityPerDay = (reservationsIds, startDate, endDate) => {
			return $http.post(globals.webApiBaseUrl + 'resource/master/resource/capacityPerDay', {
				ResourceIds: reservationsIds,
				From: startDate,
				To: endDate
			});
		};
	}

})(angular);
