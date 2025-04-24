/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeValidationService', [
		'basicsMaterialScopeServiceFactory', 'procurementCommonServiceCache', '$q', 'prcItemScopeDetailDataService',
		function (basicsMaterialScopeServiceFactory, procurementCommonServiceCache, $q, prcItemScopeDetailDataService) {

			function Constructor(dataService) {
				var service = basicsMaterialScopeServiceFactory.createScopeValidationService(dataService);

				service.validateIsSelected = function (entity, value) {
					var doGridRefresh = false;
					var list = dataService.getList();
					var parentDataService = dataService.parentService();
					var prcItem = parentDataService.getSelected();

					if (value === true) {
						list.forEach(function (item) {
							if (item !== entity) {
								doGridRefresh = true;
								if(item.IsSelected !== false){
									item.IsSelected = false;
									dataService.markItemAsModified(item);
								}
							}
						});

						if(doGridRefresh){
							dataService.gridRefresh();
						}
					}

					entity.IsSelected = value;
					dataService.hasScope();
					dataService.isSelectedChanged.fire(dataService.isSelectedChanged, {
						prcItem: prcItem,
						itemScope: entity
					});

					return true;
				};

				service.asyncValidateMatScope = function (entity, value) {
					var prcItemService = dataService.parentService();
					var prcItem = prcItemService.getSelected();
					var scopeDetailService = prcItemScopeDetailDataService.getService(dataService);
					return scopeDetailService.reloadByMatScopeAsync(prcItem.MdcMaterialFk, value, entity);
				};


				return service;
			}

			return procurementCommonServiceCache.registerService(Constructor, 'prcItemScopeValidationService');
		}
	]);

})(angular);