(() => {
	'use strict';
	/* global angular, _ */
	let moduleName = 'productionplanning.item';
	let masterModule = angular.module(moduleName);
	let serviceName = 'ppsItemDailyPlanningBoardSupplierService';
	masterModule.factory(serviceName, DailyPlanningBoardSupplierService);
	DailyPlanningBoardSupplierService.$inject = [
		'$injector',
		'moment',
		'platformPlanningBoardServiceFactoryProviderService',
		'productionplanningItemDataService',
		'platformPlanningBoardDataService',
		'productionplanningCommonStructureFilterService',
		'transportplanningTransportUtilService'];

	function DailyPlanningBoardSupplierService(
		$injector,
		moment,
		platformPlanningBoardServiceFactoryProviderService,
		productionplanningItemDataService,
		platformPlanningBoardDataService,
		ppsCommonStructureFilterService,
		transportplanningTransportUtilService) {

		let factoryOptions = platformPlanningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
			baseSettings: {
				initReadData: (readData) => {
					let list = productionplanningItemDataService ? productionplanningItemDataService.getList() : null;
					let selected = productionplanningItemDataService ? productionplanningItemDataService.getSelected() : null;

					let startDateCollection = _.filter(_.map(list, (item) => {
						if (item.ProductionStart) {
							return moment(item.ProductionStart);
						}
					}), _.isObject);
					let from = selected && selected.ProductionStart ? moment(selected.ProductionStart).utc() : moment.min(startDateCollection);
					let to = moment.max(startDateCollection);

					// set initial datestart from planningboard data service with the selected production start date
					scrollView(from);

					if (selected) {
						readData.SiteIdList = [selected.SiteFk];
					}
					readData.From = from;
					readData.To = to;

					if(hasShowContainerInFront('productionplanning.item.dailyplanningboard.site.filter.list') && $injector.get('ppsItemDailyPlanningBoardSupplierSiteFilterDataService').markedItems.length > 0) {
						let allIds = ppsCommonStructureFilterService.getAllFilterIds('ppsItemDailyPlanningBoardSupplierService');
						readData.FilterIdList = allIds.SITE;
					}
				},
				moduleName: moduleName,
				// this service will be overridden with the created instance
				serviceName: serviceName,
				parentService: productionplanningItemDataService
			},
			module: moduleName,
			translationId: 'basics.site.entitySite',
			http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
				routePostFix: 'productionplanning/productionset/dailyproduction/',
				endRead: 'dailyPlanningboardSupplier',
				usePostForRead: true
			}),
			translation: {
				uid: 'basicsSiteMainService',
				title: 'basics.site.entitySite',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
			},
			role: {
				itemName: 'Supplier',
				moduleName: 'cloud.desktop.moduleDisplayNameSite',
				descField: 'DescriptionInfo.Translated',
				useIdentification: true
			}
		});

		let originalDataRead = factoryOptions.flatNodeItem.presenter.list.incorporateDataRead;
		factoryOptions.flatNodeItem.presenter.list.incorporateDataRead = function (readData, data) {
			let entities = readData.dtos;
			originalDataRead(entities, data);
		};

		let serviceContainer = platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions);
		serviceContainer.data.doNotUnloadOwnOnSelectionChange = true;
		serviceContainer.data.doNotLoadOnSelectionChange = true;

		const loadSuppliers = (e, item) => {
			if (!hasShowContainerInFront('productionplanning.item.dailyplanningboard')) {
				return;
			}
			let lastSelectedRoot = productionplanningItemDataService.getLastSelection();
			if (!_.isNil(lastSelectedRoot) && !_.isNil(item) && lastSelectedRoot.SiteFk === item.SiteFk) {
				// set initial datestart from planningboard data service with the selected production start date
				const startDate = item && item.ProductionStart ? moment(item.ProductionStart).utc() : null;
				scrollView(startDate, true);
			} else if ((!_.isNil(item) && _.isNil(lastSelectedRoot)) || !_.isNil(lastSelectedRoot) && !_.isNil(item) && lastSelectedRoot.SiteFk !== item.SiteFk) {
				productionplanningItemDataService.setLastSelection(item);
				serviceContainer.service.load();
			}
		};

		function scrollView(startDate, needToReDraw = false) {
			if (startDate) {
				const planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceBySupplierServiceName(serviceName);
				if (planningBoardDataService) {
					const dateDiff = planningBoardDataService.getDateEnd().diff(planningBoardDataService.getDateStart(), 'day');
					const startDay = moment(startDate).utc().startOf('day');
					planningBoardDataService.getDateStart(moment(startDay));
					planningBoardDataService.getDateEnd(moment(startDay).add(dateDiff, 'day'));
					if (needToReDraw) {
						planningBoardDataService.planningBoardReDraw(true,true);
					}
				}
			}
		}

		productionplanningItemDataService.registerSelectionChanged(loadSuppliers);

		function hasShowContainerInFront(containerId) {
			return transportplanningTransportUtilService.hasShowContainerInFront(containerId);
		}

		return serviceContainer.service;
	}
})();