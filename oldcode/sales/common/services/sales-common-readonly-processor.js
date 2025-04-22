/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';
	/**
	 * @ngdoc service
	 * @name salesCommonReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The salesCommonReadonlyProcessor sets the readonly status of common properties like exchange rate
	 */
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('SalesCommonReadonlyProcessor', ['platformRuntimeDataService', 'salesCommonContextService',
		function (platformRuntimeDataService, salesCommonContextService) {
			return function () {
				var self = this;

				self.processItem = function processItem(item) {
					// do nothing if entire entity is set read only
					if (!platformRuntimeDataService.isReadonly(item)) {
						// handle exchange rate
						platformRuntimeDataService.readonly(item, [{
							field: 'ExchangeRate',
							readonly: salesCommonContextService.isCompanyCurrency(item.CurrencyFk)
						}]);
					}
				};
			};
		}]);
})();
