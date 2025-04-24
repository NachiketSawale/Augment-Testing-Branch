(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName).factory('transportplanningBundleItemClipboardService', ClipboardService);

	ClipboardService.$inject = ['$q', '$translate', 'platformModalService',
		'productionplanningItemDataService', 'productionplanningItemBundleDataService', 'basicsLookupdataLookupDescriptorService'];

	function ClipboardService($q, $translate, platformModalService, ppsItemDataService, bundleDataService, lookupService) {
		var service = {};

		service.doCanPaste = function (canPastedContent) {
			if(canPastedContent.itemService.canMoveToSelected !== undefined && _.isFunction(canPastedContent.itemService.canMoveToSelected))
				return canPastedContent.itemService.canMoveToSelected();
			return false;
		};

		service.doPaste = function (pastedContent, selectedItem, type) {
			if (pastedContent.type === 'ReassignedProduct') {
				// check productionset of PU
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
					var promises = [];
					_.each(ids, function (id) {
						promises.push(lookupService.loadItemByKey('TrsBundleLookup', id));
					});
					$q.all(promises).then(function (data) {
						if (data) {
							bundleDataService.appendItems(data);
							bundleDataService.gridRefresh();
							bundleDataService.setSelected(_.last(data));
						}
					});
				});
			}
		};

		return service;
	}
})();
