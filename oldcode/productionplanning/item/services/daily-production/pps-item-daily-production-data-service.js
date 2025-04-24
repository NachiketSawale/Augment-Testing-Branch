(function (angular) {
	'use strict';
	/* global globals, moment, _ */
	let moduleName = 'productionplanning.item';
	let itemModule = angular.module(moduleName);
	itemModule.service('productionplanningItemDailyProductionDataService', DailyProductionDataService);

	DailyProductionDataService.$inject = ['platformPlanningBoardDataService', 'productionplanningItemDataService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService',
		'$http',
		'platformModalService',
		'cloudCommonGridService',
		'ppsItemConstantValues',
		'transportplanningTransportUtilService',
		'basicsWorkflowInstanceService'];

	function DailyProductionDataService(platformPlanningBoardDataService, ppsItemDataService, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		platformRuntimeDataService,
		$http,
		platformModalService,
		cloudCommonGridService,
		ConstantValues,
		UtilService,
		basicsWorkflowInstanceService) {

		let serviceInfo = {
			hierarchicalLeafItem: {
				module: itemModule,
				serviceName: 'productionplanningItemDailyProductionDataService',
				entityNameTranslationID: 'productionplanning.item.entityDailyProduction',
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/'},
				dataProcessor: [
					{
						processItem: (item) => {
							// format -- dd/MM/yyyy
							let tokens = item.PlannedStart.split('/');
							item.PlannedStart = moment.utc(tokens[2] + '-' + tokens[1] + '-' + tokens[0]);

							// make FullyCovered field of not unassigned type sub sets readonly
							if (item.DataTypeId !== ConstantValues.values.UnassignedTypeId) {
								platformRuntimeDataService.readonly(item, [{ field: 'FullyCovered', readonly: true }]);
								platformRuntimeDataService.readonly(item, [{ field: 'IsAssigned', readonly: true }]);
							}

							if(ppsItemDataService.getSelected()?.IsForPreliminary === true){
								platformRuntimeDataService.readonly(item, true);
							}
						}
					}],
				entityRole: {
					leaf: {
						itemName: 'DailyProduction',
						parentService: ppsItemDataService,
						parentFilter: 'itemFk'
					}
				},
				actions: {},
				presenter: {
					tree: {
						parentProp: 'ParentFk',
						childProp: 'ChildItems'
					}
				}
			}
		};

		let container = platformDataServiceFactory.createNewComplete(serviceInfo);
		let service = container.service;

		basicsWorkflowInstanceService.registerWorkflowCallback(reloadPlanningBoard);

		const showDailyProductionDialog = (response, dialogFor, loadFunc) => {
			let config = {
				width: '1000px',
				height: '500px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-update-production-subset-controller.html',
				controller: 'productionplanningItemUpdateProductionSubsetController',
				resolve: {
					params: () => {
						return {
							data: response.data,
							update: response.data[0].ProductionSetId !== 0,
							dialogFor: dialogFor,
							loadFunc: loadFunc
						};
					}
				}
			};
			platformModalService.showDialog(config);
		};

		service.updateSubSets = () => {
			let selectedItem = service.parentService().getSelected();
			$http.get(globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/getsubSets?itemFk=' + selectedItem.Id).then((response) => {
				if (response.data && response.data.length > 0) {
					showDailyProductionDialog(response, 1, service.load);
				}
			});
		};

		service.splitUnassign = (entity, planningBoardService) => {
			let selectedItem = {};
			let loadFunc = null;
			if (angular.isDefined(planningBoardService)) {
				selectedItem = planningBoardService.getSelected();
				loadFunc = planningBoardService.load;
			} else {
				selectedItem = service.getSelected();
				loadFunc = service.load;
			}
			let request = {
				ItemFk: selectedItem.ItemFk,
				StartDate: selectedItem.PlannedStart.format('DD/MM/YYYY'),
				Count: entity.SplitNumber
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/splitunassgin', request).then((response) => {
				if (response.data && response.data.length > 0) {
					showDailyProductionDialog(response, 2, loadFunc);
				}
			});
		};

		service.setSplitNumber = (planningBoardService) => {
			let modalOptions =
				{
					iconClass: 'ico-info',
					width: '500px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-copy-route-dialog.html',
					controller: 'productionplanningItemSplitUnassignProductionsetController',
					resolve: {
						params: () => {
							return {
								planningBoardService: planningBoardService
							};
						}
					}
				};
			platformModalService.showDialog(modalOptions);
		};

		service.updateSiblingSubSets = () => {
			let selectedSubset = _.clone(service.getSelected());
			selectedSubset.PlannedStart = selectedSubset.PlannedStart.format('DD/MM/YYYY');
			$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/getsiblingsubsets', selectedSubset).then((response) => {
				if (response.data && response.data.length > 0) {
					let flat = [];
					cloudCommonGridService.flatten(response.data, flat, 'ChildItems');
					let locked = _.find(flat, (production) => {
						return production.DataTypeId === ConstantValues.values.LockedTypeId;
					});
					if (locked) {
						showDailyProductionDialog(response, 3, service.load);
					} else {
						platformModalService.showErrorBox('productionplanning.item.dailyProduction.noSiblingError', 'Error');
					}
				}
			});
		};

		service.onFieldChanged = (item, field) => {
			if (field === 'FullyCovered' || field === 'IsAssigned') {
				item.UpdateStatus = true;
				const target = service.getItemById(item.Id);
				if (target) {
					target.State = 3;  // Update status of unassigned sub set in grid
				}
			}
		};

		function reloadPlanningBoard(workflowInstance){
			let instances = workflowInstance.ActionInstances;
			_.forEach(instances, (instance) =>{
				if(instance.ActionId === '235bc73316ab459199c956758e814058' && UtilService.hasShowContainerInFront('productionplanning.item.dailyplanningboard')) {
					platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService').load();
				}
			});
		}

		container.service.getContainerData = () => {
			return container.data;
		}

		return service;
	}
})(angular);