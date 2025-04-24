(function (angular) {
	'use strict';

	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractSideBarInfoController',
		['$scope', 'procurementContractHeaderDataService',
			'procurementCommonTotalDataService', 'procurementCommonSideBarInfoService',
			'procurementCommonSideBarInfoDependentDataService', 'procurementCommonSideBarInfoDependentDataUIService',
			/* jshint -W072 */

			function ($scope, dataService,
				commonTotalService, procurementCommonSideBarInfoService,
				procurementCommonSideBarInfoDependentDataService, procurementCommonSideBarInfoDependentDataUIService) {

				var headerItemFields = [
					{
						model: 'ConStatus.Translated',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'DateOrdered',
						description: '"Date Ordered"',
						description$tr$: 'procurement.contract.sidebarInfo.DateOrdered',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateDelivery',
						description: '"Date Delivery"',
						description$tr$: 'procurement.contract.sidebarInfo.DateDelivery',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateCanceled',
						description: '"Date Canceled"',
						description$tr$: 'procurement.contract.sidebarInfo.DateCanceled',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						itemType: 'location',
						model: 'AddressEntity.Address'
					}
				];

				var theModule = 'contract';

				$scope.config = [].concat(
					procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields),
					procurementCommonSideBarInfoService.businessPartnerHandler($scope),
					procurementCommonSideBarInfoService.totalHandler($scope, commonTotalService.getService(dataService)),
					procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
				);
			}
		]);
})(angular);