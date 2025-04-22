/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidDocumentValidationService
	 * @description provides validation methods for bid header entities
	 */
	angular.module(moduleName).factory('salesBidDocumentValidationService',
		['salesBidDocumentService', 'salesCommonDocumentServiceProvider',
			function (salesBidDocumentService, salesCommonDocumentServiceProvider) {
				var service = salesCommonDocumentServiceProvider.getValidationInstance(salesBidDocumentService);
				return service;
			}
		]);
})();
