/**
 * Created by lcn on 10/18/2017.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';

	/* jshint -W072 */ // This function has too many parameters
	angular.module(moduleName).controller('procurementStockClearProjectStockController', [
		'$scope',
		'$translate',
		'params', '$http',
		'platformGridAPI',
		'constructionSystemProjectCompareCosService',
		'basicsLookupdataLookupFilterService',
		'constructionSystemProjectCosInstanceFlagImageService', 'clearProjectStockGridConfigService', 'moment', 'platformModalService',
		function ($scope,
			$translate,
			params, $http,
			platformGridAPI,
			constructionSystemProjectCompareCosService,
			basicsLookupdataLookupFilterService,
			constructionSystemProjectCosInstanceFlagImageService, clearProjectStockGridConfigService, moment, platformModalService) {

			$scope.modalOptions = {};
			$scope.modalOptions.headerText = $translate.instant('procurement.stock.wizard.ClearProjectStockTitle');
			$scope.modalOptions.cancel = function cancel() {
				$scope.$close(false);
			};

			$scope.currentStep = {
				buttons: [
					{
						label: 'procurement.stock.wizard.Clear',
						disable: function () {
							return !canToClear();
						},
						action: goToClear
					},
					{
						label: 'cloud.common.cancel',
						action: close
					}
				]
			};

			// needs for the accordions in Modal Dialog
			$scope.inputOpen = true;

			var filters = [
				{
					key: 'procurement-stock-select-transactiontype-filter',
					serverSide: true,
					fn: function () {
						return 'Id = 3  or Id = 5 or Id = 6';
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);
			$scope.config = {
				project: {
					lookupDirective: 'basics-lookup-data-project-project-dialog',
					descriptionMember: 'ProjectName',
					lookupOptions: {
						readOnly: true
					}
				},
				TransactionType: {
					showClearButton: false,
					filterKey: 'procurement-stock-select-transactiontype-filter'
				}

			};
			$scope.context = {
				prjStockIds:  params.prjStockIds || [],
				TransactionTypeId: null,
				TransactionDate: moment.utc(),
				ProjectId: params.projectId || null
			};

			$scope.gridDataView = null;
			$scope.gridId = 'f52781149ca746bf8ccdc6602b137841';
			$scope.gridData = {state: $scope.gridId};

			// noinspection JSCheckFunctionSignatures
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var gridConfig = clearProjectStockGridConfigService.provideGridConfig($scope.gridId);
				platformGridAPI.grids.config(gridConfig);
			}


			$http.post(globals.webApiBaseUrl + 'procurement/stock/header/getclearprojectstock', {
				prjStockIds: $scope.context.prjStockIds,ProjectId: $scope.context.ProjectId
			}).then(function (res) {
				var stockdata = res.data;
				if (angular.isArray(stockdata)) {
					platformGridAPI.items.data($scope.gridId, stockdata);
					if (stockdata.length > 0) {
						$scope.gridDataView = true;
					}
				}
			}
			);

			function close() {
				$scope.$close({isClear: false});
			}

			function goToClear() {
				var requestData = {
					prjStockIds: $scope.context.prjStockIds,
					transactionDate: $scope.context.TransactionDate,
					transactionTypeId: $scope.context.TransactionTypeId,
					ProjectId: $scope.context.ProjectId
				};
				$http.post(globals.webApiBaseUrl + 'procurement/stock/header/updateclearprojectstock', requestData).then(function () {
				}).then(function () {
					var modalOptions = {
						bodyText: $translate.instant('procurement.stock.wizard.ClearProjectStockMessage'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
					$scope.$close({isClear: true});

				});
			}

			function canToClear() {
				return $scope.gridDataView !== null && $scope.context.TransactionTypeId !== null && $scope.context.TransactionDate !== null;
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
	]);

})(angular);