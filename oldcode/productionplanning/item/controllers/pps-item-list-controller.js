/**
 * Created by anl on 5/4/2017.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemListController', PPSItemListController);

	PPSItemListController.$inject = ['$scope', 'platformGridControllerService', 'productionplanningItemDataService',
		'productionplanningItemUIStandardService', 'productionplanningItemValidationService',
		'productionplanningItemGotoBtnsExtension', 'productionplanningItemGobacktoBtnsExtension',
		'$translate', 'platformGridAPI', 'documentsProjectDocumentDataService',
		'productionplanningDrawingUIStandardService',
		'basicsCommonToolbarExtensionService', 'platformDateshiftHelperService', '$injector',
		'ppsCommonLoggingHelper', 'ppsItemDocumentProcessor',
		'productionplanningCommonActivityDateshiftService', 'ppsCommonGotoTabsExtension',
		'PpsCommonCharacteristic2ColumnEventsHelper', '$rootScope', 'ppsDocumentForFieldOriginProcessor',
		'keyCodes',
		'productionplanningItemClipBoardService'];

	function PPSItemListController(
		$scope, platformGridControllerService, dataService,
		uiStandardService, validationService,
		gotoBtnsExtension, gobacktoBtnsExtension,
		$translate, platformGridAPI, documentsProjectDocumentDataService,
		productionplanningDrawingUIStandardService,// avoid cell readonly when create drawing
		basicsCommonToolbarExtensionService, platformDateshiftHelperService, $injector, // jshint ignore:line
		ppsCommonLoggingHelper, documentProcessor,
		activityDateshiftService, gotoTabsExtension,
		characteristic2ColumnEventsHelper, $rootScope, ppsDocumentForFieldOriginProcessor,
		keyCodes,
		productionplanningItemClipBoardService) {

		// if new window is opened and should response by this container, then nothing should be done
		// the GoToTab action will take place
		if (gotoTabsExtension.tryGoToTab(dataService.getServiceContainer())) {
			return;
		}

		const gridContainerGuid = '3598514b62bc409ab6d05626f7ce304b';
		const ppsItemCharacteristics2Section = 69;
		const prodDescCharacteristics2Section = 62;

		// extend validation for logging
		const schemaOption = {
			typeName: 'PPSItemDto',
			moduleSubModule: 'ProductionPlanning.Item'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);

		const gridConfig = {
			initCalled: false,
			columns: [],
			type: 'productionplanning.item',
			dragDropService: productionplanningItemClipBoardService,
			pinningContext: true, // set to refresh tools when pinningContext changed
		};

		uiStandardService.handleFieldChange = dataService.registerFieldChangeHandler(validationService);
		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// button for create log
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 12, uiStandardService,
			dataService, schemaOption, $injector.get('productionplanningItemTranslationService'), dataService.refreshItemLogs);

		dataService.setInitialFilterOption($scope.gridId);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'applyFilter',
			caption: $translate.instant('productionplanning.item.applyFilter'),
			type: 'check',
			value: dataService.getFilterOptionState($scope.gridId),
			iconClass: 'tlb-icons ico-filtering',
			fn: function () {
				dataService.toggleFilterOptionStatus($scope.gridId);
				dataService.showListByFilter($scope.gridId);
			}
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoTabsExtension.createBtn(dataService, moduleName));
		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataService));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		// get dateshift Mode tool
		// todo: do we still need the eventService here? 19.03.2021
		var eventServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
		var eventService = eventServiceFactory.getService('ItemFk', 'productionplanning.common.item.event', dataService);

		// dateshift registration
		// todo: do we still need the eventService here? 19.03.2021
		let initDateshiftConfig = {tools: [{id: 'fullshift', value: true}], configId: 'productionplanning.item'};
		activityDateshiftService.initializeDateShiftController('productionplanning.common', eventService, $scope, initDateshiftConfig);

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

		function onSelectedRowsChanged(e, args) {
			$scope.tools.update();
			if (dataService.loadSubItemsForRefresh) {
				let selectedItem = dataService.getSelected();
				if (selectedItem) {
					dataService.loadSubItems(selectedItem);
					dataService.loadSubItemsForRefresh = false;
				}
			}else{
				if(args.rows.length > 1) {
					let subItemService = $injector.get('productionplanningItemSubItemDataService');
					subItemService.resetLockIcon(false);
				}
			}
		}

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		}

		function onInitialized() {
			if (dataService.getFilterOptionState($scope.gridId)) {
				dataService.showListByFilter($scope.gridId);
			}
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
					projectFkField: 'ProjectId',
					lgmJobFkField: 'LgmJobFk'
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
			let selectedItem = args.grid.getDataItem(args.row);
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

		const onListLoaded = () => {
			dataService.loadSubItemsForRefresh = true;
			dataService.initLocationPath();
		};
		dataService.registerListLoaded(onListLoaded);

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

		// un-register on destroy
		$scope.$on('$destroy', () => {
			documentsProjectDocumentDataService.unRegister();
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			characteristic2ColumnEventsHelper.unregister(gridContainerGuid, prodDescCharacteristics2Section);
			characteristic2ColumnEventsHelper.unregister(gridContainerGuid, ppsItemCharacteristics2Section);
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
			platformGridAPI.events.unregister($scope.gridId, 'onKeyDown', onKeyDown);
			dataService.unregisterListLoaded(onListLoaded);
		});
	}
})(angular);
