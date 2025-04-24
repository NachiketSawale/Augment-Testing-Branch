/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainRebImportSelectCostGroupGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportSelectCostGroupGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainRebImportSelectCostGroupService', 'qtoMainRebImportCommonService', 'qtoMainRebImportCostGroupCatService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, selectCostGroupService, qtoMainRebImportCommonService, qtoMainRebImportCostGroupCatService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					selectCostGroupService.setGridId($scope.gridId);

					function getColumns() {
						let columns = [
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								toolTip: 'Code',
								formatter: 'code',
								name$tr$: 'cloud.common.entityCode'
							},
							{
								id: 'Description',
								field: 'DescriptionInfo.Description',
								name: 'Description',
								toolTip: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}];

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainRebImportSelectCostGroupService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), [], {
						parentProp: 'CostGroupFk',
						childProp: 'CostGroupChildren'
					});

					// marker change event
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						let items = platformGridAPI.items.data($scope.gridId);
						let itemList = salesCommonUtilsService.flatten(items, 'CostGroupChildren');
						qtoMainRebImportCommonService.onStructureMarkerChanged(item, itemList , 'CostGroupChildren', 'CostGroupFk');
						platformGridAPI.items.data($scope.gridId, items);

						let hasMarkedItem = items.some(function(item) {
							return item.IsMarked === true;
						});
						qtoMainRebImportCostGroupCatService.setSelectedItemAsMarked(hasMarkedItem);

						$scope.$emit('qtoMainRebImportSelectCostGroupGrid:IsMarkedChanged');
					});

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					}, 0);

				}];

			return {
				restrict: 'A',

				scope: {
					ngModel: '=',
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (scope) {
					scope.$on('reloadGrid', function () {
					});
				}
			};
		}]);
})(angular);
