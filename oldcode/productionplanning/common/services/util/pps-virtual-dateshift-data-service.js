/**
 * Created by hof on 24/02/2021.
 */
/* global _ */
(function factoryFn() {
	'use strict';
	/**
	 * @ngdoc factory
	 * @name ppsVirtualDateshiftDataService
	 * @function
	 *
	 * @description
	 * Facotry to created services to handle mixed entities and shift dates.
	 **/

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsVirtualDateshiftDataServiceFactory', ppsVirtualDateshiftDataServiceFactory);

	ppsVirtualDateshiftDataServiceFactory.$inject = ['$http', '$q', '$timeout', '$injector',
		'platformDateshiftCalendarService',
		'ppsVirtualDataServiceFactory',
		'platformDateshiftHelperService'];

	function ppsVirtualDateshiftDataServiceFactory($http, $q, $timeout, $injector, platformDateshiftCalendarService, ppsVirtualDataServiceFactory, dateshiftHelperService) {

		let factory = {};

		const moduleEndpoint = 'productionplanning/common/event/';

		factory.createNewVirtualDateshiftDataService = function createNewVirtualDateshiftDataService(moduleName, rootService) {

			/*****************************************************************************************
			 *      Initialization
			 *****************************************************************************************/

			// region Initialization

			let originalHandleOnUpdateSucceeded = {};

			function addVirtualRelations(newRelations, currentData) {
				let actualNewRelations = _.filter(newRelations, (newRel) => {
					let isRemoved = _.find(data.removedRelations, (remRel) => { return isSameRelation(remRel, newRel); });
					return _.isNil(isRemoved);
				});
				// union by unique data sets
				const actualNewRelMap = new Set(actualNewRelations.map(x => x.PredecessorFk + x.SuccessorFk));
				currentData.relations = [...actualNewRelations, ...currentData.relations.filter(rel => !actualNewRelMap.has(rel.PredecessorFk + rel.SuccessorFk))];
			}

			function addCalendarData(calendarData, currentData, resetData = true) {
				calendarData.forEach(calendarObj => {
					currentData.calendarData.set(calendarObj.Id, calendarObj);
				});
				if (resetData) {
					dateshiftHelperService.resetDateshift(service.getServiceName());
				}
			}

			function addDefaultCalendarData(defaultCalendar, currentData) {
				currentData.calendarData.set('default', defaultCalendar);
				dateshiftHelperService.resetDateshift(service.getServiceName());
			}

			function updateCalendarData(calendarData, currentData) {
				let calendarDataArray = Array.from(calendarData.values());

				let indexDefaultCal = Array.from(calendarData.keys()).indexOf('default');

				let otherCalendarIds = calendarDataArray.filter((val, i) => i !== indexDefaultCal);
				let projectCalendarId = calendarDataArray[indexDefaultCal] && calendarDataArray[indexDefaultCal].Id ? calendarDataArray[indexDefaultCal].Id : null;

				platformDateshiftCalendarService.clearCalendarCache();
				getCalendarDataByIds(otherCalendarIds, projectCalendarId, currentData).then(() => {
					dateshiftHelperService.resetDateshift(service.getServiceName());
				});
			}

			/**
			 * @ngdoc function
			 * @name incorporateVirtualDataRead
			 * @description Private method that is called when a VDS is reading dataShiftData from the server.
			 * Only the relations and calendar data is stored. The acitvities are stored by the underlying VDS.
			 *
			 * @param {Object} readData: Server result object that contains the dateshift data.
			 * @param {Object[]} readData.relations: List of relations objects.
			 * @param {number} readData.projectCalendarId: Id of the calendar used for the dateshift.
			 *
			 * @returns {Promise<Object>} Returns a promise that loads the calendar data.
			 * Resolves with returning the original readData readData.
			 **/
			function incorporateVirtualDataRead(readData, currentData) {
				addVirtualRelations(readData.relations, currentData);
				const relationCalendars = Object.keys(_.groupBy(readData.relations, currentData.dateshiftConfig.calendar)).map(calendarIdString => parseInt(calendarIdString));

				let entitiesCalendars = [];
				new Map(Object.entries(readData.dtos)).forEach((entities, type) =>  entitiesCalendars = [...entitiesCalendars, ...entities.map(x => x[service.getContainerData().entityMappings[type].CalendarId])]);
				entitiesCalendars = [...new Set(entitiesCalendars).values()]; // distinct

				const calendarIds = [...new Set([...relationCalendars, ...entitiesCalendars]).values()]; // distinct
				return getCalendarDataByIds(calendarIds, readData.projectCalendarId, currentData, readData);
			}

			function getCalendarDataByIds(calendarIds, projectCalendarId, currentData, readData = []) {
				return platformDateshiftCalendarService.getCalendarsByIds(calendarIds)
					.then(function fn(calendarData) {
						addCalendarData(calendarData, currentData, false);
						platformDateshiftCalendarService.getCalendarsByIds([projectCalendarId])
							.then(function fn(projectCalendarData) {
								let projectCalendar = null;
								if (projectCalendarData.length > 0) {
									projectCalendar = projectCalendarData[0];
								}
								addDefaultCalendarData(projectCalendar, currentData);
								return readData;
							});
					});
			}

			/**
			 * @ngdoc function
			 * @name registerActualServiceForDateshift
			 * @description Public function that registers a serviceContainer to the VDS.
			 *
			 * @param {string} entityName: The entity name of the actual entities stored by the passed serviceContainer.
			 * @param {Object} serviceContainer: The serviceContainer that is registered to the VDS.
			 * @param {Object} [config]: Optional config object for the registrations.
			 **/
			function registerActualServiceForDateshift(entityName, serviceContainer, config) {
				let resetDateshiftFunction = () => {
					if (!service.isMulticreationInProgress) {
						dateshiftHelperService.resetDateshift(service.getServiceName());
					}
				};
				serviceContainer.service.registerSelectionChanged(resetDateshiftFunction);

				// on creating an entity the calendar data may be required:
				let onEntityCreated = () => {
					// TODO: Add calendar implementation

					// platformDateshiftCalendarService.getCalendarsByIds([])
					// .then( function fn(calendarData) {
					// addCalendarData(calendarData, data.calendarData);
					// });
					if (!service.isMulticreationInProgress) {
						dateshiftHelperService.resetDateshift(service.getServiceName());
						dateshiftHelperService.updateSequenceData(service.getServiceName());
					}
				};
				if (_.isFunction(serviceContainer.service.registerEntityCreated)) {
					serviceContainer.service.registerEntityCreated(onEntityCreated);
				}

				if (_.isFunction(rootService.getContainerData)
					&& virtualHandleOnUpdateSucceded !== rootService.getContainerData().handleOnUpdateSucceeded) {
					originalHandleOnUpdateSucceeded = rootService.getContainerData().handleOnUpdateSucceeded;
					rootService.getContainerData().handleOnUpdateSucceeded = virtualHandleOnUpdateSucceded;
				}

				// on deletion, redundant relations must be removed
				let onEntityDeleted = (redundantParam, deletedItem) => {
					let deletedItems = _.isArray(deletedItem) ? deletedItem : [deletedItem];
					let redundantRelations = [];
					_.forEach(deletedItems, (delAct) => {
						let compositeId = `${data.entityPrefixes[entityName]}${delAct[config.match || 'Id']}`;
						let curRedRelations = _.filter(data.relations, (rel) => {
							return rel[data.dateshiftConfig.nextEdgeKey] === compositeId ||
								rel[data.dateshiftConfig.prevEdgeKey] === compositeId;
						});
						redundantRelations.push(...curRedRelations);
					});
					if (!_.isEmpty(redundantRelations)) {
						service.removeRelations(redundantRelations);
						resetDateshiftFunction();
					}
				};
				if (_.isFunction(serviceContainer.service.registerEntityDeleted)) {
					serviceContainer.service.registerEntityDeleted(onEntityDeleted);
				}
			}

			let virtualDataServiceConfig = {
				id: moduleName,
				customDataRead: incorporateVirtualDataRead,
				customServiceRegistration: registerActualServiceForDateshift,
				endpoint: {
					route: moduleEndpoint,
					read: 'dataForDateshift',
					options: 'optionsForDateshift'
				},
				dateProcessors: {
					Event: { typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common' },
					ResReservation: { typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation' },
					ResRequisition: { typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition' },
					PpsPhase: { typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration' },
					DailyProduction: { typeName: 'ProductionsetDto', moduleSubModule: 'ProductionPlanning.ProductionSet' }
				},
				messageDescriptions: {
					Event: {
						getDescriptionPromiseFn: () => {
							let serviceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
							if (serviceFactory && serviceFactory.getService) {
								let dataServiceForModule = serviceFactory.getService(null, moduleName, rootService);
								if (dataServiceForModule && dataServiceForModule.getDateShiftMessageDescription) {
									return dataServiceForModule.getDateShiftMessageDescription;
								}
							}
							// fallback - star is an indicator of missing getDateShiftMessageDescription fn in dataService!
							return (eventList) => {
								return Promise.resolve(new Map([
									['*eventCode', new Map(eventList.map(eventEntity => [eventEntity.Id, eventEntity.EventCode || '']))]
								]));
							};
						},
						mappedProperties:  [
							{
								module: 'productionplanning.common', translation: 'event.eventCode', defaultDescription: '*Event Code', propName: 'eventCode'
							}]
					},
					PpsPhase: {
						getDescriptionPromiseFn: () => {
							let serviceFactory = $injector.get('productionplanningPhaseDataServiceFactory');
							if (serviceFactory && serviceFactory.getService) {
								let dataServiceForModule = serviceFactory.getService(moduleName, rootService);
								if (dataServiceForModule && dataServiceForModule.getDateShiftMessageDescription) {
									return dataServiceForModule.getDateShiftMessageDescription;
								}
							}
							// fallback - star is an indicator of missing getDateShiftMessageDescription fn in dataService!
							return (phaseList) => {
								return Promise.resolve(new Map(
									['*phaseProcessId', new Map(phaseList.map(phaseEntity => [phaseEntity.Id, phaseEntity.PpsProcessFk || '']))]
								));
							};
						},
						mappedProperties: [
							{
								module: 'productionplanning.product', translation: 'phase.productCode', defaultDescription: '*Product Code', propName: 'productCode'
							},
							{
								module: 'productionplanning.processconfiguration', translation: 'phaseTemplate.phaseType', defaultDescription: '*Phase Type', propName: 'phaseType'
							}]
					},
				},
				validation: {
					Event: {
						initService: (dataServ) => {
							// let dateShiftConfig = { dateshiftId: `${moduleName}.virtual` };
							let dateShiftConfig = { dateshiftId: `${moduleName}` };
							return $injector.get('productionplanningCommonEventValidationService').getValidationService(dataServ, dateShiftConfig.dateshiftId, dateShiftConfig);
						},
						properties: ['PlannedStart', 'PlannedFinish']
					}
				},
				parentService: rootService
			};

			let serviceContainer = ppsVirtualDataServiceFactory.createVirtualDataService(virtualDataServiceConfig);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			// endregion

			/*****************************************************************************************
			 *      Data
			 *****************************************************************************************/

			data.relations = [];
			data.removedRelations = [];
			data.calendarData = new Map();
			data.dateshiftConfig = {
				id: 'CompositeId',
				start: 'StartDate',
				end: 'EndDate',
				nextEdgeKey: 'SuccessorFk',
				prevEdgeKey: 'PredecessorFk',
				relationKind: 'RelationKindFk',
				relationType: 'RelationTypeFk',
				isLocked: 'IsLocked',
				IsLockedStart: 'IsLockedStart',
				IsLockedFinish: 'IsLockedFinish',
				IsLockedStartVirtual: 'IsLockedStartVirtual',
				IsLockedFinishVirtual: 'IsLockedFinishVirtual',
				calendar: 'CalendarId',
				propagateShiftForRelated: 'PropagateShiftForRelated'
			};
			data.parentService.registerListLoaded(function clearData() {
				data.relations.length = 0;
				data.removedRelations.length = 0;
				data.calendarData.clear();
				data.specializedEventCache.length = 0;
			});
			data.lastDateshiftId = null;
			data.specializedEventCache = [];

			/*****************************************************************************************
			 *      Service
			 *****************************************************************************************/

			// region Dateshift

			service.getDateshiftData = function getDateshiftData() {
				return {
					originalActivities: data.itemList,
					config: data.dateshiftConfig,
					relations: data.relations,
					calendarData: data.calendarData
				};
			};

			dateshiftHelperService.registerDateshift(serviceContainer.service);

			/**
			 * @ngdoc function
			 * @name shiftVirtualEntity
			 * @description Public method that dateshifts an entity using the underlying genericd data provided by the VDS.
			 *
			 * @param {Object} entity: Trigger entity that initiates the shift.
			 * @param {Object} entityName: Name of the entity under which the VDS stores the entities.
			 * @param {Object} configId: Name of the entity under which the VDS stores the entities.
			 * @param {String} fixedShiftVariant: Fixed shift variant for dateshift.
			 * @param {boolean} mergeAsync: Merge data in VDS async.
			 * @param {Object} shiftSatus: Optional parameter to inform if shifting finished. Set in dateshift helper.
			 *
			 * @returns {Object} Returns virtual entity list with shift manipuldated data.
			 * Returns empty array if the dateshift failed
			 **/
			service.shiftVirtualEntity = function shiftVirtualEntity(entity, entityName, configId, fixedShiftVariant, mergeAsync = false, matchingProperty, shiftSatus) {
				if (!_.isNil(data.lastDateshiftId) && data.lastDateshiftId !== configId) {
					dateshiftHelperService.resetDateshift(service.getServiceName());
				}
				data.lastDateshiftId = configId;
				data.mergeAsync = mergeAsync;
				let virtualEntities = [entity];
				let genericEntities = _.cloneDeep(service.findGenericEntities([entity], entityName, matchingProperty));
				service.mergeChangedVirtualData(virtualEntities, entityName, genericEntities);
				let triggerEntity = _.head(genericEntities);
				let dateShiftActivities = !_.isNil(triggerEntity) ? dateshiftHelperService.shiftDate(service.getServiceName(), triggerEntity, configId, fixedShiftVariant, shiftSatus) : null;
				let entityList = [];
				if (!_.isNil(dateShiftActivities)) {
					// entityList with dateShiftActivities, always update entity of trigger
					dateShiftActivities = dateShiftActivities.filter(activity => activity.hasChanged === true || triggerEntity.CompositeId === activity.CompositeId);
					virtualEntities = _.cloneDeep(service.findVirtualEntities(dateShiftActivities, entityName));
					entityList = service.mergeChangedGenericData(dateShiftActivities, virtualEntities);
				}

				return entityList;
			};

			service.virtualEntityChanged = function virtualEntityChanged(entity, entityName, mergeAsync = false, matchingProperty) {
				data.mergeAsync = mergeAsync;
				let virtualEntities = [entity];
				let genericEntities = _.cloneDeep(service.findGenericEntities(virtualEntities, entityName, matchingProperty));
				service.mergeChangedVirtualData(virtualEntities, entityName, genericEntities);
				let triggerEntity = _.head(genericEntities);
				triggerEntity.hasChanged = true;
				let dateShiftActivities = _.filter([triggerEntity], { 'hasChanged': true });
				virtualEntities = _.cloneDeep(service.findVirtualEntities(dateShiftActivities, entityName));
				Object.assign(data.getList().find(x => x.Id === entity.Id), triggerEntity);
				if (_.isFunction(service.updateProperties)) {
					service.updateProperties(data.getList());
				}
				return service.mergeChangedGenericData(dateShiftActivities, virtualEntities);
			};

			service.addCalendarData = function addCalData(calendarData) {
				addCalendarData(calendarData, data);
			};

			service.addDefaultCalendarData = function addDefCalData(calendarData) {
				addDefaultCalendarData(calendarData, data);
			};

			service.updateCalendarData = (calendarData) => {
				updateCalendarData(calendarData, data);
			};

			service.loadCalendarsByIds = (calendarIds) => {
				return platformDateshiftCalendarService.getCalendarsByIds(calendarIds)
					.then(function fn(calendarData) {
						addCalendarData(calendarData, data);
						return calendarData;
					});
			};

			// endregion

			// region Relations

			/**
			 * @ngdoc function
			 * @name addRelations
			 * @description Public method that adds relations to the dateshift data.
			 * Required to add dateshift relevant data that is only present on the client side/cache but not persisted yet.
			 *
			 * @param { Object[] } relations: Array of new relations that are added to the data service.
			 * The passed relations are validated based on the dateshift settings.
			 **/
			service.addRelations = function addRelations(relations) {
				let validRelations = _.filter(relations, (r) => {
					return _.has(r, data.dateshiftConfig.nextEdgeKey) &&
						_.has(r, data.dateshiftConfig.prevEdgeKey);
				});
				data.relations.push(...validRelations);
				// additionally, remove them from the removed relations (if applicable)
				_.forEach(validRelations, (addedRel) => {
					_.remove(data.removedRelations, (currentRelation) => {
						return isSameRelation(addedRel, currentRelation);
					});
				});
				// do a timeout before starting checking the relation integrity to ensure activities have been added!
				$timeout(() => {
					let integrityCheck = checkRelationIntegrity(validRelations);
					if (integrityCheck) {
						dateshiftHelperService.resetDateshift(service.getServiceName());
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name removeRelations
			 * @description Public method that removes relations from the dateshift data.
			 * Required to remove dateshift relevant data that is only present on the client side/cache but not persisted yet.
			 *
			 * @param { Object[] } relations: Array of new relations that are removed from the data service.
			 * The passed relations are validated based on the dateshift settings.
			 **/
			service.removeRelations = function removeRelations(relations) {
				let validRelations = _.filter(relations, (r) => {
					return _.has(r, data.dateshiftConfig.nextEdgeKey) &&
						_.has(r, data.dateshiftConfig.prevEdgeKey);
				});
				let removedRelationCheck = false;
				_.forEach(validRelations, (removedRel) => {
					let matchingRelations = _.remove(data.relations, (currentRelation) => {
						return isSameRelation(removedRel, currentRelation);
					});
					// if no relation was found among current relations: add them to missing relations!
					if (_.isEmpty(matchingRelations)) {
						data.removedRelations.push(removedRel);
					} else {
						removedRelationCheck = true;
					}
				});
				if (removedRelationCheck) {
					dateshiftHelperService.resetDateshift(service.getServiceName());
				}
			};

			function checkRelationIntegrity(newRelations) {
				// if we add relations we would have to check data integrity => load new data
				let missingActivityIds = [];
				_.forEach(newRelations, (newRelation) => {
					let predecessor = _.find(data.itemList, { CompositeId: newRelation[data.dateshiftConfig.prevEdgeKey] });
					if (_.isEmpty(predecessor)) {
						missingActivityIds.push(newRelation[data.dateshiftConfig.prevEdgeKey]);
					}
					let successor = _.find(data.itemList, { CompositeId: newRelation[data.dateshiftConfig.nextEdgeKey] });
					if (_.isEmpty(successor)) {
						missingActivityIds.push(newRelation[data.dateshiftConfig.nextEdgeKey]);
					}
				});
				let missingActivityRequests = {};
				_.forEach(missingActivityIds, (missId) => {
					let entityPrefix = _.head(missId);
					let entityId = parseInt(missId.replace(entityPrefix, ''));
					let entityName = _.findKey(data.entityPrefixes, (v) => { return v === entityPrefix; });
					if (_.isNil(missingActivityRequests[entityName])) {
						missingActivityRequests[entityName] = {
							entity: entityName,
							foreignKey: 'Id',
							mainItemSet: new Set()
						};
					}
					missingActivityRequests[entityName].mainItemSet.add(entityId);
				});
				_.forEach(missingActivityRequests, (filter) => {
					filter.mainItemIds = [...filter.mainItemSet];
					delete filter.mainItemSet;
					service.loadVirtualEntities(filter);
				});
				return _.isEmpty(missingActivityRequests);
			}

			function createRelation(activity1Id, activity1EntityName, activity2Id, activity2EntityName, relationKind = 4, relationType = 0) {
				let activity1Key = `${data.entityPrefixes[activity1EntityName]}${activity1Id}`;
				let activity2Key = `${data.entityPrefixes[activity2EntityName]}${activity2Id}`;
				return {
					[data.dateshiftConfig.prevEdgeKey]: activity1Key,
					[data.dateshiftConfig.nextEdgeKey]: activity2Key,
					[data.dateshiftConfig.relationKind]: relationKind,
					[data.dateshiftConfig.relationType]: relationType
				};
			}

			function isSameRelation(relation1, relation2) {
				// only compare suc/pre key!
				return relation1[data.dateshiftConfig.nextEdgeKey] === relation2[data.dateshiftConfig.nextEdgeKey] &&
					relation1[data.dateshiftConfig.prevEdgeKey] === relation2[data.dateshiftConfig.prevEdgeKey];
			}

			// endregion

			// region Events

			service.changeEvents = function changeEvents(subEvents, oldSuperEvent, newSuperEvent) {
				if (!_.isNil(oldSuperEvent)) {
					removeEvents(subEvents, oldSuperEvent);
				}
				if (!_.isNil(newSuperEvent)) {
					addEvents(subEvents, newSuperEvent);
				}
			};

			function addEvents(subEvents, superEvent) {
				if (superEvent.DateshiftMode !== 0) {
					let addedRelations = _.flatten(_.map(subEvents, (subEvent) => {
						return createSuperSubRelationsForEvents(superEvent, subEvent);
					}));
					service.addRelations(addedRelations);
				}
			}

			function removeEvents(subEvents, superEvent) {
				if (superEvent.DateshiftMode !== 0) {
					let removedRelations = _.flatten(_.map(subEvents, (subEvent) => {
						return createSuperSubRelationsForEvents(superEvent, subEvent);
					}));
					service.removeRelations(removedRelations);
				}
			}

			function validateEvent(event, forSuperEvent = false) {
				if (forSuperEvent === true && _.isNil(event)) {
					return true;
				}
				let propertyList = forSuperEvent === true ? ['Id', 'DateshiftMode'] : ['Id'];
				let validationResult = _.every(propertyList, (p) => { return !_.isNil(event[p]); });
				if (validationResult === false) {
					// eslint-disable-next-line no-console
					console.error(`The following event is not correctly set: ${JSON.stringify(event)}`);
				}
				return validationResult;
			}

			function createSuperSubRelationsForEvents(superEntity, subEntity) {
				if (!validateEvent(superEntity, true) || !validateEvent(subEntity)) {
					return;
				}
				let preRelType, sucRelType;
				switch (superEntity.DateshiftMode) {
					case 1: // Validate bounds
						preRelType = sucRelType = 4;
						break;
					case 2: // Shift children
						preRelType = 2;
						sucRelType = 3;
						break;
				}
				let preRelation = createRelation(superEntity.Id, 'Event', subEntity.Id, 'Event', 4, preRelType);
				let sucRelation = createRelation(subEntity.Id, 'Event', superEntity.Id, 'Event', 2, sucRelType);
				return [preRelation, sucRelation];
			}

			// endregion

			// region Specialized Events

			service.changeSpecialzedEvents = function changeSpecialzedEvents(subSpecEvents, oldSuperSpecEvent, newSuperSpecEvent) {
				// disect data first: Are event keys provided?
				let presentSpecializedEvents = _.filter([...subSpecEvents, oldSuperSpecEvent, newSuperSpecEvent], (e) => { return !_.isNil(e); });
				let specEvsWithMissingProp = _.filter(presentSpecializedEvents, (spE) => {
					return _.isNil(spE.PpsEventFk) || _.isNil(spE.DateshiftMode);
				});
				let collectionRequest = !_.isEmpty(specEvsWithMissingProp) ?
					loadMissingEvents(specEvsWithMissingProp) : $q.when(true);
				return collectionRequest.then(() => {
					addToSpecializedEventCache(presentSpecializedEvents);
					let subEvents = mapSpecializedEventsToEvents(subSpecEvents);
					let oldSuperEvent = mapSpecializedEventsToEvents(oldSuperSpecEvent);
					let newSuperEvent = mapSpecializedEventsToEvents(newSuperSpecEvent);
					service.changeEvents(subEvents, oldSuperEvent, newSuperEvent);
				});
			};

			function addToSpecializedEventCache(addedSpecEvs) {
				let essentialSpecEvs = _.map(addedSpecEvs, (e) => {
					return {
						PpsEntity: e.PpsEntity,
						Id: e.Id,
						PpsEventFk: e.PpsEventFk,
						DateshiftMode: e.DateshiftMode
					};
				});
				_.forEach(essentialSpecEvs, (ev) => {
					if (!_.isNil(ev, 'PpsEntity') && !_.isNil(ev, 'Id') && !_.isNil(ev, 'PpsEventFk')) {
						let presentInCache = _.find(data.specializedEventCache, { PpsEntity: ev.PpsEntity, Id: ev.Id });
						if (_.isNil(presentInCache)) {
							data.specializedEventCache.push(ev);
						}
					}
				});
			}

			function mapSpecializedEventsToEvents(specEvents) {
				let returnArray = true;
				if (!_.isArray(specEvents)) {
					specEvents = [specEvents];
					returnArray = false;
				}
				let mappedResult = _.map(specEvents, (specEvent) => {
					return !_.isNil(specEvent) ? {
						Id: specEvent.PpsEventFk,
						DateshiftMode: specEvent.DateshiftMode
					} : null;
				});
				return returnArray === true ? mappedResult : _.head(mappedResult);
			}

			// load missing eventids. dateshiftmode, etc.
			function loadMissingEvents(specEvsWithoutId) {
				let specEvPartition = _.partition(specEvsWithoutId, (specEvWithoutId) => {
					let matchingCacheEvent = _.find(data.specializedEventCache, { PpsEntity: specEvWithoutId.PpsEntity, Id: specEvWithoutId.Id });
					specEvWithoutId.PpsEventFk = !_.isNil(matchingCacheEvent) ? matchingCacheEvent.PpsEventFk : null;
					specEvWithoutId.DateshiftMode = !_.isNil(matchingCacheEvent) ? matchingCacheEvent.DateshiftMode : null;
					return !_.isNil(matchingCacheEvent);
				});
				let specEvsInCache = specEvPartition[0];
				let missingSpecEvs = specEvPartition[1];
				let resultRequest = $q.when(specEvsInCache);
				if (!_.isEmpty(missingSpecEvs)) {
					// TODO: Provide serverside fallback!
					// eslint-disable-next-line no-console
					console.error(`The following specialized events were not correctly cached: ${JSON.stringify(missingSpecEvs)}`);
				}
				return resultRequest;
			}

			service.getSequenceData = () => {
				return dateshiftHelperService.getSequenceData(service.getServiceName());
			};

			service.updateSepcializedEvents = (updatedSpecializedEvents) => {
				if (data.specializedEventCache && data.specializedEventCache.length > 0
					&& updatedSpecializedEvents && updatedSpecializedEvents.length > 0) {

					let mapSpecialized = {};
					let clonedSpecialized = {};
					let toUpdateSpecialized = [];

					updatedSpecializedEvents.forEach(updatedSpecializedEvent => {
						mapSpecialized = mapSpecializedEventsToEvents(updatedSpecializedEvent);
						clonedSpecialized = _.cloneDeep(updatedSpecializedEvent);
						clonedSpecialized.Id = mapSpecialized.Id; // set the id according to mapping of specialized event
						toUpdateSpecialized.push(clonedSpecialized);
					});

					updateVirtualEntityAfterUpdate({
						VirtualEventToSave: toUpdateSpecialized
					});
				}
			};

			function updateVirtualEntityAfterUpdate(response) {
				let modified = false;
				let toDeleteVirtual = {};
				let toAddVirtual = {};

				for (let entityTypeName in data.virtualEntities) {
					if (data.virtualEntities[entityTypeName]
						&& data.virtualEntities[entityTypeName].length > 0
						&& response[`Virtual${entityTypeName}ToSave`]
						&& response[`Virtual${entityTypeName}ToSave`].length > 0) {

						toDeleteVirtual[entityTypeName] = [];
						toAddVirtual[entityTypeName] = [];

						response[`Virtual${entityTypeName}ToSave`].forEach(e => {

							// to avoid concurrency issue
							let outdated = data.virtualEntities[entityTypeName]
								.find(virtualEntity => virtualEntity.Id === e.Id && virtualEntity.Version < e.Version);

							if (outdated) {
								modified = true;
								toDeleteVirtual[entityTypeName].push(outdated);
								toAddVirtual[entityTypeName].push(e);
							}
						});
					}
				}

				if (modified) {
					service.removeVirtualEntities(toDeleteVirtual);
					service.addVirtualEntities(toAddVirtual);
					dateshiftHelperService.resetDateshift(service.getServiceName());
				}
			}


			function virtualHandleOnUpdateSucceded(updateData, response, orgininalData) {
				if (_.isFunction(originalHandleOnUpdateSucceeded)) {
					originalHandleOnUpdateSucceeded(updateData, response, orgininalData, true);
				}
				updateVirtualEntityAfterUpdate(response);
			}

			// endregion

			return service;
		};

		return factory;
	}

})();
