(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataRichLineItemProcessor', ['basicsLookupdataLookupDescriptorService',
		function (basicsLookupdataLookupDescriptorService) {
			var service = {
				processItem: function (item) {
					if (item.LineItem) {
						_.extend(item, item.LineItem);
						delete item.LineItem;
					}
					if (item.DedicatedAssembly) {
						basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', [_.clone(item.DedicatedAssembly)]);
						delete item.DedicatedAssembly;
					}
				}
			};
			return service;

		}]);
})(angular);


