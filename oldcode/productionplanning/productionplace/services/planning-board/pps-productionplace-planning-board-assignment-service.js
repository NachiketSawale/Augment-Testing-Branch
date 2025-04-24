/* global _,globals */

(function () {
	'use strict';

	const moduleName = 'productionplanning.productionplace';
	const serviceName = 'ppsProductionPlacePlanningBoardAssignmentService';

	angular.module(moduleName).factory(serviceName, AssignmentService);

	AssignmentService.$inject = ['platformDataServiceFactory', 'ppsProductionPlaceDataService', 'ppsVirtualDataServiceFactory', 'productionplanningCommonActivityDateshiftService',
		'platformDataServiceProcessDatesBySchemeExtension', 'ppsProductionPlacePlanningBoardDemandService', '$http', 'moment',
		'platformDataServiceModificationTrackingExtension', 'productionplanningCommonProductItemDataService', 'platformGridAPI', '$q', 'ppsMaintenanceDataService','platformPlanningBoardDataService', 'platformSchemaService', 'platformPermissionService'];

	function AssignmentService(platformDataServiceFactory, ppsProductionPlaceDataService, ppsVirtualDataServiceFactory, productionplanningCommonActivityDateshiftService,
		platformDataServiceProcessDatesBySchemeExtension, prodPlaceDemandDataService, $http, moment,
		platformDataServiceModificationTrackingExtension, productionplanningCommonProductItemDataService, platformGridAPI, $q, ppsMaintenanceDataService, platformPlanningBoardDataService, platformSchemaService, platformPermissionService) {
		const dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});

		const serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.processconfiguration.entityPhase',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phase/',
					endRead: 'getByPlanningBoardFilter',
					endDelete: 'multidelete',
					endCreate: 'createforplanningboard',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.ProductionPlaceIds = _.map(ppsProductionPlaceDataService.getList(), 'Id');
						readData.From = container.data.filter.From;
						readData.To = container.data.filter.To;
					}
				},
				dataProcessor: [dateProcessor],
				entitySelection: { supportsMultiSelection: true },
				entityRole: {
					leaf: {
						itemName: 'Phase',
						parentService: ppsProductionPlaceDataService
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.Id = prodPlaceDemandDataService.getSelected().Id;
						},
						incorporateDataRead: function (readData, data) {
							// virtual data load
							let mainItemIds = _.map(readData, 'Id');
							const dateshiftFilter = {
								mainItemIds,
								entity: 'PpsPhase',
								foreignKey: 'Id',
								triggerEntityName: service.getItemName()
							};

							if (mainItemIds.length > 0) {
								return container.data.handleReadSucceeded(readData, data);
							}
						}
					}
				},
				useItemFilter: true
			}
		};

		const container = platformDataServiceFactory.createNewComplete(serviceOption);
		let service = container.service;

		container.data.doNotUnloadOwnOnSelectionChange = true;
		container.data.doNotLoadOnSelectionChange = true;

		container.service.createItems = function createItems(creationData, dataService, creationCalendarData) {
			if (creationData.hasOwnProperty('intersectSequence')) {

				creationData.PlannedStart = null;
			   	creationData.PlannedFinish = null;

			   	const modifications = platformDataServiceModificationTrackingExtension.getModifications(container.service);

				const eventTargetSequence = creationData.intersectSequence.actualData.activities.filter(activity => activity.EntityName === 'Event');

				const phaseTargetSequence = creationData.intersectSequence.actualData.activities.filter(activity => activity.EntityName === 'PpsPhase');

				const intersectParams = {
					PlanningUnitId: creationData.demandFk,
					ModifiedPhasesToSave: modifications.PhaseToSave || [], // list of phases to save/update (newly created ones are here, too!)
					ModifiedPhasesToDelete: modifications.PhaseToDelete || [], // list of phases to delete
					TargetSequence: {
						// generic ds event entities
						Events: eventTargetSequence,
						// on request of BE Dev - assingnmet entities for the generic ones
						Phases: Array.from(creationData.dataService.assignments.values()).filter(assignment => phaseTargetSequence.map(p => p.Id).includes(assignment.Id)),
						Relations: creationData.intersectSequence.actualData.relations
					}
				};

				return $http.post(container.data.httpCreateRoute + 'integrateForPlanningBoard', intersectParams).then(function (response) {
					if (container.data.onCreateSucceeded && response.data) {
						const targetSequenceClone = _.cloneDeep(intersectParams.TargetSequence);
						const mergeSequencePhases = integratePhaseInSequence(response.data.ModifiedPhases, Array.from(creationData.dataService.assignments.values()).filter(assignment => targetSequenceClone.Phases.map(p => p.Id).includes(assignment.Id)));

						response.data.ModifiedPhases.forEach((p) => container.data.onCreateSucceeded(p, container.data, {}));

						if (_.isFunction(productionPlacePhaseVirtualDataService.addRelations) && response.data.RelationsToAdd) {
							productionPlacePhaseVirtualDataService.addRelations([...response.data.RelationsToAdd]);
						}

						if (_.isFunction(productionPlacePhaseVirtualDataService.removeRelations) && response.data.RelationsToRemove) {
							productionPlacePhaseVirtualDataService.removeRelations([...response.data.RelationsToRemove]);
						}

						return mergeSequencePhases;
					}
				});
			} else {

				const modifications = platformDataServiceModificationTrackingExtension.getModifications(container.service);

				const creationParams = {
					Id: creationData.demandFk,
					ModifiedPhasesToSave: modifications.PhaseToSave || [], // list of phases to save/update (newly created ones are here, too!)
					ModifiedPhasesToDelete: modifications.PhaseToDelete || [], // list of phases to delete
				};

				return $http.post(container.data.httpCreateRoute + 'createForPlanningBoard', creationParams).then(function (response) {
					if (container.data.onCreateSucceeded && response.data) {

						let promiseList = [];

						// Take only phases, correct the start and finish dates and initiate phases creation in planning board
						let createdAssignments = [...response.data.Phases];
						createdAssignments = correctStartAndFinishDatesOfCreated(createdAssignments, dataService, creationCalendarData);

						// add event entities to virtual data service
						if (_.isFunction(productionPlacePhaseVirtualDataService.addVirtualEntities) && response.data.Relations) {
							const entities = {};
							entities.Event = response.data.Activities.filter(x => response.data.Phases.filter(p => p.Id === x.Id).length === 0);
							productionPlacePhaseVirtualDataService.addVirtualEntities(entities);
							promiseList.push(productionPlacePhaseVirtualDataService.loadCalendarsByIds(entities.Event.map(e => e.CalCalendarFk)));
						}

						if (_.isFunction(productionPlacePhaseVirtualDataService.addRelations) && response.data.Relations) {
							productionPlacePhaseVirtualDataService.addRelations(response.data.Relations);
						}

						return $q.all(promiseList).then(() => {
							createdAssignments.forEach((p) => container.data.onCreateSucceeded(p, container.data, {}));

							return createdAssignments;
						});
					}
				});
			}
		};

		function correctStartAndFinishDatesOfCreated(assignments, dataService, creationCalendarData) {
			// find index of first assignment of type Phase
			let indexOfFirstPhaseEntity = 0;
			if (assignments.find(assignment => assignment.FormworkTypeFk === 0)) {
				const firstPhaseEntity = assignments.find(assignment => assignment.FormworkTypeFk === 0);
				indexOfFirstPhaseEntity = assignments.indexOf(firstPhaseEntity);
			}

			assignments.forEach((x) => {
				x.PlannedStart = moment.utc(x.PlannedStart);
				x.PlannedFinish = moment.utc(x.PlannedFinish);
			});

			// use the create fn to calculate correct dates for phases based on calendar
			return dataService.getAssignmentConfig().mappingService.createAssignments(
				assignments[indexOfFirstPhaseEntity],
				assignments,
				creationCalendarData,
				dataService.getDateshiftConfig(),
				{
					useCustomPostCreation: true,
					noQuantityUpdate: true
				},
				dataService);
		}

		container.service.deleteSelection = function deleteSelection(dateShiftConfig) {

			let selectedPhases = service.getSelectedEntities();
			let sequenceData = productionPlacePhaseVirtualDataService.getSequenceData();
			if (sequenceData.length > 0) {
				selectedPhases.forEach(selectedPhase => {
					let deleteSequenceData = sequenceData.filter(sq => sq.actualData.activities.some(activity => activity.Id === selectedPhase.Id));
					if (deleteSequenceData.length > 0) {

						const deletePhaseParam = {
							Relations: deleteSequenceData[0].actualData.relations,
							PhaseId: selectedPhase.Id
						};
						return $http.post(container.data.httpCreateRoute + 'removeForPlanningBoard', deletePhaseParam).then(function (response) {
							if (response.data) {
								container.data.deleteItem(selectedPhase, container.data);
								if (_.isFunction(productionPlacePhaseVirtualDataService.addRelations) && response.data.RelationsToAdd) {
									productionPlacePhaseVirtualDataService.addRelations(response.data.RelationsToAdd);
								}
								if (_.isFunction(productionPlacePhaseVirtualDataService.removeRelations) && response.data.RelationsToRemove) {
									productionPlacePhaseVirtualDataService.removeRelations(response.data.RelationsToRemove);
								}
								if (dateShiftConfig) {
									dateShiftConfig.dateShiftHelperService.updateSequenceData(dateShiftConfig.dataService.getServiceName());
								}


							}
						});
					} else {
						service.deleteEntities(selectedPhases);
					}
				});
			} else {
				service.deleteEntities(selectedPhases);
			}
		};
		service.update = service.parentService().update;

		container.service.integrateFormworkForProductPhases = (creationData) => {
			if (creationData.hasOwnProperty('integrateFormworkForProductPhases')) {
				const modifications = platformDataServiceModificationTrackingExtension.getModifications(container.service);
				const formowrkForPhasesParams = {
					PhasesToIntegrate: [...creationData.integrateFormworkForProductPhases],
					SourceSequence: creationData.sourceSequence,
					ModifiedPhasesToSave: modifications.PhaseToSave || [], // list of phases to save/update (newly created ones are here, too!)
					ModifiedPhasesToDelete: modifications.PhaseToDelete || [], // list of phases to delete
				};

				return $http.post(container.data.httpCreateRoute + 'createformworkforphases', formowrkForPhasesParams).then(function (response) {
					if (container.data.onCreateSucceeded && response.data) {
						let dataService = creationData.planningBoardDataService;
						let phasesToAdd = response.data.ModifiedPhases.filter(phaseToAdd => !formowrkForPhasesParams.PhasesToIntegrate.map(p => p.Id).includes(phaseToAdd.Id));

						phasesToAdd.forEach((p) => container.data.onCreateSucceeded(p, container.data, {}));
						phasesToAdd.splice(1, 0, ...formowrkForPhasesParams.PhasesToIntegrate);
						phasesToAdd = dataService.getAssignmentConfig().mappingService.createAssignments(formowrkForPhasesParams.PhasesToIntegrate[0], phasesToAdd, null, dataService.getDateshiftConfig());


						if (_.isFunction(productionPlacePhaseVirtualDataService.addRelations) && response.data.RelationsToAdd) {
							productionPlacePhaseVirtualDataService.addRelations(response.data.RelationsToAdd);
						}

						if (_.isFunction(productionPlacePhaseVirtualDataService.removeRelations) && response.data.RelationsToRemove) {
							productionPlacePhaseVirtualDataService.removeRelations(response.data.RelationsToRemove);
						}


						phasesToAdd.forEach(newAssignment => {
							dataService.getAssignmentConfig().mappingService.validateAssignment(newAssignment, dataService.assignmentDataService);
							newAssignment.pBoardModified = true;
							if (!dataService.assignments.get(newAssignment.Id)) {
								dataService.assignments.set(newAssignment.Id, newAssignment);
							} else {
								dataService.updateAssignment(newAssignment);
							}
						});

						dataService.getDateshiftConfig().dataService.mergeChangedVirtualData(phasesToAdd, dataService.getDateshiftConfig().entityName);
						dataService.getDateshiftConfig().dateShiftHelperService.resetDateshift(dataService.getDateshiftConfig().dataService);
						dataService.getDateshiftConfig().dateShiftHelperService.updateSequenceData(dataService.getDateshiftConfig().dataService);

						return phasesToAdd;
					}
				});
			}
		};

		container.service.integratePhasesIntoSequence = (creationData) => {

			creationData.PlannedStart = null;
			creationData.PlannedFinish = null;

			const modifications = platformDataServiceModificationTrackingExtension.getModifications(container.service);
			const integratePhasesParams = {
				PhasesToIntegrate: [...creationData.integratePhase],
				SourceSequence: creationData.sourceSequence,
				TargetSequence: creationData.targetSequence,
				ModifiedPhasesToSave: modifications.PhaseToSave || [], // list of phases to save/update (newly created ones are here, too!)
				ModifiedPhasesToDelete: modifications.PhaseToDelete || [], // list of phases to delete
			};

			return $http.post(container.data.httpCreateRoute + 'integratephaseintosequence', integratePhasesParams).then(function (response) {
				if (container.data.onCreateSucceeded && response.data) {

					let phasesToAdd = response.data.ModifiedPhases;

					phasesToAdd.forEach((p) => container.data.onCreateSucceeded(p, container.data, {}));

					if (_.isFunction(productionPlacePhaseVirtualDataService.addRelations) && response.data.RelationsToAdd) {
						productionPlacePhaseVirtualDataService.addRelations(response.data.RelationsToAdd);
					}

					if (_.isFunction(productionPlacePhaseVirtualDataService.removeRelations) && response.data.RelationsToRemove) {
						productionPlacePhaseVirtualDataService.removeRelations(response.data.RelationsToRemove);
					}
					return phasesToAdd;
				}
			});
		};

		function integratePhaseInSequence(phasesToIntegrate, phaseSequence) {
			phaseSequence = sortByStartDate(phaseSequence);
			let lastPhase = phaseSequence.find(phase => phase.PlannedFinish === moment.max(phaseSequence.map(otherPhase => otherPhase.PlannedFinish)));
			// insert the new phase into second last position in sequence if last is a formwork. add to the end otherwise
			let positionOfIntegration = lastPhase.PpsFormworkFk > 0 ? -1 : phaseSequence.length;
			phaseSequence.splice(positionOfIntegration, 0, ...phasesToIntegrate);
			return phaseSequence;
		}

		function sortByStartDate(phases) {
			return phases.sort((a, b) => {
				if (moment(a.PlannedStart).isBefore(moment(b.PlannedStart))) {
					return -1;
				}
				if (moment(b.PlannedStart).isBefore(moment(a.PlannedStart))) {
					return 1;
				}
				return 0;
			});
		}


		let requirmentsDropdownPropsCache = [];
		container.service.getExtraRequirementsDropdownProperties = (isInitialLoad = false) => {
			if (isInitialLoad) {
				return $http.post(container.data.httpCreateRoute + 'getPhaseRequirements').then(function (response) {
					requirmentsDropdownPropsCache = response.data;
					return response.data;
				});
			}
			return requirmentsDropdownPropsCache;
		};

		let dateShiftConfig = {
			dateshiftId: 'productionplanning.phase'
		};

		productionplanningCommonActivityDateshiftService.registerToVirtualDateshiftService(moduleName, container, dateShiftConfig.dateshiftId);

		const productionPlacePhaseVirtualDataService = ppsVirtualDataServiceFactory.getVirtualDataService(moduleName);
		container.service.getExtraRequirementsDropdownProperties(true);

		container.service.updateMaintenanceData = () => {

			let ruleSetAttributeDomains  = platformSchemaService.getSchemaFromCache({
				typeName: 'PhaseForPlanningBoardDto',
				moduleSubModule: 'Productionplanning.ProcessConfiguration'
			});
			ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

			let mainList = ppsMaintenanceDataService.getList();

			let pbDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('3dee881400914baa92d596e210c7e4bd');

			let assignments = Array.from(pbDataService.assignments.values());

			if(mainList.length > 0){
				mainList.forEach((mainData) => {

					let mainAssignment = assignments.find(a => a.PpsProductionPlaceFk === mainData.PpsProductionPlaceFk && a.Id === mainData.Id);

					let mAssignment = assignments.find(a => a.Type === 'Maintenance');

					if(typeof mainAssignment === 'undefined'){

						if(typeof mAssignment === 'undefined'){
							mAssignment = {};
							Object.entries(ruleSetAttributeDomains).forEach(([key, value]) => {
										console.log(key + ' - ' + value.domain) // key - value
										if(value.domain === 'datetimeutc'|| value.domain === 'description' || value.domain === 'translation' || value.domain === 'history'){

											mAssignment[key] = null;
										}else if(value.domain === 'integer' || value.domain === 'decimal' || value.domain === 'quantity'){
											mAssignment[key] = 0;
										}else if(value.domain === 'boolean'){
											mAssignment[key] = false;
										}
							});
							//extra flag added for maintenance
							mAssignment.IsForMaintenance = true;
							mAssignment.CustomId = 'M'
							mAssignment.CommentText = null;
							mAssignment.Id = 0;
							mAssignment.Type = 'Maintenance';

						}
						let newMassignment = _.cloneDeep(mAssignment);
						newMassignment.Id = mainData.Id
						newMassignment.PlannedStart = mainData.StartDate;
						newMassignment.PlannedFinish = mainData.EndDate;
						newMassignment.PpsProductionPlaceFk = mainData.PpsProductionPlaceFk;
						newMassignment.CommentText = mainData.CommentText;
						pbDataService.assignments.set(mainData.Id, newMassignment);

					}else if(!mainAssignment.PlannedStart.isSame(mainData.StartDate)
					|| !mainAssignment.PlannedFinish.isSame(mainData.EndDate)){
						mainAssignment.PlannedStart = mainData.StartDate;
						mainAssignment.PlannedFinish = mainData.EndDate;
						pbDataService.assignments.set(mainAssignment.Id, mainAssignment);
					}

				});
			}
		}

		container.service.registerSelectedEntitiesChanged(() => {


			if (platformGridAPI.grids.exist('fde309107aaf43d78ec1b8b16f726364')) { // make request only when conatiner shown
				let selectedAssignment = service.getSelectedEntities();
				if(selectedAssignment.length > 0) {
					if (selectedAssignment[0].FormworkTypeFk === 0) { // show data only for phases!
						productionplanningCommonProductItemDataService.setSelected(selectedAssignment[0], selectedAssignment);
					} else {
						productionplanningCommonProductItemDataService.setSelected(null, []);
					}
				}
			}
		});

		container.service.getContainerData = () => {
			return container.data;
		}

		let accessRights = {
			read : null,
			write : null,
			create : null,
			execute : null,
			delete : null
		};

		container.service.getAccessRights = () =>{
			if(accessRights.write === null){
				platformPermissionService.loadPermissions(['f10baf3f63a04d6a9b4b51514ebde160']).then(function () {
					accessRights.write = (platformPermissionService.hasWrite('f10baf3f63a04d6a9b4b51514ebde160')) ? true : false;
				});
			}
			return accessRights;

		}

		return container.service;
	}
})();