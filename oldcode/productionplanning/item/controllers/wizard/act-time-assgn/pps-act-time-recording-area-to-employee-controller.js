(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingAreaToEmployeeController', Controller);

	Controller.$inject = ['$scope',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingAreaToEmployeeDataService'];

	function Controller($scope,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		assignmentDataService,
		dataService) {

		const gridConfig = {
			uuid: constantValues.uuid.areaToEmployee,
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

		const uiService = uiServiceFactory.getService(constantValues.areaToEmployee);
		const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService(gridConfig.uuid, uiService);
		const columnService = actionColumnServiceFactory.getService(gridConfig.uuid, dynamicConfigurationService, assignmentDataService.actionColFieldGeneratorFn);

		dialogGridControllerService.initListController($scope, dynamicConfigurationService, dataService, null, gridConfig);

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