/**
 * Created by lcn on 1/21/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).factory('procurementCommonCreateModuleService',
		['$q', '$http', '$translate', 'platformModalService',
			function ($q, $http, $translate, platformModalService) {
				var service = {};
				service.showEditDialog = function (moduleName) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-create-module.html',
							packageCreationShowAssetMaster: response.data,
							moduleName: moduleName,
							resizeable: true
						}).then(function (result) {
							if (result) {
								var params = {};
								params.ConfigurationFk = result.ConfigurationFk;
								params.Code = result.Code;
								params.BusinessPartnerFk = result.BusinessPartnerFk;
								params.ContactFk = result.ContactFk;
								params.SubsidiaryFk = result.SubsidiaryFk;
								params.SupplierFk = result.SupplierFk;
								defer.resolve(params);
							}
						});
					});
					return defer.promise;
				};
				return service;
			}
		]);
})(angular);
