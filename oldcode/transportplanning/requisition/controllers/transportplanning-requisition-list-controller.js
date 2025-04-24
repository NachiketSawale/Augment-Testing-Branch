(function (angular) {
	'use strict';
	/* globals angular, _*/

	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.controller('transportplanningRequisitionListController', RequisitionListController);
	RequisitionListController.$inject = ['$scope', '$injector', '$translate', 'platformGridAPI',
		'platformGridControllerService', 'transportplanningRequisitionUIStandardService',
		'transportplanningRequisitionValidationService', 'transportplanningRequisitionResourceRequisitionLookupDataService',
		'transportplanningRequisitionClipBoardService',
		'productionplanningCommonStructureFilterService',
		'$timeout', 'ppsCommonLoggingHelper', 'productionplanningCommonActivityDateshiftService',
		'basicsCommonToolbarExtensionService','transportplanningRequisitionGobacktoBtnsExtension',
		'transportplanningRequisitionGotoBtnsExtension', 'PpsCommonCharacteristic2ColumnEventsHelper'];

	function RequisitionListController($scope, $injector, $translate, platformGridAPI,
									   gridControllerService, uiStandardService,
									   validationService, transportplanningRequisitionResourceRequisitionLookupDataService,
									   trsRequisitionClipBoardService,
									   ppsCommonStructureFilterService,
									   $timeout, ppsCommonLoggingHelper, ppsCommonActivityDateshiftService,
									   basicsCommonToolbarExtensionService,gobacktoBtnsExtension,
									   gotoBtnsExtension, characteristic2ColumnEventsHelper) {

		function getDataService() {
			var dataServiceName = $scope.getContentValue('dataService');
			if (angular.isUndefined(dataServiceName)) {
				dataServiceName = 'transportplanningRequisitionMainService';
			}
			return $injector.get(dataServiceName);
		}

		var gridConfig = {
			initCalled: false, columns: [],
			type: 'trsRequisition',
			dragDropService: trsRequisitionClipBoardService
		};

		var dataService = getDataService();

		// extend validation for logging
		var schemaOption = {
			typeName: 'RequisitionDto',
			moduleSubModule: 'TransportPlanning.Requisition'
		};
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);

		gridControllerService.initListController($scope,
			uiStandardService,
			dataService,
			validationService,
			gridConfig);

		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 6, uiStandardService,
			dataService, schemaOption, $injector.get('transportplanningRequisitionTranslationService'));

		gridControllerService.addTools(dataService.getCopyButton());

		function onChangeGridContent() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			if (_.isNil(selected)) {
				transportplanningRequisitionResourceRequisitionLookupDataService.setFilter(0);
			} else {
				transportplanningRequisitionResourceRequisitionLookupDataService.setFilter(selected.Id);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'MntActivityFk' && args.item.Version === 0 && !_.isNull(args.item.MntActivityFk) &&
				args.item.LgmJobFk === 0) {
				dataService.updateLgmJobFkForNewItem(args.item, validationService);
			}
			if (col === 'PlannedStart' || col === 'PlannedTime') {
				dataService.syncPlannedTimes(args.item, col);
				platformGridAPI.rows.refreshRow({'gridId': args.grid.id, 'item': args.item});
			}
			dataService.onEntityPropertyChanged(args.item, col);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.setTools(ppsCommonStructureFilterService.getToolbar(dataService));

		//initialize dateshift
		var toolConfig = {tools : [ { id: 'fullshift', value: true } ], configId: moduleName };
		ppsCommonActivityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, toolConfig);
		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataService));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataService));

		// update toolbar
		function updateToolsWA() {
			$timeout($scope.tools.update, 50);
		}

		ppsCommonStructureFilterService.onUpdated.register(updateToolsWA);

		// extend characteristics2
		const characteristics2Section = 75;
		const characteristic2Config = {
			sectionId: characteristics2Section,
			gridContainerId: $scope.gridId,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'transportplanningRequisitionContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			ppsCommonStructureFilterService.onUpdated.unregister(updateToolsWA);
			characteristic2ColumnEventsHelper.unregister($scope.gridId, characteristics2Section);
		});
	}
})(angular);
