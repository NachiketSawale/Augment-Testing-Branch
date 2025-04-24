/* global _*/
(function serviceFn() {
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc constant
	 * @name productionplanningCommonEventMainConfiguration
	 * @function
	 *
	 * @description
	 * productionplanningCommonEventMainConfiguration returns all a caonfig object of all event servies sorted by module id.
	 * Should be used within PpsEventDataServiceFactory only if possible.
	 */
	angular.module(moduleName).constant('productionplanningCommonEventDateshiftConfiguration', (function getEventDateshiftConfiguration() {

		//default values for all subevents
		var defaultConfiguration = {
			foreignKey: 'Id',
			filterProperty: 'PpsEventFk',
			virtual: true,
			eventKey: 'PpsEventFk',
			eventProperty: 'Id',
			dateshiftId: null
		};
		var moduleConfigurations = {};
		_.forEach(moduleConfigurations, function mergeConfigFn(configObject, configKey) {
			moduleConfigurations[configKey] = _.assign({}, defaultConfiguration, configObject);
		});

		return {
			get: function (moduleId) {
				var result = moduleConfigurations[_.camelCase(moduleId)] || defaultConfiguration;
				return _.clone(result);
			}
		};
	})());

	/**
	 * @ngdoc service
	 * @name productionplanningCommonEventDateshiftService
	 * @function
	 * @requires platform:platformDateshiftHelperService
	 * @description
	 * productionplanningCommonEventValidationServiceExtension adds common validation methods to validation services of ppsEvent or ppsDerivedEvent(like EngTask, TrsRoute and so on)
	 */
	angular.module(moduleName).service('productionplanningCommonEventDateshiftService', ProductionplanningCommonEventDateshiftService);
	ProductionplanningCommonEventDateshiftService.$inject = ['$q', 'moment', 'platformDateshiftHelperService',
		'productionplanningCommonEventMainServiceFactory', 'productionplanningCommonEventDateshiftConfiguration'];
	function ProductionplanningCommonEventDateshiftService($q, moment, dateshiftHelperService, ppsCommonEventMainServiceFactory, eventDateshiftConfiguration) {
		var service = this;

		/**
		 * @ngdoc function
		 * @name initializeDateShiftController
		 * @description Public function that initializes a eventDataService for dateshift and adds dateshift tools to the controller.
		 *
		 * @param {string} moduleId: Id of eventDataService.
		 * @param {dataService} dataService: dataService that consume the dateshift.
		 * @param {Object} controllerScope: $scope of the intialized controller.
		 * @param {Object} [config]: Optional config object for sub config objects. Consists of:
		 * @param {Object} [config.eventConfig]: Optional override config object for the eventDataService.
		 * @param {Object} [config.toolConfig]: Optional override config object for the dateshift tools.
		 * @param {string} [config.toolConfig.toolConfigId]: Optional override config object for the dateshift tool id.
		 * @param {Object[]} [config.toolConfig.tools]: Optional config array for the dateshift tools.
		 * @param {string} [configId]: Optional identifier to fetch the configuration instead of by module id.
		 * Other config values are disregarded in this case
		 **/
		service.initializeDateShiftController = function initializeDateShiftController(moduleId, dataService, controllerScope, config, configId) {
			config = config || {};
			if (_.isNil(config.eventConfig)) {
				config.eventConfig = eventDateshiftConfiguration.get(configId || moduleId);
			}
			var dateshiftDataService = getEventMainServiceByModuleId(moduleId, dataService, config.eventConfig);
			if (!_.isNil(dateshiftDataService)) {
				controllerScope.dateShiftModeTools = dateshiftHelperService.getDateshiftTools(dateshiftDataService.getServiceName(), config.toolConfig.tools, config.toolConfig.toolConfigId, controllerScope);
				_.forEachRight(controllerScope.dateShiftModeTools,function fn(tool){
					controllerScope.tools.items.unshift(tool);
				});
			}
		};


		/**
		 * @ngdoc function
		 * @name shiftEventAsync
		 * @description Public function that takes an event entity,
		 * fetches their dateshift data and eventually shifts their date,
		 * usually triggered by a validation service.
		 * @param {Object} entity: The entity that triggered the shift
		 * @param {moment} value: date to be changed to in dateshift
		 * @param {string} field: property used for dateshift
		 * @param {dataService} dataServ: dataService that provides the entity
		 * @param {Object | string} [config]: Optional config to create/get the underlying event dataservice.
		 * Alternatively, a string can be passed to indicate a dateshift configuration based on a module id.
		 * If no config is passed, no dateshift is triggered.
		 * @param {string} config.moduleId: Id of eventDataService.
		 * @param {Object} [config.eventKey]: Optional name of property of passed entity that holds the referenced value of the event (eg: 'EventFk'). 'Id' by default.
		 * @param {Object} [config.eventProperty]: Optional name of property of event that matches the value of the eventKey property of the entity (eg: 'EventTypeFk'). 'Id' by default.
		 * @param {Object} [config.eventConfig]: Optional override config object for the eventDataService.
		 * @param {boolean} [config.dateshiftId]: Optional id of configSet that is used for dateshift.
		 * @param {string} [config.dateshiftDisabled]: Optional flag to skip shift entirely and return original item to caller.
		 * Other config values are disregarded in this case
		 *
		 * @returns {object} validation result including {boolean} apply, {moment} value
		 **/
		service.shiftEventAsync = function shiftEventAsync(entity, value, field, dataServ, config) {
			var result;
			//set config to empty object if undefined
			config = config || {};
			if (_.isString(config)) {
				var moduleId = config;
				config = eventDateshiftConfiguration.get(moduleId);
				config.moduleId = moduleId;
			}
			//don't shift date if entity is new!
			if (entity.Version === 0 || config.dateshiftDisabled) {
				let disabledShiftResult = {
					apply: true,
					value: value,
					event: entity,
					dateshiftCancelled: true
				};
				result = $q.when(disabledShiftResult);
			} else {
				var getEventAsync = getVirtualEventDataAsync(entity, dataServ, config);
				result = getEventAsync.then(function shiftFoundEvent(result) {
					if (!result.event) {
						return null;
					}
					var currentField = getCurrentDateField(field);
					var trigger = _.cloneDeep(result.event);
					trigger[currentField] = value;
					var shiftedEntity = shiftVirtualEvent(trigger, result.dataService, config);
					if (shiftedEntity) {
						var oppositeField = getOppositeDateField(currentField);
						if (shiftedEntity) {
							if (moment.isMoment(shiftedEntity[currentField]) && shiftedEntity[currentField].isValid()) {
								value = shiftedEntity[currentField];
								entity[currentField] = entity[field] = shiftedEntity[currentField];
							}
							if (oppositeField && moment.isMoment(shiftedEntity[oppositeField]) && shiftedEntity[oppositeField].isValid()) {
								entity[oppositeField] = shiftedEntity[oppositeField];
							}
						}
					}
					return {
						apply: _.isNil(shiftedEntity),
						value: value,
						event: result.event
					};
				});
			}
			return result;
		};


		//region Virtual Event


		function getVirtualEventDataAsync(entity, dataService, config) {
			var eventEntity, eventDataService;
			var promise = $q.when(true);
			if (config.moduleId) {
				eventDataService = getEventMainServiceByModuleId(config.moduleId, dataService, config);
				eventEntity = getEvent(entity, eventDataService.getList(), config);
				if (!eventEntity) {
					eventDataService.setRequireLoad(true);
					promise = eventDataService.loadSubItemList().then(function afterLoadedEntities() {
						eventDataService.setRequireLoad(false);
						eventEntity = getEvent(entity, eventDataService.getList(), config);
						//if still no entity: new event
						//TODO: directly create new event + relation?
					});
				}
			} else {
				eventDataService = dataService;
				eventEntity = entity;
			}
			return promise.then(function returnResult() {
				return {
					event: eventEntity,
					dataService: eventDataService
				};
			});
		}

		function shiftVirtualEvent(trigger, dataService, config) {
			var dsResult = dateshiftHelperService.shiftDate(dataService.getServiceName(), trigger, config.dateshiftId);
			return getEvent(trigger, dsResult, {});
		}

		function getEventMainServiceByModuleId(moduleId, mainService, config) {
			return ppsCommonEventMainServiceFactory.getService(config.foreignKey, moduleId,
				mainService, config.filterProperty, config.virtual);
		}

		//enregion


		function getEvent(entity, eventList, config) {
			return _.find(eventList, function findEvent(event) {
				return entity[config.eventKey || 'Id'] === event[config.eventProperty || 'Id'];
			});
		}

		function getCurrentDateField(field) {
			var fieldJoins = getFieldSegments(field);
			var fieldPrefix = _.first(fieldJoins);
			var fieldType = _.last(fieldJoins) === 'Time' ? 'Start' : _.last(fieldJoins);
			return fieldPrefix + fieldType;
		}

		function getOppositeDateField(field) {
			var fieldJoins = getFieldSegments(field);
			var fieldPrefix = _.first(fieldJoins);
			var fieldType = _.last(fieldJoins) === 'Start' ? 'Finish' : 'Start';
			return fieldPrefix + fieldType;
		}

		function getFieldSegments(field) {
			var fieldJoins = field.match(/[A-Z][a-z]+/g);
			if (!fieldJoins || fieldJoins.length !== 2) {
				// eslint-disable-next-line no-console
				console.warn('Field does not match Naming Convention of Date Field');
				return null;
			} else {
				return fieldJoins;
			}
		}

		return service;
	}
})();
