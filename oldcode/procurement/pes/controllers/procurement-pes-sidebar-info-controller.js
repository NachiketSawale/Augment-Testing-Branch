/**
 * Created by lja on 2015/10/23.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesSideBarInfoController',
		['$scope', 'procurementPesHeaderService',
			'procurementCommonSideBarInfoService', 'procurementCommonSideBarInfoDependentDataUIService',
			function ($scope, dataService,
				procurementCommonSideBarInfoService, procurementCommonSideBarInfoDependentDataUIService) {

				var headerItemFields = [
					{
						model: 'PesStatus.Description',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'DocumentDate',
						description: '"Document Date"',
						description$tr$: 'procurement.pes.sidebar.documentDate',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateDelivered',
						description: '"Date Delivered"',
						description$tr$: 'procurement.pes.sidebar.dateDelivered',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					}
				];

				var theModule = 'pes';

				// this watcher must before the totalHandler's watch
				var unWatch = $scope.$watch('headerItem', function () {
					getPesAmount();
				});

				function init() {

					$scope.pesAmount = [];

					$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
						.concat(
							procurementCommonSideBarInfoService.businessPartnerHandler($scope),
							procurementCommonSideBarInfoService.totalHandler($scope, $scope.pesAmount),
							procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
						);
				}

				function getPesAmount() {

					if ($scope.headerItem && $scope.headerItem.Id) {
						$scope.pesAmount.length = 0;
						$scope.pesAmount.push({
							Id: 1,
							Gross: $scope.headerItem.PesValue + $scope.headerItem.PesVat,
							ValueNet: $scope.headerItem.PesValue,
							Vat: $scope.headerItem.PesVat,
							isCustom: true
						});
					}
				}

				init();

				$scope.$on('$destroy', function () {
					unWatch();
				});

			}]);
})(angular);