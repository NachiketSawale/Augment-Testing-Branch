(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonProductItemClipboardService', ClipboardService);

	ClipboardService.$inject = ['$q', '$translate', 'platformModalService', 'productionplanningItemDataService', 'productionplanningCommonProductItemDataService',
		'basicsLookupdataLookupDescriptorService', 'productionplanningCommonProductItemDataService'];

	function ClipboardService($q, $translate, platformModalService, ppsItemDataService, productItemDataService, lookupService, productDataService) {
		var service = { };

		service.doCanPaste = function (canPastedContent) {
			var canPaste = false;
			if (canPastedContent.type === 'ReassignedProduct') {
				var selectedItem = ppsItemDataService.getSelected();
				if(selectedItem && !_.findKey(canPastedContent.data, {Type: 2})) {
					canPaste = canPastedContent.data.every(function (prod) {
						return !!prod.CanAssign;
					});
				}
			}
			return canPaste;
		};

		service.doPaste = function (pastedContent, selectedItem, type) {
			if (pastedContent.type === 'ReassignedProduct') {
				// check productionset of PU (HP ALM #115488)
				var target = ppsItemDataService.getSelected();
				if (_.isNil(target.ProductionSetId) || target.ProductionSetId === 0) {
					var bodyText = $translate.instant('productionplanning.item.reassignProduct.errorNotProductionsetFound').replace('{0}', target.Code).replace('{0}', target.Code);
					platformModalService.showDialog({
						headerTextKey: 'cloud.common.errorMessage',
						bodyTextKey: bodyText,
						iconClass: 'ico-error'
					});
					return;
				}

				pastedContent.itemService.paste(pastedContent.data, ppsItemDataService.getSelected(), type).then(function (ids) {
					service.appendProducts(ids);
				});
			}
		};

		service.appendProducts = function (ids) {
			var promises = [];
			_.each(ids, function (id) {
				promises.push(lookupService.getItemByKey('CommonProduct', id, {version: 3}));
			});
			$q.all(promises).then(function (data) {
				if (data) {
					productItemDataService.appendItems(data);
					productItemDataService.gridRefresh();
					productItemDataService.setSelected(_.last(data));

					productDataService.updateProductionQuantity();
				}
			});
		};

		return service;
	}
})();
