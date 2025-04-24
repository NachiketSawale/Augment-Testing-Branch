/**
 * Created by wui on 10/24/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeServiceBootstrap', [
		'prcItemScopeDataService',
		'prcItemScopeDetailDataService',
		'prcItemScopeDetailPriceConditionDataService',
		'procurementContextService',
		'prcItemScopeItemTextDataService',
		function (prcItemScopeDataService,
			prcItemScopeDetailDataService,
			prcItemScopeDetailPriceConditionDataService,
			procurementContextService,
			prcItemScopeItemTextDataService) {
			return {
				execute: function () {
					var prcItemService = procurementContextService.getItemDataService();
					var scopeService = prcItemScopeDataService.getService(prcItemService);
					var scopeDetailService = prcItemScopeDetailDataService.getService(scopeService);
					prcItemScopeDetailPriceConditionDataService.getService(scopeDetailService);
					prcItemScopeItemTextDataService.getService(scopeDetailService);
				}
			};
		}
	]);

})(angular);