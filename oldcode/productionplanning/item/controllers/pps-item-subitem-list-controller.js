/**
 * Created by anl on 23/06/2022.
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemSubItemListController', SubItemListController);

	SubItemListController.$inject = [
		'$scope', 'platformGridControllerService', 'productionplanningItemSubItemDataService',
		'productionplanningItemUIStandardService', 'productionplanningItemValidationService',
		'$translate', 'platformGridAPI', 'documentsProjectDocumentDataService', '$injector',
		'ppsItemDocumentProcessor',
		'basicsCommonToolbarExtensionService',
		'platformToolbarService',
		'ppsItemCreateSubPUsService',
		'productionplanningItemDataService',
		'$rootScope',
		'productionplanningCommonActivityDateshiftService', 'ppsDocumentForFieldOriginProcessor',
		'productionplanningSubItemGotoBtnsExtension',
		'PpsCommonCharacteristic2ColumnEventsHelper'];

	function SubItemListController(
	  $scope, platformGridControllerService, dataService,
	  uiStandardService, validationService,
	  $translate, platformGridAPI, documentsProjectDocumentDataService, $injector, // jshint ignore:line
	  documentProcessor,
	  basicsCommonToolbarExtensionService,
	  platformToolbarService,
	  ppsItemCreateSubPUsService,
	  itemService,
	  $rootScope,
	  ppsCommonActivityDateshiftService, ppsDocumentForFieldOriginProcessor,
	  gotoBtnsExtension,
	  characteristic2ColumnEventsHelper) {

		let gridConfig = {
			initCalled: false,
			columns: []
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// let grid = $injector.get ('platformGridAPI').grids.element ('id', '4ddf9e9220f44a22b29c97ecd41c7ab2');
		// grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow:false}));

		const getToolItems = () => {
			let removeItems = ['create', 'delete'];
			if ($scope.getContentValue('hideDownload')) {
				removeItems.push('download');
			}
			return _.filter(platformToolbarService.getTools($scope.gridId), (item) => {
				return item && removeItems.indexOf(item.id) === -1;
			});
		};

		const initToolItems = () => {
			$scope.tools.items = getToolItems();
			// don't remove it, beacuse of the framework problem, I need this to make tool items not show again
			$scope.setTools = () => {
			};
		};
		initToolItems();

		const onCellChange = (e, args) => {
			let col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		let config = {
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

		basicsCommonToolbarExtensionService.insertBefore($scope, [{
			id: 'copy',
			caption: 'cloud.common.toolbarCopy',
			iconClass: 'tlb-icons ico-copy',
			type: 'item',
			fn: function () {
				dataService.copy();
			},
			disabled: function () {
				if (dataService.getSelected()?.IsForPreliminary === true) {
					return true;
				}
				return !dataService.getSelected();
			}
		}, {
			id: 'paste',
			caption: $translate.instant('cloud.common.toolbarPasteSelectedItem'),
			type: 'item',
			iconClass: 'tlb-icons ico-paste',
			fn: function () {
				dataService.paste();
			},
			disabled: function () {
				if (dataService.getSelected()?.IsForPreliminary === true) {
					return true;
				}
				return disableCreate() || dataService.CopyCache().length === 0 || _.some(dataService.CopyCache(), function (child) {
					return child.MdcMaterialFk !== dataService.getParentItemFilter().MdcMaterialFk;
				});
			},
		}]);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'createSubPUs',
			sort: 1,
			caption: $translate.instant('productionplanning.item.createSubPUs'),
			type: 'item',
			iconClass: 'tlb-icons ico-add-extend',
			permission: {'5907fffe0f9b44588254c79a70ba3af1': 4},
			isSet: true,
			fn: function () {
				var parent = null;
				if (dataService.getSelected()) {
					var select = dataService.getSelected();
					parent = itemService.getItemById(select.PPSItemFk);
				} else if (itemService.getSelected()) {
					parent = itemService.getSelected();
				}
				ppsItemCreateSubPUsService.showDialog(parent);

			},
			disabled: disableCreate
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataService));


		function disableCreate() {
			if (itemService.getSelected()?.IsForPreliminary === true) {
				return true;
			}
			var parent = null;
			if (dataService.getSelected()) {
				var select = dataService.getSelected();
				parent = itemService.getItemById(select.PPSItemFk);
			} else if (itemService.getSelected()) {
				parent = itemService.getSelected();
			}
			return _.isNil(parent) ? true : parent.ProductDescriptionFk || !parent.MdcMaterialFk;
		}


		const onGridClick = (e, args) => {
			let selectedItem = args.grid.getDataItem(args.row);
			$rootScope.$emit('documentsproject-parent-grid-click', {
				clickedItem: selectedItem,
				title: config.title
			});
			if (selectedItem) {
				dataService.setPPSDocConfig('productionplanning.item', 'productionplanningItemSubItemDataService', selectedItem);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

		// get dateshift Mode tool
		const eventServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
		const eventService = eventServiceFactory.getService('ItemFk', 'productionplanning.common.item.event', dataService);

		// initialize dateshift
		const toolConfig = {tools: [{id: 'fullshift', value: true}], configId: moduleName};
		ppsCommonActivityDateshiftService.initializeDateShiftController('productionplanning.common', eventService, $scope, toolConfig);

		function updateToolsItems() {
			$scope.tools.update();
		}

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'activeIcon',
			sort: -1000,
			caption: 'productionplanning.item.focusContainer',
			type: 'item',
			iconClass: 'control-icons ico-active',
			fn: () => {
			},
			disabled: () => {
				return !dataService.IsContainerLocked();
			}
		});

		dataService.setScope($scope);
		itemService.registerListLoaded(updateToolsItems);
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateToolsItems);

		const gridContainerGuid = '4ddf9e9220f44a22b29c97ecd41c7ab2';
		const ppsItemCharacteristics2Section = 69;

		// extend characteristics2
		const ppsItemCharacteristic2Config = {
			sectionId: ppsItemCharacteristics2Section,
			gridContainerId: gridContainerGuid,
			gridConfig: gridConfig,
			dataService: itemService,
			containerInfoService: 'productionplanningItemContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		characteristic2ColumnEventsHelper.register(ppsItemCharacteristic2Config);

		// un-register on destroy
		$scope.$on('$destroy', () => {
			documentsProjectDocumentDataService.unRegister();
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
			itemService.unregisterListLoaded(updateToolsItems);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateToolsItems);
		});

	}
})(angular);
