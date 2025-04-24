(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingEmployeeController', Controller);

	Controller.$inject = ['$scope',
		'$translate',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingEmployeeDataService'];

	function Controller($scope,
		$translate,
		platformGridAPI,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		assignmentDataService,
		dataService) {

		const gridConfig = {
			uuid: constantValues.uuid.employee,
			initCalled: false,
			columns: [],
			grouping: false,
			lazyInit: true,
			enableCopyPasteExcel: false,
			enableConfigSave: true,
			enableModuleConfig: true,
			enableTemplateButtons: true
		};

		const uiService = uiServiceFactory.getService(constantValues.employee);
		dialogGridControllerService.initListController($scope, uiService, dataService, null, gridConfig);

		assignmentDataService.registerReportLoaded(dataService.loadData);
		assignmentDataService.registerReportModified(dataService.gridRefresh);

		// filter button
		let filtered = false;
		const filterBtn = {
			id: 'filter',
			caption: $translate.instant('productionplanning.item.wizard.actualTimeRecording.filterBtn'),
			type: 'check',
			value: filtered,
			iconClass: 'tlb-icons ico-filter',
			fn: () => {
				filtered = !filtered;
				platformGridAPI.filters.extendFilterFunction(gridConfig.uuid, item =>
					filtered ? dataService.isValid(item) : true);

				const gridInstance = platformGridAPI.grids.element('id', gridConfig.uuid).instance;
				dataService.filter(filtered, gridInstance);
			}
		};
		$scope.tools.items.unshift(filterBtn);

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
			assignmentDataService.unregisterReportLoaded(dataService.loadData);
			assignmentDataService.unregisterReportModified(dataService.gridRefresh);
		});
	}
})(angular);