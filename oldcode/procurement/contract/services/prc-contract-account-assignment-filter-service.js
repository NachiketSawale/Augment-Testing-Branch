/**
 * Created by jhe on 8/21/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementContractAccountAssignmentFilterService', [
		'basicsLookupdataLookupFilterService', 'procurementContractHeaderDataService',
		function (basicsLookupdataLookupFilterService, procurementContractHeaderDataService) {
			var service = {};

			// project filter
			var filters = [{
				key: 'basics-company-companyyear-filter',
				serverSide: true,
				fn: function () {
					var conHeader = procurementContractHeaderDataService.getSelected();
					if (conHeader) {
						return 'CompanyFk=' + conHeader.CompanyFk;
					}
				}
			}, {
				key: 'procurement-contract-account-assignment-controlling-unit-filter',
				serverKey: 'prc.con.controllingunit.by.prj.filterkey',
				serverSide: true,
				fn: function () {
					var conHeader = procurementContractHeaderDataService.getSelected();
					if (conHeader) {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: conHeader.ProjectFk,
							CompanyFk: null
						};
					}
				}
			},
			{
				key: 'procurement-contract-account-assignment-scheduling-activity-filter',
				serverSide: true,
				fn: function (item) {
					if (item) {
						return 'ScheduleFk =' + item.PsdScheduleFk;
					}
				}
			},
			{
				key: 'procurement-contract-crew-filter',
				serverSide: true,
				fn: function () {
					var conHeader = procurementContractHeaderDataService.getSelected();
					if (conHeader) {
						return 'IsLive = true And ConHeaderFk =' + conHeader.Id;
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