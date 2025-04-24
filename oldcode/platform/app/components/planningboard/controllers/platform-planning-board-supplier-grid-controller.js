/**
 * Created by baf on 05.09.2017.
 */
(function (angular) {
	'use strict';

	angular.module('platform').controller('platformPlanningBoardSupplierGridController', PlatformPlanningBoardSupplierGridController);

	PlatformPlanningBoardSupplierGridController.$inject = ['$scope', '$timeout',
		'platformGridControllerService',
		'platformPlanningBoardDataService',
		'platformGridAPI',
		'platformPlanningBoardValidationService'
		
		];

	function PlatformPlanningBoardSupplierGridController($scope, $timeout,
		platformGridControllerService,
		platformPlanningBoardDataService,
		platformGridAPI,
		platformPlanningBoardValidationService
		) {

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID());

		var conf = planningBoardDataService.getSupplierConfig();
		var demandConf, demandGrid, demandList, selectedDemand;
		var selectedSupplier;

		$scope.gridId = conf.uuid;

		$scope.config = {
			initCalled: false, columns: [],
			passThrough: {
				rowHeight: planningBoardDataService.getRowHeightFromSettings()
			}, gridDataAccess: 'supplierGridData',
			toolbarItemsDisabled: conf.toolbarItemsDisabled,
			skipToolbarCreation: conf.skipToolbarCreation
		};

		let suppControl = {};

		function init() {
			suppControl = platformGridControllerService.initListController($scope, conf.uiStandardService, conf.dataService, conf.validationService, $scope.config);
			$scope.gridConfigReady = true;

			if (demandGrid) { // !platformPlanningBoardDataService.gridSettings.validateDemandsAgainstSupplier()
				// reset demand list
				demandList = _.cloneDeep(demandConf.dataService.getUnfilteredList());
				demandGrid.dataView.setItems(demandList);
			}
		}

		function onSettingsChanged() {
			platformGridAPI.grids.unregister($scope.gridId);
			$scope.config.passThrough.rowHeight = planningBoardDataService.getRowHeightFromSettings();
			init();
			$scope.gridConfigReady = true;
		}

		function onStart() {
			$scope.gridConfigReady = false;
		}

		function validateSelection() {			
			// todo: delete with all registrations if no error report (created on 17.06.2020)
			// if (platformPlanningBoardDataService.gridSettings.validateDemandsAgainstSupplier()) {
			// 	selectedSupplier = conf.dataService.getSelected();
			// 	demandList = _.cloneDeep(demandConf.dataService.getUnfilteredList());
			// 	if (!demandGrid) {
			// 		demandGrid = platformGridAPI.grids.element('id', demandConf.uuid);
			// 	}
			//
			// 	if (demandGrid) {
			// 		if (!_.isNull(selectedSupplier)) {
			// 			selectDemand(demandConf.dataService.getSelected());
			// 			selectSupplier(conf.dataService.setSelected(selectedSupplier));
			// 		} else {
			// 			demandGrid.dataView.setItems(demandList);
			// 			selectDemand(demandConf.dataService.getSelected());
			// 		}
			// 	}
			// }
		}

		function selectDemand(demand) {
			if (!_.isNull(demand)) {
				platformGridAPI.rows.selection({
					gridId: demandConf.uuid,
					rows: [demand]
				});
				platformGridAPI.rows.scrollIntoViewByItem(demandConf.uuid, demand);
			}
		}

		function selectSupplier(supplier) {
			if (!_.isNull(supplier)) {
				platformGridAPI.rows.selection({
					gridId: conf.uuid,
					rows: [supplier]
				});
				platformGridAPI.rows.scrollIntoViewByItem(conf.uuid, supplier);
			}
		}
		
		function listLoaded() {
			validateSelection();
			init();
		}

		// valdiateSelection settings
		demandConf = planningBoardDataService.getDemandConfig();
		if (demandConf) {
			demandGrid = platformGridAPI.grids.element('id', demandConf.uuid);
		}

		// conf.dataService.registerSelectionChanged(validateSelection);

		// register events
		planningBoardDataService.registerOnSettingsChanged(onSettingsChanged);
		planningBoardDataService.registerOnSettingsChangedStarted(onStart);
		conf.dataService.registerListLoaded(listLoaded);

		$scope.$on('$destroy', function () {
			planningBoardDataService.unregisterOnSettingsChanged(onSettingsChanged);
			planningBoardDataService.unregisterOnSettingsChangedStarted(onStart);
			// conf.dataService.unregisterSelectionChanged(validateSelection);

			// valdiateSelection setting
			conf.dataService.unregisterListLoaded(listLoaded);
		});

		init();
	}

})(angular);