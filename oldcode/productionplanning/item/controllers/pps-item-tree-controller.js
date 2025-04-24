(function (angular) {

	'use strict';

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemTreeController', PPSItemTreeController);

	PPSItemTreeController.$inject = ['$scope', '$timeout', 'platformGridControllerService', 'productionplanningItemDataService',
		'productionplanningItemUIStandardService', 'productionplanningItemValidationService',
		'productionplanningItemGotoBtnsExtension', 'productionplanningItemGobacktoBtnsExtension',
		'$translate', 'platformGridAPI',
		'productionplanningDrawingUIStandardService',
		'documentsProjectDocumentDataService', 'basicsCommonToolbarExtensionService',
		'ppsCommonLoggingHelper', '$injector', 'ppsItemDocumentProcessor',
		'ppsCommonGotoTabsExtension', 'PpsCommonCharacteristic2ColumnEventsHelper', '$rootScope', 'ppsDocumentForFieldOriginProcessor',
		'keyCodes',
		'productionplanningItemClipBoardService'];

	function PPSItemTreeController($scope, $timeout, platformGridControllerService, dataService, uiStandardService, validationService,
		gotoBtnsExtension, gobacktoBtnsExtension,
		$translate, platformGridAPI,
		productionplanningDrawingUIStandardService,// avoid cell readonly when create drawing
		documentsProjectDocumentDataService, basicsCommonToolbarExtensionService,
		ppsCommonLoggingHelper, $injector, documentProcessor,
		gotoTabsExtension, characteristic2ColumnEventsHelper, $rootScope, ppsDocumentForFieldOriginProcessor,
		keyCodes,
		productionplanningItemClipBoardService) {// jshint ignore:line

		// if new window is opened and shoudl response by this container, then nothing should be done
		// the GoToTab action will take place
		if (gotoTabsExtension.tryGoToTab(dataService.getServiceContainer())) {
			return;
		}

		const gridContainerGuid = '5907fffe0f9b44588254c79a70ba3af1';
		const ppsItemCharacteristics2Section = 69;
		const prodDescCharacteristics2Section = 62;

		const gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'PPSItemFk',
			type: 'productionplanning.item',
			dragDropService: productionplanningItemClipBoardService,
			childProp: 'ChildItems',
			pinningContext: true, // set to refresh tools when pinningContext changed
		};

		uiStandardService.handleFieldChange = dataService.registerFieldChangeHandler(validationService);
		// extend validation for logging
		const schemaOption = {
			typeName: 'PPSItemDto',
			moduleSubModule: 'ProductionPlanning.Item'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// button for create log
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 12, uiStandardService,
			dataService, schemaOption, $injector.get('productionplanningItemTranslationService'), dataService.refreshItemLogs);

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoTabsExtension.createBtn(dataService, moduleName));
		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataService));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onSelectedRowsChanged(e, args) {
			$scope.updateTools();
			if (dataService.loadSubItemForRefresh) {
				let selectedItem = dataService.getSelected();
				if (selectedItem) {
					dataService.loadSubItems(selectedItem);
					dataService.loadSubItemForRefresh = false;
				}
			}else{
				if(args.rows.length > 1) {
					let subItemService = $injector.get('productionplanningItemSubItemDataService');
					subItemService.resetLockIcon(false);
				}
			}
		}

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		}

		const config = {
			moduleName: moduleName,
			title: $translate.instant('productionplanning.item.entityItem'),
			parentService: dataService,
			processors: [documentProcessor, ppsDocumentForFieldOriginProcessor],
			columnConfig: [{
				documentField: 'PpsItemFk',
				dataField: 'Id',
				readOnly: false,
				projectFkField: 'ProjectFk',
				lgmJobFkField: 'LgmJobFk'
			}],
			subModules: [{
				service: $injector.get('ppsUpstreamItemDataService').getService(),
				title: $translate.instant('productionplanning.item.upstreamItem.entity'),
				columnConfig: [{
					documentField: 'PpsUpstreamItemFk',
					dataField: 'Id',
					readOnly: false,
					projectFkField:'ProjectId',
					lgmJobFkField:'LgmJobFk'
				}, {
					documentField: 'PpsItemFk',
					dataField: 'PpsItemUpstreamFk',
					readOnly: false
				}, {
					documentField: 'PrcPackageFk',
					dataField: 'PrcPackageFk',
					readOnly: false
				}]
			}]
		};

		documentsProjectDocumentDataService.register(config);

		// extend characteristics2
		const ppsItemCharacteristic2Config = {
			sectionId: ppsItemCharacteristics2Section,
			gridContainerId: gridContainerGuid,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'productionplanningItemContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		characteristic2ColumnEventsHelper.register(ppsItemCharacteristic2Config);

		const prodDescCharacteristic2Config = {
			sectionId: prodDescCharacteristics2Section,
			gridContainerId: gridContainerGuid,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'productionplanningItemContainerInformationService',
			additionalCellChangeCallBackFn: function (arg, field) {
				// sync other items with same ProductDescriptionFK.
				const otherItemsWithSameProductDescriptionFK = (item) => {
					return item.Id !== arg.item.Id && item.ProductDescriptionFk !== null && item.ProductDescriptionFk === arg.item.ProductDescriptionFk;
				};
				dataService.getList().filter(otherItemsWithSameProductDescriptionFK).forEach(item => item[field] = arg.item[field]);
				dataService.gridRefresh();
			},
		};
		characteristic2ColumnEventsHelper.register(prodDescCharacteristic2Config);

		const onGridClick = (e, args) => {
			let selectedItem = angular.isDefined(args.item) ? args.item : args.grid.getDataItem(args.row);
			if (selectedItem) {
				dataService.loadSubItems(selectedItem);
				dataService.setPPSDocConfig('productionplanning.item', 'productionplanningItemDataService', selectedItem);
			}
			$rootScope.$emit('documentsproject-parent-grid-click', {
				clickedItem: selectedItem,
				title: config.title
			});
		};
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
		platformGridAPI.events.register($scope.gridId, 'onTreeNodeExpanded', onGridClick);
		platformGridAPI.events.register($scope.gridId, 'onTreeNodeCollapsed', onGridClick);

		const onKeyDown = (event, args) => {
			let rowsCount = platformGridAPI.rows.getRows($scope.gridId);
			let loadsubItems = false;
			switch (event.keyCode) {
				case keyCodes.DOWN:
					loadsubItems = args.row + 1 !== rowsCount;
					args.row = loadsubItems ? args.row + 1 : args.row;
					break;
				case keyCodes.UP:
					loadsubItems = args.row !== 0;
					args.row = loadsubItems ? args.row - 1 : args.row;
					break;
			}
			if(loadsubItems) {
				onGridClick(event, args);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onKeyDown', onKeyDown);

		const onListLoaded = () => {
			dataService.loadSubItemForRefresh = true;
			dataService.initLocationPath();
		};
		dataService.registerListLoaded(onListLoaded);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			documentsProjectDocumentDataService.unRegister();
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			characteristic2ColumnEventsHelper.unregister(gridContainerGuid, prodDescCharacteristics2Section);
			characteristic2ColumnEventsHelper.unregister(gridContainerGuid, ppsItemCharacteristics2Section);
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
			platformGridAPI.events.unregister($scope.gridId, 'onTreeNodeExpanded', onGridClick);
			platformGridAPI.events.unregister($scope.gridId, 'onTreeNodeCollapsed', onGridClick);
			platformGridAPI.events.unregister($scope.gridId, 'onKeyDown', onKeyDown);
			dataService.unregisterListLoaded(onListLoaded);
		});
	}

})(angular);