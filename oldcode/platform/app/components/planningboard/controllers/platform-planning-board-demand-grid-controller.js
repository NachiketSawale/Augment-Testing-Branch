/**
 * Created by baf on 05.09.2017.
 */
(function (angular) {
	'use strict';

	angular.module('platform').controller('platformPlanningBoardDemandGridController', PlatformPlanningBoardDemandGridController);

	PlatformPlanningBoardDemandGridController.$inject = ['$scope', '$timeout',
		'platformGridControllerService',
		'platformPlanningBoardDataService',
		'platformPlanningBoardValidationService',
		'platformGridAPI',
		'platformDataServiceSelectionExtension'];

	function PlatformPlanningBoardDemandGridController($scope, $timeout,
		platformGridControllerService,
		platformPlanningBoardDataService,
		platformPlanningBoardValidationService,
		platformGridAPI,
		platformDataServiceSelectionExtension) {

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID());

		var conf = planningBoardDataService.getDemandConfig();

		var supplierConf, supplierGrid, supplierList;
		var demandGrid, selectedDemand;

		if (!_.isNull(conf)) {
			$scope.gridId = conf.uuid;
			let gridConfig = {
				initCalled: false,
				columns: [],
				gridDataAccess: 'demandGridData',
				dragDropService: conf.dragDropService,
				type: conf.dragDropType,
				toolbarItemsDisabled: conf.toolbarItemsDisabled,
				skipToolbarCreation: conf.skipToolbarCreation,
			};

			if (conf.treeViewConfig) {
				gridConfig.parentProp = conf.treeViewConfig.parentProp;
				gridConfig.childProp  = conf.treeViewConfig.childProp;
			}

			platformGridControllerService.initListController($scope, conf.uiStandardService, conf.dataService, conf.validationService,gridConfig);
		}

		function onSettingsChanged() {
			init();
			filterDemandList();
		}

		function filterDemandList() {
			if (!_.isNull(conf) && _.isFunction(conf.mappingService.filterDemands) && demandGrid) {
				demandGrid.dataView.setItems(conf.mappingService.filterDemands(planningBoardDataService));
			}
		}

		function validateSelection() {
			if (planningBoardDataService.gridSettings.validateDemandAgainstSuppliers()) {
				selectedDemand = conf.dataService.getSelected();
				supplierList = _.cloneDeep(supplierConf.dataService.getUnfilteredList());

				if (!_.isNull(selectedDemand)) {
					let pbGridDefaultSetting = planningBoardDataService.gridSettings.validateDemandAgainstSuppliers();
					var validSupplierList = platformPlanningBoardValidationService.validateSelectedAgainstList(selectedDemand, supplierList, 'demand', 'supplier', pbGridDefaultSetting);
					supplierGrid.dataView.setItems(validSupplierList);

					selectSupplier(supplierConf.dataService.getSelected());
					selectDemand(selectedDemand);
				} else {
					supplierGrid.dataView.setItems(supplierList);
					selectSupplier(supplierConf.dataService.getSelected());
				}
			}
		}

		function selectDemand(demand) {
			if (!_.isNull(demand)) {
				platformGridAPI.rows.selection({
					gridId: conf.uuid,
					rows: [demand]
				});
				platformGridAPI.rows.scrollIntoViewByItem(conf.uuid, demand);
			}
		}

		function selectSupplier(supplier) {
			if (!_.isNull(supplier)) {
				platformGridAPI.rows.selection({
					gridId: supplierConf.uuid,
					rows: [supplier]
				});
				platformGridAPI.rows.scrollIntoViewByItem(supplierConf.uuid, supplier);
			}
		}

		function listLoaded() {
			filterDemandList();
			validateSelection();
		}

		function init() {
			supplierConf = planningBoardDataService.getSupplierConfig();
			supplierGrid = platformGridAPI.grids.element('id', supplierConf.uuid);

			if (!_.isNull(conf)) {
				demandGrid = platformGridAPI.grids.element('id', conf.uuid);
			}
		}

		// check valdiateSelection setting
		if (!_.isNull(conf)) {
			conf.dataService.registerSelectionChanged(validateSelection);
		}

		// register events
		planningBoardDataService.registerOnSettingsChanged(onSettingsChanged);
		if (!_.isNull(conf)) {
			conf.dataService.registerListLoaded(listLoaded);
			planningBoardDataService.registerInfoChanged(filterDemandList);
		}

		$scope.$on('$destroy', function cleanupHandlers() {
			if (!_.isNull(conf)) {
				conf.dataService.unregisterSelectionChanged(validateSelection);
				// valdiateSelection setting
				conf.dataService.unregisterListLoaded(listLoaded);
				planningBoardDataService.unregisterInfoChanged(filterDemandList);
			}
		});

		init();
	}

})(angular);