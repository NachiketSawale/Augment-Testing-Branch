(function (angular) {

	'use strict';

	let moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemDailyProductionListController', DailyProductionListControlle);

	DailyProductionListControlle.$inject = [
		'$scope', 'platformGridControllerService', 'productionplanningItemDailyProductionDataService',
		'productionplanningItemDailyProductionUIStandardService',
		'platformGridAPI',
		'basicsCommonToolbarExtensionService',
		'$translate',
		'ppsItemConstantValues',
		'$http',
		'platformPlanningBoardDataService'];

	function DailyProductionListControlle($scope, gridControllerService, dataService, uiStandardService,
		platformGridAPI,
		basicsCommonToolbarExtensionService,
		$translate,
		ConstantValues,
		$http,
		platformPlanningBoardDataService) {

		let gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'ParentFk',
			childProp: 'ChildItems'
		};
		gridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'deleteAssignments',
			caption: $translate.instant('productionplanning.item.dailyProduction.deleteAssignments'),
			type: 'item',
			iconClass: 'tlb-icons ico-delete',
			fn: () => {
				let selectedSubset = _.clone(dataService.getSelected());
				selectedSubset.PlannedStart = selectedSubset.PlannedStart.format('DD/MM/YYYY');
				$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/deleteAssignments', selectedSubset).then((response) => {
					dataService.load();
					var PBDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService');
					if (PBDataService !== undefined) {
						PBDataService.load();
					}
				});
			},
			disabled: () => {
				if(dataService.parentService().getSelected()?.IsForPreliminary === true){
					return true;
				}
				return !dataService.getSelected() || dataService.getSelected().DataTypeId !== ConstantValues.values.LockedTypeId;
			}
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'updateSiblingSubSets',
			caption: $translate.instant('productionplanning.item.dailyProduction.updateSiblingSubSets'),
			type: 'item',
			iconClass: 'tlb-icons ico-instance-calculate',
			fn: () => {
				dataService.updateSiblingSubSets();
			},
			disabled: () => {
				if(dataService.parentService().getSelected()?.IsForPreliminary === true){
					return true;
				}
				return !dataService.getSelected() || !(dataService.getSelected().DataTypeId === ConstantValues.values.LockedTypeId || dataService.getSelected().DataTypeId === ConstantValues.values.NestedTypeId);
			}
		});
		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'createSiblingSubSets',
			caption: $translate.instant('productionplanning.item.dailyProduction.createSiblingSubSets'),
			type: 'item',
			iconClass: 'tlb-icons ico-copy-paste-deep',
			fn: () => {
				dataService.setSplitNumber();
			},
			disabled: () => {
				if(dataService.parentService().getSelected()?.IsForPreliminary === true){
					return true;
				}
				return !dataService.getSelected() ||
					(dataService.getSelected() !== null && dataService.getSelected().DataTypeId !== ConstantValues.values.UnassignedTypeId) ||
					(dataService.getSelected() !== null && dataService.getSelected().DataTypeId === ConstantValues.values.UnassignedTypeId &&
						(dataService.getSelected().IsAssigned || dataService.getSelected().FullyCovered)
					);
			}
		});
		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'updateSubSets',
			caption: $translate.instant('productionplanning.item.dailyProduction.updateSubSet'),
			type: 'item',
			iconClass: 'tlb-icons ico-sub-fld-new',
			fn: () => {
				dataService.updateSubSets();
			},
			disabled: () => {
				if(dataService.parentService().getSelected()?.IsForPreliminary === true){
					return true;
				}
				let selectedPU = dataService.parentService().getSelected();
				let parentPU = selectedPU && selectedPU.PPSItemFk !== null ? dataService.parentService().getItemById(selectedPU.PPSItemFk) : null;
				return !(selectedPU !== null && selectedPU.ProductionSetId !== null || (parentPU !== null && parentPU.ProductionSetId !== selectedPU.ProductionSetId));
			}
		});

		const onSelectedRowsChanged = () => {
			$scope.updateTools();
		};

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			dataService.onFieldChanged(args.item, col);
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', () => {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});

	}

})(angular);