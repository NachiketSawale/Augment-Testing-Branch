/**
 * Created by reimer on 28.07.2015.
 */

(function () {

	/*global angular, _*/

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc controller
	 * @name basicsImportWizardController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('basicsImportCustomEstimateGridController', [
		'$scope', '$timeout', '$translate', 'platformGridAPI', 'platformTranslateService','$injector','basicImportCustomEstimateService',

		function ($scope, $timeout, $translate, platformGridAPI, platformTranslateService,$injector,basicImportCustomEstimateService) {

			let gridColumns = $scope.gridColumns;
			let modeType = $scope.mode;
			gridColumns=_.map(gridColumns,function (column){
				return 	{
					id: column.Id,
					field: column.DesctinationFieId,
					name:   column.SourceFieId,
					formatter: 'description',
					width: 110,
					name$tr$: 'basics.import.column.DesctinationFieId'
				};
			});
			$scope.dataItem = basicImportCustomEstimateService.getFormConfiguration();
			if($scope.dataItem.searchCriteria){
				basicImportCustomEstimateService .dataItem.searchCriteria = $scope.dataItem.searchCriteria;

			}
		let gridData = $scope.gridData;
		if(!modeType){
			gridData = basicImportCustomEstimateService.gridData;
			gridColumns = [{
				id: 1,
				field: 'Reference2',
				name:   'Structure Ref No',
				formatter: 'description',
				width: 100,
				name$tr$: 'basics.import.Reference2',
			},{
				id: 2,
				field: 'OutlineSpecification',
				name:   'Resource Description',
				formatter: 'description',
				width: 120,
				name$tr$: 'basics.import.OutlineSpecification',
			},{
				id: 3,
				field: 'Uom',
				name:   'UoM',
				formatter: 'description',
				width: 80,
				name$tr$: 'basics.import.Uom',
			},{
				id: 4,
				field: 'FinalPrice',
				name:   'Unit Rate',
				formatter: 'description',
				width: 80,
				name$tr$: 'basics.import.FinalPrice',
			}];
		}
			$scope.gridId = '3a55b53e9555453596e83acf9830c794';

			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)){
				let gridConfig = {
					data: [],
					columns: angular.copy(gridColumns),
					id: $scope.gridId,
					lazyInit: false,
					isStaticGrid: true,
					options: {
						tree: true,
						childProp: 'BoqItems',
						type: 'boqitem',
						skipPermissionCheck: true,
						parentProp: 'BoqItemFk',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					},
					enableConfigSave: true
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);

				// initialize();
			}else{
				platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));

				// initialize();
			}
			$timeout(function () {
				platformGridAPI.items.data($scope.gridId, gridData);
				platformGridAPI.grids.resize($scope.gridId);
			});
		}
	]);
})();
