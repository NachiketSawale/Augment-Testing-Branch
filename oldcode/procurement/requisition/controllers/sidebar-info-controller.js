/**
 * Created by wui on 4/7/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionSideBarInfoController',
		['$scope', 'procurementRequisitionHeaderDataService', 'procurementCommonSideBarInfoService',
			'procurementCommonTotalDataService', 'procurementCommonSideBarInfoDependentDataUIService',
			/* jshint -W072 */

			function ($scope, dataService, procurementCommonSideBarInfoService,
				commonTotalService, procurementCommonSideBarInfoDependentDataUIService) {

				var headerItemFields = [
					{
						model: 'ReqStatus.Description',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'DateRequired',
						description: '"Required Date"',
						description$tr$: 'procurement.requisition.sidebarInfo.headerItem.dateRequired',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateReceived',
						description: '"Received Date"',
						description$tr$: 'procurement.requisition.sidebarInfo.headerItem.dateReceived',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateCanceled',
						description: '"Canceled Date"',
						description$tr$: 'procurement.requisition.sidebarInfo.headerItem.dateCanceled',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						itemType: 'location',
						model: 'AddressEntity.Address'
					}
				];

				var theModule = 'requisition';

				$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
					.concat(
						procurementCommonSideBarInfoService.businessPartnerHandler($scope),
						procurementCommonSideBarInfoService.totalHandler($scope, commonTotalService.getService(dataService)),
						procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
					);

			}
		]);
})(angular);