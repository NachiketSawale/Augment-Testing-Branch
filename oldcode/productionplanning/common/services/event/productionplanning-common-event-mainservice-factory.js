/**
 * Created by lid on 7/14/2017.
 */
(function () {
	'use strict';
	/*global angular, globals, _*/

	/**
	 * @ngdoc service
	 * @name PpsEventDataServiceFactory
	 * @function
	 *
	 * @description
	 * PpsEventDataServiceFactory create difference data service for difference containner.
	 */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningCommonEventMainServiceFactory', ProductionplanningCommonEventMainServiceFactory);

	ProductionplanningCommonEventMainServiceFactory.$inject = ['$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService', 'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningCommonEventProcessor', 'basicsLookupdataLookupFilterService',
		'PlatformMessenger', 'platformDateshiftHelperService', 'ppsMasterDataServiceFactory', 'ppsMasterDataConfigurations',
		'$q', '$http', 'platformDateshiftCalendarService', 'productionplanningCommonActivityDateshiftService'];

	function ProductionplanningCommonEventMainServiceFactory(
		$injector, platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		platformDataServiceProcessDatesBySchemeExtension,
		productionplanningCommonEventProcessor,
		basicsLookupdataLookupFilterService,
		PlatformMessenger, platformDateshiftHelperService,
		ppsMasterDataServiceFactory, ppsMasterDataConfigurations,
		$q, $http, platformDateshiftCalendarService, ppsActivityDateshiftService) {

		var serviceFactroy = {};
		var serviceCache = {};
		//moduleId is used to handle the special service.
		// serviceFactroy.createNewComplete = function createNewComplete(foreignKey, moduleId, mainService, filterProperty, virtual, hideCreateDeleteBtn) {
		serviceFactroy.createNewComplete = function createNewComplete(foreignKey, moduleId, mainService, filterProperty, virtual) {
			const hideCreateDeleteBtn = ['productionplanning.common.item.event',
				'productionplanning.common.item.product.event',
				'productionplanning.common.product.event']
				.some(e => e === moduleId);
			const relations = [];
			let schema = {
				typeName: 'EventDto',
				moduleSubModule: 'ProductionPlanning.Common'
			};
			let dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(schema);

			const canCreateOrDeleteCallBackFunc = (event) =>{
				if(mainService.getSelected()?.IsForPreliminary === true){
					return false;
				}
				if(mainService?.parentService()?.getSelected()?.IsForPreliminary === true){
					return false;
				}
				// other condition...
				return true;
			};

			var serviceOption = {
				flatNodeItem: {
					module: masterModule,
					entityNameTranslationID: 'productionplanning.common.event.eventTitle',
					dataProcessor: [productionplanningCommonEventProcessor, dateProcessor],
					serviceName: mainService.getServiceName() + 'EventDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/common/event/',
						//endRead: 'listForCommon'
						endRead: 'listForDateshift'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'productionplanning/common/event/',
						endCreate: 'createForCommon'
					},
					entityRole: {
						node: {
							itemName: 'Event',
							parentService: mainService,
							parentFilter: 'foreignKey=' + foreignKey + '&mainItemId',
							doesRequireLoadAlways: virtual ? false : true,
							filterParent: function (data) {
								var parentItemId;
								data.currentParentItem = data.parentService.getSelected();
								if (data.currentParentItem) {
									parentItemId = data.currentParentItem[filterProperty || 'Id'];
								}
								data.selectedItem = null;
								data.parentFilterProperty = filterProperty;
								return parentItemId;
							}
						}

					},
					actions: hideCreateDeleteBtn === true ? {} :
						{
							delete: {},
							canDeleteCallBackFunc: canCreateOrDeleteCallBackFunc,
							canCreateCallBackFunc: canCreateOrDeleteCallBackFunc,
							create: 'flat',
						},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};
								relations.push(readData.Relations);
								resetDs();

								//future implementation!
								//var calendarIdList = _.map(readData.dtos, 'CalCalendarFk');
								return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then(function (calendarData) {
									serviceContainer.service.calendarData = calendarData;

									var handleResult = serviceContainer.data.handleReadSucceeded(result, data);
									syncProdcutionEventQuantity(result.dtos);
									return handleResult;

								});
							},
							initCreationData: function initCreationData(creationData, data) {
								creationData.mainItemId = data.parentService.getSelected().Id;
								creationData.foreignKey = foreignKey;
								var parent = data.parentService.getSelected();
								if (!_.isUndefined(parent.LgmJobFk) && !_.isNull(parent.LgmJobFk)) {
									creationData.jobId = parent.LgmJobFk;
								}
							}
						}
					},
					modification: true,
					useItemFilter: true
				}
			};

			initialize();
			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;
			service.getContainerData = () => serviceContainer.data;
			// register to masterDataService
			// var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
			// 	dataServiceContainer: serviceContainer,
			// 	validation: {
			// 		service: $injector.get('productionplanningCommonEventValidationService').getValidationService(serviceContainer.service, moduleId),
			// 		properties: ['PlannedStart', 'PlannedFinish']
			// 	},
			// 	overwriteEntity: true
			// });
			// ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);

			// register to virtualDataService
			//if (moduleName === 'productionplanning.mounting') {
			let dateShiftConfig = {
				dateshiftId: 'productionplanning.common'
			};
			// todo: second parameter should be moduleId or dateshiftId?
			let virtualValidationConfig = {
				service: $injector.get('productionplanningCommonEventValidationService').getValidationService(service, moduleId, dateShiftConfig),
				properties: ['PlannedStart', 'PlannedFinish', 'ModificationInfo']
			};
			// #135820: always use actual module name to register to VDS (exception: pps.item!)
			const currentModuleName = service.getModule().name || moduleName;
			const moduleWithGenericVds = ['productionplanning.item'];
			const vdsModuleName = moduleWithGenericVds.includes(currentModuleName)? moduleName : currentModuleName;
			ppsActivityDateshiftService.registerToVirtualDateshiftService(vdsModuleName, serviceContainer, dateShiftConfig.dateshiftId, virtualValidationConfig);
			//}

			serviceContainer.data.usesCache = false;
			serviceContainer.data.newEntityValidator = newEntityValidator();

			function newEntityValidator() {
				return {
					validate: function validate(entity) {
						if (entity.Version === 0) {
							var validService = $injector.get('productionplanningCommonEventValidationService').getValidationService(service, moduleId);
							validService.validateEventTypeFk(entity, (entity.EventTypeFk === 0) ? null : entity.EventTypeFk, 'EventTypeFk');
							validService.validateCalCalendarFk(entity, (entity.CalCalendarFk === 0) ? null : entity.CalCalendarFk, 'CalCalendarFk');
							validService.validatePlannedStart(entity, entity.PlannedStart, 'PlannedStart');
							validService.validatePlannedFinish(entity, entity.PlannedFinish, 'PlannedFinish');
							validService.validateEarliestStart(entity, entity.EarliestStart, 'EarliestStart');
							validService.validateEarliestFinish(entity, entity.EarliestFinish, 'EarliestFinish');
							validService.validateLatestStart(entity, entity.LatestStart, 'LatestStart');
							validService.validateLatestFinish(entity, entity.LatestFinish, 'LatestFinish');
						}
					}
				};
			}

			service.onEventUpdated = new PlatformMessenger();

			service.onEventUpdated.register(eventUpdate);

			function eventUpdate(changedEvents) {
				const eventValidationService = $injector.get('productionplanningCommonEventValidationService').getValidationService(service, moduleId, {
					dateshiftId: 'productionplanning.common'
				});
				let listEvents = service.getList();
				if (changedEvents.length > 0) {
					const filterLogEvents = event => {
						return event.ModificationInfo !== null && event.ModificationInfo.ModifiedProperties !== null &&
							event.ModificationInfo.ModifiedProperties[0].LogConfigType !== 2;
					};
					_.forEach(changedEvents, function (changedEvent) {
						let ppsEvent = _.find(listEvents, {Id: changedEvent.Id});
						if (ppsEvent) {
							eventValidationService.validateQuantity(ppsEvent, changedEvent.Quantity, 'Quantity');
							ppsEvent.Quantity = changedEvent.Quantity;
							service.markItemAsModified(ppsEvent);
						}
					});

					let needLogEvents = listEvents.filter(filterLogEvents);
					if (needLogEvents.length > 0) {
						const loggingValidationExtension = $injector.get('ppsCommonLoggingValidationExtension');
						const translationSrv = $injector.get('productionplanningCommonTranslationService');
						const entity = needLogEvents[0];
						const model = 'ModificationInfo';

						loggingValidationExtension.showLoggingDialog(entity, schema, translationSrv, true).then(res => {
							if (res.ok) {
								loggingValidationExtension.setUpdateReasons(entity, res.value);
								eventValidationService.validateModificationInfo(entity, res.value, model);
							} else if (res.applyAll) {
								loggingValidationExtension.setUpdateReasonsAndValidateEntities(needLogEvents, entity, res.value, eventValidationService.validateModificationInfo);
							}
						});
					}
				}
			}

			function syncProdcutionEventQuantity(events) {
				var itemDataSrv = $injector.get('productionplanningItemDataService');
				if (mainService === itemDataSrv) {
					var selectedPpsItem = itemDataSrv.getSelected();
					if (selectedPpsItem) {
						var caches = $injector.get('ppsDataCache').itemModule.itemProductsTotalArea;
						var cache = _.find(caches, {itemId: selectedPpsItem.Id});
						if (cache) {
							service.updateProductionEventQuantity(cache.productsTotalArea, events);
							caches.splice(caches.indexOf(cache), 1); // remove after used
						}
					}
				}
			}

			service.updateProdEventQuantityPromise = undefined;
			service.updateProductionEventQuantity = function (quantity, events, additionalQty) {
				var defer = $q.defer();
				var listEvents = events ? events : service.getList();
				if (listEvents && listEvents.length > 0) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/getall').then(function (response) {
						var items = response.data;
						var productionEvent = null;
						// find production event
						for (var i = 0; i < listEvents.length; i++) {
							var evenType = _.find(items, {Id: listEvents[i].EventTypeFk});
							if (evenType.PpsEntityFk === 15) { // PPS Production Set
								productionEvent = listEvents[i];
								break;
							}
						}
						// update quantity of production event
						if (productionEvent) {
							productionEvent.Quantity = quantity || (productionEvent.Quantity + additionalQty);
							service.markItemAsModified(productionEvent);
						}

						defer.resolve();
					});
				} else {
					defer.resolve();
				}

				service.updateProdEventQuantityPromise = defer.promise;
			};

			function filterFn(item) {
				return !item.IsHidden;
			}

			service.setItemFilter(filterFn);
			service.enableItemFilter(true);

			service.onPrjLocationChanged = new PlatformMessenger();

			function onPrjLocationChanged(args) {
				let events = service.getUnfilteredList(); // get all events of current PU tree.
				if (events.length > 0) {
					let eventsToUpdate = events.filter(function (event) {
						return event[args.foreignKey] === args.foreignValue;
					});

					eventsToUpdate.forEach(function (event) {
						event.PrjLocationFk = args.prjLocationId;
					});

					service.markEntitiesAsModified(eventsToUpdate);
				}
			}

			service.onPrjLocationChanged.register(onPrjLocationChanged);

			mainService.registerSelectionChanged(resetDs);

			var dateshiftConfig = {
				//mode: 'both', //initial mode
				id: 'Id',
				end: 'PlannedFinish',
				start: 'PlannedStart',
				nextEdgeKey: 'SuccessorFk',
				prevEdgeKey: 'PredecessorFk',
				relationKind: 'RelationKindFk',
				isLocked: 'IsLocked'
			};

			service.setDateshiftMode = function (mode) {
				dateshiftConfig.mode = _.isString(mode) ? mode : dateshiftConfig.mode;
				resetDs();
			};

			service.getDateshiftData = function () {
				return {
					config: dateshiftConfig,
					originalActivities: service.getUnfilteredList(),
					relations: relations,
					calendarData: service.calendarData
				};
			};

			service.postProcessDateshift = function (dateshiftResult) {
				var events = _.filter(dateshiftResult, 'hasChanged');
				//use custom columns info
				var customColumnServiceFactory = $injector.get('ppsCommonCustomColumnsServiceFactory');
				//get service of parentservice
				var customColumnService = customColumnServiceFactory.getService('productionplanning.item'); //for now hardcoded
				customColumnServiceFactory.getService();
				//sync planned start AND end
				var fields = ['PlannedStart', 'PlannedFinish'];
				customColumnService.syncValuesToEntities(mainService, events, fields, undefined, 'EventEntities');
				service.gridRefresh();
			};

			platformDateshiftHelperService.registerDateshift(service);

			function resetDs() {
				platformDateshiftHelperService.resetDateshift(service.getServiceName());
			}

			service.setRequireLoad = function (value) {
				if (virtual) {
					serviceContainer.data.doesRequireLoadAlways = value;
				}
			};

			service.serviceNeedsLoad = function serviceNeedsLoad() {
				var data = serviceContainer.data;
				if (data.parentService) {
					var parentItem = data.parentService.getSelected();
					return _.isEmpty(data.usingContainer) && parentItem && (!data.currentParentItem || parentItem.Id !== data.currentParentItem.Id);
				}

				return _.isEmpty(data.usingContainer);
			};

			service.getDateShiftMessageDescription = (eventList) => {
				return Promise.resolve(new Map([
					['eventCode', new Map(eventList.map(eventEntity => [eventEntity.Id, eventEntity.EventCode || '']))]
				]));
			};

			return service;
		};

		/**
		 * @ngdoc function
		 * @name getService
		 * @description Public function that returns an event main data service based on a config.
		 *
		 * @param {string} foreignKey: The name of the key that is used to fetch the events from the server. E.g.: 'Id'
		 * @param {string} moduleId: Id of the eventMainDataService. Is usually named after module + '.event' in the module it is used in.
		 * @param {Object} mainService: DataService that will become the parent the event dataservice.
		 * @param {string} filterProperty: The name of the property that is used to fetch the filter property from the entity of the passed main service.
		 * @param {boolean} [virtual]: Flag to indicated if the service is not represented in an interface on its own.
		 * Usually true if the mainService is set.
		 *
		 * @returns {Object} The eventMainDataService that was found/created.
		 **/
		serviceFactroy.getService = function getService(foreignKey, moduleId, mainService, filterProperty, virtual) {
			if (!serviceCache[moduleId]) {
				serviceCache[moduleId] = serviceFactroy.createNewComplete(foreignKey, moduleId,
					mainService, filterProperty, virtual);
			}
			return serviceCache[moduleId];
		};

		serviceFactroy.hasService = function (moduleId) {
			return !_.isNil(serviceCache[moduleId]);
		};

		return serviceFactroy;

		function initialize() {
			var filters = [{
				//a filter for ordinary event(not for special event)
				key: 'productionplanning-common-event-ordinary-filter',
				fn: function (item) {
					if (item) {
						return item.PpsEntityFk === 16; //Generic Event
					}
					return false;
				}
			}, {
				key: 'productionplanning-common-event-controlling-unit-filter',
				fn: function (item, event) {
					return item.PrjProjectFk === event.ProjectFk;
				}
			}, {
				key: 'pps-common-event-type-product-filter',
				fn: function (item) {
					if (item) {
						return item.PpsEntityFk === 13; //Product Event
					}
					return false;
				}
			}, {
				key: 'pps-common-event-type-productionset-filter',
				fn: function (item) {
					if (item) {
						return item.PpsEntityFk === 15; //Production Set Event
					}
					return false;
				}
			}];
			_.each(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});
		}
	}
})();

