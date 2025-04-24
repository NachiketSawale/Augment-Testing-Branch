/**
 * Created by lnb on 10/21/2014.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('procurementStockHeaderFilterService', [
		'platformContextService', 'basicsLookupdataLookupFilterService',
		'cloudDesktopSidebarService', 'procurementContextService',
		// eslint-disable-next-line func-names
		function (platformContextService, basicsLookupdataLookupFilterService,
			sidebarService, moduleContext) {
			var service = {}, self = this;

			// var getProjectFk = function getProjectFk(currentItem, useCurrentFirst) {
			//     return useCurrentFirst && currentItem ? currentItem.ProjectFk : platformContextService.getApplicationValue(sidebarService.appContextProjectContextKey);
			// };


			var filters = [
				{
					key: 'prc-invoice-header-project-filter',
					serverSide: true,
					fn: function () {
						return {
							IsLive: true,
							CompanyFk: moduleContext.loginCompany
						};
					}
				},
				{
					key: 'prc-stock-header-stockheaderv-filter',
					serverSide: true,
					fn: function (currentitem) {
						return 'PrjStockFk=' + currentitem.Id;
					}
				}
			];

			/**
             * register all filters
             * this method aways call in contract-controller.js when controller loaded.
             */
			service.registerFilters = function registerFilters(leadingService) {
				self.leadingService = leadingService;
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			/**
             * remove register all filters
             * this method aways call in contract-controller.js when controller destroy event called.
             */
			service.unRegisterFilters = function unRegisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return service;
		}]);
})(angular);