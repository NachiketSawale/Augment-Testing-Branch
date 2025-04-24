
(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainMaterialPortionListController', [
		'$scope',
		'$injector',
		'platformCreateUuid',
		'platformGridControllerService',
		'projectMaterialPortionStandardConfigurationService',
		'estimateMainMaterialPortionService',
		'estimateMainMaterialPortionValidationService',
		function (
			$scope,
			$injector,
			platformCreateUuid,
			gridControllerService,
			gridColumns,
			dataService,
			validationService
		) {

			let gridConfig = {
				columns: [],
				skipPermissionCheck :true,
				cellChangeCallBack: function cellChangeCallBack(args) {
					let currentItem = args.item;
					let col = args.grid.getColumns()[args.cell].field;
					if (col === 'IsEstimatePrice' || col ==='IsDayWorkRate' || col ==='CostPerUnit' || col ==='Project2MdcCostCodeFk' || col ==='Quantity') {
						dataService.fieldChanged(col,currentItem);
					}
				},
			};

			let projectId = $injector.get('estimateMainService').getSelectedProjectId();
			$injector.get('projectCostCodeLookupDataService').setProjectId(projectId);

			$injector.get('projectMaterialMainService').setCalculateModule('estimate');

			$scope.gridId = platformCreateUuid();
			gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			// every time open the Dialog need to clear the data first
			dataService.setList([]);

			$scope.$on('$destroy', function () {
				dataService.setParentSelected(null);
				dataService.setMaterialId(0);
				$injector.get('projectMaterialMainService').setCalculateModule(null);
			});
		}]);
})(angular);