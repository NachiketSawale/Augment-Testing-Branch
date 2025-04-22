(function () {
	'use strict';
	var salesContractModule = 'sales.contract';
	angular.module(salesContractModule).factory('ordPaymentScheduleImageProcessor', [function() {

		var service = {};

		/* jshint -W074 */ // I don't see a high cyclomatic complexity
		service.processItem = function processItem(item) {
			if (!item) {
				return '';
			}
			if (item.Id === -1) {
				item.image = 'ico-folder-doc';
			}
			else {
				if (item.IsStructure) {
					if (!item.PaymentScheduleFk) {
						item.image = 'ico-folder-empty';
					}
					else {
						item.image = 'ico-boq-item';
					}
				}
				else {
					item.image = 'ico-empty';
				}
			}
			return true;
		};

		return service;

	}]);
})();