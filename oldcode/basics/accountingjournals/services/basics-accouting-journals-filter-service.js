/**
 * Created by jhe on 11/22/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).factory('basicsAccountingJournalsFilterService', [
		'basicsLookupdataLookupFilterService',
		function (basicsLookupdataLookupFilterService) {
			var service = {};

			// project filter
			var filters = [{
				key: 'basics-company-companyyear-filter',
				serverSide: true,
				fn: function (item) {
					return 'CompanyFk=' + item.CompanyFk;
				}
			},
			{
				key: 'basics-company-period-filter',
				serverSide: true,
				fn: function (item) {
					return 'CompanyYearFk=' + item.CompanyYearFk;
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