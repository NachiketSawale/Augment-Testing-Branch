/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @name qtoMainSelectHeadersGrid
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainSelectHeadersGrid', ['globals',
		function (globals) {

			let controller = ['$injector', '$scope', '$timeout', 'platformGridAPI', 'salesCommonUtilsService','qtoMainSelectHeadersService',
				function ($injector, $scope, $timeout, platformGridAPI, salesCommonUtilsService, selectHeadersService) {

					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					selectHeadersService.setGridId($scope.gridId);

					function getColumns() {
						let columns = [
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								name$tr$: 'cloud.common.entityCode',
								toolTip: 'Code',
								formatter: 'code'
							}, {
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								toolTip: 'Description',
								formatter: 'translation'
							}, {
								id: 'BasRubricCategoryFk',
								field: 'BasRubricCategoryFk',
								name: 'Rubric Category',
								name$tr$: 'qto.main.BasRubricCategoryFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'QtoFormulaRubricCategory',
									displayMember: 'Description'
								}
							}, {
								id: 'QtoTypeFk',
								field: 'QtoTypeFk',
								name: 'QTO Type',
								name$tr$: 'qto.main.qtoTypeFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'QtoType',
									displayMember: 'DescriptionInfo.Translated'
								}
							}, {
								id: 'BoqHeaderFk',
								field: 'BoqHeaderFk',
								name: 'BoQ Reference No.',
								name$tr$: 'qto.main.headerBoq',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrjBoqExtended',
									dataServiceName:'qtoProjectBoqDataService',
									displayMember: 'Reference'
								}
							}, {
								id: 'OrdHeaderFk',
								field: 'OrdHeaderFk',
								name: 'OrdHeader Code',
								name$tr$: 'qto.main.OrdHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SalesContractInQto',
									dataServiceName:'qtoHeaderSalesContractLookupDialogService',
									displayMember: 'Code'
								}
							}];

						columns.push(salesCommonUtilsService.createMarkerColumn('qtoMainSelectHeadersService', '', true, true));

						return columns;
					}

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

					$timeout(function () {
						selectHeadersService.loadQtoHeaderItems();
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
