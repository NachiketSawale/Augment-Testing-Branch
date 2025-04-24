/* global globals _ */
((angular) => {
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonCustomColumnsServiceFactory', CustomColumnsServiceFactory);
	CustomColumnsServiceFactory.$inject = ['$http', '$q', 'moment', 'platformDataValidationService', '$injector',
		'productionplanningCommonEventMainServiceFactory', 'platformDateshiftHelperService',
		'productionplanningCommonEventDateshiftService', 'ppsMasterDataServiceFactory',
		'basicsLookupdataLookupFilterService', 'ppsVirtualDataServiceFactory',
		'productionplanningCommonActivityDateshiftService', 'ppsEntityConstant'];

	function CustomColumnsServiceFactory(
		$http, $q, moment, platformDataValidationService, $injector,
		eventServiceFactory, platformDateshiftHelperService,
		ppsCommonEventDateshiftService, ppsMasterDataServiceFactory,
		lookupFilterService, ppsVirtualDataServiceFactory,
		ppsActivityDateshiftService, ppsEntityConstant) {
		var factory = {};

		var serviceCache = {};

		var filters = [{
			key: 'productionplanning-common-detailer-filter',
			serverKey: 'productionplanning-common-detailer-filter',
			serverSide: true,
			fn: function (item) {
				return item;
			}
		}];
		if (!lookupFilterService.hasFilter('productionplanning-common-detailer-filter')) {
			lookupFilterService.registerFilter(filters);
		}

		factory.createNewService = function (moduleId) {
			var service = {};

			var clerkGridConfig = {
				editor: 'lookup',
				directive: 'basics-lookupdata-lookup-composite',
				editorOptions: {
					lookupDirective: 'cloud-clerk-clerk-dialog',
					lookupOptions: {
						displayMember: 'Code',
						addGridColumns: [{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription',
							width: 200
						}],
						additionalColumns: true,
						showClearButton: true
					},
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'Clerk',
					displayMember: 'Code',
					version: 3,
				}
			};

			var clerkDetailConfig = {
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupOptions: {showClearButton: true},
					lookupDirective: 'cloud-clerk-clerk-dialog',
					descriptionMember: 'Description'
				}
			};

			var detailerGridConfig = _.merge(_.cloneDeep(clerkGridConfig), {
				editorOptions: {
					lookupOptions: {
						filterKey: 'productionplanning-common-detailer-filter'
					}
				}
			});

			var detailerDetailConfig = _.merge(_.cloneDeep(clerkDetailConfig), {
				options: {
					lookupOptions: {
						filterKey: 'productionplanning-common-detailer-filter'
					}
				}
			});

			service.moduleId = moduleId;
			service.uiConfig = {};
			service.readOnlyFields = {};
			service.attributes = {};
			service.translations = {};
			service.eventTypeSlots = {};
			service.clerkRoleSlots = {};
			service.phaseReqSlots = {};
			service.phaseDateSlots = {};
			service.hasInit = false;

			service.init = function (url) {
				var deferred = $q.defer();

				if(service.hasInit === true){
					deferred.resolve();
				} else {
					$http.get(globals.webApiBaseUrl + url).then(function (response) {
						service.uiConfig = response.data.UIConfig;
						service.readOnlyFields = response.data.ReadOnlyFields;
						service.attributes = response.data.Attributes;
						service.translations = response.data.Translations;
						service.eventTypeSlots = response.data.EventTypeSlots;
						service.clerkRoleSlots = response.data.ClerkRoleSlots;
						service.phaseReqSlots = response.data.PhaseReqSlots;
						service.phaseDateSlots = response.data.PhaseDateSlots;
						service.hasInit = true;
						deferred.resolve();
					});
				}
				return deferred.promise;
			};

			service.setEventTypeConfig = function (config, eventModule) {
				var eventTypeFields = service.uiConfig.EventType;
				if (_.isArray(eventTypeFields) && eventTypeFields.length > 0) {
					config.groups.push({
						gid: 'customGroup',
						attributes: eventTypeFields
					});

					_.each(eventTypeFields, function (field) {
						var overloadConfig = {};
						overloadConfig[field] = {
							readonly: _.includes(service.readOnlyFields, field),
							detail: {
								change: function (entity) {
									if (!_.isNil(eventModule)) {
										syncValuesToEvent(eventModule, field, entity[field]);
									}
								}
							}
						};
						_.merge(config.overloads, overloadConfig);
					});
				}
			};

			service.setClerkRoleConfig = function (config) {
				var clerkRoleFields = service.uiConfig.ClerkRole;
				var detailerFields = service.uiConfig.Detailer;
				if ((_.isArray(clerkRoleFields) && clerkRoleFields.length > 0) ||
					(_.isArray(detailerFields) && detailerFields.length > 0)) {
					config.groups.push({
						gid: 'customClerkGroup',
						attributes: _.concat(clerkRoleFields, detailerFields)
					});
					_.each(clerkRoleFields, function (field) {
						var overloadConfig = {};
						overloadConfig[field] = {
							readonly: _.includes(service.readOnlyFields, field),
							grid: clerkGridConfig,
							detail: clerkDetailConfig
						};
						_.merge(config.overloads, overloadConfig);
					});
					_.each(detailerFields, function (field) {
						var overloadConfig = {};
						overloadConfig[field] = {
							readonly: _.includes(service.readOnlyFields, field),
							grid: detailerGridConfig,
							detail: detailerDetailConfig
						};
						_.merge(config.overloads, overloadConfig);
					});
				}
			};
			service.setPhaseReqConfig = function (config) {
				let phaseReqFields = service.uiConfig.PhaseReq;
				if (_.isArray(phaseReqFields) && phaseReqFields.length > 0) {
					config.groups.push({
						gid: 'customPhaseReqGroup',
						attributes: phaseReqFields
					});
				}
				// set readonly option, all phaseReq fields should be readonly according to requirement of ticket #137785
				_.each(phaseReqFields, function (field) {
					let overloadConfig = {};
					overloadConfig[field] = {
						readonly: _.includes(service.readOnlyFields, field)
					};
					_.merge(config.overloads, overloadConfig);
				});
			};


			service.setPhaseDateConfig = function (config) {
				let phaseDateFields = service.uiConfig.PhaseDate;
				if (_.isArray(phaseDateFields) && phaseDateFields.length > 0) {
					config.groups.push({
						gid: 'customPhaseDateGroup',
						attributes: phaseDateFields
					});
				}
				// set readonly option, all phase date fields should be readonly according to requirement of ticket #147830
				_.each(phaseDateFields, function (field) {
					let overloadConfig = {};
					overloadConfig[field] = {
						readonly: _.includes(service.readOnlyFields, field)
					};
					_.merge(config.overloads, overloadConfig);
				});
			};

			service.setTranslation = function (words) {
				if (service.attributes) {
					if (service.eventTypeSlots) {
						_.merge(words, {
							customGroup: {
								location: moduleName,
								identifier: 'customGroup',
								initial: '*Custom Group'
							}
						});
					}

					if (service.clerkRoleSlots) {
						_.merge(words, {
							customClerkGroup: {
								location: moduleName,
								identifier: 'customClerkGroup',
								initial: '*Custom Clerk Group'
							}
						});
					}

					if (service.phaseReqSlots) {
						_.merge(words, {
							customPhaseReqGroup: {
								location: moduleName,
								identifier: 'customPhaseReqGroup',
								initial: '*Custom Time Tracking Group'
							}
						});
					}

					if (service.phaseReqSlots) {
						_.merge(words, {
							customPhaseDateGroup: {
								location: moduleName,
								identifier: 'customPhaseDateGroup',
								initial: '*Custom Phase Date Group'
							}
						});
					}

					_.merge(words, service.translations);
				}
			};

			service.updateDateTimeFields = function (entity) {
				var customAttributes = service.attributes;
				for (var prop in customAttributes) {
					if (entity[prop] && (customAttributes[prop].domain === 'datetimeutc' || customAttributes[prop].domain === 'dateutc' || customAttributes[prop].domain === 'timeutc')) {
						entity[prop] = moment.utc(entity[prop]);
					}
				}
			};

			// maybe it's better to rename as "addValidationsOfEventTypeSlotColumns" in the future
			service.addValidations = function (validationService, dataService, eventModule, getValueUrl, eventServiceConfig) {

				_.each(service.eventTypeSlots, function (slot) {
					let rebuildValue = (entity, value) => {
						let newValue = value;
						let event = _.find(entity.EventEntities, {EventTypeFk: slot.PpsEventTypeFk});
						if (event) {
							let column = getDateFieldEnum(slot.ColumnSelection);
							if (!_.isNil(column) && !_.isNil(slot)) {
								newValue = moment.utc(event[column]);
								if (slot.DatetimeFormat === 1) {
									newValue.year(value.year());
									newValue.month(value.month());
									newValue.date(value.date());
									newValue.format('YYYY-MM-DD');
								}
								if (slot.DatetimeFormat === 2) {
									newValue.hours(value.hours());
									newValue.minutes(value.minutes());
									newValue.format('HH:mm');
								}
							}
						}
						return newValue;
					};

					validationService['validate' + slot.FieldName] = function (entity, value, model) {
						if(slot.ColumnSelection === 20 || slot.ColumnSelection === 21) {
							return {apply: true, valid: true, error: ''};
						}
						value = slot.DatetimeFormat === 0 ? value : rebuildValue(entity, value);
						return platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
					};

					validationService['asyncValidate' + slot.FieldName] = function (entity, value, field) {
						value = slot.DatetimeFormat === 0 ? value : rebuildValue(entity, value);
						var deferred = $q.defer();

						var startDate, endDate, relModel, targetColumn, eventField;

						switch (slot.ColumnSelection) {
							case 0: { // Planned Start
								startDate = value;
								targetColumn = 1;
								eventField = 'PlannedFinish';
							}
								break;
							case 1: { // Planned Finish
								endDate = value;
								targetColumn = 0;
								eventField = 'PlannedStart';
							}
								break;
							case 2: { // Earliest Start
								startDate = value;
								targetColumn = 3;
								eventField = 'EarliestFinish';
							}
								break;
							case 3: { // Earliest Finish
								endDate = value;
								targetColumn = 2;
								eventField = 'EarliestStart';
							}
								break;
							case 4: { // Latest Start
								startDate = value;
								targetColumn = 5;
								eventField = 'LatestFinish';
							}
								break;
							case 5: { // Latest Finish
								endDate = value;
								targetColumn = 4;
								eventField = 'LatestStart';
							}
								break;
						}
						let dateshiftConfig = _.cloneDeep(eventServiceConfig);

						function shiftEvent(originalMoment) {
							// use event dateshift service to shift date (modifies the passed entity)
							// var dateshiftConfig = _.cloneDeep(eventServiceConfig);
							let activity = _.cloneDeep(_.find(entity.EventEntities, {'EventTypeFk': slot.PpsEventTypeFk}));
							if (_.isNil(activity)) {
								return $q.when(); // fix issue of HP_ALM #125321
							}
							dateshiftConfig.moduleId = eventModule || eventServiceConfig.moduleId;
							dateshiftConfig.eventKey = 'SlotEventType';
							var columnProperty = getDateFieldEnum(slot.ColumnSelection);
							activity[columnProperty] = moment.utc(originalMoment);
							// return ppsActivityDateshiftService.shiftActivityAsync(activity, value, columnProperty, 'productionplanning.common', 'productionplanning.item', 'productionplanning.item', ppsActivityDateshiftService.getMainEntityName(dataService)).then((dateshiftResult) => {
							const dateshiftCfgObj = {
								'productionplanning.common.item.event': { // for dateshift of PU events
									dataServ: 'productionplanning.common',
									config: 'productionplanning.item',
									dateshiftId: 'productionplanning.item',
								},
								'productionplanning.common.product.event': { // for dateshift of Product events
									dataServ: 'productionplanning.product',
									config: {
										calendarFk: 'CalCalendarFk',
										dateFields: {startDate: 'PlannedStart', endDate: 'PlannedFinish'},
										entity: 'Event',
										filterProperty: 'ProductFk',
										foreignKey: 'ProductFk',
										matchingPropertyForFindingVirtualEntity: 'Id'
									},
									// config: 'productionplanning.product',
									dateshiftId: 'productionplanning.common',
								},
								'productionplanning.common.item.product.event': { // for dateshift of Product events slot
									dataServ: 'productionplanning.common',
									config: {
										calendarFk: 'CalCalendarFk',
										dateFields: {startDate: 'PlannedStart', endDate: 'PlannedFinish'},
										entity: 'Event',
										filterProperty: 'ProductFk',
										foreignKey: 'ProductFk',
										matchingPropertyForFindingVirtualEntity: 'Id'
									},
									// config: 'productionplanning.product',
									dateshiftId: 'productionplanning.common',
								}
							}[eventModule];
							return ppsActivityDateshiftService.shiftActivityAsync(activity, value, columnProperty, dateshiftCfgObj.dataServ, dateshiftCfgObj.config, dateshiftCfgObj.dateshiftId, ppsActivityDateshiftService.getMainEntityName(dataService)).then((dateshiftResult) => {
								if (!dateshiftResult || dateshiftResult.dateshiftCancelled) {
									return validateEvent();
								}

								if (dateshiftResult.value) {
									value = dateshiftResult.value;
								}

								// if date was shifted: check for log => needs to be opened immediately
								let reg = registeredVirtualDataService.getLeadingRegistration(activity.Id, 'Event');
								let validationName = `asyncValidate${columnProperty}`;
								if (_.has(reg, 'config.validation.service') && _.isFunction(reg.config.validation.service[validationName])) {
									// restore old value
									reg.entity[columnProperty] = moment.utc(originalMoment);
									reg.config.validation.service[validationName](reg.entity, value, columnProperty);
									// reset to current value
									reg.entity[columnProperty] = value;
								}

								if (slot.ColumnSelection % 2 === 0) {
									// a start date
									startDate = dateshiftResult.entity[columnProperty];
									endDate = dateshiftResult.entity[eventField];
								} else if (slot.ColumnSelection % 2 === 1) {
									// an end date
									startDate = dateshiftResult.entity[eventField];
									endDate = dateshiftResult.entity[columnProperty];
								}
								var result = platformDataValidationService.validatePeriod(startDate, endDate, entity, field, validationService, dataService);
								if (_.isBoolean(result)) {
									result = {
										valid: result
									};
								}
								result.apply = dateshiftResult.apply;
								return result;
							});
						}

						function validateEvent() {
							function createMoment(data) {
								if (_.isNil(data) || data === '') {
									return null;
								}
								return moment.utc(data);
							}

							var targetSlot = _.find(service.eventTypeSlots, {
								'PpsEventTypeFk': slot.PpsEventTypeFk,
								'PpsEntityFk': slot.PpsEntityFk,
								'PpsEntityRefFk': slot.PpsEntityRefFk,
								'ColumnSelection': targetColumn
							});
							var findEvent = false;
							if (!_.isNil(targetSlot)) {
								findEvent = true;
								if (_.isNil(startDate)) {
									startDate = entity[targetSlot.FieldName];
								} else {
									endDate = entity[targetSlot.FieldName];
								}
								relModel = targetSlot.FieldName;
							} else if (eventServiceFactory.hasService(eventModule)) {
								let eventDataService = eventServiceFactory.getService('', eventModule);
								if (!_.isNil(eventDataService)) {
									const ppsEvents = eventDataService.getList();
									const ppsEvent = _.find(ppsEvents, {'EventTypeFk': slot.PpsEventTypeFk});
									if (!_.isNil(ppsEvent)) {
										findEvent = true;
										if (_.isNil(startDate)) {
											startDate = ppsEvent[eventField];
										} else {
											endDate = ppsEvent[eventField];
										}

										//Update Actual Start/Finish
										if(slot.ColumnSelection === 20 || slot.ColumnSelection === 21){
											switch (slot.ColumnSelection) {
												case 20: { // Actual Start
													ppsEvent.ActualStart = value;
												}
													break;
												case 21: { // Actual Finish
													ppsEvent.ActualFinish = value;
												}
													break;
											}
											eventDataService.markItemAsModified(ppsEvent);
										}
									}
								}
							}

							if (!findEvent) {
								var postData = {
									Id: entity.Id,
									PpsEventTypeFk: slot.PpsEventTypeFk,
									PpsEntityFk: slot.PpsEntityFk,
									PpsEntityRefFk: slot.PpsEntityRefFk,
									Column: targetColumn
								};
								return $http.post(globals.webApiBaseUrl + getValueUrl, postData).then(function (response) {
									if (_.isNil(startDate)) {
										startDate = createMoment(response.data);
									} else {
										endDate = createMoment(response.data);
									}

									return platformDataValidationService.validatePeriod(startDate, endDate, entity, field, validationService, dataService, relModel);
								});
							}
							deferred.resolve(platformDataValidationService.validatePeriod(startDate, endDate, entity, field, validationService, dataService, relModel));

							return deferred.promise;
						}

						if (_.get(entity, field) && !_.isUndefined(eventServiceConfig) && eventServiceConfig.dateshiftDisabled !== true && (slot.ColumnSelection === 0 || slot.ColumnSelection === 1)) {
							return shiftEvent(entity[field]);
						} else {
							return validateEvent();
						}
					};
				});

				let registeredVirtualDataService;
				if (_.has(eventServiceConfig, 'virtualDataServiceConfig')) {
					if (eventModule === 'productionplanning.common.product.event'){
						registeredVirtualDataService = ppsActivityDateshiftService.getVirtualDataServiceByMatch('productionplanning.product');
						// remark: in product-main-service.js, a correpsonding virtual data service is created by line-code "let virtualDateshiftService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, serviceContainer.service);"
					}
					else {
						// todo: eventServiceConfig to match all entity properties as it was in the MDS 19.03.2021
						registeredVirtualDataService = ppsActivityDateshiftService.getVirtualDataServiceByMatch('productionplanning.common');
					}
				}

				if (!_.isNil(registeredVirtualDataService)) {
					let eventService;
					let onVirtualDataChangedCallback = (modifiedEvents) => {
						if (eventServiceFactory.hasService(eventModule)) {
							eventService = (_.isObject(eventService)) ? eventService : eventServiceFactory.getService('', eventModule);
							let eventList = eventService.getList();
							// modifiedEvent is generic entity not real event!
							_.forEach(modifiedEvents, (data) => {
								let eventEntity = _.find(eventList, {Id: data.Id});
								if (!_.isNil(eventEntity)) {
									updateSlots(eventEntity);
								}
							});
							dataService.gridRefresh();
						}
					};
					registeredVirtualDataService.onVirtualDataChanged.register(onVirtualDataChangedCallback);
				}


				const updateSlots = (eventEntity) => {
					let entityList = dataService.getList();

					const updateSlot = (entity, field) => {
						let showsEventSlot = _.some(entity.EventEntities, {Id: eventEntity.Id});
						if (!showsEventSlot) {
							return;
						}
						let column = getDateFieldEnum(field);
						if (!_.isNil(column)) {
							// may have several slots with different domain(datetimeutc, dateutc, timeutc)
							let slots = _.filter(service.eventTypeSlots, {
								'PpsEventTypeFk': eventEntity.EventTypeFk,
								'ColumnSelection': column
							});
							if (!_.isNil(slots)) {
								_.forEach(slots, (slot) => {
									entity[slot.FieldName] = eventEntity[field];
								});
							}
						}
					};
					let allFields = _.keys(dateFieldEnum);
					_.forEach(entityList, (entity) => {
						_.forEach(allFields, (field) => {
							updateSlot(entity, field);
						});
					});
				};
			};

			service.addValidationsOfClerkRoleSlotColumns = function (validationService, dataService){
				// at the moment, just for case of clerk role slot columns in ppsItem
				function markAsModifiedForClerkFromSlot(item2clerkDataService, cEntity){
					let modState = $injector.get('platformModuleStateService').state(item2clerkDataService.getModule());
					let elemState = item2clerkDataService.assertPath(modState.modifications, false, cEntity);

					item2clerkDataService.addEntityToModified(elemState, cEntity, modState.modifications);
					item2clerkDataService.fireItemModified(cEntity);
				}

				let dataServiceName = dataService.getServiceName();

				if(dataServiceName === 'productionplanningItemDataService' || dataServiceName === 'productionplanningEngineeringMainService'){
					let serviceConfig = {
						'productionplanningItemDataService': {
							'clerkDataServiceName': 'productionplanningItemClerkDataService',
							'clerkValidationServiceName': 'productionplanningItemClerkValidationService',
							'clerkUIStandardServiceName': 'productionplanningItemClerkUIStandardService',
							'clerkEntitiesName': 'Item2ClerkXEntities'
						},
						'productionplanningEngineeringMainService': {
							'clerkDataServiceName': 'ppsEngTask2ClerkDataService',
							'clerkValidationServiceName': 'ppsEngTask2ClerkValidationService',
							'clerkUIStandardServiceName': 'ppsEngTask2ClerkUIStandardService',
							'clerkEntitiesName': 'EngTask2ClerkEntities'
						}
					}[dataServiceName];

					let taskClerkRoleSlots = (dataServiceName === 'productionplanningItemDataService')
						? _.filter(service.clerkRoleSlots, (slot) => {
							return slot.PpsEntityFk === ppsEntityConstant.PPSItem && slot.PpsEntityRefFk === ppsEntityConstant.EngineeringTask;
						})
						: _.filter(service.clerkRoleSlots, (slot) => {
							return slot.PpsEntityFk === ppsEntityConstant.EngineeringTask && (_.isNil(slot.PpsEntityRefFk) || slot.PpsEntityFk === ppsEntityConstant.EngineeringTask);
						});

					$injector.get('ppsEngTask2ClerkUIStandardService'); // do nothing, just for loading ppsEngTask2ClerkUIStandardService, it will be referenced for logging engtask2clerk(as slot) in PU module
					let item2clerkDataService = $injector.get(serviceConfig.clerkDataServiceName);
					let item2clerkValidationService = $injector.get(serviceConfig.clerkValidationServiceName);

					_.each(taskClerkRoleSlots, function (slot){

						$injector.get('platformLayoutByDataService').registerLayout($injector.get(serviceConfig.clerkUIStandardServiceName), item2clerkDataService);
						$injector.get('platformValidationByDataService').registerValidationService(item2clerkValidationService, item2clerkDataService);

						let doValidateFn = function (entity, value, field, isForBulk = false) {
							let clerkEntity = (dataServiceName === 'productionplanningItemDataService')
								? _.clone(_.find(entity[serviceConfig.clerkEntitiesName], {'ClerkRoleFk': slot.ClerkRoleFk, 'From': 'ENGTASK'}))
								: _.clone(_.find(entity[serviceConfig.clerkEntitiesName], {'ClerkRoleFk': slot.ClerkRoleFk}));

							const validateFuncName = 'validateClerkFk';
							const asyncValidateFuncName = isForBulk ? 'asyncValidateClerkFkForBulkConfig' : 'asyncValidateClerkFk';

							if(value){
								if (clerkEntity) {
									item2clerkValidationService[validateFuncName](clerkEntity, value, 'ClerkFk');
									if(_.isFunction(item2clerkValidationService[asyncValidateFuncName])){ // check if method asyncValidateClerkFk() exists for fixing issue of #138474 by zwz on 2023/1/29
										item2clerkValidationService[asyncValidateFuncName](clerkEntity, value, 'ClerkFk');
										// Remark: Method validateClerkFk() is implemented in relative clerk validation service for syncing data.
										//         However, method asyncValidateClerkFk() is not implemented in relative clerk validation service, it may be implemented(or not) by extended pps log functionality indirectly.
										//         At the moment, method asyncValidateClerkFk() is not required for clerk slot functionality.
										//         Any way, here we need to check if method asyncValidateClerkFk() exists.
									}
									clerkEntity.ClerkFk = value;
									clerkEntity.PpsItemFk = entity.Id;
									markAsModifiedForClerkFromSlot(item2clerkDataService, clerkEntity);
								} else {
									// create new clerk record and do validation
									const idMask = 400000000;
									const tmpId = -(idMask+entity.Id); // set tempId as negative for keeping it unique
									clerkEntity = (dataServiceName === 'productionplanningItemDataService')
										? {
											Id: tmpId, // just use a temp ID, this ID will be discarded on the server side when saving new clerk record
											ClerkFk: null,
											ClerkRoleFk: slot.ClerkRoleFk,
											From: 'ENGTASK',
											EngTaskFk: entity.EngTaskId,
											PpsItemFk: entity.Id,
											Version: 1 // HACK: just for passing method isModified() of ppsCommonLoggingValidationExtension in force
										}
										:{
											Id: tmpId, // just use a temp ID, this ID will be discarded on the server side when saving new clerk record
											ClerkFk: null,
											ClerkRoleFk: slot.ClerkRoleFk,
											From: 'ENGTASK',
											EngTaskFk: entity.Id,
											Version: 1 // HACK: just for passing method isModified() of ppsCommonLoggingValidationExtension in force
										};

									item2clerkValidationService[validateFuncName](clerkEntity, value, 'ClerkFk');
									if(_.isFunction(item2clerkValidationService[asyncValidateFuncName])){ // check if method asyncValidateClerkFk() exists for fixing issue of #138474 by zwz on 2023/1/29
										item2clerkValidationService[asyncValidateFuncName](clerkEntity, value, 'ClerkFk');
									}
									clerkEntity.Version = 0; // recover value of Version as creating record
									clerkEntity.ClerkFk = value;
									markAsModifiedForClerkFromSlot(item2clerkDataService, clerkEntity);
								}
							}
							else { // value is null
								let modState = $injector.get('platformModuleStateService').state(item2clerkDataService.getModule());
								if(modState.modifications.PPSItemClerkToSave && modState.modifications.PPSItemClerkToSave.length >0){
									_.remove(modState.modifications.PPSItemClerkToSave, function (e) {
										return e.ClerkRoleFk === slot.ClerkRoleFk;
									});
								}
							}

							if(dataServiceName === 'productionplanningItemDataService'){
								dataService.synClerk4PUsWithSameEngineerEvent(entity, value, field);
							}
							return true;
						};
						validationService['asyncValidate' + slot.FieldName] = (entity, value, field) => {
							let defer = $q.defer();
							defer.resolve(doValidateFn(entity, value, field));
							return defer.promise;
						};

						validationService['asyncValidate' + slot.FieldName + 'ForBulkConfig'] = (entity, value, field) => {
							let defer = $q.defer();
							defer.resolve(doValidateFn(entity, value, field, true));
							return defer.promise;
						};

					});
				}
			};

			service.syncValuesToEntity = (dataService, event, fields) => {
				let selectedItem = dataService.getSelected();

				function updateSlot(field) {
					let column = getDateFieldEnum(field);
					if (!_.isNil(column)) {
						let slot = _.find(service.eventTypeSlots, {
							'PpsEventTypeFk': event.EventTypeFk,
							'ColumnSelection': column
						});
						if (!_.isNil(slot)) {
							selectedItem[slot.FieldName] = event[field];
						}
					}
				}

				if (_.isArray(fields)) {
					_.forEach(fields, updateSlot);
				} else if (_.isString(fields)) {
					updateSlot(fields);
				} else if (_.isUndefined(fields)) {
					let allFields = _.keys(dateFieldEnum);
					_.forEach(allFields, updateSlot);
				}
			};

			service.syncValuesToEntities = function (dataService, events, fields, foreignKey, childListKey) {
				var list = dataService.getList();
				if (!_.isEmpty(list)) {
					_.forEach(events, function (event) { // for each passed event
						var entities;
						if (!_.isUndefined(foreignKey) && _.isUndefined(childListKey)) {
							entities = _.filter(list, function (e) {
								return e.Id === event[foreignKey];
							});
						} else if (_.isUndefined(foreignKey) && !_.isUndefined(childListKey)) {
							entities = _.filter(list, function (e) {
								return _.map(e[childListKey], 'Id').includes(event.Id);
							});
						} else {
							// eslint-disable-next-line no-console
							console.warn('Only either foreignKey or childListKey can be entered');
							return;
						}
						_.forEach(entities, function (entity) { // each entity connected to that events
							_.forEach(fields, function (field) { // has the following fields that are updated
								var column = -1;
								column = getDateFieldEnum(field);
								var slots = _.filter(service.eventTypeSlots, {
									'PpsEventTypeFk': event.EventTypeFk,
									'ColumnSelection': column
								});
								_.forEach(slots, function (slot) {
									entity[slot.FieldName] = event[field];
								});
							});
						});
					});
					dataService.gridRefresh();
				}
			};

			function syncValuesToEvent(eventModule, field, value) {
				if (!eventServiceFactory.hasService(eventModule)) {
					return;
				}

				var eventService = eventServiceFactory.getService('', eventModule);
				if (!_.isNil(eventService)) {
					var events = eventService.getList();
					_.each(events, function (event) {
						var slot = _.find(service.eventTypeSlots, {'PpsEventTypeFk': event.EventTypeFk, 'FieldName': field});
						if (!_.isNil(slot)) {
							var dateProperty = getDateFieldEnum(slot.ColumnSelection);
							if (dateProperty) {
								event[dateProperty] = value;
							}
							eventService.gridRefresh();
						}
					});
				}
			}

			return service;
		};

		var dateFieldEnum = {
			PlannedStart: 0,
			PlannedFinish: 1,
			EarliestStart: 2,
			EarliestFinish: 3,
			LatestStart: 4,
			LatestFinish: 5,
			ActualStart: 20,
			ActualFinish: 21
		};

		function getDateFieldEnum(request) {
			if (_.isNumber(request)) {
				return _.findKey(dateFieldEnum, function (d) {
					return d === request;
				});
			} else if (_.isString(request)) {
				return dateFieldEnum[request];
			}
		}

		factory.getService = function (moduleId) {
			if (_.isNil(serviceCache[moduleId])) {
				serviceCache[moduleId] = factory.createNewService(moduleId);
			}
			return serviceCache[moduleId];
		};

		factory.initCommonCustomColumnsService = function () {
			var productCustomService = factory.getService('productionplanning.common.product');
			return $q.all([
				productCustomService.init('productionplanning/common/product/customcolumn')
			]);
		};

		factory.createNewServiceForPlnQty = function (moduleId) {
			let service = {};

			service.moduleId = moduleId;
			service.uiConfig = {};
			service.readOnlyFields = {};
			service.attributes = {};
			service.translations = {};
			service.plannedQuantitySlots = {};
			service.hasInit = false;

			service.init = function (url) {
				let deferred = $q.defer();

				if(service.hasInit === true){
					deferred.resolve();
				} else {
					$http.get(globals.webApiBaseUrl + url).then(function (response) {
						service.uiConfig = response.data.UIConfig;
						service.attributes = response.data.Attributes;
						service.translations = response.data.Translations;
						service.plannedQuantitySlots = response.data.PlannedQuantitySlots;
						service.hasInit = true;
						deferred.resolve();
					});
				}
				return deferred.promise;
			};

			service.setPlannedQuantityConfig = function (config) {
				let plnQtyFields = service.uiConfig.PlannedQuantity;
				if (_.isArray(plnQtyFields) && plnQtyFields.length > 0) {
					config.groups.push({
						gid: 'customGroup',
						attributes: plnQtyFields
					});

					// Quantity allows negative value, so we needn't to set disallowNegative option
					// // set overload
					// _.each(plnQtyFields, function (field) {
					// 	let overloadConfig = {};
					// 	overloadConfig[field] = {
					// 		disallowNegative: true
					// 	};
					// 	_.merge(config.overloads, overloadConfig);
					// });
				}
			};

			service.setTranslation = function (words) {
				if (service.attributes) {
					if (service.plannedQuantitySlots) {
						_.merge(words, {
							customGroup: {
								location: moduleName,
								identifier: 'customGroup',
								initial: '*Custom Group'
							}
						});
					}

					_.merge(words, service.translations);
				}
			};

			service.addValidations = function (validationService, dataService) {
				_.each(service.plannedQuantitySlots, function (slot){
					validationService['validate'+slot.FieldName] = function (entity, value, field) {
						entity.DynamicQuantities[slot.FieldName] = value;
						return true;
					};
				});
			};

			return service;
		};

		factory.getServiceForPlnQty = function (moduleId) {
			if (_.isNil(serviceCache[moduleId])) {
				serviceCache[moduleId] = factory.createNewServiceForPlnQty(moduleId);
			}
			return serviceCache[moduleId];
		};

		return factory;
	}
})(angular);
