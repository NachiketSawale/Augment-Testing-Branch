(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingEmployeeToAreaController', Controller);

	Controller.$inject = ['$scope', '$translate',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingEmployeeToAreaDataService'];

	function Controller($scope, $translate,
		platformGridAPI,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		assignmentDataService,
		dataService) {

		$scope.isReady = true;
		const gridConfig = {
			uuid: constantValues.uuid.employeeToArea,
			initCalled: false,
			columns: [],
			grouping: false,
			lazyInit: true,
			enableCopyPasteExcel: false,
			cellChangeCallBack: arg => {
				const field = arg.grid.getColumns()[arg.cell].field;
				// set value to 0 if is ''
				if (_.get(arg.item, field) === '') {
					_.set(arg.item, field, 0);
				}
			},
			enableConfigSave: true,
			enableModuleConfig: true,
			enableTemplateButtons: true
		};

		const uiService = uiServiceFactory.getService(constantValues.employeeToArea);
		const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService(gridConfig.uuid, uiService);
		const columnService = actionColumnServiceFactory.getService(gridConfig.uuid, dynamicConfigurationService, assignmentDataService.actionColFieldGeneratorFn);

		dialogGridControllerService.initListController($scope, dynamicConfigurationService, dataService, null, gridConfig);

		const resetBtn = {
			id: 'reset',
			caption: $translate.instant('basics.common.reset'),
			type: 'item',
			iconClass: 'tlb-icons ico-discard',
			fn: () => {
				$scope.isReady = false;
				dataService.reset().then(() => $scope.isReady = true);
			},
			disabled: () => !dataService.canReset(),
		};
		$scope.tools.items.unshift(resetBtn);

		// events
		assignmentDataService.registerReportLoaded(renderActionColumns);
		assignmentDataService.registerReportModified(dataService.gridRefresh);

		function renderActionColumns() {
			const actions = assignmentDataService.getActions();
			columnService.appendActionCols(actions);
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

		$scope.$on('$destroy', function () {
			assignmentDataService.unregisterReportLoaded(renderActionColumns);
			assignmentDataService.unregisterReportModified(dataService.gridRefresh);
		});
	}
})(angular);