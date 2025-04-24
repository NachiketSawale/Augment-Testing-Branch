/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var packageModule = angular.module(moduleName);

	packageModule.controller('productionplanningEngineeringTaskListController', PpsEngtaskListController);
	PpsEngtaskListController.$inject = ['$scope', '$http', '$injector', '$timeout', 'platformGridControllerService', 'platformGridAPI',
		'productionplanningEngineeringMainService',
		'productionplanningEngineeringTaskValidationService',
		'productionplanningEngineeringTaskUIStandardService',
		'productionplanningCommonStructureFilterService',
		'productionplanningEngineeringTaskClipboardService',
		'documentsProjectDocumentDataService',
		'$translate',
		'ppsCommonLoggingHelper',
		'basicsCommonToolbarExtensionService',
		'platformModuleNavigationService',
		'ppsEngineeringProjectDocumentProcessor',
		'productionplanningEngineeringGobacktoBtnsExtension',
		'$rootScope','ppsDocumentForFieldOriginProcessor'];


	function PpsEngtaskListController($scope, $http, $injector, $timeout, platformGridControllerService, platformGridAPI,
		dataService,
		validationService,
		uiStandardService,
		ppsCommonStructureFilterService,
		PpsEngineeringTaskClipboardService,
		documentsProjectDocumentDataService,
		$translate,
		ppsCommonLoggingHelper,
		toolbarExtensionService,
		navigationService,
		projectDocumentProcessor,
		gobacktoBtnsExtension,
		$rootScope,ppsDocumentForFieldOriginProcessor) {

		$scope.setTools(ppsCommonStructureFilterService.getToolbar(dataService));

		var gridConfig = {
			initCalled: false,
			type: 'engineeringTask',
			dragDropService: PpsEngineeringTaskClipboardService
		};
		// update toolbar
		function updateToolsWA() {
			$timeout($scope.tools.update, 50);
		}

		toolbarExtensionService.insertBefore($scope, {
			id: 'goto',
			caption: $translate.instant('cloud.common.Navigator.goTo'),
			type: 'dropdown-btn',
			iconClass: 'tlb-icons ico-goto',
			list: {
				showImages: true,
				listCssClass: 'dropdown-menu-right',
				items: [{
					id: 'planningUnitGoto',
					caption: $translate.instant('productionplanning.engineering.gotoPlanningUnitByJob'),
					type: 'item',
					iconClass: 'app-small-icons ico-production-planning',
					fn: function () {
						var selectedItem = dataService.getSelected();
						if (selectedItem && !_.isNil(selectedItem.LgmJobFk)) {
							$http.get(globals.webApiBaseUrl + 'productionplanning/common/item2event/listbyevent?eventId='+ selectedItem.PpsEventFk).then(function (response) {
								var itemFks = _.map(response.data, 'ItemFk');
								var navigator = {moduleName: 'productionplanning.item'};
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								dataService.update().then(function () {
									navigationService.navigate(navigator, {LgmJobFk: selectedItem.LgmJobFk, ItemFks: itemFks}, 'LgmJobFk');
									return $rootScope.$emit('after-save-entity-data');
								});
							});
						}
					}
				}]
			}
		});

		toolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		$scope.paste = function () {
			if (!PpsEngineeringTaskClipboardService.canPaste('engineeringTask', dataService.getSelected())) {
				return;
			}
			PpsEngineeringTaskClipboardService.paste(
				dataService.getSelected(),
				'engineeringTask',
				function (type) {
					if (type === 'leadingStructure') {
						dataService.gridRefresh();
					}
				});
		};

		function clearHightlight() {
			var grid = platformGridAPI.grids.element('id', $scope.gridId).instance;
			grid.clearHighlightRows();
		}

		PpsEngineeringTaskClipboardService.onDragEnd.register(clearHightlight);
		ppsCommonStructureFilterService.onUpdated.register(updateToolsWA);

		// extend validation for logging
		var schemaOption = {
			typeName: 'EngTaskDto',
			moduleSubModule: 'ProductionPlanning.Engineering'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// button for create log
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 5, uiStandardService,
			dataService, schemaOption, $injector.get('productionplanningEngineeringTranslationService'));

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


		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onEntityPropertyChanged(args.item,field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		var upStreamService = $injector.get('ppsUpstreamItemDataService').getService({
			serviceKey: 'productionplanning.engineering.ppsitem.upstreamitem',
			parentService: 'productionplanningEngineeringMainService',
			ppsItemColumn: 'PPSItemFk',
			ppsHeaderColumn: 'PPSItem_PpsHeaderFk'
		});
		var config = {
			moduleName: 'productionplanning.engineering',
			title: $translate.instant('productionplanning.engineering.taskListTitle'),
			parentService: dataService,
			processors: [projectDocumentProcessor, ppsDocumentForFieldOriginProcessor],
			readonly: false,
			columnConfig: [{
				documentField: 'EngTaskFk',
				dataField: 'Id',
				readOnly: true,
				projectFkField:'ProjectId',
				lgmJobFkField:'LgmJobFk'
			}],
			subModules: [{
				service: upStreamService,
				title: $translate.instant('productionplanning.item.upstreamItem.entity'),
				columnConfig: [{
					documentField: 'PpsUpstreamItemFk',
					dataField: 'Id',
					readOnly: true,
					projectFkField:'ProjectId',
					lgmJobFkField:'LgmJobFk'
				}, {
					documentField: 'PpsItemFk',
					dataField: 'PpsItemUpstreamFk',
					readOnly: true
				}, {
					documentField: 'PrcPackageFk',
					dataField: 'PrcPackageFk',
					readOnly: true
				}]
			}]
		};

		documentsProjectDocumentDataService.register(config);
		const onGridClick = (e, args) => {
			let selectedItem = args.grid.getDataItem(args.row);
			$rootScope.$emit('documentsproject-parent-grid-click', {
				clickedItem: selectedItem,
				title: config.title
			});
		};
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

		// extend characteristic2
		const characteristic2Config = {
			sectionId: 71,
			gridContainerId: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'productionplanningEngineeringContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			documentsProjectDocumentDataService.unRegister();
			ppsCommonStructureFilterService.onUpdated.unregister(updateToolsWA);
			PpsEngineeringTaskClipboardService.onDragEnd.unregister(clearHightlight);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			characteristic2ColumnEventsHelper.unregister($scope.gridId, 71);
			platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
		});
	}
})(angular);