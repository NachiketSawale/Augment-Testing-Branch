/**
 * Created by mik on 30/07/2019.
 */
/* global globals, _ */
((angular) => {
	'use strict';
	/**
	 * @ngdoc service
	 * @name PpsItemEventDataService
	 *
	 * @description
	 * PpsItemEventDataServiceFactory creates a service for the hierarchical list of item and events.
	 */
	var moduleName = 'productionplanning.item';
	var masterModule = angular.module(moduleName);

	masterModule.service('productionplanningItemEventService', PpsItemEventDataService);

	PpsItemEventDataService.$inject = ['$injector',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'productionplanningItemProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningItemDataService',
		'ppsItemEventReadonlyProcessor',
		'platformDateshiftHelperService',
		'ppsItemEventImageProcessor',
		'ppsCommonDataServiceItemFilterTreeExtension',
		'ppsMasterDataServiceFactory',
		'ppsMasterDataConfigurations',
		'platformDateshiftCalendarService',
		'productionplanningCommonActivityDateshiftService'];

	function PpsItemEventDataService(
		$injector,
		platformDataServiceFactory,
		ServiceDataProcessArraysExtension,
		productionplanningItemProcessor,
		basicsLookupdataLookupDescriptorService,
		platformDataServiceProcessDatesBySchemeExtension,
		productionplanningItemDataService,
		ppsItemEventReadonlyProcessor,
		platformDateshiftHelperService,
		ppsItemEventImageProcessor,
		ppsCommonDataServiceItemFilterTreeExtension,
		ppsMasterDataServiceFactory,
		ppsMasterDataConfigurations,
		platformDateshiftCalendarService,
		ppsActivityDateshiftService) {
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		let virtualDataService;

		var serviceOption = {
			hierarchicalRootItem: {
				module: masterModule,
				serviceName: 'productionplanningItemEventService',
				entityNameTranslationID: 'productionplanning.item.event', // id not correct
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getItemEventListGraphByJob',
					initReadData: function initReadData(readData) {
						readData.filter = '?lgmJobFk=' + serviceContainer.parentService.getSelected().LgmJobFk;
					}
				},
				dataProcessor: [
					new ServiceDataProcessArraysExtension(['ChildItems']),
					//productionplanningItemProcessor,
					dateProcessor,
					ppsItemEventReadonlyProcessor,
					{
						processItem: function (item) {
							ppsItemEventImageProcessor.processItem(item);
						}
					}
				],
				presenter: {
					tree: {
						parentProp: 'PPSItemFk',
						childProp: 'ChildItems', // add ChildItems to list
						hierarchyEnabled: true,
						initialState: 'expanded',
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							serviceContainer.service.itemIds = readData.itemIds;
							// service.onContextUpdated.fire();

							// virtual data load
							let mainItemIds = [];

							result.dtos.forEach((location) => {
								getMainItemIds(location, {mainItemIds});
							});

							const dateshiftFilter = {
								mainItemIds,
								entity: 'Event',
								foreignKey: 'Id'
							};

							if (_.isUndefined(serviceContainer.service.calendarData)) {
								serviceContainer.service.calendarData = new Map();
							}

							if (mainItemIds.length > 0) {
								return virtualDataService.loadVirtualEntities(dateshiftFilter).then(() => {
									//future implementation!
									//var calendarIdList = _.map(readData.dtos, 'CalCalendarFk');
									return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then((calendarData) => {
										serviceContainer.service.calendarData.set('default', calendarData);
										return serviceContainer.data.handleReadSucceeded(result, data);
									});
								});
							} else {
								//future implementation!
								//var calendarIdList = _.map(readData.dtos, 'CalCalendarFk');
								return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then((calendarData) => {
									serviceContainer.service.calendarData.set('default', calendarData);
									return serviceContainer.data.handleReadSucceeded(result, data);
								});
							}
						},
					}
				},
				entityRole: {
					node: {
						parentService: productionplanningItemDataService,
						itemName: 'PPSItemEventGantt',
						moduleName: 'PPSItemEvent',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				translation: {
					uid: 'productionplanningItemMainService',
					title: 'productionplanning.item.entityItem',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				},
				useItemFilter: true
			}
		};

		function getMainItemIds(item, mainItemIdsObj) {
			if (!_.isNil(item.ChildItems)) {
				item.ChildItems.forEach(i => getMainItemIds(i, mainItemIdsObj));
			} else {
				if (mainItemIdsObj.mainItemIds.indexOf(item.OriginalId) === -1) {
					mainItemIdsObj.mainItemIds.push(item.OriginalId);
				}
			}
		}

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.service.getContainerData = () => serviceContainer.data;
		// register to masterDataService
		// var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
		// 	dataServiceContainer: serviceContainer,
		// 	mergeDataAsync: true,
		// 	validation: {
		// 		service: $injector.get('productionplanningCommonEventValidationService').getValidationService(serviceContainer.service, 'productionplanning.item.gantt'),
		// 		properties: ['PlannedStart', 'PlannedFinish']
		// 	},
		// 	matchConfig: {
		// 		'Id': 'OriginalId'
		// 	},
		// 	filter: function(event) {
		// 		return _.includes(event.Id, 'E');
		// 	}
		// });
		// ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);
		//
		// // register masterdata changed and refresh gantt data
		// serviceContainer.service.masterDataChanged = function masterDataChanged() {
		// 	serviceContainer.service.gridRefresh();
		// 	if (!_.isUndefined(serviceContainer.service.ganttDataLoaded)) {
		// 		serviceContainer.service.ganttDataLoaded.fire();
		// 	}
		// };

		let dateShiftConfig = {
			dateshiftId: 'productionplanning.item.gantt'
		};
		let virtualValidationConfig = {
			service: $injector.get('productionplanningCommonEventValidationService').getValidationService(serviceContainer.service, dateShiftConfig.dateshiftId, dateShiftConfig),
			properties: ['PlannedStart', 'PlannedFinish', 'ModificationInfo']
		};
		virtualDataService = ppsActivityDateshiftService.registerToVirtualDateshiftService('productionplanning.common', serviceContainer, dateShiftConfig.dateshiftId, virtualValidationConfig);

		serviceContainer.parentService = productionplanningItemDataService;

		var filterFn = function (event) {
			return !event.IsHidden;
		};

		serviceContainer.service.setItemFilter(filterFn);
		serviceContainer.service.enableItemFilter(true);

		//overwrite getTree function to overrule issue of filterTree function
		ppsCommonDataServiceItemFilterTreeExtension.overwriteTreeFunction(serviceContainer);

		function syncEventChanges(placeholder, changedEntity) {
			var synchronizedEvents = _.filter(serviceContainer.data.itemList, {OriginalId: changedEntity.OriginalId});
			_.forEach(synchronizedEvents, function (event) {
				event.PlannedStart = changedEntity.PlannedStart;
				event.PlannedFinish = changedEntity.PlannedFinish;
			});
		}

		serviceContainer.service.registerItemModified(syncEventChanges);

		// Dateshift attributes
		serviceContainer.service.config = {
			mode: 'both', // initial mode
			id: 'OriginalId',
			end: 'PlannedFinish',
			start: 'PlannedStart',
			nextEdgeKey: 'SuccessorFk',
			prevEdgeKey: 'PredecessorFk',
			relationKind: 'RelationKindFk',
			isLocked: 'IsLocked'
		};
		serviceContainer.service.originalActivities = [];
		serviceContainer.service.relations = [];
		serviceContainer.service.setDateshiftMode = function (mode) {
			serviceContainer.service.config.mode = _.isString(mode) ? mode : serviceContainer.service.config.mode;
			platformDateshiftHelperService.resetDateshift(serviceContainer.service.getServiceName());
		};

		serviceContainer.service.getDateshiftData = function getDateshiftData() {
			return {
				config: serviceContainer.service.config,
				originalActivities: serviceContainer.service.getList(),
				relations: serviceContainer.service.relations,
				calendarData: serviceContainer.service.calendarData
			};
		};

		serviceContainer.service.postProcessDateshift = function () {
			// todo: remove this function after refreshGrid is working
		};

		platformDateshiftHelperService.registerDateshift(serviceContainer.service);

		return serviceContainer.service;
	}
})(angular);
