(function (angular) {
	/* globals angular , globals , _ */
	'use strict';

	var moduleName = 'transportplanning.transport';
	var angModule = angular.module(moduleName);

	angModule.controller('transportplanningTransportListController', transportplanningTransportListController);

	transportplanningTransportListController.$inject = ['$scope', '$injector', '$http',
		'platformGridAPI',
		'platformGridControllerService',
		'platformPermissionService',
		'transportplanningTransportMainService',
		'transportplanningTransportUIStandardService',
		'transportplanningTransportValidationService',
		'productionplanningCommonStructureFilterService',
		'transportplanningTransportMapDataService',
		'$timeout','$translate','transportplanningTransportTranslationService',
		'transportplanningTransportClipBoardService',
		'transportplanningTransportUtilService',
		'basicsCommonToolbarExtensionService',
		'basicsLookupdataSimpleLookupService',
		'ppsCommonLoggingHelper',
		'documentsProjectDocumentDataService',
		'transportplanningTransportDocumentProcessor',
		'trsTransportGobacktoBtnsExtension',
		'trsWizCreateDispatchingNoteDefaultDispatchingRecordGridsUIConfig',
		'PpsCommonCharacteristic2ColumnEventsHelper',
		'platformValidationDataConcurrencyService',
		'platformNavBarService'];

	function transportplanningTransportListController($scope, $injector, $http,
		platformGridAPI,
		platformGridControllerService,
		platformPermissionService,
		dataService,
		uiStandardService,
		validationService,
		ppsCommonStructureFilterService,
		transportMapDataService,
		$timeout,$translate,translationServ,
		transportClipBoardService,
		utilService,
		basicsCommonToolbarExtensionService,
		basicsLookupdataSimpleLookupService,
		ppsCommonLoggingHelper,
		projectDocumentDataService,
		documentProcessor,
		gobacktoBtnsExtension,
		trsWizCreateDispatchingNoteDefaultDispatchingRecordGridsUIConfig,
		characteristic2ColumnEventsHelper,
		platformValidationDataConcurrencyService,
		platformNavBarService) {
		function isSlotField(field) {
			return field.indexOf('_slot') !== -1; // field like 'event_type_slot_1000001' or 'clerk_role_slot_1000001'
		}

		var gridLayout = uiStandardService.getStandardConfigForListView();
		if (!gridLayout.isTranslated) {
			var descStringSuffix = '-'+$translate.instant('cloud.common.entityDescription');
			_.forEach(gridLayout.columns, function (col) {
				var tmpField = col.field.toLowerCase();
				if(col.id === tmpField+'description'
					&& !isSlotField(tmpField) // skip slot-fields for avoiding translation issue of slot-fields by zwz 2021/1/26 (HP-ALM #117005)
				){
					var translation = translationServ.getTranslationInformation(col.field);
					var translationResult = $translate.instant(translation.location + '.' + translation.identifier);
					col.name = translationResult+ descStringSuffix;
				}
			});
			gridLayout.isTranslated = true;
		}
		// remark:fix issue about translation missing of additional Columns(like "Cost Group 1-Description") issue on Transport List conatainer.
		// this issue is caused by setting generic structre configuration("platform.generic.structure" and etc) in container.json (by zweig 2019/02/14)


		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'transportRoute',
			dragDropService: transportClipBoardService
		};

		// extend validation for logging
		var schemaOption = {
			typeName: 'TrsRouteDto',
			moduleSubModule: 'TransportPlanning.Transport'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);
		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// button for create log
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 2, uiStandardService,
			dataService, schemaOption, $injector.get('transportplanningTransportTranslationService'), dataService.onAddManualLogSucceeded);

		platformGridControllerService.addTools(dataService.getCopyButton());

		function onSelectionChanged(e, entity) {
			if (entity ) {// "entity is null" means no item is selected in the route list container
				if(entity.Version > 0){
					// set default site for "Check Resource Requisition"
					var sourceFSName = 'transportplanningTransportResRequisitionFilterService';
					if(dataService.getSelected()) {
						var defSiteFk = dataService.getSelected().SiteFk;
						if (defSiteFk) {
							$injector.get(sourceFSName).setDefaultSite(defSiteFk);
						}
						var deliveryDate = dataService.getSelected().PlannedDelivery;
						$injector.get(sourceFSName).setRequestedDate(deliveryDate);
					}
					// If waypoint list container is showed, two things setting waypoints for the selected route and setting route info for the map will be doned in the waypointListController's onListLoaded function.
					// If it's not showed, then we need to set waypoints for the selected route here.
					if (!utilService.hasShowContainer('transportplanning.transport.waypoint.list')) {
						$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/list?routeId=' + entity.Id).then(function (respond) {
							// set waypoints for the selected route;
							entity.waypointsBackup = _.cloneDeep(respond.data.Main); // waypointsBackup will be used for shifting PlannedDelivery
							// remark: In case waypoint container is not showed while shifting route's PlannedDelivery, we need to set a property `waypointsBackup` on entity in advance.
							//         entity.Waypoints will be dirty in transportPlanningTransportSidebarInfoController later, for case of shifting route's PlannedDelivery, we cannot reuse it.

							entity.Waypoints = respond.data.Main;
							// set route info for the map
							if (utilService.hasShowContainer('transportplanning.transport.routemap')) {
								if(respond.data.Main && respond.data.Main.length >= 1){
									transportMapDataService.setShowRoutes(respond.data.Main);
								}
							}
						});
					}
					if(!_.isNil(entity.JobDefFk)){
						$http.get(globals.webApiBaseUrl + 'productionplanning/item/countbyjobid?jobid=' + entity.JobDefFk).then(function (response) {
							entity.CanbeSearchByJob = response.data > 0;
						});
					}
				}
				if(dataService.getSelected() && dataService.triggerAddGoodsWizard) {
						dataService.showAddGoodsWizard();
				}
				dataService.isBusy = false;
			}
		}
		dataService.registerSelectionChanged(onSelectionChanged);

		// region check for changes in db

		const dbChangesCheckService = new platformValidationDataConcurrencyService(
			dataService,
			$scope,
			'transportplanning/transport/route/checkchanges',
			function(item) {
				dataService.syncPlannedDelivery(item, 'PlannedDelivery');
				platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: item});
			});
		//dbChangesCheckService.activateDbChangesCheck(); // currently deactivated
		dbChangesCheckService.checkForChanges();

		// endregion

		var onCellChange = function (e, args) {
			const cell = args.grid.getColumns()[args.cell];
			const field = cell.field;
			if (field === 'PlannedDeliveryTime') {
				dataService.handlePlannedDeliveryTimeChanged(args.item, field);
			} else if (field === 'PlannedDeliveryDate') {
				dataService.handlePlannedDeliveryDateChanged(args.item, field);
			} else if (field === 'PlannedDelivery') {
				dataService.syncPlannedDelivery(args.item, field);
			}
			platformGridAPI.rows.refreshRow({'gridId': args.grid.id, 'item': args.item});

			if (cell.basedOnField) {
				dataService.handleFieldChanged(args.item, cell.basedOnField);
			} else {
				dataService.handleFieldChanged(args.item, field);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onChangeGridContent() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			if (_.isObject(selected)) {
				var lookupDataServ = $injector.get('productionplanningCommonResourceRequisitionLookupDataService');
				lookupDataServ.setFilter(selected.PpsEventFk);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		$scope.setTools(ppsCommonStructureFilterService.getToolbar(dataService));

		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		// remove createButton and deleteButton if hasn't permissions
		if(!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('c')) ||
			!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('c'))){
			_.remove($scope.tools.items,{id:'create'});
		}
		if(!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('d')) ||
			!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('d'))){
			_.remove($scope.tools.items,{id:'delete'});
		}

		// update toolbar
		function updateToolsWA() {
			$timeout($scope.tools.update, 50);
		}

		ppsCommonStructureFilterService.onUpdated.register(updateToolsWA);

		projectDocumentDataService.register({
			moduleName: moduleName,
			title: $translate.instant('transportplanning.transport.entityRoute'),
			parentService: dataService,
			processors: [documentProcessor],
			columnConfig: [{
				documentField: 'TrsRouteFk',
				dataField: 'Id',
				readOnly: false,
				projectFkField:'ProjectDefFk',
				lgmJobFkField:'JobDefFk'
			}],
			subModules: [{
				service: $injector.get('transportplanningTransportWaypointDataService'),
				title: $translate.instant('transportplanning.transport.waypointJobDocumentList'),
				columnConfig: [{
					documentField: 'LgmJobFk',
					dataField: 'LgmJobFk',
					readOnly: false
				}],
				otherFilter:[{documentField: 'LgmJobFk', dataField: 'LgmJobFk'}]
			}]
		});

		// extend characteristics2
		const characteristics2Section = 73;
		const characteristic2Config = {
			sectionId: characteristics2Section,
			gridContainerId: $scope.gridId,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'transportplanningTransportContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		// overwrite refresh/refreshSelection
		let orgRefreshFn = platformNavBarService.getActionByKey('refresh').fn;
		let orgRefreshSelFn = platformNavBarService.getActionByKey('refreshSelection').fn;
		platformNavBarService.getActionByKey('refresh').fn = ()=>{
			dataService.cleanupTruckDriver();
			orgRefreshFn();
		};
		platformNavBarService.getActionByKey('refreshSelection').fn = ()=>{
			dataService.cleanupTruckDriverForSelection();
			orgRefreshSelFn();
		};

		// HACKCODE: For fixing an issue(simialr to issue of #141573 mentioned in productionplanningDrawingComponentCommonListController) that can only be reproduced in trunk(daily)/rel24.1/rel6.4/rel6.3/rel6.2/rel6.1 when there is no corresponding BAS_MODULEUICONFIG records of the logined user.(it's ok in rel6.0, it's relative to code-changes about platformgrid after rel6.0)
		// As a temporary solution, here we check if has corrsponding grid config. If not, then set the grid config in advanced, and the issue is fixed.
		// by zwz for ticket DEV-11354 on 2024/4/15
		let mainViewService = $injector.get('mainViewService');
		let uuids = ['3822aae4dd4a471fa3c2916db72ae88b', 'ea7110a9ef2a45cfa704944bca586f31'];
		_.each(uuids, (uuid) => {
			if (!mainViewService.hasModuleConfig(uuid, 's') &&
				!mainViewService.hasModuleConfig(uuid, 'r') &&
				!mainViewService.hasModuleConfig(uuid, 'u')) {
				$http.get(globals.webApiBaseUrl + 'basics/layout/getuiconfig?uuid=' + uuid).then((response) => {
					if (_.isEmpty(response) || _.isEmpty(response.data)) {
						const gridConfig = trsWizCreateDispatchingNoteDefaultDispatchingRecordGridsUIConfig[uuid];
						mainViewService.setModuleConfig(gridConfig.uuid, gridConfig.propertyConfig, gridConfig.grouping, gridConfig.gridInfo);
					}
				});
			}
		});

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dbChangesCheckService.deactivateDbChangesCheck();
			projectDocumentDataService.unRegister();
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			// cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
			ppsCommonStructureFilterService.onUpdated.unregister(updateToolsWA);
			dataService.unregisterSelectionChanged(onSelectionChanged);
			characteristic2ColumnEventsHelper.unregister($scope.gridId, characteristics2Section);
		});
	}
})(angular);

