/*
 * Created by las on 26/08/2020.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsEngineeringGanttEventService
	 */
	var moduleName = 'productionplanning.engineering';
	var masterModule = angular.module(moduleName);

	masterModule.service('ppsEngineeringGanttEventService', PpsEngineeringGanttEventService);

	PpsEngineeringGanttEventService.$inject = ['$injector',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'productionplanningItemProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningEngineeringMainService',
		'ppsItemEventReadonlyProcessor',
		'platformDateshiftHelperService',
		'ppsItemEventImageProcessor',
		'ppsCommonDataServiceItemFilterTreeExtension',
		'ppsMasterDataServiceFactory',
		'ppsMasterDataConfigurations',
		'platformDateshiftCalendarService'];

	function PpsEngineeringGanttEventService($injector,
									 platformDataServiceFactory,
									 ServiceDataProcessArraysExtension,
									 productionplanningItemProcessor,
									 basicsLookupdataLookupDescriptorService,
									 platformDataServiceProcessDatesBySchemeExtension,
											 productionplanningEngineeringMainService,
									 ppsItemEventReadonlyProcessor,
									 platformDateshiftHelperService,
									 ppsItemEventImageProcessor,
									 ppsCommonDataServiceItemFilterTreeExtension,
									 ppsMasterDataServiceFactory,
									 ppsMasterDataConfigurations,
											 platformDateshiftCalendarService) {
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		var serviceOption = {
			hierarchicalRootItem: {
				module: masterModule,
				serviceName: 'ppsEngineeringGanttEventService',
				entityNameTranslationID: 'productionplanning.item.event', // id not correct
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getItemEventListGraphByJob',
					initReadData: function initReadData(readData) {
						var task = serviceContainer.parentService.getSelected();
						if(task !== null && task.PPSItemFk !== null){
							var ppsItem = basicsLookupdataLookupDescriptorService.getLookupItem('PPSItem', task.PPSItemFk);
							if(ppsItem !== null){
								readData.filter = '?lgmJobFk=' + ppsItem.LgmJobFk;
							}
						}
						else {
							readData.filter = '?lgmJobFk=' + -1;
						}

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

							return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then(function(calendarData) {
								serviceContainer.service.calendarData = calendarData;
								return serviceContainer.data.handleReadSucceeded(result, data);
							});
						},
					}
				},
				entityRole: {
					node: {
						parentService: productionplanningEngineeringMainService,
						itemName: 'PPSItemEventGantt',
						moduleName: 'PPSItemEvent',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				translation: {
					uid: 'productionplanningEngineeringMainService',
					title: 'productionplanning.engineering.entityEngTask',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				},
				useItemFilter: true
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		// register to masterDataService
		var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
			dataServiceContainer: serviceContainer,
			mergeDataAsync: true,
			matchConfig: {
				'Id': 'OriginalId'
			},
			filter: function(event) {
				return _.includes(event.Id, 'E');
			}
		});
		ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);

		// register masterdata changed and refresh gantt data
		serviceContainer.service.masterDataChanged = function masterDataChanged() {
			serviceContainer.service.gridRefresh();
			if (!_.isUndefined(serviceContainer.service.ganttDataLoaded)) {
				serviceContainer.service.ganttDataLoaded.fire();
			}
		};

		serviceContainer.parentService = productionplanningEngineeringMainService;

		var filterFn = function(event) {
			return !event.IsHidden;
		};

		serviceContainer.service.setItemFilter(filterFn);
		serviceContainer.service.enableItemFilter(true);

		//overwrite getTree function to overrule issue of filterTree function
		ppsCommonDataServiceItemFilterTreeExtension.overwriteTreeFunction(serviceContainer);

		function syncEventChanges(placeholder, changedEntity) {
			var synchronizedEvents = _.filter(serviceContainer.data.itemList, { OriginalId: changedEntity.OriginalId});
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
		serviceContainer.service.setDateshiftMode = function(mode) {
			serviceContainer.service.config.mode = _.isString(mode)? mode : serviceContainer.service.config.mode;
			platformDateshiftHelperService.resetDateshift(serviceContainer.service.getServiceName());
		};

		serviceContainer.service.getDateshiftData = function getDateshiftData() {
			return {
				config : serviceContainer.service.config,
				originalActivities : serviceContainer.service.getList(),
				relations: serviceContainer.service.relations,
				calendarData: serviceContainer.service.calendarData
			};
		};

		serviceContainer.service.postProcessDateshift = function() {
			// todo: remove this function after refreshGrid is working
		};

		platformDateshiftHelperService.registerDateshift(serviceContainer.service);

		return serviceContainer.service;
	}
})(angular);