/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainRebImportCostGroupCatGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportCostGroupCatGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainRebImportCostGroupCatService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, costGroupCatService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					costGroupCatService.setGridId($scope.gridId);
					costGroupCatService.clear();

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

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainRebImportCostGroupCatService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

					// selection change event
					salesCommonUtilsService.addOnSelectedRowChangedEvent($scope, $scope.gridId, function (selected) {
						if (selected) {
							$injector.get('qtoMainRebImportSelectCostGroupService').loadCostGrouupItems([selected.Id], selected.Code);
							costGroupCatService.setSelectedItem(selected);
						}
					});

					// marker change event
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						if (value){
							costGroupCatService.addIsMarkedCatId(item.Id);
						} else {
							costGroupCatService.removeIsMarkedCatId(item.Id);
						}

						$injector.get('qtoMainRebImportSelectCostGroupService').setItems(item);

						$scope.$emit('qtoMainRebImportCostGroupCatGrid:IsMarkedChanged');
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