(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).constant('trsWizCreateDispatchingNoteDefaultDispatchingRecordGridsUIConfig', {
		// DispatchingRecordGrid
		'3822aae4dd4a471fa3c2916db72ae88b': {
			uuid: '3822aae4dd4a471fa3c2916db72ae88b',
			gridInfo:
				{
					'showFilterRow': true,
					'showMainTopPanel': false,
					'statusBar': false,
					'markReadonlyCells': false,
					'allowCopySelection': false,
					'searchString':''
				},
			grouping:
				{
					'groups': [],
					'sortColumn': 'null',
					'groupColumnWidth': 250
				},
			propertyConfig: [
				{
					'id': 'totalPrice',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'description',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'recordtypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'recordtypefkbrief',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'recordno',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 75,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'dispatchrecordstatusfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'uomfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'dateeffective',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'prcstructurefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'settlementPrice',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				}

			]
		},
		// PpsComponents
		'ea7110a9ef2a45cfa704944bca586f31': {
			uuid: 'ea7110a9ef2a45cfa704944bca586f31',
			gridInfo:
				{
					'showFilterRow': true,
					'showMainTopPanel': false,
					'statusBar': false,
					'markReadonlyCells': false,
					'allowCopySelection': false,
					'searchString':''
				},
			grouping:
				{
					'groups': [],
					'sortColumn': 'null',
					'groupColumnWidth': 250
				},
			propertyConfig: [
				[
					{
						'id': 'totalPrice',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'description',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 200,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'quantity',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'componentPrice',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'billQuantity',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'Convertable',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 50,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'Checked',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 50,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'mdcmaterialcostcodeproductfk',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 70,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'basuomfk',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 150,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'basuomfkdescription',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 60,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'quantity2',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'quantity3',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'actualquantity',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'actualquantity2',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					},
					{
						'id': 'actualquantity3',
						'labelCode': '',
						'keyboard': {
							'enter': true,
							'tab': true
						},
						'hidden': true,
						'width': 100,
						'pinned': false,
						'sort': false,
						'columnFilterString': ''
					}
				]

			]
		},
	});
})(angular);
