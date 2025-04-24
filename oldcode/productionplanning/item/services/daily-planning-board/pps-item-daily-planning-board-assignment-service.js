(() => {
	'use strict';
	/* global globals, angular */
	let moduleName = 'productionplanning.item';
	let masterModule = angular.module(moduleName);
	let serviceName = 'ppsItemDailyPlanningBoardAssignmentService';
	masterModule.factory(serviceName, DailyPlanningBoardAssignmentService);
	DailyPlanningBoardAssignmentService.$inject = [
		'platformDataServiceFactory', '$q', '_', '$http',
		'$injector',
		'$translate',
		'ServiceDataProcessDatesExtension',
		'productionplanningItemDataService',
		'ppsItemDailyPlanningBoardSupplierService',
		'productionplanningItemDailyProductionDataService',
		'platformPlanningBoardDataService',
		'platformModalService',
		'$timeout',
		'ppsItemConstantValues',
		'ppsVirtualDataServiceFactory'];

	function DailyPlanningBoardAssignmentService(
		platformDataServiceFactory, $q, _, $http,
		$injector,
		$translate,
		ServiceDataProcessDatesExtension,
		productionplanningItemDataService,
		supplierService,
		dailyProductionDataService,
		platformPlanningBoardDataService,
		platformModalService,
		$timeout,
		ConstantValues,
		ppsVirtualDataServiceFactory
	) {

		let infoFieldProcessor = {
			processItem: (assignment) => {
				//Set all to Update State
				assignment.State = 1;

				switch (assignment.DataTypeId) {
					case ConstantValues.values.UnassignedTypeId:
						assignment.InfoField1 = assignment.RemainingQty;
						if (assignment.PpsItem !== null) {
							assignment.CommentText = assignment.PpsItem.Comment;
							assignment.UserDefined1 = assignment.PpsItem.Userdefined1;
							assignment.UserDefined2 = assignment.PpsItem.Userdefined2;
							assignment.UserDefined3 = assignment.PpsItem.Userdefined3;
							assignment.UserDefined4 = assignment.PpsItem.Userdefined4;
							assignment.UserDefined5 = assignment.PpsItem.Userdefined5;
						}
						break;
					case ConstantValues.values.LockedTypeId:
						assignment.InfoField1 = _.get(assignment, 'PlanQty');
						if (assignment.ProductionSet !== null) {
							assignment.CommentText = assignment.ProductionSet.CommentText;
							assignment.UserDefined1 = assignment.ProductionSet.Userdefined1;
							assignment.UserDefined2 = assignment.ProductionSet.Userdefined2;
							assignment.UserDefined3 = assignment.ProductionSet.Userdefined3;
							assignment.UserDefined4 = assignment.ProductionSet.Userdefined4;
							assignment.UserDefined5 = assignment.ProductionSet.Userdefined5;
						}
						break;
					case ConstantValues.values.NestedTypeId:
						assignment.InfoField1 = _.get(assignment, 'RealQty');
						if (assignment.FabricationUnit !== null) {
							assignment.CommentText = assignment.FabricationUnit.CommentText;
						}
				}
			}
		};
		let statusProcessor = {
			processItem: (assignment) => {
				assignment.UpdateStatus = false;
			}
		};

		let container = null;
		let assignmentsCache = [];
		let serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.productionset.entityProductionset',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/productionset/dailyProduction/',
					endRead: 'dailyPlanningboardAssignment',
					usePostForRead: true,
					initReadData: (readData) => {
						readData.From = container.data.filter.From;
						readData.To = container.data.filter.To;
						let sites = supplierService.getList();
						let selectedItem = productionplanningItemDataService.getSelected();
						readData.SiteIdList = _.map(sites, 'Id');
						readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind
						if (selectedItem) {
							readData.FilterIdList = [selectedItem.Id];
						}
					}
				},
				//actions: {delete: true, create: 'flat'},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						incorporateDataRead: (readData, data) => {
							// virtual data load
							let mainItemIds = _.map(_.filter(readData.dtos, {DataTypeId: 1}), 'ProductionSetId');
							const dateshiftFilter = {
								mainItemIds,
								entity: 'DailyProduction',
								foreignKey: 'Id'
							};
							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};

							if (mainItemIds.length > 0) {
								container.service.Sum(result.dtos, ConstantValues.values.LockedTypeId);
								container.service.Sum(result.dtos, ConstantValues.values.NestedTypeId);
								container.service.Sum(result.dtos, ConstantValues.values.UnassignedTypeId);
								assignmentsCache = angular.copy(result.dtos);
								initTriggerEntities(result.dtos);
								return container.data.handleReadSucceeded(result, data);
							}else{
								return container.data.handleReadSucceeded(result, data);
							}
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'DailyProduction',
						moduleName: 'cloud.desktop.moduleDisplayNameProductionSet',
						useIdentification: true,
						parentService: productionplanningItemDataService
					}
				},
				dataProcessor: [new ServiceDataProcessDatesExtension(['PlannedStart', 'PlannedFinish', 'DeliveryDate', 'MinStart', 'MaxStart']), infoFieldProcessor, statusProcessor],
				useItemFilter: true
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.isHighlightAssignments = false;

		container.service.getCustomTools = () => {
			var defer = $q.defer();
			var splitBtn = [{
				id: 'deleteAssignments',
				caption: $translate.instant('productionplanning.item.dailyProduction.deleteAssignments'),
				type: 'item',
				iconClass: 'tlb-icons ico-delete',
				fn: () => {
					var selected = container.service.getSelected();
					$http.get(globals.webApiBaseUrl + 'productionplanning/productionset/productionset/deleteAssignments?prodSetId=' + selected.ProductionSetId).then((response) => {
						dailyProductionDataService.load();
						var PBDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService');
						if (PBDataService !== undefined) {
							PBDataService.load();
						}
					});
				},
				disabled: () => {
					return container.service.getSelected() === null || container.service.getSelected().DataTypeId !== ConstantValues.values.LockedTypeId;
				}
			}, {
				id: 'createSiblingSubSets',
				caption: $translate.instant('productionplanning.item.dailyProduction.createSiblingSubSets'),
				type: 'item',
				iconClass: 'tlb-icons ico-copy-paste-deep',
				fn: () => {
					//button state respond slow on planningboard
					if (container.service.getSelected() !== null && container.service.getSelected().DataTypeId === ConstantValues.values.UnassignedTypeId) {
						dailyProductionDataService.setSplitNumber(container.service);
					} else {
						platformModalService.showDialog({
							windowClass: 'msgbox',
							iconClass: 'ico-error',
							headerTextKey: $translate.instant('productionplanning.item.dailyProduction.splitUnassign'),
							bodyTextKey: $translate.instant('productionplanning.item.dailyProduction.unassignOnly')
						});
					}
				},
				disabled: () => {
					return false;
				}
			}];

			splitBtn.push({
				id: 'highlight',
				caption: 'productionplanning.item.highlightAssignment',
				type: 'check',
				iconClass: 'tlb-icons ico-filter-assigned',
				value: container.service.isHighlightAssignments,
				fn: function () {
					highlightAssignments(this.value);
				}
			});
			defer.resolve(splitBtn);
			return defer.promise;
		};

		function highlightAssignments(value) {
			container.service.isHighlightAssignments = value;
			platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName(serviceName).planningBoardReDraw(true, true);
		}

		container.service.Sum = (data, dataTypeId) => {
			let prodSets = _.filter(data, set => {
				return set.DataTypeId === dataTypeId;
			});
			_.forEach(prodSets, prodSet => {
				if (prodSet.Products) {
					prodSet.SumQuantity = _.sum(_.map(prodSet.Products, 'PlanQuantity'));
					prodSet.SumArea = _.sum(_.map(prodSet.Products, 'Area'));
					prodSet.SumVolume = _.sum(_.map(prodSet.Products, 'Volume'));
					if (dataTypeId === ConstantValues.values.NestedTypeId) {
						prodSet.FabricationProductStatusFk = _.first(prodSet.Products).StatusFk;
					}
				}
			});
		};

		container.data.doNotUnloadOwnOnSelectionChange = true;

		const SetSelectedItem = () => {
			let selectedAssignment = container.service.getSelected();
			if (selectedAssignment) {
				let selectedSupplier = supplierService.getItemById(selectedAssignment.Supplier);
				supplierService.setSelected(selectedSupplier);
				let newSelectedItem = productionplanningItemDataService.getItemById(selectedAssignment.ItemFk);
				if (newSelectedItem) {
					productionplanningItemDataService.setSelected(newSelectedItem);
				}
			}
		};

		container.service.registerSelectionChanged(SetSelectedItem);

		container.service.getStatusList = (dataTypeId) => {
			switch (dataTypeId) {
				case ConstantValues.values.UnassignedTypeId:
					return [
						{
							Id: 0,
							Value: '*NoState',
							Description: $translate.instant('productionplanning.item.dailyProduction.noState')
						},
						{
							Id: 1,
							Value: '*Fully Covered',
							Description: $translate.instant('productionplanning.item.dailyProduction.fullyCovered')
						},
						{
							Id: 2,
							Value: '*Assigned',
							Description: $translate.instant('productionplanning.item.dailyProduction.assigned')
						},
						{
							Id: 5,
							Value: '*LockedQty',
							Description: $translate.instant('productionplanning.item.dailyProduction.lockedQty')
						},
						{
							Id: 6,
							Value: '*LockedDateAndQty',
							Description: $translate.instant('productionplanning.item.dailyProduction.lockedDateAndQty')
						}];
				case ConstantValues.values.LockedTypeId:
					return [
						{
							Id: 0,
							Value: '*NoState',
							Description: $translate.instant('productionplanning.item.dailyProduction.noState')
						},
						{
							Id: 3,
							Value: '*LockedDate',
							Description: $translate.instant('productionplanning.item.dailyProduction.lockedDate')
						}, {
							Id: 4,
							Value: '*Nested',
							Description: $translate.instant('productionplanning.item.dailyProduction.nested')
						}];
			}
		};

		container.service.getAssignmentCache = () => {
			return assignmentsCache;
		};

		let vdsConfig = {
			dateshiftId: 'productionplanning.dailyProduction',
			match: 'Id'
		};
		const dailyProductionVirtualDataService = ppsVirtualDataServiceFactory.registerToVirtualDataService('productionplanning.common', 'DailyProduction', container, vdsConfig);

		const initTriggerEntities = (data) => {
			let productionSets = _.filter((data, set) => set.DataTypeId === ConstantValues.values.LockedTypeId);
			const planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService');
			const dataServiceForDateshift = planningBoardDataService.getDateshiftConfig().dataService;
			const triggerEntities = dataServiceForDateshift.getList();

			if(triggerEntities) {
				_.forEach(productionSets, (productionSet) => {
					let triggerEntity = triggerEntities.find(entity => entity.EntityName === 'DailyProduction' && entity.Id === productionSet.Id);
					if (triggerEntity) {
						triggerEntity.StartDate = productionSet.PlannedStart;
						triggerEntity.EndDate = productionSet.PlannedFinish;
					}
				});
			}
		};

		container.service.virtualDataChanged = function virtualDataChanged() {
			platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName(serviceName).planningBoardReDraw(true);
		};

		container.service.getContainerData = () => {
			return container.data;
		}

		return container.service;
	}
})
();