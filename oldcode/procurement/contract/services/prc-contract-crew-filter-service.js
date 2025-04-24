/**
 * Created by jhe on 1/11/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).factory('procurementContractCrewFilterService', [
		'basicsLookupdataLookupFilterService', 'procurementContractHeaderDataService',
		function (basicsLookupdataLookupFilterService, procurementContractHeaderDataService) {
			var service = {};

			// project filter
			var filters = [{
				key: 'prc-crew-contact-filter',
				serverSide: true,
				serverKey: 'prc-con-contact-filter',
				fn: function () {
					var conHeader = procurementContractHeaderDataService.getSelected();
					if (conHeader)
					{
						return {
							BusinessPartnerFk: conHeader ? conHeader.BusinessPartnerFk : null,
							SubsidiaryFk: conHeader ? conHeader.SubsidiaryFk : null
						};
					}
				}
			}];

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