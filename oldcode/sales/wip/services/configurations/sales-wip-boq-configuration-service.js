/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipBoqConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides layouts for containers of boq used in context of wips
	 */
	angular.module(moduleName).factory('salesWipBoqConfigurationService',
		['salesCommonBoqConfigurationServiceProvider',
			function (salesCommonBoqConfigurationServiceProvider) {
				return salesCommonBoqConfigurationServiceProvider.getInstance('sales.wip.boqdetailform');
			}
		]);
})();
