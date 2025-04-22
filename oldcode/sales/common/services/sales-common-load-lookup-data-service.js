/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonLoadLookupDataService
	 * @description service to preload neccesary lookup data of sales entities to speed up lookup performance
	 */
	angular.module(salesCommonModule).service('salesCommonLoadLookupDataService', ['$injector', function ($injector) {

		return {
			loadLookupData: function loadLookupData(salesService) {

				// Here we preload the status lookup of the given salesService
				var salesHeaderStatusLookupService = null;
				switch (salesService.getItemName()) {
					case 'BidHeader':
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesBidStatusLookupDataService');
						break;
					case 'BilHeader':
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesBillingStatusLookupDataService');
						break;
					case 'OrdHeader':
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesContractStatusLookupDataService');
						break;
					case 'WipHeader':
						salesHeaderStatusLookupService = $injector.get('basicsCustomSalesWipStatusLookupDataService');
						break;
				}

				var lookupOptions = {lookupType: salesService.getItemName() + 'Status'};
				return salesHeaderStatusLookupService.getList(lookupOptions);
			}
		};
	}
	]);

})();
