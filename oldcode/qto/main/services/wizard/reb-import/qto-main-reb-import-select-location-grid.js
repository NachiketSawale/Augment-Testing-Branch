/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainRebImportSelectLocationGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportSelectLocationGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainRebImportSelectLocationService', 'qtoMainRebImportCommonService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, selectLocationService, qtoMainRebImportCommonService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					selectLocationService.setGridId($scope.gridId);

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

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainRebImportSelectLocationService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), [], {
						parentProp: 'LocationParentFk',
						childProp: 'Locations'
					});

					// marker change event
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						let items = platformGridAPI.items.data($scope.gridId);
						let itemList = salesCommonUtilsService.flatten(items, 'Locations');
						qtoMainRebImportCommonService.onStructureMarkerChanged(item, itemList , 'Locations', 'LocationParentFk');
						platformGridAPI.items.data($scope.gridId, items);
						$scope.$emit('qtoMainRebImportSelectLoctionGrid:IsMarkedChanged');
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
