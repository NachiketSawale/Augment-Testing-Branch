(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingAreaController', Controller);

	Controller.$inject = ['$scope',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingAreaDataService'];

	function Controller($scope,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		assignmentDataService,
		dataService) {

		const gridConfig = {
			uuid: constantValues.uuid.area,
			initCalled: false,
			columns: [],
			grouping: false,
			lazyInit: true,
			enableCopyPasteExcel: false,
			enableConfigSave: true,
			enableModuleConfig: true,
			enableTemplateButtons: true
		};

		const uiService = uiServiceFactory.getService(constantValues.area);
		const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService(gridConfig.uuid, uiService);
		const columnService = actionColumnServiceFactory.getService(gridConfig.uuid, dynamicConfigurationService, assignmentDataService.actionColFieldGeneratorFn);

		dialogGridControllerService.initListController($scope, dynamicConfigurationService, dataService, null, gridConfig);

		assignmentDataService.registerReportLoaded(loadData);
		assignmentDataService.registerReportModified(dataService.gridRefresh);

		function loadData() {
			const actions = assignmentDataService.getActions();
			columnService.appendActionCols(actions);
			dataService.loadData();
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
			assignmentDataService.unregisterReportLoaded(loadData);
			assignmentDataService.unregisterReportModified(dataService.gridRefresh);
		});
	}
})(angular);