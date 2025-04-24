/**
 * Created by wui on 10/16/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDetailValidationService', [
		'basicsMaterialScopeServiceFactory', 'basicsMaterialScopeDetailPriceConditionDataService', 'basicsMaterialScopeDetailDataService',
		function (basicsMaterialScopeServiceFactory, basicsMaterialScopeDetailPriceConditionDataService, basicsMaterialScopeDetailDataService) {
			var service=basicsMaterialScopeServiceFactory.createScopeDetailValidationService(basicsMaterialScopeDetailPriceConditionDataService, {
				getExchangeRate: function () {
					return 1; //No foreign currency in material module, just return 1.
				},
				dataService: basicsMaterialScopeDetailDataService
			});

			service.validateScopeOfSupplyTypeFk = function () {
				service.onTotalChanged.fire();
			};

			service.onTotalChanged.register(function () {
				var scopeService = basicsMaterialScopeDetailDataService.parentService();
				var selectedMaterial=scopeService.parentService().getSelected();
				var itemScope= scopeService.getSelected();
				basicsMaterialScopeDetailDataService.sumTotal(selectedMaterial,itemScope);
			});

			return service;
		}
	]);

})(angular);