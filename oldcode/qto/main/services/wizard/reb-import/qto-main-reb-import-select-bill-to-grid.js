/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainRebImportSelectBillToGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportSelectBillToGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainRebImportSelectBillToService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, selectBillToService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					selectBillToService.setGridId($scope.gridId);

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
								field: 'Description',
								name: 'Description',
								toolTip: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}];

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainRebImportSelectBillToService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

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
