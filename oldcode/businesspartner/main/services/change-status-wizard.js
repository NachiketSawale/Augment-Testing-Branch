(function (angular) {
	'use strict';

	angular.module('businesspartner.main').factory('BusinessPartnerMainChangeStatusWizard',
		['businesspartnerMainHeaderDataService', function (businesspartnerMainHeaderDataService) {
			return {
				execute: function (wizardsChange, value) {

					let header = businesspartnerMainHeaderDataService.getCurrentItem();
					if (!header || header.IsLive === value) {
						return;
					}

					header.IsLive = value;
					if (typeof wizardsChange === 'function') {
						wizardsChange();
					}

				}
			};
		}]);
})(angular);
