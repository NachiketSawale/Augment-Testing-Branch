(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingProductController', Controller);

	Controller.$inject = ['$scope',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingProductAssignmentDataService',
		'ppsActualTimeRecordingAreaDataService',
		'ppsActualTimeRecordingProductDataService',
		'ppsActualTimeRecordingProductUIStandardService'];

	function Controller($scope,
		platformGridAPI,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		assignmentDataService,
		productAssignmentDataService,
		areaDataService,
		dataService,
		ppsActualTimeRecordingProductUIStandardService) {
		const gridConfig = {
			uuid: 'c2604409c00442fcae74b8d8f7be843a',
			initCalled: false,
			columns: [],
			grouping: false,
			lazyInit: true,
			enableCopyPasteExcel: false,
			enableConfigSave: true,
			enableModuleConfig: true,
			enableTemplateButtons: true
		};

		const uiService = ppsActualTimeRecordingProductUIStandardService;
		const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService(gridConfig.uuid, uiService);
		const columnService = actionColumnServiceFactory.getService(gridConfig.uuid, dynamicConfigurationService, productAssignmentDataService.actionColFieldGeneratorFn);

		// dialogGridControllerService.initListController($scope, dynamicConfigurationService, dataService, null, gridConfig);
		dialogGridControllerService.initListController($scope, uiService, dataService, null, gridConfig);

		// events
		productAssignmentDataService.registerProductAssignmentLoaded(loadData);

		function loadData() {
			$scope.isReady = false;
			columnService.appendActionCols(productAssignmentDataService.getActions());
			dataService.load();
			$scope.isReady = true;
		}

		// copy from mainview-subcontainer.js for filter toolbar
		$scope.removeToolByClass = function removeToolByClass(cssClassArray) {
			if ($scope.tools && $scope.tools.items) {
				$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
					return findByClass(toolItem, cssClassArray);
				});
				$scope.tools.update();
			}
		};
		function findByClass(toolItem, cssClassArray) {
			var notFound = true;
			_.each(cssClassArray, function (CssClass) {
				if (CssClass === toolItem.iconClass) {
					notFound = false;
				}
			});
			return notFound;
		}


		function onCellChange(e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			productAssignmentDataService.onCorrectionChanged(args.item, dataService, field);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			areaDataService.unregisterSelectionChanged(loadData);
			productAssignmentDataService.unregisterProductAssignmentLoaded(loadData);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});

		// setTimeout(function () {
		// 	// console.log('resize grid of product container on the second step');
		// 	platformGridAPI.grids.resize('c2604409c00442fcae74b8d8f7be843a');
		// }, 200);
	}
})(angular);