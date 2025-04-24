/**
 * Created by ltn on 8/16/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.quote').factory('procurementQuoteUpdateMaterialService',
		['$q', '$http', '$translate','platformModalService', 'basicsLookupdataLookupDescriptorService',
			'procurementQuoteRequisitionDataService', 'procurementCommonPrcItemDataService',
			function ($q, $http, $translate, platformModalService, lookupDescriptorService, procurementQuoteRequisitionDataService, procurementCommonPrcItemDataService) {

				var service = {}/* , self = this */;

				service.updateMaterial = function () {
					var headerItem = procurementQuoteRequisitionDataService.getSelected();
					if (!headerItem){
						return;
					}
					var iPrcHeaderFK = headerItem.PrcHeaderFk;
					return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/updateMaterial', {PrcHeaderFK: iPrcHeaderFK});
				};

				service.execute = function () {
					var headerItem = procurementQuoteRequisitionDataService.getSelected();
					if (!headerItem){
						return;
					}
					var prcItemDataService = procurementCommonPrcItemDataService.getService(procurementQuoteRequisitionDataService);
					var items= prcItemDataService.getList();
					var bMutil = false;
					var aFKs = [];

					// Get if have more than one same material records to update
					for(var i=0; i < items.length; i++)
					{
						for(var j=0; j < items.length; j++)
						{
							if ((items[i].MdcMaterialFk === items[j].MdcMaterialFk) && (items[i].Id !== items[j].Id))
							{
								bMutil = true;
							}
						}

						aFKs.unshift(items[i].MdcMaterialFk);
					}

					var modalOptions = {
						materialFKs: aFKs,
						headerTextKey: 'procurement.common.wizard.updateMaterial.updateMaterialTitle',
						isMultiMaterial: bMutil,
						templateUrl: globals.appBaseUrl + 'procurement.quote/partials/update-quote-material-dialog.html',
						iconClass: 'ico-info',
						showCancelButton: true
					};

					platformModalService.showDialog(modalOptions).then(function (/* result */) {
					});
				};

				return service;
			}]);
})(angular);