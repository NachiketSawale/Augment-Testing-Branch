((angular) => {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceReservationPlanningBoardDemandMappingService
	 * @function
	 *
	 * @description
	 * resourceReservationPlanningBoardDemandMappingService is the mapping service for all reservation to standard demands in planning boards
	 */
	let moduleName = 'productionplanning.item';

	let resourceModule = angular.module(moduleName);

	resourceModule.service('ppsItemPlanningBoardAssignmentMappingService', PpsItemPlanningBoardAssignmentMappingService);

	PpsItemPlanningBoardAssignmentMappingService.$inject = ['_', '$q', '$translate', 'productionPlanningItemPlanningBoardStatusService', 'platformDateshiftPlanningboardHelperService','productionplanningItemDataService'];

	function PpsItemPlanningBoardAssignmentMappingService(_, $q, $translate, productionPlanningItemPlanningBoardStatusService, platformDateshiftPlanningboardHelperService, productionplanningItemDataService) {
		let _self = this;

		function addProperty(entity, property, array) {
			if (_.isObject(entity) && _.isString(property) && _.isArray(array) && _.has(entity, property)) {
				array.push(_.get(entity, property));
			}
		}

		function implementMemberAccess(field, reservation, value) {
			// nullable values are accepted
			if (!_.isUndefined(value)) {
				reservation[field] = value;
			}
			return reservation[field];
		}

		function implementNumberMemberAccess(field, reservation, value) {
			// nullable values are accepted
			if (_.isNumber(value) || value === null) {
				reservation[field] = value;
			}
			return reservation[field];
		}

		this.id = function idOfReservation(reservation) {
			return reservation.Id;
		};

		this.description = function descriptionOfReservation(prodSet) {
			//Project: Drawing
			let descriptionsArr = [];
			addProperty(prodSet, 'Project.ProjectName', descriptionsArr);
			addProperty(prodSet, 'Drawing.Code', descriptionsArr);
			return descriptionsArr.join(': ');
		};

		this.from = function fromOfReservation(reservation, from) {
			return implementMemberAccess('PlannedStart', reservation, from);
		};

		this.to = function toOfReservation(reservation, to) {
			return implementMemberAccess('PlannedFinish', reservation, to);
		};

		this.infoField = function infoFieldOfReservation(reservation, field) {
			return _.has(reservation, field) ? _.get(reservation, field) : '';
		};

		this.quantity = function quantityOfReservation(reservation, quantity) {
			return implementNumberMemberAccess('Quantity', reservation, quantity);
		};

		this.useCapacities = () => {
			return true;
		};

		this.getAggregationProperties = () => {
			return ['Quantity'];
		};

		this.aggregateType = function materialGroup(reservation) {
			return _.get(reservation, 'MaterialGroup.Code');
		};

		this.unitOfMeasurement = function unitOfMeasurementOfReservation(reservation, unit) {
			return implementNumberMemberAccess('BasUomFk', reservation, unit);
		};

		this.assignmentType = function assignmentTypeOfReservation(reservation, type) {
			return implementNumberMemberAccess('ReservationTypeFk', reservation, type);
		};

		this.supplierType = function supplierTypeOfReservation(reservation, type) {
			return implementNumberMemberAccess('ResourceTypeFk', reservation, type);
		};

		this.forMaintenance = function assignmentIsForMaintenance(reservation) {
			return implementNumberMemberAccess('IsForMaintenance', reservation);
		};

		this.supplier = function supplierOfReservation(reservation, supplier) {
			return implementNumberMemberAccess('SiteFk', reservation, supplier);
		};

		this.demand = function demandOfReservation(reservation, demand) {
			if (_.isObject(demand) && demand !== null) {
				reservation.Requisition = demand;

				return implementNumberMemberAccess('RequisitionFk', reservation, demand.Id);
			}
			return implementNumberMemberAccess('RequisitionFk', reservation, demand);
		};

		this.project = function supplierOfReservation(reservation) {
			return _.get(reservation, 'Project.Id');
		};

		this.entityTypeName = function entityTypeName() {
			return 'resreservationstatus';
		};

		this.headerColor = function assignmentHeaderColor(reservation) {
			return ((_self.project(reservation) % 100) / 100); // d3.interpolateRainbow
		};

		this.isDraggable = function isReservationDraggable(/*reservation*/) {
			return true;
		};

		this.dragInformation = function dragInformationOfReservation(reservation) {
			return reservation.Description;
		};

		this.areRelated = function areReservationsRelated() { //res1, res2) {
			return false;
		};


		this.getTypeService = function getTypeService() {
			return {
				getAssignmentTypeIcons: function () {
					return $q.when([]);
				},
				getAssignmentType: function () {
					return $q.when([]);
				}
			};
		};

		this.getStatusService = function getStatusService() {
			return productionPlanningItemPlanningBoardStatusService;
		};

		this.status = function statusOfProductionSet(productionSet) {
			return productionSet.StatusFk;
		};

		this.statusKey = function statusKeyOfProductionSet() {
			return 'StatusFk';
		};

		this.statusPanelText = function statusPanelTextOfReservation(productionSet) {
			return productionSet.Description;
		};

		this.isLocked = function isLocked(prodctionSet) {
			return prodctionSet.IsLocked;
		};

		this.isReadOnly = function isReadOnly(prodctionSet) {
			return !prodctionSet.HasWriteRight;
		};


		this.uomFactor = function uomFactor(productionSet) {
			return (productionSet.Unit !== null && productionSet.Unit.Factor) ? productionSet.Unit.Factor : 1;
		};

		this.aggregationUomFactor = function aggregationUomFactor (productionSet) {
			//jshint ignore:line
			return (productionSet.SiteUnit !== null && productionSet.SiteUnit.Factor) ? productionSet.SiteUnit.Factor : 1;
		};

		this.ppsHeaderColor = function ppsHeaderColor(productionSet) {
			var ppsHeaderColor = implementNumberMemberAccess('PPSHeaderColor', productionSet);
			return ppsHeaderColor ? ppsHeaderColor : null;
		};

		this.aggregationUomDescription = function aggregationUomDescription (productionSet) {
			return (productionSet.SiteUnit !== null && productionSet.SiteUnit.LowerUnit) ? productionSet.SiteUnit.LowerUnit : '';
		};

		/**
		 * @ngdoc function
		 * @name dateShift
		 * @description Public mapped function for dateshift.
		 */
		this.dateShift = (dateshiftData) => {
			dateshiftData.mappingService = _self;
			platformDateshiftPlanningboardHelperService.shiftDate(dateshiftData, true);
		};

		this.filteredAssignmentsOnProductionSet = function filteredAssignmentsOnProductionSet(assignments) {
			let productionSetId = (productionplanningItemDataService.getSelected()) ? productionplanningItemDataService.getSelected().ProductionSetId : -1;
			let highlightAssignmentKeys = [];
			assignments.forEach(function f(assignment) {
				assignment.highlightAssignmentFlag = false;
				if (assignment.ProductionSetId === productionSetId) {
					highlightAssignmentKeys.push(assignment.Id);
				}
			});
			return highlightAssignmentKeys;

		};

		this.manipulateDefaultConfigValues = (defaultConfigValues) => {
			let tagConfig = Object.values(defaultConfigValues)[0].tagConfig;
			let currentMaxSort = Math.max(...tagConfig.map(i => i.sort));
			tagConfig.push({
				id: 'ppsHeader',
				name: $translate.instant('productionplanning.productionplace.customTagConfig.ppsHeader'),
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
