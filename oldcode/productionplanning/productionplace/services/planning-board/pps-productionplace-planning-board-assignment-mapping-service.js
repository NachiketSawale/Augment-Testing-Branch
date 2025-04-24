(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).service('ppsProductionPlacePlanningBoardAssignmentMappingService', MappingService);

	MappingService.$inject = ['_', '$q', '$http', '$injector', 'ppsProductionPlacePlanningBoardStatusService', 'moment',
		'platformDateshiftPlanningboardHelperService', 'ppsProcessConfigurationPhaseUIPlanningBoardService', '$translate', 'productionplanningCommonTranslationService',
		'ppsProductionPlacePlanningBoardDemandService', 'ppsProductionPlacePlanningBoardStatusService', 'platformSchemaService', 'platformSequenceManagerService', 'ppsProductionPlacePhaseIntegrationDialogService',
		'platformModalFormConfigService', 'ppsProductionPlaceDataService', 'platformDateshiftCalendarService',
		'ppsProductionPlacePlanningBoardAssignmentService', 'basicsUnitLookupDataService'];
	function MappingService(_, $q, $http, $injector, statusService, moment, platformDateshiftPlanningboardHelperService, ppsProcessConfigurationPhaseUIPlanningBoardService, $translate, ppsCommonTranslationService,
		demandService, ppsProductionPlacePlanningBoardStatusService, platformSchemaService, platformSequenceManagerService, ppsProductionPlacePhaseIntegrationDialogService,
		platformModalFormConfigService, ppsProductionPlaceDataService, platformDateshiftCalendarService, ppsProductionPlacePlanningBoardAssignmentService, basicsUnitLookupDataService) {
		var _self = this;

		// region Helper functions

		function implementNumberMemberAccess(field, phase, value) {
			// nullable values are accepted
			if (_.isNumber(value) || value === null) {
				phase[field] = value;
			}
			return phase[field];
		}

		function implementMemberAccess(field, phase, value) {
			// nullable values are accepted
			if (!_.isUndefined(value)) {
				phase[field] = value;
			}
			return phase[field];
		}

		// endregion

		// region Supplier
		this.supplier = function supplierOfReservation(phase, supplier) {
			implementNumberMemberAccess('PpsProductionPlaceFk', phase, supplier);
			if (!phase.BasSiteFk && implementNumberMemberAccess('PpsProductionPlaceFk', phase) || supplier) {
				const supplierMap = new Map(ppsProductionPlaceDataService.getList().map(x => [x.Id, x]));
				phase.BasSiteFk = supplierMap.has(phase.PpsProductionPlaceFk) ? supplierMap.get(phase.PpsProductionPlaceFk).BasSiteFk : phase.BasSiteFk;
			}
			return implementNumberMemberAccess('PpsProductionPlaceFk', phase);
		};
		// endregion

		// region Demand
		this.demand = function demandOfReservation(phase, demand) {
			if (_.isObject(demand) && demand !== null) {
				this.prodDescription(phase, demand.ProductDescriptionFk);
				return implementNumberMemberAccess('demandFk', phase, demand.Id);
			}
			return implementNumberMemberAccess('demandFk', phase, demand);
		};

		// endregion

		// region Properties
		this.id = function (phase) {
			return phase.CustomId;
		};

		this.description = function (phase, description) {
			let type = implementMemberAccess('Type', phase, description);

			if (typeof type === 'string') {
				switch (type.toLowerCase()) {
					case 'product': type = $translate.instant('productionplanning.productionplace.product');
						break;
					case 'formwork': type = $translate.instant('productionplanning.productionplace.formwork');
						break;
					case 'maintenance': type = $translate.instant('productionplanning.productionplace.maintenance.listTitle');
						break;
					default: type;
						break;
				}
			} else {
				type = '';
			}
			return type;
		};

		this.from = function (phase, from) {
			//return implementMemberAccess('PlannedStart', phase, from);
			if (from) {
				phase.PlannedStart = from;
			}
			return phase.PlannedStart;
		};

		this.to = function (phase, to) {
			//return implementMemberAccess('PlannedFinish', phase, to);
			if (to) {
				phase.PlannedFinish = to;
			}
			return phase.PlannedFinish;
		};

		this.quantity = function quantityOfReservation(reservation, quantity) {
			return implementNumberMemberAccess('Quantity', reservation, quantity);
		};

		this.unitOfMeasurement = function unitOfMeasurementOfReservation(reservation, unit) {
			return implementNumberMemberAccess('UomFk', reservation, unit);
		};


		this.forMaintenance = function () {
			return false;
		};

		this.prodDescription = function (phase, productDescriptionFk) {
			return implementNumberMemberAccess('ProductDescriptionFk', phase, productDescriptionFk);
		};

		this.project = function project(phase, project) {
			return implementNumberMemberAccess('ProjectFk', phase, project);
		};

		this.projectName = function projectName(phase, project) {
			var projectNo = implementNumberMemberAccess('ProjectNo', phase, project);
			var projectName = implementNumberMemberAccess('ProjectName', phase, project);
			return projectNo + (projectName ? ' (' + projectName + ')' : '');
		};

		this.headerColor = function assignmentHeaderColor(phase) {
			return ((_self.project(phase) % 100) / 100);
		};

		this.ppsHeaderColor = function ppsHeaderColor(phase) {
			var ppsHeaderColor = implementNumberMemberAccess('PPSHeaderColor', phase);
			return ppsHeaderColor ? ppsHeaderColor : null;
		};

		this.infoField = function (phase, infoField) {

			if (infoField.includes('SequenceEvents'))
			{
				if (infoField === 'SequenceEvents')
				{
					let seqEventVal = _.has(phase, infoField) ? _.get(phase, infoField) : '';
					let result = '';
					for(var key in seqEventVal)
					{
						result = result + key + ': ';
						let ps = _.has(phase, 'SequenceEvents.' + key + '.PlannedStart') ? _.get(phase, 'SequenceEvents.' + key + '.PlannedStart') : '';
						let pf = _.has(phase, 'SequenceEvents.' + key + '.PlannedFinish') ? _.get(phase, 'SequenceEvents.' + key + '.PlannedFinish') : '';
						result = result + '{PS: ' + moment(ps).format('DD/MM/YYYY') + ', PF: ' + moment(pf).format('DD/MM/YYYY') + '} ';
					}
				}
				if (infoField.includes('Start') || infoField.includes('Finish'))
				{
					let dt = _.has(phase, infoField) ? _.get(phase, infoField) : '';
					return moment(dt).format('DD/MM/YYYY');
				}
			}

			return _.has(phase, infoField) ? _.get(phase, infoField) : '';
		};

		this.assignmentTypeDescription = function (phase, assignmentType) {
			return implementMemberAccess('Type', phase, assignmentType);
		};

		this.getTransportInfo = function (phase) {
			let routeInfos = {
				isInTransport: false,
				routesDescription: null,
				routesPlannedDeliveries: null
			}
			if(!_.isNil(phase.RoutesInfo)) {
				routeInfos.isInTransport = true,
				routeInfos.routesDescription = phase.RoutesInfo.Codes,
				routeInfos.routesPlannedDeliveries = phase.RoutesInfo.PlannedDeliverys
			}
			return routeInfos;
		}
		// endregion

		// region Type

		this.assignmentType = function () {
			return -1;
		};

		this.getTypeService = function () {
			return {
				getAssignmentTypeIcons: function () {
					return $q.when([]);
				},
				getAssignmentType: function () {
					return $q.when([]);
				}
			};
		};

		// endregion

		// region Status

		this.getStatusService = () => {
			return ppsProductionPlacePlanningBoardStatusService;
		};

		this.status = (phase) => {
			return phase.StatusFk;
		};

		this.statusKey = () => {
			return 'StatusFk';
		};

		this.statusEntityKey = () => {
			return 'ProductStatusFk';
		};

		this.statusEntityId = (assignment) => {
			return assignment.PpsProductFk;
		};

		this.entityTypeName = () => {
			return 'ppsproduct';
		};

		this.useStatusProperties = () => {
			return true;
		};

		this.statusPanelText = function () {
			return '';
		};

		// endregion

		// region Validation

		this.isReadOnly = (phase) => {
			return false;
		};

		this.isLocked = function (phase, type) {
			if (type === 'start' && phase.IsLockedStart) {
				return true;
			} else if (type === 'end' && phase.IsLockedFinish) {
				return true;
			} else {
				return false;
			}
		};

		this.isDraggable = function isReservationDraggable(phase, phases, dateShiftConfig) {
			phases = phases ? phases : [phase];
			return canDragPhases(phases, dateShiftConfig);
		};

		this.areRelated = function () {
			return false;
		};

		this.canDelete = (selectedPhase, allPhases, dateShiftConfig) => {
			let sequences = dateShiftConfig ? dateShiftConfig.dateShiftHelperService.getSequenceData(dateShiftConfig.dataService.getServiceName()) : [];
			return canDeleteFormworkPhase(selectedPhase, sequences,  allPhases);
		};

		this.canDragVertically = (selectedPhase, selectedPhases, dateShiftConfig) => {
			selectedPhases = selectedPhases ? selectedPhases : [selectedPhase];
			return canDragPhases(selectedPhases, dateShiftConfig);
		};

		this.intersectSequence = function (phase, intersectSq) {
			return implementMemberAccess('intersectSequence', phase, intersectSq);
		};

		this.validateAssignment = function () {

		};

		this.validateAgainst = function validateAgainst() {
			return [];
		};

		// endregion

		// region Custom configurations
		this.getAssignmentModalFormConfig = () => {
			return ppsProcessConfigurationPhaseUIPlanningBoardService.getStandardConfigForDetailView();
		};

		// endregion

		// region Create functions
		this.createAssignment = function createAssignment(phase, newAssignment, calendarConfig, dateShiftConfig, customCreationParams = {}, pbDataService = {}) {
			// #133472 decrease OpenQuantity demand counter on create.

			const calendar = getCalendar(dateShiftConfig, calendarConfig);

			newAssignment.Quantity = _self.quantity(phase);
			newAssignment.UomFk = _self.unitOfMeasurement(phase);
			newAssignment.description = _self.id(phase);
			_self.supplier(newAssignment, _self.supplier(phase));
			updateCalendarInDateshiftData(newAssignment, [newAssignment], pbDataService);
			newAssignment.ProductDescriptionFk = _self.prodDescription(phase);

			demandService.increaseDemandQuantity(newAssignment);

			newAssignment.PlannedStart = moment(newAssignment.PlannedStart);
			newAssignment.PlannedFinish = moment(newAssignment.PlannedFinish);

			let unit = 'day';
			if (calendarConfig && calendarConfig.type) {
				unit = calendarConfig.type;
				if (unit === 'hour') {
					phase.PlannedStart = calendarConfig.from;
				}
			}

			newAssignment.PlannedStart = platformDateshiftCalendarService.getNextFreeDay(calendar, moment(phase.PlannedStart).startOf(unit), false, true);

			let newPlannedFinish = moment.duration(newAssignment.PlannedFinish.diff(newAssignment.PlannedStart));
			newAssignment.PlannedFinish = platformDateshiftCalendarService.getNextFreeDay(calendar, newAssignment.PlannedStart.clone().add(newPlannedFinish), false, false);

			return newAssignment;

		};

		/**
		 *
		 *
		 * @description
		 *
		 * @param {Object} templateAssignment - The template assignemnt with
		 * @param {Object} newAssignments - Array of entities coming from creation endpoint (server)
		 * @param {Object} calendarCreationData - Object providing data for updating new assignments
		 * @param {Object} dateShiftConfig - Object with dateshift config
		 * @param {Object} customCreationParams - Object containing addional creation params for special use cases
		 * @param {Boolean} customCreationParams.noQuantityUpdate - Turns off the quantity change (e.i. when this function is used only for calculation)
		 * @param {moment} customCreationParams.useCustomPostCreation - In case there is a custom post creation function (e.i. shifting after creating) some custom behavior can be implemented
		 * @returns {Object[]} - newAssignments - An array of new assignemnts to be added to planning board data service
		 */
		this.createAssignments = function createAssignments(templateAssignment = {}, newAssignments = [], calendarCreationData = {}, dateShiftConfig = {}, customCreationParams = {}, pbDataService = {}) {
			const calendar = getCalendar(dateShiftConfig, calendarCreationData);

			let unit = 'day';

			if (customCreationParams && customCreationParams.useCustomPostCreation) {
				unit = 'hour';
				// find index of first assignment of type Phase
				let indexOfFirstPhaseEntity = 0;
				if (newAssignments.find(assignment => assignment.FormworkTypeFk === 0)) {
					const firstPhaseEntity = newAssignments.find(assignment => assignment.FormworkTypeFk === 0);
					indexOfFirstPhaseEntity = newAssignments.indexOf(firstPhaseEntity);
				}
				templateAssignment.PlannedStart = newAssignments[indexOfFirstPhaseEntity].PlannedStart;

			} else if (calendarCreationData && calendarCreationData.type) {
				unit = calendarCreationData.type;
				if (unit === 'hour') {
					templateAssignment.PlannedStart = calendarCreationData.from;
				}
			}

			newAssignments.forEach(function (assignment, index, assignments) {

				assignment.Quantity = _self.quantity(templateAssignment);
				assignment.UomFk = _self.unitOfMeasurement(templateAssignment);
				assignment.description = _self.id(templateAssignment);
				_self.supplier(assignment, _self.supplier(templateAssignment));
				assignment.ProductDescriptionFk = _self.prodDescription(templateAssignment);
				// calculate duration and non-exception start and end date of assignment coming from backend
				const startEndExceptionTime = platformDateshiftCalendarService.getExceptionDaysCount(calendar, assignment.PlannedStart, assignment.PlannedFinish) * 86400;
				const realAssignmentDurationInSeconds = assignment.PlannedFinish.diff(assignment.PlannedStart, 'seconds') - startEndExceptionTime;

				// created for the integration usecase
				if (templateAssignment.PlannedStart === null && templateAssignment.PlannedFinish === null) {
					assignment.PlannedStart = platformDateshiftCalendarService.getNextFreeDay(calendar, moment(assignment.PlannedStart), false, true);
					assignment.PlannedFinish = platformDateshiftCalendarService.calculateNextNonExceptionDate(
						assignment.PlannedStart,
						moment(assignment.PlannedStart).add(realAssignmentDurationInSeconds, 'seconds'),
						calendar,
						false);
				}

				if (index === 0) { // set dates for first phase in sequence
					if (customCreationParams && !customCreationParams.noQuantityUpdate) {
						demandService.increaseDemandQuantity(assignment);
					}

					if (templateAssignment.PlannedStart && templateAssignment.PlannedFinish) {

						if (assignment.FormworkTypeFk === 0) { // assignment is phase
							assignment.PlannedStart = platformDateshiftCalendarService.getNextFreeDay(calendar, moment(templateAssignment.PlannedStart).startOf(unit), false, true);
							assignment.PlannedFinish = platformDateshiftCalendarService.calculateNextNonExceptionDate(
								assignment.PlannedStart, // start
								moment(assignment.PlannedStart).add(realAssignmentDurationInSeconds, 'seconds'), // finish
								calendar, // calendar for calculation
								false); // is date of start?
						}

						if (assignment.FormworkTypeFk > 0) { // assignment is formwork
							assignment.PlannedFinish = platformDateshiftCalendarService.getNextFreeDay(calendar, moment(templateAssignment.PlannedStart).startOf(unit), true, false);
							assignment.PlannedStart = platformDateshiftCalendarService.calculateNextNonExceptionDate(
								moment(assignment.PlannedFinish).subtract(realAssignmentDurationInSeconds, 's'),
								assignment.PlannedFinish,
								calendar,
								true);
						}
					}
				} else { // index > 0 - set dates for other phases in sequence
					assignment.PlannedStart = platformDateshiftCalendarService.getNextFreeDay(calendar, assignments[index - 1].PlannedFinish, false, true);
					assignment.PlannedFinish = platformDateshiftCalendarService.calculateNextNonExceptionDate(
						assignment.PlannedStart,
						platformDateshiftCalendarService.getNextFreeDay(calendar, moment(assignment.PlannedStart).add(realAssignmentDurationInSeconds, 'seconds'), false, false),
						calendar,
						false);
				}
			});

			updateCalendarInDateshiftData(newAssignments[0], newAssignments, pbDataService);

			return newAssignments;

		};

		// endregion


		function getCalendar(dateShiftConfig, calendarConfig){
			let calendar = null;
			if(dateShiftConfig){
				if(calendarConfig && calendarConfig.calendarId){
					calendar = dateShiftConfig.dataService.getDateshiftData().calendarData.get(calendarConfig.calendarId);
				}else{
					calendar = dateShiftConfig.dataService.getDateshiftData().calendarData.get('default');
				}
			}
			return calendar
		}
		// region Dateshift

		this.dateShift = (dateshiftData) => {
			dateshiftData.mappingService = _self;
			if (dateshiftData.selectedAssignments && dateshiftData.selectedAssignments.length > 1) {
				platformDateshiftPlanningboardHelperService.shiftMultiple(dateshiftData, true);
			} else {
				platformDateshiftPlanningboardHelperService.shiftDate(dateshiftData, true);
			}
		};

		this.postAssignmentCreation = (newAssignments, creationData, planningBoardDataService, dateShiftConfig) => {
			let indexOfFirstPhaseEntity = 0;
			if (newAssignments.find(assignment => assignment.FormworkTypeFk === 0)) {
				const firstPhaseEntity = newAssignments.find(assignment => assignment.FormworkTypeFk === 0);
				indexOfFirstPhaseEntity = newAssignments.indexOf(firstPhaseEntity);
			}

			let unit = 'day';
			if (creationData && creationData.type) {
				unit = creationData.type;
			}

			newAssignments[indexOfFirstPhaseEntity].circle = 'mid';
			const startMoment = moment(creationData.from).startOf(unit);
			const endMoment = moment(startMoment).add(newAssignments[indexOfFirstPhaseEntity].PlannedFinish.diff(newAssignments[indexOfFirstPhaseEntity].PlannedStart));

			// shift the assignments to the drop postition to shift not only phases but all activities related to those phases!
			platformDateshiftPlanningboardHelperService.shiftDate({
				el: newAssignments[indexOfFirstPhaseEntity],
				startMoment: startMoment,
				endMoment: endMoment,
				dateShiftConfig: dateShiftConfig,
				dataService: planningBoardDataService,
				mappingService: this
			}, true);
		};

		this.assignmentChanged = (dateshiftData) => {
			return platformDateshiftPlanningboardHelperService.entityChanged(dateshiftData, true);
		};

		this.getCustomSettings = () => {
			return ppsProcessConfigurationPhaseUIPlanningBoardService.getCustomSettingsConfig();
		};

		// endregion

		this.getCustomAggregationDropdownOptions = () => {
			const buildDropdownOption = (columnName) => {
				const translationInfo = ppsCommonTranslationService.data.words[columnName];
				const translationId = translationInfo ? `${translationInfo.location}.${translationInfo.identifier}` : null;
				const translationFallback = translationInfo ? translationInfo.initial : null;
				return {
					value: columnName,
					id: columnName,
					caption: $translate.instant(translationId) || translationFallback || columnName
				};
			};
			const getDropDownOtion = this.getAggregationProperties();
			const dropDownOptions = getDropDownOtion.map(buildDropdownOption);
			return dropDownOptions;
		};
		this.getAggregationText = (option, productionSet) => {
			return (option !== 'empty') ? `${(productionSet.sums[option] / productionSet.displayFactor).toFixed(2)}` : '';
		};

		// only uses default values, needs to be changed based on requirements

		this.useCapacities = () => {
			return false;
		};
		this.uomFactor = function uomFactor() {
			return 1;
		};
		this.aggregationUomFactor = function aggregationUomFactor() {
			return 1;
		};
		this.aggregationUomDescription = function aggregationUomDescription() {
			return '';
		};

		this.getAggregationProperties = () => {
			let sumAggregationProperties = [];

			let sumAggrigationProp = this.getPropertiesWithDomain();
			_.forEach(sumAggrigationProp, function (value, key) {
				if (value.domain === 'decimal' || value.domain === 'quantity') {
					sumAggregationProperties.push(key);
				}
			});

			let requirmentsCache = this.getExtraDropdownProperties();
			let sumAggrigationPhaseProp = this.getPhaseRequirmentsProperties();
			if (requirmentsCache.length > 0) {
				requirmentsCache.forEach(value => {
					_.forEach(sumAggrigationPhaseProp, function (val, key) {
						if (val.domain === 'decimal' || val.domain === 'quantity') {
							let newKey = 'PhaseRequirment' + ' ► ' + value.RequirementDescription + ' ► ' + key;
							sumAggregationProperties.push(newKey);
						}
					});

				});
			}

			return sumAggregationProperties;
		};

		this.getPropertiesWithDomain = () => {
			var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'PhaseForPlanningBoardDto',
				moduleSubModule: 'Productionplanning.ProcessConfiguration'
			});
			return ruleSetAttributeDomains.properties;
		};

		this.getExtraDropdownProperties = () => {
			return ppsProductionPlacePlanningBoardAssignmentService.getExtraRequirementsDropdownProperties();
		};

		this.getPhaseRequirmentsProperties = () => {
			var ruleSetAttributeDomainsRequirmentsPhase = platformSchemaService.getSchemaFromCache({
				typeName: 'PpsPhaseRequirementDto',
				moduleSubModule: 'Productionplanning.ProcessConfiguration'
			});

			return ruleSetAttributeDomainsRequirmentsPhase.properties;
		};

		this.valueToSelectedAggregation = (phase, propertyName, property = '') => {
			let val = 0, phasedRequirementsData;
			let properties = propertyName.split(' ► ');
			if (property) {
				val = '';
				phasedRequirementsData = ppsProductionPlacePlanningBoardAssignmentService.getExtraRequirementsDropdownProperties().find(req => propertyName.toLowerCase().replace(/\s/g, '') === req.RequirementDescription.toLowerCase().replace(/\s/g, ''));
			} else {
				phasedRequirementsData = ppsProductionPlacePlanningBoardAssignmentService.getExtraRequirementsDropdownProperties().find(req => properties.includes(req.RequirementDescription));
			}


			if (phasedRequirementsData) {
				let reqirementToShow = phase.PhaseRequirementsToShow && phase.PhaseRequirementsToShow.find(x => x.RequirementGoods === phasedRequirementsData.Requirementgoods && x.PpsUpstreamGoodsTypeFk === phasedRequirementsData.PpsUpstreamGoodsTypeId);
				if (reqirementToShow && !property) {
					val = reqirementToShow[properties[properties.length - 1]];
				} else if (reqirementToShow && reqirementToShow.hasOwnProperty(property)) {
					if (/(.*)uom(.*)fk/.test(property.toLowerCase())) {
						let uom = basicsUnitLookupDataService.getItemById(reqirementToShow[property], {
							'lookupType': 'Uom',
							'dataServiceName': 'basicsUnitLookupDataService'
						});
						val = uom ? uom.Unit : '';
					} else {
						val = reqirementToShow[property];
					}

				}
			}
			return val;
		};

		this.onSupplierChanged = (assignment, planningBoardDataService) => {
			if (_.isFunction(this.dateShift)) {
				if (!planningBoardDataService.getDateshiftConfig().dataService.isDateshiftDeactivated) {
					const sequenceData = planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName());
					const originalSequences = sequenceData.filter(activity => activity.actualData.activities.length > 0);
					if (originalSequences.length > 0) {
						const relatedActivities = originalSequences.filter(originalSequence => originalSequence.actualData.activities.find(searchActivity => searchActivity.Id === assignment.Id))[0].actualData.activities;

						let relatedAssignmentsData = Array.from(planningBoardDataService.assignments.values());
						if (relatedAssignmentsData.length > 0 && relatedAssignmentsData[0].originalEntity) {
							relatedAssignmentsData = relatedAssignmentsData.map(assignmentData => assignmentData.originalEntity);
						}

						relatedAssignmentsData = relatedAssignmentsData.filter(pBassignment => relatedActivities.map(activity => activity.Id).includes(pBassignment.Id));

						relatedAssignmentsData.forEach(element => {
							if (element.PpsProductionPlaceFk !== assignment.PpsProductionPlaceFk) {
								_self.supplier(element, _self.supplier(assignment));
							}
						});
						updateCalendarInDateshiftData(assignment, relatedAssignmentsData, planningBoardDataService);
						return relatedAssignmentsData;
					}
				}
			}
			return assignment;
		};


		this.getDeniedDeleteMessage = () => {
			return $translate.instant('productionplanning.productionplace.deleteFormworkPhaseDeniedMessage');
		};

		this.forMaintenance = function assignmentIsForMaintenance(phase) {
			return implementNumberMemberAccess('IsForMaintenance', phase);
		};

		this.showIntersectSequenceDialog = (dialogData) => {
			if (dialogData.sequenceData.length > 0) {
				// filter sequences based on supplier
				let supplierSequenceData = [];
				dialogData.sequenceData.forEach(sequence => {
					let assignmentToActivityArray = [];
					const isActivitiesOfSupplier = sequence.actualData.activities.filter(activity => activity.EntityName === 'PpsPhase').every(activity => {
						if (dialogData.items.get(activity.Id) && this.supplier(dialogData.items.get(activity.Id)) === dialogData.supplierId) {
							assignmentToActivityArray.push(dialogData.items.get(activity.Id));
							return true;
						}
						return false;
					});

					const isFormworkSequence = assignmentToActivityArray.some(assignment => typeof assignment !== 'undefined' && assignment.FormworkTypeFk > 0);
					if (isActivitiesOfSupplier && isFormworkSequence) {
						supplierSequenceData.push(sequence);
					}
				});

				let intersectedSequences = platformSequenceManagerService.getIntersectingSequences(supplierSequenceData, dialogData.planningBoardDate, dialogData.items, dialogData.calendarData);

				if (intersectedSequences.length > 0) {
					// open the isAmbigious dialog
					let intersectDialog = ppsProductionPlacePhaseIntegrationDialogService.getIntersectingSequencesDialogConfig(intersectedSequences);

					platformModalFormConfigService.showDialog(intersectDialog).then(function (result) {
						if (result.custom1) {
							dialogData.createAssignment(dialogData.creationData);
						} else if (result.custom2) {
							let intersectSequence = _.find(dialogData.sequenceData, { 'sequenceId': result.data.intersectingSequence.id });
							dialogData.creationData.intersectSequence = intersectSequence;
							dialogData.creationData.modifiedPhasesToSave = []; // all modified phases - will be updated in assignment service
							dialogData.creationData.modifiedPhasesToDelete = []; // all modified phases - will be updated in assignment service
							dialogData.createAssignment(dialogData.creationData);
						}
					});
				} else {
					dialogData.createAssignment(dialogData.creationData);
				}
			} else {
				dialogData.createAssignment(dialogData.creationData);
			}
		};

		function canDeleteFormworkPhase(selectedAssignment, sequences, assignments) {

			if (selectedAssignment.FormworkTypeFk > 0) {
				// find the sequence of selected phase
				let sequenceOfDeletePhase = sequences.filter(sequence => sequence.actualData.activities.some(activity => activity.Id === selectedAssignment.Id));
				if (sequenceOfDeletePhase.length > 0) {
					// find the assignment which is in activities of sequence and check its having product phase assigned to selected formwork phase
					let productPhases = [];
					sequenceOfDeletePhase.forEach(sequence => {
						sequence.actualData.activities.forEach(activity => {
							let productPhase = assignments.find(assignment => activity.Id === assignment.Id && (assignment.FormworkTypeFk === 0 || assignment.FormworkTypeFk === null));
							if (productPhase !== undefined) {
								productPhases.push(productPhase);
							}
						});
					});
					if (productPhases.length > 0) {
						return false;
					}
				}
			}
			return true;

		}

		this.onDrop = (phase, phases, planningBoardDataService) => {
			phases = phases.length > 0 ? phases : [phase];
			const dateShiftHelperService = planningBoardDataService.getDateshiftConfig().dateShiftHelperService;
			const sequenceData = dateShiftHelperService.getSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName());
			const dataServiceForDateshift = planningBoardDataService.getDateshiftConfig().dataService;

			let sequencesOfDraggedPhases = sequenceData.filter(sequence => phases.every(phase => sequence.actualData.activities.map(s => s.Id).includes(phase.Id)));
			let suppliersOfDraggedPhases = phases.map(phase => _self.supplier(phase)).filter((value, index, array) => array.indexOf(value) === index);

			if (dataServiceForDateshift.isDateshiftDeactivated && sequencesOfDraggedPhases.length === 1 && suppliersOfDraggedPhases.length === 1) {

				const assignments = Array.from(planningBoardDataService.assignments.values());
				let supplierOfDraggedPhases = suppliersOfDraggedPhases[0];
				let sequenceOfDraggedPhases = sequencesOfDraggedPhases[0];

				let assignmentsSupplier = assignments.filter(assignment => this.supplier(assignment) === supplierOfDraggedPhases).map(assignment => assignment.Id);
				let sequencesOfSupplier = sequenceData.filter(sequence => sequence.actualData.activities.some(activity => {
					if (typeof assignments.find(assignment => assignment.Id === activity.Id) !== 'undefined' && assignments.find(assignment => assignment.Id === activity.Id).FormworkTypeFk > 0 && activity.EntityName === 'PpsPhase' && assignmentsSupplier.includes(activity.Id)) {
						return true;
					}
				}));

				if (sequenceOfDraggedPhases) {

					let calendarData = dateShiftHelperService.getCalendarData(dataServiceForDateshift.getServiceName());
					let intersectedSequences = platformSequenceManagerService.getIntersectingSequences(sequencesOfSupplier, moment.min(phases.map(phase => this.from(phase))), planningBoardDataService.assignments, calendarData);
					let isOutOfOwnSequenceBounds = false;
					let phaseDropDate = moment.min(phases.map(phase => this.from(phase)));
					let filteredIntersectedSequences = intersectedSequences.filter(interSequence => interSequence.sequenceId !== sequenceOfDraggedPhases.sequenceId);
					let phasesAreProduct = phases.every(phase => phase.FormworkTypeFk === 0);
					if (filteredIntersectedSequences.length === 0 && intersectedSequences.length === 1 && phasesAreProduct) { // if intersecting with it's own sequence

						let filteredActivities = intersectedSequences[0].actualData.activities.filter(activity => !phases.map(phase => phase.Id).includes(activity.Id) && (assignments.find(a => a.Id === activity.Id)).FormworkTypeFk === 0);
						if (filteredActivities.length > 0) {
							let filteredAssignments = assignments.filter(assignment => filteredActivities.map(activity => activity.Id).includes(assignment.Id));

							let filteredSequenceEnd = moment.max(filteredActivities.map(activity => activity.EndDate));
							let filteredSequenceStart = moment.min(filteredActivities.map(activity => activity.StartDate));

							let suppliersOfFiltered = filteredAssignments.map(assingnment => _self.supplier(assingnment)).filter((value, index, array) => array.indexOf(value) === index);
							let supplierChanged = !suppliersOfFiltered.includes(supplierOfDraggedPhases);

							isOutOfOwnSequenceBounds = moment.max(phases.map(p => _self.from(p))).isAfter(filteredSequenceEnd) || moment.max(phases.map(p => _self.to(p))).isBefore(filteredSequenceStart) || supplierChanged;
						}
					}

					if (phasesAreProduct && (intersectedSequences.length === 0 || isOutOfOwnSequenceBounds)) {
						let creationData = {
							integrateFormworkForProductPhases: phases,
							sourceSequence: {
								PhasesForPlanningBoard: assignments.filter(assignment => sequenceOfDraggedPhases.actualData.activities.map(activity => activity.Id).includes(assignment.Id)),
								Relations: sequenceOfDraggedPhases.actualData.relations
							},
							modifiedPhasesToSave: [],
							modifiedPhasesToDelete: [],
							planningBoardDataService: planningBoardDataService
						};
						return planningBoardDataService.getAssignmentConfig().dataService.integrateFormworkForProductPhases(creationData);

					} else if (filteredIntersectedSequences.length > 0) {

						let dialogData = {
							creationData: {}
						};

						let intersectDialog = ppsProductionPlacePhaseIntegrationDialogService.getIntersectingSequencesDialogConfig(filteredIntersectedSequences);

						return platformModalFormConfigService.showDialog(intersectDialog).then(function (result) {
							if (result.custom1) { // button 'New' was clicked
								let creationData = {
									integrateFormworkForProductPhases: phases,
									sourceSequence: {
										PhasesForPlanningBoard: assignments.filter(assignment => sequenceOfDraggedPhases.actualData.activities.map(activity => activity.Id).includes(assignment.Id)),
										Relations: sequenceOfDraggedPhases.actualData.relations
									},
									modifiedPhasesToSave: [],
									modifiedPhasesToDelete: [],
									planningBoardDataService: planningBoardDataService
								};
								return planningBoardDataService.getAssignmentConfig().dataService.integrateFormworkForProductPhases(creationData);

							} else if (result.custom2) { // button 'Integrate' was clicked
								let intersectSequence = _.find(filteredIntersectedSequences, { 'sequenceId': result.data.intersectingSequence.id });
								dialogData.creationData.intersectSequence = intersectSequence;
								// TODO integrate phases in selected exsisting sequence
								let intersectActivity = intersectSequence.actualData.activities.find(activity => phaseDropDate.isBetween(activity.StartDate, activity.EndDate, null, []));
								if (typeof intersectActivity !== 'undefined') {
									let filteredRelations = intersectSequence.actualData.relations.find(relation => relation.SuccessorFk === intersectActivity.CompositeId || relation.PredecessorFk === intersectActivity.CompositeId);
									let creationData = {
										integratePhase: phases,
										sourceSequence: {
											PhasesForPlanningBoard: sequenceOfDraggedPhases.actualData.activities,
											Relations: sequenceOfDraggedPhases.actualData.relations
										},
										targetSequence: {
											PhasesForPlanningBoard: intersectSequence.actualData.activities,
											Relations: intersectSequence.actualData.relations,
											RelationToMerge: filteredRelations
										}
									};
									return planningBoardDataService.getAssignmentConfig().dataService.integratePhasesIntoSequence(creationData);
								}

							}
						});
					}
				}
			}
			return $q.resolve();
		};

		function canDragPhases(phases, dateShiftConfig) {
			const dataServiceForDateshift = dateShiftConfig.dataService;

			if (dataServiceForDateshift.isDateshiftDeactivated) {
				let noFormworksPhases = phases.every(phase => phase.FormworkTypeFk === 0);
				if (noFormworksPhases) {

					let suppliersOfPhases = phases.map(phase => _self.supplier(phase)).filter((value, index, array) => array.indexOf(value) === index);
					let isSameSupplier = suppliersOfPhases.length === 1;

					const sequenceData = dateShiftConfig.dateShiftHelperService.getSequenceData(dateShiftConfig.dataService.getServiceName());
					let isSameSquence = sequenceData.filter(sequence => phases.every(phase => sequence.actualData.activities.map(s => s.Id).includes(phase.Id))).length === 1;

					return isSameSupplier && isSameSquence;
				} else {
					return false;
				}
			}

			return true;
		}

		this.canMultiShiftAssignment = function canMultiShiftAssignment(selectedPhases){
			return true;
		};

		this.canEditCalendar = () => {
			return true;
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


		this.updateMaintenanceList = () =>{
			ppsProductionPlacePlanningBoardAssignmentService.updateMaintenanceData();
		}

		/** HELPER FUNCTIONS **/

		function updateCalendarInDateshiftData(draggedAssignment, assignments, planningBoardDataService) {
			const supplierMapServ = planningBoardDataService.getSupplierConfig().mappingService;
			const supplierMap = new Map(planningBoardDataService.getSupplierConfig().dataService.getList().map(x => [x.Id, x]));
			const supplierOfAssignment = supplierMap.get(_self.supplier(draggedAssignment));

			if (supplierOfAssignment) {
				const calendarOfSupplier = supplierMapServ.calendar(supplierOfAssignment);

				_self.calendar(draggedAssignment, calendarOfSupplier);

				assignments.forEach(assignment => _self.calendar(assignment, calendarOfSupplier));

				const dsConfig = planningBoardDataService.getDateshiftConfig();
				const genericEntities = dsConfig.dataService.findGenericEntities(assignments, dsConfig.entityName);
				if (genericEntities.length > 0) {
					let compositeIdsOfDraggedGeneric = genericEntities.map(gE => gE[dsConfig.dataService.getDateshiftData().config.id]);
					dsConfig.dateShiftHelperService.updateCalendarId(dsConfig.dataService.getServiceName(), compositeIdsOfDraggedGeneric, calendarOfSupplier);
				}
			}
		}

		this.calendar = (phase, calendarId, pbDataService) => {
			if (_.isNumber(calendarId)) {
				phase.CalCalendarFk = calendarId;
			}

			if (pbDataService) {
				updateCalendarInDateshiftData(phase, [phase], pbDataService);
			}

			return phase.CalCalendarFk;
		}

		this.getWriteAccessRight =(planningBoardDataService) =>{
			 return planningBoardDataService.getAssignmentConfig().dataService.getAccessRights ? !!planningBoardDataService.getAssignmentConfig().dataService.getAccessRights().write : true;
		}
	}
})();
