/**
 * Created by xai on 4/11/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CustomerValidationService', basicsMaterialCatalogPriceVersion2CustomerValidationService);
	basicsMaterialCatalogPriceVersion2CustomerValidationService.$inject = ['platformDataValidationService','basicsLookupdataLookupDataService','basicsLookupdataLookupDescriptorService'];
	function basicsMaterialCatalogPriceVersion2CustomerValidationService(platformDataValidationService,lookupDataService,basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};

			service.validateBpdBusinesspartnerFk = validateBpFk;

			function validateBpFk(entity, value, model) {
				if(value){
					var subsidiaryCaches = basicsLookupdataLookupDescriptorService.getData('subsidiary');
					//try to get data in local cache
					var subsidiary = _.find(subsidiaryCaches, {
						BusinessPartnerFk: value,
						IsMainAddress: true
					});
					//get data from server when cache is not found
					if (!subsidiary) {
						lookupDataService.getSearchList('subsidiary', 'IsMainAddress=true and BusinessPartnerFk=' + value).then(function (response) {
							if (response && response.items && response.items.length > 0) {
								entity.BpdSubsidiaryFk = response.items[0] ? response.items[0].Id : null;
								if (angular.isDefined(response.items[0])) {
									basicsLookupdataLookupDescriptorService.attachData({'subsidiary': response.items});
								}
								dataService.gridRefresh();
							}
						});
					} else {
						entity.BpdSubsidiaryFk = subsidiary.Id;
						dataService.gridRefresh();
					}
				}

				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			return service;
		};
	}
})(angular);