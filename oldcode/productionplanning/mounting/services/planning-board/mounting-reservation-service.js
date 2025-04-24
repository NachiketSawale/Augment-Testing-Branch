((angular) => {
	'use strict';

	let moduleName = 'productionplanning.mounting';
	let masterModule = angular.module(moduleName);
	let serviceName = 'mountingReservationService';
	masterModule.factory(serviceName, MountingReservationService);
	MountingReservationService.$inject = [
		'_',
		'resourceReservationPlanningBoardServiceFactory',
		'mountingResourceService',
		'productionplanningMountingContainerInformationService',
		'PlatformMessenger',
		'ppsVirtualDataServiceFactory',
		'platformPlanningBoardDataService'];

	function MountingReservationService(
		_,
		resourceReservationPlanningBoardServiceFactory,
		mountingResourceService,
		mountingContainerInformationService,
		PlatformMessenger,
		ppsVirtualDataServiceFactory,
		platformPlanningBoardDataService) {

		let virtualDataService;
		let activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		let dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		let container = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = mountingResourceService.getIdList();
				readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind
			},
			incorporateDataRead: (readData, data) => {
				let mainItemIds = _.map(readData, 'Id');
				const dateshiftFilter = {
					mainItemIds,//mainItemIds: [entity[config.eventKey || 'Id']],
					entity: 'ResReservation',
					foreignKey: 'Id' //config.foreignKey
				};

					return container.data.handleReadSucceeded(readData, data);
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			itemName: 'PBResReservation',
			parentService: dynamicActivityService,
			dataProcessor: [{
				processItem: function processItem(/*item*/) {
					// optionally set additional info fields 1-3 here by extending json object
					// item.InfoField3 = item.Requisition ? item.Requisition.Project ? item.Requisition.Project.ProjectNo : '' : '';
				}
			}]
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		container.service.statusChanged = new PlatformMessenger();

		container.service.fireStatusChanged = () => {
			container.service.statusChanged.fire();
		};

		container.service.virtualDataChanged = function virtualDataChanged() {
			platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName(serviceName).planningBoardReDraw(true);
		};

		container.service.unloadSubEntities = () => {
		};
		container.service.loadSubItemList = () => {
		};
		container.data.loadSubItemList = () => {
		};

		// new virtual dateshift registration!
		if (moduleName === 'productionplanning.mounting') {
			let vdsConfig = {match: 'Id'};
			virtualDataService = ppsVirtualDataServiceFactory.registerToVirtualDataService(moduleName, 'ResReservation', container, vdsConfig);
		}

		return container.service;
	}

})(angular);

