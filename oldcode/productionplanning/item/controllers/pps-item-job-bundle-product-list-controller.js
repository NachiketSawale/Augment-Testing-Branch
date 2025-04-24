(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningJobBundleProductListController', JobBundleProductListController);

	JobBundleProductListController.$inject = ['_','$scope', 'platformGridControllerService', '$translate',
	  	'platformGridAPI',
	  	'basicsCommonToolbarExtensionService',
	  	'productionplanningCommonProductUIStandardService',
		'productionplanningItemJobBundleProductDataService',
		'$injector',
		'productionplanningItemJobBundleProductClipBoardService'];

	function JobBundleProductListController(_, $scope, platformGridControllerService, $translate,
		platformGridAPI,
		basicsCommonToolbarExtensionService,
		ppsItemJobBundleProductUIService,
		dataService,
		$injector,
		productionplanningItemJobBundleProductClipBoardService) {

		let gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: productionplanningItemJobBundleProductClipBoardService,
			type: 'Product'
		};

		const productColumns = ppsItemJobBundleProductUIService.getStandardConfigForListView().columns;

		_.each(productColumns, (column) => {
			column.sortable = false;
			column.editor = null;
		});

		platformGridControllerService.initListController($scope, ppsItemJobBundleProductUIService, dataService, {}, gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, [
			{
				id: 'moveUp',
				caption: $translate.instant('productionplanning.item.wizard.itemSplit.moveUp'),
				iconClass: 'tlb-icons ico-grid-row-up',
				type: 'item',
				fn: () => {
					dataService.moveUp();
				},
				disabled: () => {
					return diabledMove();
				}
			},
			{
				id: 'moveDown',
				caption: $translate.instant('productionplanning.item.wizard.itemSplit.moveDown'),
				iconClass: 'tlb-icons ico-grid-row-down',
				type: 'item',
				fn:  ()=> {
					dataService.moveDown();
				},
				disabled: () => {
					return diabledMove();
				}
			}
		]);
		_.find($scope.tools.items, {id: 'delete'}).fn = function () {
			dataService.deleteFn();
			// platformGridAPI.grids.refresh($scope.gridId, true);
		};
		$scope.tools.update();

		function diabledMove (){
			return dataService.getSelected() === null || dataService.getSelectedEntities().length > 1;
		}

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		}

		function onSelectionChanged() {
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		const grid = platformGridAPI.grids.element('id', $scope.gridId);
		dataService.setGrid(grid);
		dataService.registerSelectionChanged(onSelectionChanged);
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', () => {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);


