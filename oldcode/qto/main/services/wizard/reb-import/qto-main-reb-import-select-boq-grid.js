/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainRebImportSelectBoqGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportSelectBoqGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainRebImportSelectBoqService', 'qtoMainRebImportCommonService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, selectBoqService, qtoMainRebImportCommonService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					selectBoqService.setGridId($scope.gridId);

					function getColumns() {
						let boqConfigService = $injector.get('boqMainStandardConfigurationServiceFactory');
						let configService = boqConfigService.createBoqMainStandardConfigurationService();
						let columns = salesCommonUtilsService.getReadonlyColumnsSubset(configService.getStandardConfigForListView().columns, [
							'reference', 'briefinfo', 'basuomfk'
						]);

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainRebImportSelectBoqService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), [], {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems'
					});

					// marker change event
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						let items = platformGridAPI.items.data($scope.gridId);
						let itemList = salesCommonUtilsService.flatten(items, 'BoqItems');
						qtoMainRebImportCommonService.onStructureMarkerChanged(item, itemList , 'BoqItems', 'BoqItemFk');
						platformGridAPI.items.data($scope.gridId, items);
						$scope.$emit('qtoMainRebImportSelectBoqGrid:IsMarkedChanged');
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
