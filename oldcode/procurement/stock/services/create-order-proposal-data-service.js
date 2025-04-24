/**
 * Created by jhe on 11/27/2018.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('stockCreateOrderProposalDataService',
		[ 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService',
			// eslint-disable-next-line func-names
			function (runtimeDataService, basicsLookupdataLookupFilterService) {

				var service = {};

				// eslint-disable-next-line func-names
				service.updateReadOnly = function (item, field, value) {
					runtimeDataService.readonly(item, [{field: field, readonly: !value}]);
				};
				var filters = [
					{
						key: 'create-order-proposal-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.bpdBusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.bpdSupplierFk : null
							};
						}
					},
					{
						key: 'create-order-proposal--supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						fn: function (dataItem) {
							return {
								BusinessPartnerFk: dataItem !== null ? dataItem.bpdBusinessPartnerFk : null,
								SubsidiaryFk: dataItem !== null ? dataItem.bpdSubsidiaryFk : null
							};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				return service;
			}]);
})(angular);