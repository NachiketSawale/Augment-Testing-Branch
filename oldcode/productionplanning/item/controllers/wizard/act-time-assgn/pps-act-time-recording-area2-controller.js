// duplicate code like ppsActualTimeRecordingAreaController, to be optimized later
(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsActualTimeRecordingArea2Controller', Controller);

	Controller.$inject = ['$scope', 'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'ppsActTimeRecordingConstantValues',
		'ppsActualTimeRecordingUIStandardServiceFactory',
		'ppsActualTimeRecordingDynamicConfigurationServiceFactory',
		'ppsActualTimeRecordingActionColumnServiceFactory',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingAreaDataService'];

	function Controller($scope, platformGridAPI,
		dialogGridControllerService,
		constantValues,
		uiServiceFactory,
		dynamicConfigurationServiceFactory,
		actionColumnServiceFactory,
		assignmentDataService,
		dataService) {

		$scope.isReady = true;
		const gridConfig = {
			uuid: '78eefacac8424e70bfb230c3e830f4c3',
			initCalled: false,
			columns: [],
			grouping: false,
			lazyInit: true,
			enableCopyPasteExcel: false,
			enableConfigSave: true,
			enableModuleConfig: true,
			enableTemplateButtons: true
		};

		const uiService = uiServiceFactory.getService(constantValues.area2);
		const dynamicConfigurationService = dynamicConfigurationServiceFactory.getService(gridConfig.uuid, uiService);
		const columnService = actionColumnServiceFactory.getService(gridConfig.uuid, dynamicConfigurationService, assignmentDataService.actionColFieldGeneratorFn);

		dialogGridControllerService.initListController($scope, dynamicConfigurationService, dataService, null, gridConfig);

		assignmentDataService.registerReportLoaded(loadData);
		assignmentDataService.registerReportModified(dataService.gridRefresh);

		function setSelectedIfNeeds(){
			let selected = dataService.getSelected();
			if(_.isNil(selected)){
				let list = dataService.getList();
				if(list.length > 0){
					dataService.setSelected(list[0]);
				}
			}
		}
		setSelectedIfNeeds();

		function loadData() {
			$scope.isReady = false;
			const actions = assignmentDataService.getActions();
			columnService.appendActionCols(actions);
			dataService.loadData();
			setSelectedIfNeeds();
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

		$scope.$on('$destroy', function () {
			assignmentDataService.unregisterReportLoaded(loadData);
			assignmentDataService.unregisterReportModified(dataService.gridRefresh);
		});

		// setTimeout(function () {
		// 	// console.log('resize grid of area container on the second step');
		// 	platformGridAPI.grids.resize($scope.gridId);
		// }, 200);
	}
})(angular);