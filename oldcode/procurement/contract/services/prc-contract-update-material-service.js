/**
 * Created by ltn on 8/15/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.contract').factory('procurementContractUpdateMaterialService',
		['$q', '$http', '$translate', 'platformModalService', 'basicsLookupdataLookupDescriptorService',
			'procurementContractHeaderDataService', 'procurementCommonPrcItemDataService',
			function ($q, $http, $translate, platformModalService, lookupDescriptorService, procurementContractHeaderDataService, procurementCommonPrcItemDataService) {

				var service = {};
				service.updateMaterial = function () {
					var headerItem = procurementContractHeaderDataService.getSelected();
					if (!headerItem) {
						return;
					}
					var iPrcHeaderFK = headerItem.PrcHeaderFk;
					return $http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/updateMaterial', {PrcHeaderFK: iPrcHeaderFK});
				};

				service.execute = function () {
					var headerItem = procurementContractHeaderDataService.getSelected();
					if (!headerItem) {
						return;
					}
					var prcItemDataService = procurementCommonPrcItemDataService.getService(procurementContractHeaderDataService);
					var items = prcItemDataService.getList();
					var bMutil = false;
					var aFKs = [];

					for (var i = 0; i < items.length; i++) {
						for (var j = 0; j < items.length; j++) {
							if ((items[i].MdcMaterialFk === items[j].MdcMaterialFk) && (items[i].Id !== items[j].Id)) {
								bMutil = true;
							}
						}

						aFKs.unshift(items[i].MdcMaterialFk);
					}

					var modalOptions = {
						materialFKs: aFKs,
						headerTextKey: 'procurement.common.wizard.updateMaterial.updateMaterialTitle',
						isMultiMaterial: bMutil,
						templateUrl: globals.appBaseUrl + 'procurement.contract/partials/update-material-dialog.html',
						iconClass: 'ico-info',
						showCancelButton: true
					};

					platformModalService.showDialog(modalOptions).then(function () { // jshint ignore:line
					});
				};

				return service;
			}]);
})(angular);