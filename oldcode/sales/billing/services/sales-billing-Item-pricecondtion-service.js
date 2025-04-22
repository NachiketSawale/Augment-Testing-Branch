(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('saleBillingItemPriceConditionService', ['salesBillingItemService', 'basicsMaterialPriceConditionFactoryDataService', 'salesBillingService',
		function (parentService, priceConditionDataService, salesBillingService) {

			var option = {
				moduleName: moduleName,
				priceConditionType: 'sales.billing.item.pricecondition',
				headerService: salesBillingService,
				serviceName: 'saleBillingItemPriceConditionService',
				route: 'sales/billing/pricecondition/',
				itemName: 'PriceCondition',
				onCalculateDone: function (item, priceConditionFk, total, totalOc) {
					item.PriceExtra = total;
					item.PriceExtraOc = totalOc;
					parentService.calculateItem(item);
					parentService.markItemAsModified(item);
				},
				getExchangeRate: function () {
					// projectMaterialMainService.getSelected().ExchangeRate;
					if (option && option.headerService && option.headerService.getSelected()) {
						var headerEntity = option.headerService.getSelected();
						if (headerEntity.ExchangeRate) {
							return headerEntity.ExchangeRate;
						}
					}
					return 1;
				},
				initReadData: function (readData) {
					var selected = parentService.getSelected();
					if (selected) {
						readData.filter = '?itemId=' + selected.Id;
					} else {
						readData.filter = '?itemId=0';
					}
				},
				initCreationData: function (creationData) {
					creationData.MainItemId = parentService.getSelected().Id;
					creationData.ExistedTypes = service.getList().map(function (item) {
						return item.PrcPriceConditionTypeFk;
					});
				},
			};

			var service = priceConditionDataService.createService(parentService, option);

			var baseCanCreate = service.canCreate;
			var baseCanDelete = service.canDelete;
			service.canCreate = canCreate;
			service.canDelete = canDelete;
			service.getReadOnly = getReadOnly;
			return service;

			function canCreate() {
				return baseCanCreate() && enable();
			}

			function canDelete() {
				return baseCanDelete() && enable();
			}

			function getReadOnly() {
				return !enable();
			}

			function enable() {
				var enable = true;

				return enable;
			}

		}]);

})(angular);
