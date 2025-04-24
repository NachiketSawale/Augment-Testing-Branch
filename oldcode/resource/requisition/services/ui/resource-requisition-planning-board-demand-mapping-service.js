(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceRequisitionPlanningBoardDemandMappingService
	 * @function
	 *
	 * @description
	 * resourceRequisitionPlanningBoardDemandMappingService is the mapping service for all requisition to standard demands in planning boards
	 */
	var moduleName = 'resource.requisition';

	var resourceModule = angular.module(moduleName);

	resourceModule.service('resourceRequisitionPlanningBoardDemandMappingService', ResourceRequisitionPlanningBoardDemandMappingService);

	function ResourceRequisitionPlanningBoardDemandMappingService() {
		this.id = function idOfRequisition (requisition) {
			if (!requisition) {
				return null;
			}

			return requisition.Id;
		};

		this.description = function descriptionOfRequisition (requisition) {
			return requisition.Description;
		};

		this.from = function fromOfRequisition (requisition) {
			return requisition.RequestedFrom;
		};

		this.to = function toOfRequisition (requisition) {
			return requisition.RequestedTo;
		};

		this.quantity = function quantityOfRequisition (requisition) {
			return requisition.Quantity;
		};

		this.unitOfMeasurement = function unitOfMeasurementOfRequisition (requisition) {
			return requisition.UomFk;
		};

		this.supplierType = function supplierTypeOfRequisition (requisition) {
			return requisition.ResourceTypeFk;
		};

		this.supplier = function supplierOfRequisition (requisition) {
			return requisition.ResourceFk;
		};

		this.supplierObj = function supplierObjOfRequisition (requisition) {
			return {ResourceFk: requisition.ResourceFk};
		};

		this.isDraggable = function isRequisitionDraggable () {
			return true;
		};

		this.dragInformation = function dragInformationOfRequisition (requisition) {
			return requisition.Description;
		};

		this.status = function statusOfRequisition (requisition) {
			return requisition.RequisitionStatusFk;
		};

		this.validateAgainst = function validateAgainst (requisition, pbGridDefaultSetting) {
			if (!requisition) {
				return [];
			}

			let requestedTo = requisition.RequestedTo ? new Date(requisition.RequestedTo) : null;
			let requiredList = _.map(requisition.RequiredSkillList, function (skillEntity) {
				return Object.assign({}, skillEntity, { Type: 'skill', RequestedTo: requestedTo });
			});

			if (requisition.TypeFk && pbGridDefaultSetting === true) {
				let item = {
					Id: requisition.TypeFk,
					DescriptionInfo: {
						Description: 'Some Resource Type Description...'
					},
					Type: 'resType',
				};
				requiredList.push(item);
			}

			return requiredList;
		};

		this.isMandatory = function isMandatory (requiredSkill) {
			if (!requiredSkill) {
				return false;
			}

			if (requiredSkill.Type === 'resType') {
				return true;
			} else {
				return requiredSkill.IsMandatory;
			}
		};

		// comparison function should cover different use cases
		this.compareWith = function compareWith(requiredSkill, providedSkill) {
			if (!requiredSkill || !providedSkill) {
				return false;
			}
			if (requiredSkill.Type !== providedSkill.Type) {
				return false;
			}

			switch (requiredSkill.Type) {
				case 'resType':
					/* ResType comparison */
					return requiredSkill.Id === providedSkill.Id;

				case 'skill':
					/* Skill comparison */
					if (requiredSkill.Id !== providedSkill.Id) {
						return false;
					}
					if (!requiredSkill.RequestedTo || !providedSkill.ValidTo) {
						return true;
					}
					return requiredSkill.RequestedTo <= providedSkill.ValidTo;

				default:
					return false;
			}
		};

		this.filterDemands = (planningBoardDataService) => {
			let demandConfig = planningBoardDataService.getDemandConfig();

			let filteredDemands = demandConfig.dataService.getList();
			let assignments = Array.from(planningBoardDataService.assignments.values());

			// delete demands from the list if an assignment for this demand exist
			if (planningBoardDataService.gridSettings.filterDemands()){
				filteredDemands = filteredDemands.filter(d => _.isNil(d.ReservedFrom) && _.isNil(d.ReservedTo) && !assignments.map(a => a.Requisition).map(aR => aR.Id).includes(d.Id));
			}

			return filteredDemands;
		};

	}

})(angular);
