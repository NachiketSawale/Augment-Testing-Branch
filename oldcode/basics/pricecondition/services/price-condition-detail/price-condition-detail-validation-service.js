(function (angular) {
	'use strict';

	var moduleName = 'basics.pricecondition';
	var priceConditionModule = angular.module(moduleName);
	priceConditionModule.factory('basicsPriceConditionDetailValidationService',
		['basicsPriceConditionDetailDataService', 'basicsLookupdataLookupDescriptorService',
			function (dataService, basicsLookupdataLookupDescriptorService) {
				var service = {};

				service.validatePriceConditionTypeFk = function validatePriceConditionTypeFk(item, value) {
					var type = _.find(basicsLookupdataLookupDescriptorService.getData('PrcPriceConditionType'), {Id: value});

					item.Value = (type && !type.HasValue) ? 0 : type.Value;
					item.PriceConditionTypeFk = value;
					dataService.updateReadOnly(item, ['Value']);
					return true;
				};

				return service;

			}]);
})(angular);