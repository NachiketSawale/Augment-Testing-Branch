/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipDocumentValidationService
	 * @description provides validation methods for wip header entities
	 */
	angular.module(moduleName).factory('salesWipDocumentValidationService',
		['salesWipDocumentService', 'salesCommonDocumentServiceProvider',
			function (salesWipDocumentService, salesCommonDocumentServiceProvider) {
				var service = salesCommonDocumentServiceProvider.getValidationInstance(salesWipDocumentService);
				return service;
			}
		]);
})();
