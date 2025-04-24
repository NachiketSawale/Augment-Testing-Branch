((angular) => {
	'use strict';

	var moduleName = 'productionplanning.item';
	var masterModule = angular.module(moduleName);
	var serviceName = 'ppsItemPlanningBoardProductionSetAssignmentService';
	masterModule.factory(serviceName, PpsItemPlanningBoardProductionSetAssignmentService);
	PpsItemPlanningBoardProductionSetAssignmentService.$inject = [
		'ppsItemPlanningBoardSiteSupplierService',
		'platformDataServiceFactory',
		'$injector',
		'_',
		'ServiceDataProcessDatesExtension',
		'productionplanningItemDataService',
		'basicsUnitQuantityProcessorFactoryService',
		'platformDateshiftHelperService',
		'ppsMasterDataServiceFactory',
		'ppsMasterDataConfigurations',
		'platformPlanningBoardDataService',
		'platformDateshiftHelperService',
		'platformDateshiftCalendarService',
		'platformPlanningBoardAggregationService',
		'productionplanningCommonActivityDateshiftService',
		'ppsItemPlanningBoardAssignmentMappingService'];

	function PpsItemPlanningBoardProductionSetAssignmentService(
		ppsItemPlanningBoardSiteSupplierService,
		platformDataServiceFactory,
		$injector,
		_,
		ServiceDataProcessDatesExtension,
		productionplanningItemDataService,
		basicsUnitQuantityProcessorFactoryService,
		platformDateshiftHelperService,
		ppsMasterDataServiceFactory,
		ppsMasterDataConfigurations,
		platformPlanningBoardDataService,
		dateshiftHelperService,
		platformDateshiftCalendarService,
		platformPlanningBoardAggregationService,
		ppsActivityDateshiftService,
		ppsItemPlanningBoardAssignmentMappingService
	) {

		var infoFieldProcessor = {
			processItem: function processItem(item) {
				// optionally set additional info fields 1-3 here by extending json object
				item.InfoField1 = _.get(item, 'BusinessPartner.BusinessPartnerName1') || '';
				item.InfoField2 = _.get(item, 'BusinessPartnerOrder.BusinessPartnerName1') || '';
				item.InfoField3 = item.QuantityWithUom || '';
			}
		};

		var quantityWithUomProcessor = basicsUnitQuantityProcessorFactoryService.createProcessor({
			deepObjectPrefix: '',
			valueProp: 'Quantity',
			uoMProp: 'UomFk',
			quantityUoMProp: 'QuantityWithUom',
			schemeRef: {
				typeName: 'PPSItemDto',
				moduleSubModule: 'ProductionPlanning.Item'
			}
		});

		var dateShiftData,
			container = null;

		let virtualDataService;

		var serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'resource.reservation.entityReservation',
				httpCRUD: {
					//route: globals.webApiBaseUrl + 'productionplanning/productionset/productionset/',

					//until final implementation
					//route: globals.webApiBaseUrl + 'productionplanning/item/',
					//endRead: 'getForPlanningBoardHack',

					//new implementation
					route: globals.webApiBaseUrl + 'productionplanning/productionset/productionset/',
					endRead: 'getForPlanningBoard',

					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.From = container.data.filter.From;
						readData.To = container.data.filter.To;
						var siteFk = (productionplanningItemDataService.getSelected()) ? productionplanningItemDataService.getSelected().SiteFk : -1;
						readData.ResourceIdList = _.map(ppsItemPlanningBoardSiteSupplierService.getList().filter(r => r.ResourceFk !== null), 'ResourceFk');
						readData.SiteIdList = [siteFk];
						readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind
					}
				},
				actions: {delete: true, create: 'flat'},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function initReservationCreationData(/*creationData, data, creationOptions*/) {
							//Todo: Move client side business logic from PlatformPlanningBoardDataService into server side business logic.
						},
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							dateShiftData = readData.dateShiftData; // do we still need this line?
							container.service.relations = readData._relations;
							container.service.capacityPerDay = readData.capacityPerDay;
							platformPlanningBoardAggregationService.updateCapacities(readData.capacityPerDay, ppsItemPlanningBoardAssignmentMappingService);
							// dateshiftHelperService.shiftDate(container.service.getServiceName(), readData.dtos[0]);

							// virtual data load
							let mainItemIds = _.map(result.dtos, 'Id');
							const dateshiftFilter = {
								mainItemIds,
								entity: 'Event',
								foreignKey: 'Id'
							};

							if (mainItemIds.length > 0) {

								return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then((calendarData) => {
									container.service.calendarData = calendarData;
									return container.data.handleReadSucceeded(result, data);
								});
							} else {
								// future implementation!
								//var calendarIdList = _.map(readData.dtos, 'CalCalendarFk');
								return platformDateshiftCalendarService.getCalendarsByIds([readData.projectCalendarId]).then((calendarData) => {
									container.service.calendarData = calendarData;
									return container.data.handleReadSucceeded(result, data);
								});
							}
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PlanningBoardDemands',
						moduleName: 'cloud.desktop.moduleDisplayNameResourceReservation',
						useIdentification: true,
						parentService: productionplanningItemDataService
					}
				},
				dataProcessor: [new ServiceDataProcessDatesExtension(['PlannedStart', 'PlannedFinish']), quantityWithUomProcessor, infoFieldProcessor],
				useItemFilter: true
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOption);
		container.data.doNotUnloadOwnOnSelectionChange = true;

		container.service.isHighlightAssignments = false;
		container.service.getCustomTools = () => {
			let customTools = [{
				id: 'highlight',
				caption: 'productionplanning.item.highlightAssignment',
				type: 'check',
				iconClass: 'tlb-icons ico-filter-assigned',
				value:container.service.isHighlightAssignments,
				fn: function () {
					highlightAssignments(this.value);
				}
			}];
			return customTools;
		};

		function highlightAssignments(value){
			container.service.isHighlightAssignments = value;
			platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName(serviceName).planningBoardReDraw(true,true);

		}

		// register to masterDataService
		// var masterDataServiceConfig = ppsMasterDataConfigurations.get('Event', {
		// 	dataServiceContainer: container,
			// todo: implement virtual ui service and implement PlanningboardDto needlogging serverside
			// validation: {
			// 	service: $injector.get('productionplanningCommonEventValidationService').getValidationService(container.service, 'productionplanning.item.planningboard'),
			// 	properties: ['PlannedStart', 'PlannedFinish']
			// },
		// 	mergeDataAsync: true
		// });
		//ppsMasterDataServiceFactory.registerServiceToMasterDataService(masterDataServiceConfig);

		//workaround for logging???
		container.service.getContainerData = () => container.data;
		let dateShiftConfig = {
			dateshiftId: 'productionplanning.item.planningboard'
		};
		let virtualValidationConfig = {
			service: $injector.get('productionplanningCommonEventValidationService').getValidationService(container.service, dateShiftConfig.dateshiftId, dateShiftConfig),
			properties: ['PlannedStart', 'PlannedFinish', 'ModificationInfo']
		};
		virtualDataService = ppsActivityDateshiftService.registerToVirtualDateshiftService('productionplanning.common', container, dateShiftConfig.dateshiftId, virtualValidationConfig);

		// DEPRECATED
		// register masterdata changed and refresh planningboard data
		// container.service.masterDataChanged = function masterDataChanged() {
		// 	platformPlanningBoardDataService.planningBoardReDraw();
		// };

		container.service.virtualDataChanged = function virtualDataChanged() {
			platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName(serviceName).planningBoardReDraw(true);
		};

		if (ppsItemPlanningBoardSiteSupplierService && ppsItemPlanningBoardSiteSupplierService.isRoot) {
			container.service.canForceUpdate = function canForceUpdateAsReservation() {
				return true;
			};
		}

		var filterFn = function (event) {
			return !event.IsHidden;
		};

		container.service.setItemFilter(filterFn);
		container.service.enableItemFilter(true);

		var originLoad = container.service.load;

		function loadAndRestoreSelection() {
			var selected = container.service.getSelected();
			return originLoad().then(function () {
				if (_.isObject(selected)) {
					container.service.setSelected(selected);
				}
			});
		}

		//override original fn
		container.service.load = loadAndRestoreSelection;

		// DEPRECATED
		// dateShift options
		// var dateshiftConfig = {
		// 	mode: 'both', //initial mode
		// 	id: 'Id',
		// 	end: 'PlannedFinish',
		// 	start: 'PlannedStart',
		// 	nextEdgeKey: 'SuccessorFk',
		// 	prevEdgeKey: 'PredecessorFk',
		// 	relationKind: 'RelationKindFk',
		// 	isLocked: 'IsLocked'
		// };
		//
		// container.service.setDateshiftMode = function (mode) {
		// 	dateshiftConfig.mode = _.isString(mode) ? mode : dateshiftConfig.mode;
		// 	platformDateshiftHelperService.resetDateshift(container.service.getServiceName());
		// };
		//
		// container.service.getDateshiftData = function () {
		// 	return {
		// 		config: dateshiftConfig,
		// 		originalActivities: container.service.getUnfilteredList(),
		// 		relations: container.service.relations,
		// 		calendarData: container.service.calendarData
		// 	};
		// };
		//
		// platformDateshiftHelperService.registerDateshift(container.service);

		return container.service;

	}

})(angular);
