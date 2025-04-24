/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CompanyValidationService', basicsMaterialCatalogPriceVersion2CompanyValidationService);
	basicsMaterialCatalogPriceVersion2CompanyValidationService.$inject = ['platformDataValidationService'];
	function basicsMaterialCatalogPriceVersion2CompanyValidationService(platformDataValidationService) {
		return function (dataService) {
			var service = {};

			service.validateCompanyFk = validateCompanyFk;

			return service;

			//////////////////////////
			function validateCompanyFk(entity, value, model) {
				var tempValue = value === -1 ? '' : value;
				var dataListToCheck = angular.copy(dataService.getList());
				return platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, dataListToCheck, service, dataService);
			}
		};
	}
})(angular);