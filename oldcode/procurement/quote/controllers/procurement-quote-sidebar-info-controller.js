/**
 * Created by lja on 2015/10/23.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteSideBarInfoController',
		['$scope', 'procurementQuoteHeaderDataService', 'procurementQuoteTotalDataService',
			'procurementCommonSideBarInfoService', 'procurementCommonSideBarInfoDependentDataUIService',
			'globals',
			function ($scope, dataService, commonTotalService,
				procurementCommonSideBarInfoService, procurementCommonSideBarInfoDependentDataUIService,
				globals) {

				var headerItemFields = [
					{
						model: 'QuoteStatus.Description',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'QuoteVersion',
						description: '"Quote Version"',
						description$tr$: 'procurement.quote.sidebar.quoteVersion',
						iconClass: 'control-icons ico-version'
					},
					{
						model: 'DateQuoted',
						description: '"Date Quoted"',
						description$tr$: 'procurement.quote.sidebar.dateQuoted',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					},
					{
						model: 'DateReceived',
						description: '"Date Received"',
						description$tr$: 'procurement.quote.sidebar.dateReceived',
						domain: 'date',
						iconClass: 'tlb-icons ico-date'
					}
				];

				var theModule = 'quote';

				if (!globals.portal) {
					$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
						.concat(
							procurementCommonSideBarInfoService.businessPartnerHandler($scope),
							procurementCommonSideBarInfoService.totalHandler($scope, commonTotalService),
							procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
						);

				} else {
					$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
						.concat(
							procurementCommonSideBarInfoService.totalHandler($scope, commonTotalService)
						);
				}
			}]);
})(angular);