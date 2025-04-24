/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'project.material';
	let projectMaterialModule = angular.module(moduleName);
	projectMaterialModule.factory('projectMaterialPriceConditionServiceNew', ['basicsMaterialPriceConditionFactoryDataService', 'projectMaterialMainService', 'platformModuleStateService', function (priceConditionDataService, projectMaterialMainService, platformModuleStateService) {
		let service = priceConditionDataService.createService(projectMaterialMainService, {
			moduleName: 'PrjMatPrcConditions',
			route: 'project/material/pricecondition/',
			readonly: false,
			itemName: 'PrjMatPrcConditions',
			headerService: getHeaderService,
			onCalculateDone: function (material, priceConditionFk, total,totalOc, vatPercent,field,module) {
				let itemService = projectMaterialMainService;

				if(module !=='estimate') {
					material.PriceExtra = total;
				}
				itemService.recalculateCost(material,null,field,module);
				// material.PrcPriceConditionFk = material.PrcPriceconditionFk = priceConditionFk;

				// this action has been invoked in funciton itemService.recalculateCost(...)
				// itemService.markItemAsModified(material);

				// workaround to ensure the updated item in update data for (defect#67169)
				let modState = platformModuleStateService.state(itemService.getModule());
				let elemState = itemService.assertPath(modState.modifications);
				elemState.PrjMaterial = material;
			},
			getExchangeRate: function () {
				// projectMaterialMainService.getSelected().ExchangeRate;
				return 1;
			}
		});

		function getHeaderService(){
			return projectMaterialMainService.parentService();
		}

		let onPriceConditionSelectionChanged = function onPriceConditionSelectionChanged(priceCondition) {
			if (angular.isFunction(service.unwatchEntityAction)) {
				service.unwatchEntityAction();
			}
			service.reload(projectMaterialMainService.getSelected(), priceCondition.Id).finally(service.watchEntityAction);
		};

		service.doInit = function(){
			return true;
		};

		projectMaterialMainService.priceConditionSelectionChanged.register(onPriceConditionSelectionChanged);

		return service;
	}]);
})(angular);
