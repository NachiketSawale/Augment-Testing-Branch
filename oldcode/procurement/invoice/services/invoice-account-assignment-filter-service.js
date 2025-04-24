/**
 * Created by jhe on 8/29/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).factory('procurementInvoiceAccountAssignmentFilterService', [
		'basicsLookupdataLookupFilterService', 'procurementInvoiceHeaderDataService',
		function (basicsLookupdataLookupFilterService, procurementInvoiceHeaderDataService) {
			var service = {};

			// project filter
			var filters = [{
				key: 'basics-company-companyyear-filter',
				serverSide: true,
				fn: function () {
					var invHeader = procurementInvoiceHeaderDataService.getSelected();
					if (invHeader)
					{
						return 'CompanyFk=' + invHeader.CompanyFk;
					}
				}
			}, {
				key: 'procurement-invoice-account-assignment-controlling-unit-filter',
				serverKey: 'prc.con.controllingunit.by.prj.filterkey',
				serverSide: true,
				fn: function () {
					var invHeader = procurementInvoiceHeaderDataService.getSelected();
					if (invHeader)
					{
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: invHeader.ProjectFk,
							CompanyFk: null
						};
					}
				}
			}
			];

			/**
             * register all filters
             * this method aways call in contract-controller.js when controller loaded.
             */
			service.registerFilters = function registerFilters() {
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