/* global _*/
(angular => {
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc constant
	 * @name productionplanningCommonActivityDateshiftConfiguration
	 * @function
	 *
	 * @description constant that returns all a config object of all activity servies sorted by module id.
	 */
	angular.module(moduleName).constant('productionplanningCommonActivityDateshiftConfiguration', (function ppsActivityDateshiftConfiguration() {

		//default values for all activities
		const defaultConfiguration = {
			foreignKey: 'Id',
			entity: 'Event',
			filterProperty: 'PpsEventFk',
			dateFields: {
				startDate: 'PlannedStart',
				endDate: 'PlannedFinish'
			},
			calendarFk: 'CalCalendarFk'
		};
		const moduleConfigurations = {
			productionplanningCommon: {
				foreignKey: 'Id',
				entity: 'Event',
				filterProperty: 'Id',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: 'CalCalendarFk'
			},
			productionplanningItem: {
				foreignKey: 'Id',
				entity: 'Event',
				filterProperty: 'Id',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: 'CalCalendarFk'
			},
			productionplanningItemGantt: {
				foreignKey: 'Id',
				entity: 'Event',
				filterProperty: 'OriginalId',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: 'CalCalendarFk'
			},
			productionplanningItemPlanningboard: {
				entity: 'Event',
				filterProperty: 'Id',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: 'CalCalendarFk'
			},
			resourceReservation: {
				filterProperty: null,
				entity: 'ResReservation',
				dateFields: {
					startDate: 'ReservedFrom',
					endDate: 'ReservedTo'
				},
				calendarFk: ''
			},
			resourceRequisition: {
				filterProperty: null,
				entity: 'ResRequisition',
				dateFields: {
					startDate: 'RequestedFrom',
					endDate: 'RequestedTo'
				},
				calendarFk: ''
			},
			productionplanningPhase: {
				filterProperty: null,
				entity: 'PpsPhase',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: ''
			},
			dailyProduction: {
				filterProperty: null,
				entity: 'DailyProduction',
				dateFields: {
					startDate: 'PlannedStart',
					endDate: 'PlannedFinish'
				},
				calendarFk: ''
			}
		};
		_.forEach(moduleConfigurations, function mergeConfigFn(configObject, configKey) {
			moduleConfigurations[configKey] = _.assign({}, defaultConfiguration, configObject);
		});

		return {
			get: function (moduleId) {
				let result = moduleConfigurations[_.camelCase(moduleId)] || defaultConfiguration;
				let clonedConfiguration = _.clone(result);
				clonedConfiguration.dateshiftId = clonedConfiguration.dateshiftId || moduleId;
				return clonedConfiguration;
			}
		};
	})());


	/**
	 * @ngdoc service
	 * @name productionplanningCommonActivityDateshiftService
	 * @function
	 * @requires platform:platformDateshiftHelperService
	 * @description productionplanningCommonActivityDateshiftService offers serveral methods that allow easy registration and execution of dateshift and a registered VDS.
	 */
	angular.module(moduleName).service('productionplanningCommonActivityDateshiftService', ProductionplanningCommonActivityDateshiftService);
	ProductionplanningCommonActivityDateshiftService.$inject = ['$q', 'moment',
		'productionplanningCommonActivityDateshiftConfiguration',
		'platformDateshiftHelperService',
		'ppsVirtualDataServiceFactory',
		'platformDataValidationService',
		'platformDateshiftCalendarService',
		'mainViewService',
		'basicsCommonToolbarExtensionService'];
	function ProductionplanningCommonActivityDateshiftService($q, moment, activityDateshiftConfiguration, dateshiftHelperService, ppsVirtualDataServiceFactory, dataValidationService, platformDateshiftCalendarService, mainViewService, basicsCommonToolbarExtensionService) {
		var service = this;

		/**
		 * @ngdoc function
		 * @name registerToVirtualDateshiftService
		 * @description Public function that registers to a VDS.
		 *
		 * @param {string} moduleId: Id of virtual data service.
		 * @param {Object} dataServiceContainer: dataServiceContainer of the service that should be registered.
		 * @param { string | Object } config: Config for the registering service.
		 * Alternatively, a string can be passed to indicate a dateshift configuration based on a module id.
		 * @param {string} [config.foreignKey]: String that is used to fetch virtual entities for VDS.
		 * @param {string} [config.entity]: String that identifies the entity related to the registering entity.
		 * @param {string} [config.filterProperty]: String that identifies the property containing the value of the foreign key of the virtual entity.
		 * @param {Object} [config.dateFields]: Property names containing date fields.
		 * @param {Object} [config.dateFields.startDate]: Property name containing the start date.
		 * @param {Object} [config.dateFields.endDate]: Property name containing the end date.
		 * @param {string} [config.dateshiftId]: Id of the dateshift that is passed when executing a dateshift for the VDS
		 * @param {Object} [validationConfig]: Optional validation config to validate propterties in the VDS
		 * @param {Object} [validationConfig.service]: The validation service.
		 * @param {Array} [validationConfig.propteries]: An array of properties which will be validated.
 		 *
		 * @return VDS
		 **/
		service.registerToVirtualDateshiftService = function registerToVirtualDateshiftService(moduleName, dataServiceContainer, config, validationConfig) {
			if (_.isNil(config)) {
				return;
			} else if (_.isString(config)) {
				config = activityDateshiftConfiguration.get(config);
			}
			let registrationConfig = !_.isNil(config.filterProperty)? { match: config.filterProperty } : null;
			if (validationConfig) {
				registrationConfig.validation = validationConfig;
			}
			return ppsVirtualDataServiceFactory.registerToVirtualDataService(moduleName, config.entity, dataServiceContainer, registrationConfig);
		};

		/**
		 * @ngdoc function
		 * @name extendDateshiftActivityValidation
		 * @description Public function that extends the validation for dateshift fields based on a config.
		 *
		 * @param {Object} validationService: The validation service the new methods are added to.
		 * @param { string | Object } config: Config for the registering service.
		 * Alternatively, a string can be passed to indicate a dateshift configuration based on a module id.
		 * @param {string} [config.foreignKey]: String that is used to fetch virtual entities for VDS.
		 * @param {string} [config.entity]: String that identifies the entity related to the registering entity.
		 * @param {string} [config.filterProperty]: String that identifies the property containing the value of the foreign key of the virtual entity.
		 * @param {Object} [config.dateFields]: Property names containing date fields.
		 * @param {Object} [config.dateFields.startDate]: Property name containing the start date.
		 * @param {Object} [config.dateFields.endDate]: Property name containing the end date.
		 * @param {string} [config.dateshiftId]: Id of the dateshift that is passed when executing a dateshift for the VDS.
		 **/
		service.extendDateshiftActivityValidation = function extendDateshiftActivityValidation(validationService, dataService, config, dateshiftId) {
			if (_.isNil(config)) {
				return;
			} else if (_.isString(config)) {
				config = activityDateshiftConfiguration.get(config);
			}

			function processResult(valid, apply) {
				var result = {};
				if (_.isObject(valid)) {
					result = valid;
				} else if (_.isBoolean(valid)) {
					result.valid = valid;
				}
				result.apply = apply;
				return result;
			}

			function validateDate(entity, value, model, cancelDateshift) {
				if (cancelDateshift === true) {
					const validationResultObject = {
						apply: true,
						valid: true
					};
					return $q.when(validationResultObject);
				}
				return service.shiftActivityAsync(entity, value, model, dataService, config, dateshiftId, service.getMainEntityName(dataService)).then( (dsResult) => {
					value = dsResult.value;
					let startDate = (model === config.dateFields.startDate) ? dsResult.value : entity[config.dateFields.startDate];
					let endDate = (model === config.dateFields.endDate) ? dsResult.value : entity[config.dateFields.endDate];
					let relModel = (model === 'PlannedStart') ? 'PlannedFinish' : 'PlannedStart';
					let validationResult = dataValidationService.validatePeriod(startDate, endDate, entity, model, service, dataService, relModel);
					return processResult(validationResult, dsResult.apply);
				});
			}

			//for each dateField "value"
			_.forEach(config.dateFields, (dateField) => {
				let validationMethod = `asyncValidate${dateField}`;
				let syncValidationMethod = `validate${dateField}`;
				_.unset(validationService, syncValidationMethod);
				validationService[validationMethod] = (entity, value, model, emptyParam, fromBulkEditor) => {
					return validateDate(entity,value, model, fromBulkEditor);
				};
			});
		};

		/**
		 * @ngdoc function
		 * @name initializeDateShiftController
		 * @description Public function that initializes a service registered to a VDS for dateshift and adds dateshift tools to the controller.
		 *
		 * @param {string} moduleId: Id of virtual data service. TODO: remove this id and remove it in all registrations
		 * @param {dataService} dataService: dataService that consume the dateshift.
		 * @param {Object} [controllerScope]: Optional $scope of the initialized controller.
		 * If none is passed, tools are created but not shown in controller (used for constant settings).
		 * @param {Object} [toolConfig]: Optional config object for sub config objects. Consists of:
		 * @param {string} [toolConfig.configId]: Optional identifier of the dateshift tool config. 'Default' if not passed.
		 * @param {Object[]} [toolConfig.tools]: Optional object list of dateshift tool configs containing default values etc.
		 **/
		service.initializeDateShiftController = function initializeDateShiftController(moduleId, dataService, controllerScope, toolConfig) {
			let dateshiftDataService = ppsVirtualDataServiceFactory.getVirtualDataService(dataService);
			if (!_.isNil(dateshiftDataService)) {
				let dateshiftTools = dateshiftHelperService.getDateshiftTools(dateshiftDataService.getServiceName(), toolConfig.tools, toolConfig.configId, controllerScope);
				if (!_.isNil(controllerScope)) {
					if (controllerScope.dateShiftModeTools && controllerScope.dateShiftModeTools.length > 0) {
						controllerScope.dateShiftModeTools = _.concat(controllerScope.dateShiftModeTools, dateshiftTools);
					} else {
						controllerScope.dateShiftModeTools = dateshiftTools;
					}

					if (controllerScope.tools) {
						_.forEachRight(controllerScope.dateShiftModeTools, (tool) => {
							basicsCommonToolbarExtensionService.insertBefore(controllerScope, tool);
						});
					}
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name getVirtualDataServiceByMatch
		 * @description Get VDS with a given match (id or dataService).
		 *
		 * @param { string | Object } match: Config to find VDS.
		 * @returns {Object} VDS service object
		 */
		service.getVirtualDataServiceByMatch = (match) => {
			return ppsVirtualDataServiceFactory.getVirtualDataService(match);
		};

		/**
		 * @ngdoc function
		 * @name shiftActivityAsync
		 * @description Public function that takes an activity,
		 * fetches their dateshift data and eventually shifts their date,
		 * usually triggered by a validation service.
		 * @param {Object} entity: The entity that triggered the shift
		 * @param {moment} value: date to be changed to in dateshift
		 * @param {string} field: property used for dateshift
		 * @param {dataService} dataServ: dataService that provides the entity todo: rename to vds match id || dataserv
		 * @param { string | Object } config: Config for the registering service.
		 * Alternatively, a string can be passed to indicate a dateshift configuration based on a module id.
		 * @param {string} [config.foreignKey]: String that is used to fetch virtual entities for VDS.
		 * @param {string} [config.entity]: String that identifies the entity related to the registering entity.
		 * @param {string} [config.filterProperty]: String that identifies the property containing the value of the foreign key of the virtual entity.
		 * @param {string[]} [config.startDate]: Property names containing date fields.
		 * @param {Object} [config.dateFields]: Property names containing date fields.
		 * @param {Object} [config.dateFields.startDate]: Property name containing the start date.
		 * @param {Object} [config.dateFields.endDate]: Property name containing the end date.
		 * @param {string} [config.dateshiftId]: Id of the dateshift that is passed when executing a dateshift for the VDS.
		 * @param {string} [config.dateshiftDisabled]: Optional flag to skip shift entirely and return original item to caller.
		 * Other config values are disregarded in this case
		 * @param {string} [dateshiftId]: Optional dateshiftId to find the correct dateshift container. This id will overwrite the [config.dateshiftId]!
		 *
		 * @returns {object} validation result including {boolean} apply, {moment} value
		 **/
		service.shiftActivityAsync = function shiftActivityAsync(entity, value, field, dataServ, config, dateshiftId, triggerEntityName) {
			var result;
			//set config to empty object if undefined
			if (_.isString(config) || _.isNil(config)) {
				var moduleId = config;
				config = activityDateshiftConfiguration.get(moduleId);
			}

			//new entities must be validated as well!
			//if disabled or compared values the same, return original value
			if (config.dateshiftDisabled || (!_.isNil(entity[field]) && entity[field].isSame(value))) {
				var disabledShiftResult = {
					apply: true,
					value: value,
					dateshiftCancelled: true
				};
				result = $q.when(disabledShiftResult);
			} else {
				result = getVirtualDateshiftDataAsync(entity, dataServ, config, triggerEntityName).then(function shiftFoundActivity(result) {
					if (!result.entity) {
						return null;
					}
					var trigger = _.cloneDeep(result.entity);
					trigger[field] = value;
					if (dateshiftId) {
						// todo: rework after new concept of configs
						//overwrite dateshiftId with given id to find the correct dateshift container
						config.dateshiftId = dateshiftId;
					}
					let shiftedEntities = shiftVirtualDateshiftData(trigger, result.dataService, config);
					let shiftedEntity = _.find(shiftedEntities, {Id: trigger.Id});
					if (shiftedEntity) {
						//set shiftedEntity
						_.forEach(config.dateFields, currentField => {
							entity[currentField] = shiftedEntity[currentField];
						});
						value = shiftedEntity[field];
					}
					return {
						apply: _.isNil(shiftedEntity),
						value: value,
						entity: result.entity
					};
				});
			}
			return result;
		};


		/**
		 * @ngdoc function
		 * @name extendSuperEventLookupOptions
		 * @description Extends lookup options with event handlers to catch changes of sub and super events.
		 *
		 * @param {Object} lookupOptions: The lookupOptions that should be extended.
		 * @param {bool} isSuperLookup: Flag to control whether the lookup points to a super event (true) or sub event (false). True by default.
		 * @param {string} [vdsMatch]: Optional match to find vds. If not set the current module name is used.
		 * @param {function} [processArgs]: Optional method that is called before executing the events to modify the passed arguments.
		 */
		service.extendSuperEventLookupOptions = (lookupOptions, isSuperLookup = true, vdsMatch = null, processArgs = null) => {
			//initialize events of lookup options
			lookupOptions.events = _.isArray(lookupOptions.events)? lookupOptions.events : [];
			let firstEdit = true;
			let originalEntity, originalLookupEvent, lastLookupEvent;

			//region selectedItemChanged

			function changeSuperEventByLookup(subSpecEvent, newSuperSpecEvent, oldSuperSpecEvent) {
				//check prerequisites
				if (_.has(subSpecEvent, 'PpsEventFk')) {
					let virtualDateshiftService = ppsVirtualDataServiceFactory.getVirtualDataService(vdsMatch || mainViewService.getCurrentModuleName());
					if (virtualDateshiftService) {
						//change from old to new event
						virtualDateshiftService.changeSpecialzedEvents([subSpecEvent], oldSuperSpecEvent, newSuperSpecEvent);
					}
				}
			}

			let selectedItemChangedFilterObject = { name: 'onSelectedItemChanged'};
			let selectedItemChangedEvent = _.head(_.remove(lookupOptions.events, selectedItemChangedFilterObject)) || selectedItemChangedFilterObject;
			let originalSelecteItemChangedHandler = selectedItemChangedEvent.handler;
			selectedItemChangedEvent.handler = (e, args, scope) => {
				if (_.isFunction(originalSelecteItemChangedHandler)) {
					originalSelecteItemChangedHandler(e, args, scope);
				}
				if (_.isFunction(processArgs)) {
					processArgs(args);
				}
				//change from old to new event
				if (isSuperLookup === true) {
					changeSuperEventByLookup(args.entity, args.selectedItem, args.previousItem);
				} else {
					changeSuperEventByLookup(args.selectedItem, args.entity);
				}
				//add to last events:
				if (firstEdit === true) {
					originalEntity = _.cloneDeep(args.entity);
					originalLookupEvent = _.cloneDeep(args.previousItem);
					firstEdit = false;
				}
				lastLookupEvent = _.cloneDeep(args.selectedItem);
			};
			lookupOptions.events.push(selectedItemChangedEvent);

			//endregion

			//region onDestroyed

			function restoreOriginalValue() {
				//if edit was cancelled => restore original!
				if (isSuperLookup === true) {
					changeSuperEventByLookup(originalEntity, originalLookupEvent, lastLookupEvent);
				} else {
					changeSuperEventByLookup(originalLookupEvent, originalEntity);
				}
			}

			let destroyedFilterObject = { name: 'onDestroyed' };
			let destroyedEvent = _.head(_.remove(lookupOptions.events, destroyedFilterObject)) || destroyedFilterObject;
			let originalDestroyedHandler = destroyedEvent.handler;
			destroyedEvent.handler = (e, args, scope) => {
				if (_.isFunction(originalDestroyedHandler)) {
					originalDestroyedHandler(e, args, scope);
				}
				if (e.type === 'keydown' && e.code === 'Escape') {
					restoreOriginalValue();
				}
			};
			lookupOptions.events.push(destroyedEvent);

			//endregion
		};

		/**
		 * @ngdoc function
		 * @name getMainEntityName
		 * @description Gets the name of main entity of the service
		 *
		 * @param {Object} dataService: The data service of the entity
		 */
		service.getMainEntityName = (dataService) => {
			let mainEntityName = null;
			if (!_.isString(dataService) && dataService.getChildServices) {
				if (dataService.getChildServices && dataService.getChildServices().length > 0 || !dataService.parentService) {
					mainEntityName = dataService.getItemName();
				}
				if  (dataService.getChildServices().length === 0 && dataService.parentService) {
					mainEntityName = dataService.parentService().getItemName();
				}
			}

			return mainEntityName;
		};

		//region Virtual Dateshift Data

		// local scope variable - not nice... can be solved differently?
		let lastTriggerEntityName = null;

		function getVirtualDateshiftDataAsync(entity, dataService, config, triggerEntityName = null) {
			var virtualEntityDataService = !_.isString(dataService) && dataService.getServiceName().includes('Virtual') ? dataService : service.getVirtualDataServiceByMatch(dataService);
			var virtualEntity = _.head(virtualEntityDataService.findVirtualEntities([entity], config.entity, config.filterProperty));
			var promise = virtualEntityDataService.getQueuedRequest();

			let triggeredFromGrid = (new Error().stack.split('at ').slice(2)).filter(x => x.includes('.commitCurrentEdit')).length > 0;
			let needsVirtualEntitiesLoad = triggeredFromGrid && !_.isNil(lastTriggerEntityName) && lastTriggerEntityName !== triggerEntityName;

			if (!virtualEntity || needsVirtualEntitiesLoad) {
				lastTriggerEntityName = triggerEntityName;
				var dateshiftFilter = {
					mainItemIds : [entity[config.filterProperty || 'Id']],
					entity : config.entity,
					foreignKey : config.foreignKey,
					triggerEntityName: triggerEntityName
				};
				promise = virtualEntityDataService.loadVirtualEntities(dateshiftFilter).then(function fn() {
					const matchingProperty = _.isNil(config.matchingPropertyForFindingVirtualEntity) ? config.filterProperty : config.matchingPropertyForFindingVirtualEntity;
					virtualEntity = _.head(virtualEntityDataService.findVirtualEntities([entity], config.entity, matchingProperty));
					//if still no entity: new activity??
					//TODO: directly create new activity + relation?
				});
			}
			return promise.then(() => {
				//finally, check if calendar is loaded!
				let calendarPromise = $q.when(true);
				let dateshiftData = virtualEntityDataService.getDateshiftData();
				if (!_.isNil(virtualEntity) && _.isEmpty(dateshiftData.calendarData)) {
					calendarPromise = (function fn() {
						let calendarLoad;
						const calendarList = virtualEntityDataService.getDateshiftData().relations.map(rel => rel[config.calendarFk]);
						if (_.has(virtualEntity, 'CalCalendarFk') && virtualEntity.CalCalendarFk > 0) {
							calendarLoad = platformDateshiftCalendarService.getCalendarsByIds([virtualEntity.CalCalendarFk]);
						} else if (calendarList.length > 0) {
							calendarLoad = platformDateshiftCalendarService.getCalendarsByIds(calendarList);
						} else {
							calendarLoad = platformDateshiftCalendarService.getCompanyCalendar();
						}
						return calendarLoad.then((calendarData) => {
							virtualEntityDataService.addCalendarData(calendarData);
							if (_.has(virtualEntity, 'ProjectFk' && virtualEntity.ProjectFk > 0)) {
								calendarLoad = platformDateshiftCalendarService.getCalendarByProjectIds([virtualEntity.ProjectFk]);
							} else {
								calendarLoad = platformDateshiftCalendarService.getCompanyCalendar();
							}
							return calendarLoad.then((defaultCalendarData) => {
								if (defaultCalendarData.length > 0) {
									virtualEntityDataService.addDefaultCalendarData(defaultCalendarData[0]);
								}
							});
						});
					})();
				}
				return calendarPromise.then(() => {
					return {
						entity: virtualEntity,
						dataService: virtualEntityDataService
					};
				});
			});
		}

		function shiftVirtualDateshiftData(trigger, dataService, config) {
			return dataService.shiftVirtualEntity(trigger, config.entity, config.dateshiftId);
		}
		//endregion


		return service;
	}
})(angular);
