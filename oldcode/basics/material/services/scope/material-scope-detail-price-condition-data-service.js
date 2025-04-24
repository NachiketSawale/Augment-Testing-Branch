/**
 * Created by wui on 10/17/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDetailPriceConditionDataService', basicsMaterialScopeDetailPriceConditionDataService);

	basicsMaterialScopeDetailPriceConditionDataService.$inject = ['basicsMaterialPriceConditionFactoryDataService',
		'basicsMaterialScopeDetailDataService'];

	function basicsMaterialScopeDetailPriceConditionDataService(basicsMaterialPriceConditionFactoryDataService,
		basicsMaterialScopeDetailDataService) {
		return basicsMaterialPriceConditionFactoryDataService.createService(basicsMaterialScopeDetailDataService, {
			moduleName: 'basicsMaterialScopeDetailDataService',
			route: 'basics/material/scope/detail/pricecondition/',
			readonly: false,
			itemName: 'MaterialScopeDetailPc',
			onCalculateDone: function (scopeDetail, priceConditionFk, total, totalOc) {
				var validationService = basicsMaterialScopeDetailDataService.validationService();
				validationService.updatePriceExtraAndOc(scopeDetail, total, totalOc);
				basicsMaterialScopeDetailDataService.markItemAsModified(scopeDetail);
			},
			getExchangeRate: function () {
				return 1; //No foreign currency in material module, just return 1.
			},
			getParentDataContainer: basicsMaterialScopeDetailDataService.getServiceContainer
		});
	}
})(angular);
