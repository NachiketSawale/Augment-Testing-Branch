(function (angular) {
	'use strict';

	var module = angular.module('basics.pricecondition');
	module.factory('priceConditionValueFormatter', ['platformGridDomainService', 'basicsLookupdataLookupDescriptorService', function (platformGridDomainService, basicsLookupdataLookupDescriptorService) {
		var defaultFormatter = platformGridDomainService.formatter('factor');
		return function formatter(row, cell, value, column, dataContext) {
			var type = _.find(basicsLookupdataLookupDescriptorService.getData('PrcPriceConditionType'), {Id: dataContext.PriceConditionTypeFk});
			if (type && type.HasValue === false) {
				return '';
			} else {
				return '<div class="text-right">' + defaultFormatter.apply(this, arguments) + '</div>';
			}
		};
	}]);
})(angular);